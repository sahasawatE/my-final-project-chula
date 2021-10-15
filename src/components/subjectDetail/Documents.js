import react from 'react';
import { Button, Grid, ListItem, ListItemText, List, Collapse } from "@material-ui/core";
import axios from 'axios';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import FolderIcon from '@material-ui/icons/Folder';
import { Form, Modal } from 'react-bootstrap';
import * as FilePond from 'react-filepond';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'filepond/dist/filepond.min.css'

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// import Viewer, { Worker } from '@phuocng/react-pdf-viewer';
// import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';

var b64toBlob = require('b64-to-blob');

//make a query and get subkect from localstorage
export default function Documents(props){
    const [dir,setDir] = react.useState('');
    FilePond.registerPlugin(FilePondPluginFileValidateType)
    const api = axios.create({
        baseURL: 'http://localhost:3001/'
    })

    const subject = props.subject;

    const [files,setFiles] = react.useState([]);
    const [folders, setFolders] = react.useState([]);
    const [role,setRole] = react.useState('teacher');

    // still bug

    function getAllFileTeacher(roomId,teacherId,subjectId){
        api.post('/teacher/allFolders',{
            Room_id : roomId,
            Teacher_id : teacherId,
            Subject_id : subjectId
        }).then(result => {
            setFolders(result.data)
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
    const [deleteFolder, setDeleteFolder] = react.useState('');
    const [showModal,setShowModal] = react.useState(false);
    const [enterFolder,setEnterFolder] = react.useState(false);
    const [filesInFolder, setFilesInFolder] = react.useState([]);
    const [folder, setFolder] = react.useState('');

    function deleteFolderHandle(path){
        api.delete('/teacher/deleteFile',{
            data:{
                File_Path : path,
                Teacher_id : props.user.Teacher_id,
                Subject_id: props.subject.Subject_id,
                Room_id: props.subject.Room_id
            }
        })
        .then(setShowModal(false))
        .then(getAllFileTeacher(props.subject.Room_id,props.user.Teacher_id,props.subject.Subject_id))
        .catch(err => console.log(err))
    }

    function deleteHandle(path) {
        api.delete('/teacher/deleteFolder', {
            data: {
                File_Path: path,
                Teacher_id: props.user.Teacher_id,
                Subject_id: props.subject.Subject_id,
                Room_id: props.subject.Room_id
            }
        })
            .then(setShowModal(false))
            .then(getAllFileTeacher(props.subject.Room_id, props.user.Teacher_id, props.subject.Subject_id))
            .catch(err => console.log(err))
    }

    function createFolder(name){
        api.post('/subject/docCreateFolder',{
            Room_id: props.subject.Room_id,
            Subject_id: props.subject.Subject_id,
            Teacher_id: props.user.Teacher_id, 
            FolderName: name 
        })
        .then(getAllFileTeacher(props.subject.Room_id, props.user.Teacher_id, props.subject.Subject_id))
        .catch(err => console.log(err))
    }

    function enterF(name){
        if(folder.length === 0){
            setFolder(name);
            api.post('/subject/inFolder',{
                Room_id : props.subject.Room_id,
                Subject_id : props.subject.Subject_id,
                Teacher_id : props.user.Teacher_id,
                folders : name
            })
            .then(res => {
                if (res.data !== 'This path does not exits.'){
                    setFilesInFolder(res.data[0].files)
                }
            })
            .then(setEnterFolder(true))
            .catch(err => console.log(err))
        }
        else{
            console.log(name)
        }
    }

    react.useEffect(() => {
        setEnterFolder('')
        setFolders([]);
        if(props.user.Teacher_id){
            setRole('teacher');

            if(props.subject){
                getAllFileTeacher(props.subject.Room_id,props.user.Teacher_id,props.subject.Subject_id);
                setDir(`/Users/yen/Desktop/FinalProject/component/final/src/components/uploads/${props.subject.Subject_id}/${props.user.Teacher_id}/${props.subject.Room_id}/`);
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
    const [addFolder, setAddFolder] = react.useState(false);
    const [folderName, setFolderName] = react.useState('');

    return(

        <div>
            <Grid container justifyContent="center">
                {subject ? 
                    role === 'teacher' ? 
                        <div style={{width:'90%'}} className='pdf-container'>
                            <div style={{paddingTop:'0.5rem'}}>
                                <div style={{display:'flex', justifyContent:'center', paddingBottom:'1rem'}}>
                                    <Button variant='text' style={{ width: '100%', color: addFolder ? '#4377ED' : 'gray'}} onClick={() => {
                                        setAddFolder(!addFolder);
                                    }}><CreateNewFolderIcon /> สร้างโฟเดอร์</Button>
                                </div>
                                <div>
                                    <Collapse in={addFolder}>
                                        <Grid container>
                                            <Grid item xs={2} style={{display:'flex', justifyContent:'center'}}><FolderIcon fontSize='large'/></Grid>
                                            <Grid item xs={10} style={{display:'flex', flexDirection:'row'}}>
                                                <Form.Control style={{ width: '80%' }} type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="เขียนชื่อหัวข้อของงาน" />
                                                {folderName.length === 0 ? 
                                                <Button style={{ width: '10%' }} disabled><CheckIcon /></Button>
                                                :
                                                <Button style={{ width: '10%', color: '#18C042' }} onClick={() => {
                                                    createFolder(folderName);
                                                    setFolderName('');
                                                    setAddFolder(false);
                                                }}><CheckIcon /></Button>
                                                }
                                                <Button style={{ width: '10%' }} color='secondary' onClick={() => {
                                                    setFolderName('');
                                                    setAddFolder(false);
                                                }}><ClearIcon /></Button>   
                                            </Grid>
                                        </Grid>
                                    </Collapse>
                                </div>
                            </div>
                            {files.length === 0 && folders.length === 0 ?
                                'ยังไม่มีเอกสารตอนนี้'
                                :
                                <div>
                                    {folders.length === 0 ? null : 
                                    <List>
                                        {folders.map((value, index) => {
                                            const fname = value.split(dir)[1].split('/')[0]
                                            return (
                                                <Grid key={index} container justifyContent="center">
                                                    <Grid item xs={10}>
                                                        <ListItem button onClick={() => enterF(fname)}>
                                                            <FolderIcon fontSize='large' />
                                                            <ListItemText key={index} primary={fname} />
                                                        </ListItem>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <Button
                                                            style={{ height: '100%' }}
                                                            color="secondary"
                                                            onClick={() => {
                                                                setDeleteFolder(value);
                                                                setShowModal(!showModal)
                                                            }
                                                            }>
                                                            <DeleteForeverIcon color="secondary" />
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            );
                                        })}
                                    </List>
                                    }
                                    {files.length === 0 ? null : 
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
                            }
                        </div>
                    :
                    <div>
                        {files.length === 0 || folders.length === 0 ?
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
                        <Button variant="outlined" color="secondary" onClick={() => {
                            if(dataDelete){
                                deleteHandle(dataDelete)
                            }
                            if(deleteFolder){
                                deleteFolderHandle(deleteFolder)
                            }
                        }}>ลบ</Button>
                    </Modal.Footer>
                </Modal>
            </div>          

            <div>
                <Modal centered show={enterFolder} backdrop="static" onHide={() => {
                    setEnterFolder(false);
                    setFolder('');
                }}>
                    <Modal.Header closeButton>{folder}</Modal.Header>
                    <Modal.Body style={{ display: 'flex' }}>
                        <Grid container direction='column'>
                            <FilePond.FilePond
                                files={uploadFiles}
                                onupdatefiles={setUploadFiles}
                                allowMultiple={true}
                                maxFiles={3}
                                acceptedFileTypes={['application/pdf']}
                                allowDrop
                                allowRemove={false}
                                server={props.subject && `http://localhost:3001/teacher/uploadFile/${props.subject.Subject_id}/${props.user.Teacher_id}/${props.subject.Room_id}/${folder}`}
                                name="file"
                                credits={false}
                                onprocessfiles={() => {
                                    api.post('/teacher/uploadFileInFolder',{
                                        Subject_id : props.subject.Subject_id,
                                        Room_id : props.subject.Room_id,
                                        Teacher_id : props.user.Teacher_id,
                                        folder : folder
                                    })
                                    .catch(err => console.log(err))
                                    // getAllFileTeacher(props.subject.Room_id, props.user.Teacher_id, props.subject.Subject_id);
                                    // setUploadFiles([]);
                                }}
                                labelIdle='ลากและวาง PDF ของคุณที่นี่ หรือ <span class="filepond--label-action">เลือก</span> สูงสุด 3 ไฟล์'
                            />
                            {filesInFolder.length === 0 ? 
                            'ไม่มีเอกสารในโฟลเดอร์นี้'
                            :
                            <div>
                                
                            </div>
                            }
                        </Grid>
                    </Modal.Body>
                </Modal>
            </div>  
        </div>
    );
}