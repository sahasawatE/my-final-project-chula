import react from 'react';
import { Button, Grid, ListItem, ListItemText, List, Typography } from "@material-ui/core";
import axios from 'axios';
import {Tab, Tabs} from '@mui/material'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import AddIcon from '@mui/icons-material/Add';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@material-ui/icons/Folder';
import { Form, Modal } from 'react-bootstrap';
import * as FilePond from 'react-filepond';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'filepond/dist/filepond.min.css'

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import StudentDocument from './StudentDocument';

var b64toBlob = require('b64-to-blob');

//make a query and get subkect from localstorage
export default function Documents(props){
    const [dir,setDir] = react.useState('');
    FilePond.registerPlugin(FilePondPluginFileValidateType)
    const api = axios.create({
        baseURL: 'http://localhost:3001/'
    })

    const subject = props.subject;

    const [folders, setFolders] = react.useState([]);
    const [role,setRole] = react.useState('teacher');

    function getAllFileTeacher(roomId,teacherId,subjectId,noFolder){
        if(noFolder){
            createFolder('noFolder')
        }
        api.post('/teacher/allFolders',{
            Room_id : roomId,
            Teacher_id : teacherId,
            Subject_id : subjectId
        }).then(result => {
            setFolders(result.data)
        }).catch(err => console.log(err))
    }

    function getFile(file){
        api.post('/teacher/file',{
            filePath: `${dir}/${selectFolder.length === 0 ? 'noFolder' : selectFolder}/${file}`
        }).then(result => {
            var blob = b64toBlob(result.data, "application/pdf")
            var blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
        }).catch(err => console.log(err))
    }

    const [dataDelete,setDataDelete] = react.useState(null);
    const [deleteFolder, setDeleteFolder] = react.useState('');
    const [modalDeleteFile, setModalDeleteFile] = react.useState(false);
    const [modalDeleteFolder, setModalDeleteFolder] = react.useState(false);
    const [enterFolder,setEnterFolder] = react.useState(false);
    const [filesInFolder, setFilesInFolder] = react.useState([]);
    const [selectFolder, setSelectFolder] = react.useState('');

    function deleteFolderHandle(path){
        api.delete('/teacher/deleteFolder',{
            data:{
                File_Path : path
            }
        })
        .then(setModalDeleteFolder(false))
        .then(setFolders(folders.filter(p => p !== path)))
        .catch(err => console.log(err))
    }

    function deleteHandle(f) {
        var h = [];
        api.delete('/teacher/deleteFile', {
            data: {
                File: f,
                Teacher_id: props.user.Teacher_id,
                Subject_id: props.subject.Subject_id,
                Room_id: props.subject.Room_id
            }
        })
            .then(h = noFolderFiles.filter(v => v !== f))
            .then(setNoFolderFiles(h))
            .then(() => {
                setModalDeleteFile(false);
                if(selectFolder.length !== 0){
                    setEnterFolder(true);
                }
            })
            .catch(err => console.log(err))
    }

    function createFolder(name){
        api.post('/subject/docCreateFolder',{
            Room_id: props.subject.Room_id,
            Subject_id: props.subject.Subject_id,
            Teacher_id: props.user.Teacher_id, 
            FolderName: name 
        })
        .then(setFolderCrete(true))
        .then(setNewFolderName(name))
        .catch(err => console.log(err))
    }

    function enterF(name){
        api.post('/subject/inFolder',{
            Room_id : props.subject.Room_id,
            Subject_id : props.subject.Subject_id,
            Teacher_id : props.user.Teacher_id,
            folders : name
        })
        .then(res => {
            if (res.data !== 'This path does not exits.'){
                setFilesInFolder(res.data)
            }
        })
        .then(setSelectFolder(name))
        .then(setEnterFolder(true))
        .catch(err => console.log(err))
    }

    function docNoti(room,teacher,subject,fn){
        api.post('subject/uploadDocNoti',{
            Teacher_id : teacher,
            Room_id : room,
            Subject_id : subject,
            FolderName : fn
        })
        .catch(err => console.log(err))
    }

    react.useEffect(() => {
        setEnterFolder('')
        setFolders([]);
        if(props.user.Teacher_id){
            setRole('teacher');

            if(props.subject){
                getAllFileTeacher(props.subject.Room_id,props.user.Teacher_id,props.subject.Subject_id,uploadFileWithoutFolder);
                setDir(`/Users/yen/Desktop/FinalProject/component/final/src/components/uploads/${props.subject.Subject_id}/${props.user.Teacher_id}/${props.subject.Room_id}`);
            }
        }
        else if (props.user.Student_id){
            setRole('student')
        }
    }, [props.user,props.subject]);

    const [uploadFiles,setUploadFiles] = react.useState([]);
    const [folderName, setFolderName] = react.useState('');
    const [createContent, setCreateContent] = react.useState(false);
    const [tabValue, setTabValue] = react.useState(0);
    const [folderCreate, setFolderCrete] = react.useState(false);
    const [newFolderName, setNewFolderName] = react.useState('')
    const [finishUploadFile, setFinistUploadFile] = react.useState(false);
    const [uploadFileWithoutFolder, setUploadFileWithoutFolder] = react.useState(false);
    const [noFolderFiles, setNoFolderFiles] = react.useState([]);

    react.useEffect(() => {
        if (props.subject) {
            api.post('/subject/inFolder', {
                Room_id: props.subject.Room_id,
                Subject_id: props.subject.Subject_id,
                Teacher_id: props.user.Teacher_id,
                folders: 'noFolder'
            })
                .then(res => {
                    if (res.data !== 'This path does not exits.') {
                        setNoFolderFiles(res.data)
                    }
                })
                .catch(err => console.log(err))
        }
    }, [props.subject, createContent])

    if(subject){
        if(role === 'teacher'){
            return(
                <Grid container justifyContent='center' direction='column'>
                    <Button variant='text' style={{ width: '100%', color: '#4377ED' }} onClick={() => setCreateContent(true)}>สร้างเนื้อหา</Button>
                    <br/>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', width: '100%'}}>
                        {folders.length === 0 ?
                            <Typography>ว่างเปล่า</Typography>
                            :
                            folders.filter(p => p !== `${dir}/noFolder`).length === 0 && noFolderFiles.length === 0 ?
                                <Typography>ว่างเปล่า</Typography>
                                :
                                <List style={{ width: '90%' }}>
                                    {noFolderFiles.length !== 0 && noFolderFiles.map((value, index) => {
                                        return (
                                            <Grid key={`folderNo${index}`} container direction='row'>
                                                <Grid item xs={10} style={{ display: 'flex', flexDirection: 'row' }}>
                                                    <ListItem button onClick={() => {
                                                        getFile(value.File_Path.split('/').at(-1));
                                                    }}>
                                                        <InsertDriveFileIcon />
                                                        <ListItemText style={{ paddingLeft: '1rem' }} >{value.File_Path.split('/').at(-1)}</ListItemText>
                                                    </ListItem>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Button style={{ height: '100%' }} color='secondary' onClick={() => {
                                                        setModalDeleteFile(true);
                                                        setDataDelete(value);
                                                    }}><DeleteForeverIcon /></Button>
                                                </Grid>
                                            </Grid>
                                        );
<<<<<<< HEAD
                                    })}
                                    {folders.map((value, index) => {
                                        if (value.split('/').at(-1) !== 'noFolder') {
                                            return (
                                                <Grid key={`folderNo${index}`} container direction='row'>
                                                    <Grid item xs={10} style={{ display: 'flex', flexDirection: 'row' }}>
                                                        <ListItem button onClick={() => {
                                                            enterF(value.split('/').at(-1))
                                                        }}>
                                                            <FolderIcon />
                                                            <ListItemText style={{ paddingLeft: '1rem' }} >{value.split('/').at(-1)}</ListItemText>
                                                        </ListItem>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <Button style={{ height: '100%' }} color='secondary' onClick={() => {
                                                            setDeleteFolder(value);
                                                            setModalDeleteFolder(true)
                                                        }}><DeleteForeverIcon /></Button>
                                                    </Grid>
                                                </Grid>
                                            );
                                        }
                                        else {
                                            return null
                                        }
                                    })}
                                </List>
=======
                                    }
                                    else{
                                        return null
                                    }
                                })}
                            </List>
>>>>>>> 90ca6399f39df84d81530df0f88ac7b994f4394e
                        }
                    </Grid>

                    {/* Modal create content */}
                    <div>
                        <Modal centered show={createContent} backdrop="static">
                            <Modal.Body>
                                <Grid container direction='column'>
                                    <Tabs variant="fullWidth" value={tabValue} onChange={(e, v) => {
                                        setTabValue(v);
                                        return e
                                    }} aria-label="basic tabs example">
                                        <Tab label="สร้างโฟเดอร์" />
                                        <Tab label="อัพโหลดเอกสาร" />
                                    </Tabs>
                                    <br/>
                                    {tabValue === 0 ?
                                    <Grid container direction='column'>
                                        {newFolderName.length === 0 ?
                                        <Grid item xs={12} style={{display:'flex', flexDirection:'row'}}>
                                            <CreateNewFolderIcon fontSize='large' style={{ color: 'gray', marginRight: '1rem' }} />
                                            <Form.Control style={{ width: '75%', height:'2.5rem' }} type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="ชื่อโฟลเดอร์" />
                                            {folderName.length === 0 ? 
                                            <Button style={{height:'2.5rem'}} disabled><AddIcon fontSize='large'/></Button>
                                            :
                                            <Button style={{height:'2.5rem',color:'#4377ED'}} onClick={() => {
                                                createFolder(folderName);
                                                setFolderName('');
                                            }}><AddIcon fontSize='large'/></Button>
                                            }
                                        </Grid>
                                        :
                                        null
                                        }
                                        <Grid item xs={12}>
                                        {folderCreate &&
                                            <div>
                                                <div style={{display:'flex' , flexDirection:'row'}}>
                                                    <FolderIcon fontSize='large' style={{color:'gray'}} />
                                                    <Typography style={{marginTop:'0.5rem',paddingLeft:'0.5rem'}}>{newFolderName}</Typography>
                                                </div>
                                                <br/>
                                                <FilePond.FilePond
                                                    files={uploadFiles}
                                                    onupdatefiles={setUploadFiles}
                                                    allowMultiple={true}
                                                    maxFiles={3}
                                                    acceptedFileTypes={['application/pdf']}
                                                    allowDrop
                                                    allowRemove={false}
                                                    server={props.subject && `http://localhost:3001/teacher/uploadFile/${props.subject.Subject_id}/${props.user.Teacher_id}/${props.subject.Room_id}/${newFolderName}`}
                                                    name="file"
                                                    credits={false}
                                                    onprocessfiles={async () => {
                                                        await api.post('/teacher/uploadFileInFolder', {
                                                            Subject_id: props.subject.Subject_id,
                                                            Room_id: props.subject.Room_id,
                                                            Teacher_id: props.user.Teacher_id,
                                                            folder: newFolderName
                                                        })
                                                        .catch(err => console.log(err))
                                                        await api.post('/subject/inFolder', {
                                                            Room_id: props.subject.Room_id,
                                                            Subject_id: props.subject.Subject_id,
                                                            Teacher_id: props.user.Teacher_id,
                                                            folders: newFolderName
                                                        })
                                                            .then(res => {
                                                                if (res.data !== 'This path does not exits.') {
                                                                    setFilesInFolder(res.data)
                                                                }
                                                            })
                                                            .then(setUploadFiles([]))
                                                            .catch(err => console.log(err))
                                                    }}
                                                    onprocessfilerevert={(f) => {
                                                        api.delete('/teacher/deleteFile', {
                                                            data: {
                                                                File_Path: newFolderName,
                                                                Teacher_id: props.user.Teacher_id,
                                                                Subject_id: props.subject.Subject_id,
                                                                Room_id: props.subject.Room_id
                                                            }
                                                        })
                                                            .then(console.log('deleted'))
                                                            .catch(err => console.log(err))
                                                    }}
                                                    labelIdle='ลากและวาง PDF ของคุณที่นี่ หรือ <span class="filepond--label-action">เลือก</span> สูงสุด 3 ไฟล์'
                                                />
                                                {filesInFolder.length > 0 && filesInFolder.map((value,index) => {
                                                    return(
                                                        <div key={`fileUploadNo${index}`}>
                                                            {value.File_Doc_id}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        }
                                        </Grid>
                                    </Grid>
                                    :
                                    <div>
                                        <FilePond.FilePond
                                            files={uploadFiles}
                                            onupdatefiles={setUploadFiles}
                                            allowMultiple={true}
                                            maxFiles={3}
                                            acceptedFileTypes={['application/pdf']}
                                            allowDrop
                                            allowRemove={false}
                                            server={props.subject && `http://localhost:3001/teacher/uploadFile/${props.subject.Subject_id}/${props.user.Teacher_id}/${props.subject.Room_id}/noFolder`}
                                            name="file"
                                            credits={false}
                                            onprocessfiles={async () => {
                                                await api.post('/subject/docCreateFolder', {
                                                    Room_id: props.subject.Room_id,
                                                    Subject_id: props.subject.Subject_id,
                                                    Teacher_id: props.user.Teacher_id,
                                                    FolderName: 'noFolder'
                                                })
                                                    .catch(err => console.log(err))
                                                await api.post('/teacher/uploadFileInFolder',{
                                                    Subject_id : props.subject.Subject_id,
                                                    Room_id : props.subject.Room_id,
                                                    Teacher_id : props.user.Teacher_id,
                                                    folder: 'noFolder'
                                                })
                                                .catch(err => console.log(err))
                                                setUploadFileWithoutFolder(true);
                                            }}
                                            labelIdle='ลากและวาง PDF ของคุณที่นี่ หรือ <span class="filepond--label-action">เลือก</span> สูงสุด 3 ไฟล์'
                                        />
                                    </div>
                                    }
                                </Grid>
                            </Modal.Body>
                            <Modal.Footer style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Button variant="outlined" color="secondary" onClick={() => {
                                if(newFolderName.length === 0){
                                    if (uploadFiles.length === 0) {
                                        setCreateContent(false);
                                        setFolderName('');
                                        setNewFolderName('');
                                        setFolderCrete(false);
                                    }
                                    else {
                                        console.log('hok3')
                                    }
                                }
                                else{
                                    console.log(`${dir}/${newFolderName}`)
                                    if(uploadFiles.length === 0){
                                        console.log('hok1')
                                    }
                                    else{
                                        console.log('hok2')
                                    }
                                    // api.delete('/teacher/deleteFolder', {
                                    //     data: {
                                    //         File_Path: newFolderName,
                                    //         Teacher_id: props.user.Teacher_id,
                                    //         Subject_id: props.subject.Subject_id,
                                    //         Room_id: props.subject.Room_id
                                    //     }
                                    // })
                                    //     .then(setCreateContent(false))
                                    //     .then(setFolderName(''))
                                    //     .then(setNewFolderName(''))
                                    //     .then(setFolderCrete(false))
                                    //     .catch(err => console.log(err))
                                }
                            }}>ยกเลิก</Button>
                            {newFolderName.length !== 0 || uploadFileWithoutFolder ? 
                            <Button variant="outlined" color="primary" onClick={() => {
                                getAllFileTeacher(props.subject.Room_id, props.user.Teacher_id, props.subject.Subject_id,uploadFileWithoutFolder)
                                docNoti(props.subject.Room_id, props.user.Teacher_id, props.subject.Subject_id,newFolderName)
                                setCreateContent(false);
                                setFilesInFolder([]);
                                setUploadFiles([]);
                                setFolderName('');
                                setNewFolderName('');
                                setFolderCrete(false);
                                setUploadFileWithoutFolder(false);
                            }}>สร้าง</Button>
                            :
                            <Button variant="outlined" disabled>สร้าง</Button>
                            }
                        </Modal.Footer>
                        </Modal>
                    </div>

                    {/* Modal Upload Files */}
                    <div>
                        <Modal centered show={enterFolder} backdrop="static" onHide={() => {
                            setEnterFolder(false);
                            setSelectFolder('');
                        }}>
                            <Modal.Header closeButton>{selectFolder}</Modal.Header>
                            <Modal.Body>
                                <Grid container direction='column'>
                                    <div>
                                        <FilePond.FilePond
                                            files={uploadFiles}
                                            onupdatefiles={setUploadFiles}
                                            allowMultiple={true}
                                            maxFiles={3}
                                            acceptedFileTypes={['application/pdf']}
                                            allowDrop
                                            allowRemove={false}
                                            server={props.subject && `http://localhost:3001/teacher/uploadFile/${props.subject.Subject_id}/${props.user.Teacher_id}/${props.subject.Room_id}/${selectFolder}`}
                                            name="file"
                                            credits={false}
                                            onprocessfiles={() => {
                                                setFinistUploadFile(true);
                                            }}
                                            labelIdle='ลากและวาง PDF ของคุณที่นี่ หรือ <span class="filepond--label-action">เลือก</span> สูงสุด 3 ไฟล์'
                                        />
                                        {finishUploadFile ? 
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            {uploadFiles.length !== 0 && <Button color='secondary'>ยกเลิก</Button>}
                                            <Button color='primary' onClick={async() => {
                                                await api.post('/teacher/uploadFileInFolder', {
                                                    Subject_id: props.subject.Subject_id,
                                                    Room_id: props.subject.Room_id,
                                                    Teacher_id: props.user.Teacher_id,
                                                    folder: selectFolder
                                                })
                                                .then(setUploadFiles([]))
                                                .then(setFinistUploadFile(false))
                                                .catch(err => console.log(err))
                                                enterF(selectFolder);
                                            }}>อัพโหลด</Button>
                                        </div>
                                        :
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Button disabled>อัพโหลด</Button></div>
                                        }
                                    </div>
                                    <List>
                                        {filesInFolder.length !== 0 ? 
                                        <div>{filesInFolder.map((value, index) => {
                                            return (
                                                <Grid item xs={12} key={`fileNo${index}`}>
                                                    <Grid container>
                                                        <Grid item xs={10}>
                                                            <ListItem button onClick={() => getFile(value.File_Path.split('\\').pop().split('/').pop())}>
                                                                <InsertDriveFileIcon />
                                                                <ListItemText style={{ paddingLeft: '1rem' }} >{value.File_Path.split('\\').pop().split('/').pop()}</ListItemText>
                                                            </ListItem>
                                                        </Grid>
                                                        <Grid item xs={2}><Button style={{ height: '100%' }} color='secondary' onClick={() => {
                                                            setModalDeleteFile(true);
                                                            setDataDelete(value);
                                                            setEnterFolder(false);
                                                        }}><DeleteForeverIcon /></Button></Grid>
                                                    </Grid>
                                                </Grid>
                                            );
                                        })}
                                        </div>
                                        :
                                        <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                            <Typography style={{ color: 'gray' }}>ว่างเปล่า</Typography>
                                        </Grid>
                                        }
                                    </List>
                                </Grid>
                            </Modal.Body>
                        </Modal>
                    </div>

                    {/* Modal Confirm Delete File */}
                    <div>
                        <Modal centered backdrop="static" show={modalDeleteFile}>
                            <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
                                คุณต้องการที่จะลบเนื้อหานี้หรือไม่ ?
                            </Modal.Body>
                            <Modal.Footer style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <Button variant="outlined" onClick={() => {
                                    if(selectFolder.length === 0){
                                        setModalDeleteFile(false);
                                        setDataDelete(null);
                                    }
                                    else{
                                        setModalDeleteFile(false);
                                        setDataDelete(null);
                                        setEnterFolder(true);
                                    }
                                }}>ยกเลิก</Button>
                                <Button variant="outlined" color="secondary" onClick={() => deleteHandle(dataDelete)}>ลบ</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>  

                    {/* Modal delete Folder */}
                    <div>
                        <Modal centered backdrop="static" show={modalDeleteFolder}>
                            <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
                                เนื้อหาในโฟเดอร์นี้จะหาไปอย่างถาวร คุณต้อจะลบโฟลเดอร์นี้หรือไม่ ?
                            </Modal.Body>
                            <Modal.Footer style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <Button variant="outlined" onClick={() => {
                                    setModalDeleteFolder(false);
                                    setDeleteFolder('');
                                }}>ยกเลิก</Button>
                                <Button variant="outlined" color="secondary" onClick={() => deleteFolderHandle(deleteFolder)}>ลบ</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </Grid>
            )
        }
        else if(role === 'student'){
            return(
                <div className='pdf-container'>
                    <StudentDocument subject={props.subject} user={props.user}/>
                </div>
            )
        }
    }
    else{
        return (<div style={{ width: '90%',justifyContent:'center', display:'flex' }} className='pdf-container'>เลือกวิชาที่จะแสดง</div>)
    }
}