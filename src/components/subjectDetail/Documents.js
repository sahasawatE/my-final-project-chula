import react from 'react';
import { Button, Grid, ListItem, ListItemText, List, Collapse, IconButton } from "@material-ui/core";
import axios from 'axios';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { Modal } from 'react-bootstrap';
import * as FilePond from 'react-filepond';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'filepond/dist/filepond.min.css'

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// import Viewer, { Worker } from '@phuocng/react-pdf-viewer';
// import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';

var b64toBlob = require('b64-to-blob');

//make a query and get subkect from localstorage
export default function Documents(props){
    FilePond.registerPlugin(FilePondPluginFileValidateType)
    const api = axios.create({
        baseURL: 'http://localhost:3001/'
    })

    const subject = props.subject;

    const [files,setFiles] = react.useState([]);
    const [role,setRole] = react.useState('teacher');

    // const [upload,setUpload] = react.useState(false);

    function getAllFileTeacher(roomId,teacherId,subjectId){
        api.post('/teacher/allFiles',{
            Room_id : roomId,
            Teacher_id : teacherId,
            Subject_id : subjectId
        }).then(result => {
            setFiles(result.data)
        }).catch(err => console.log(err))
    }

    function getAllFileStudent(roomId,subjectId){
        api.post('/student/allFiles',{
            Room_id : roomId,
            Subject_id : subjectId
        }).then(result => {
            setFiles(result.data)
        }).catch(err => console.log(err))
    }

    function getFile(file){
        api.post('/teacher/file',{
            filePath: file
        }).then(result => {
            var blob = b64toBlob(result.data, "application/pdf")
            var blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
        }).catch(err => console.log(err))
    }

    const [dataDelete,setDataDelete] = react.useState('');
    const [showModal,setShowModal] = react.useState(false);

    function deleteHandle(path){
        api.delete('/teacher/deleteFile',{
            data:{
                File_Path : path,
                Teacher_id : props.user.Teacher_id,
                Subject_id: props.subject.Subject_id,
                Room_id: props.subject.Room_id
            }
        })
        .then(setShowModal(false))
        .then(setFiles(files.filter(p => p !== path)))
        .catch(err => console.log(err))
    }

    react.useEffect(() => {
        if(props.user.Teacher_id){
            setRole('teacher');

            if(props.subject){
                getAllFileTeacher(props.subject.Room_id,props.user.Teacher_id,props.subject.Subject_id);
            }
        }
        else{
            setRole('student');

            if (props.subject) {
                getAllFileStudent(props.subject.Room_id, props.subject.Subject_id);
            }
        }
    }, [props.user,props.subject]);

    const [uploadFiles,setUploadFiles] = react.useState([]);
    const [addFile, setAddFile] = react.useState(false);
    const [addFolder, setAddFolder] = react.useState(false);
    const [openBackDrop, setOpenBackDrop] = react.useState(false);

    return(

        <div>
            <Grid container justifyContent="center">
                {subject ? 
                    role === 'teacher' ? 
                        <div style={{width:'90%'}} className='pdf-container'>
                            <div style={{paddingBottom:'0.5rem'}}>
                                <div style={{display:'flex', justifyContent:'flex-end'}}>
                                    <IconButton onClick={() => {
                                        setAddFolder(!addFolder);
                                        setAddFile(false);
                                    }}><CreateNewFolderIcon /></IconButton>
                                    <IconButton onClick={() => {
                                        setAddFile(!addFile);
                                        setAddFolder(false);
                                    }}><AttachFileIcon /></IconButton>
                                </div>
                                <div>
                                    <Collapse in={addFile}>
                                        <FilePond.FilePond
                                            files={uploadFiles}
                                            onupdatefiles={setUploadFiles}
                                            allowMultiple={true}
                                            maxFiles={3}
                                            acceptedFileTypes={['application/pdf']}
                                            allowDrop
                                            allowRemove={false}
                                            server={`http://localhost:3001/teacher/uploadFile/${props.subject.Subject_id}/${props.user.Teacher_id}/${props.subject.Room_id}`}
                                            name="file"
                                            credits={false}
                                            onprocessfiles={() => {
                                                getAllFileTeacher(props.subject.Room_id, props.user.Teacher_id, props.subject.Subject_id);
                                                setUploadFiles([]);
                                            }}
                                            labelIdle='ลากและวาง PDF ของคุณที่นี่ หรือ <span class="filepond--label-action">เลือก</span> สูงสุด 3 ไฟล์'
                                        />
                                    </Collapse>
                                </div>
                                <div>
                                    <Collapse in={addFolder}>
                                        hok
                                    </Collapse>
                                </div>
                            </div>
                            {files.length === 0 ?
                                'ยังไม่มีเอกสารตอนนี้'
                                :
                                <List>
                                    {files.map((value, index) => {
                                        return (
                                            <Grid key={index} container justifyContent="center">
                                                <Grid item xs={10} onClick={() => getFile(files[index])}>
                                                    <ListItem button>
                                                        <ListItemText key={index} primary={value.split('\\').pop().split('/').pop()} />
                                                    </ListItem>    
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Button 
                                                        style={{height:'100%'}} 
                                                        color="secondary" 
                                                        onClick={() => {
                                                            setDataDelete(value);
                                                            setShowModal(!showModal)
                                                        }
                                                    }>
                                                        <DeleteForeverIcon color="secondary"/>
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        );
                                    })}
                                </List>
                            }
                        </div>
                    :
                    <div>
                        {files.length === 0 ?
                        'ยังไม่มีเอกสารตอนนี้'
                        :
                        <List>
                            {files.map((value, index) => {
                                return (
                                    <Grid key={index} container>
                                        <Grid item xs={12}>
                                            <ListItem button>
                                                <ListItemText key={index} onClick={() => getFile(files[index])} primary={value.split('\\').pop().split('/').pop()} />
                                            </ListItem>    
                                        </Grid>
                                    </Grid>
                                );
                            })}    
                        </List>
                        }
                </div>
                :
                'เลือกวิชาที่จะแสดง'}
            </Grid>
            <div>
                <Modal centered show={showModal}>
                    <Modal.Body style={{ display: 'flex', justifyContent:'center'}}>
                        คุณต้องการที่จะลบเนื้อหานี้หรือไม่ ?
                    </Modal.Body>
                    <Modal.Footer style={{display:'flex', justifyContent:'space-around'}}>
                        <Button variant="outlined" onClick={() => setShowModal(false)}>ยกเลิก</Button>
                        <Button variant="outlined" color="secondary" onClick={() => deleteHandle(dataDelete)}>ลบ</Button>
                    </Modal.Footer>
                </Modal>
            </div>            
        </div>
    );
}