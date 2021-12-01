import react from 'react';
import * as FilePond from 'react-filepond';
import axios from 'axios';
import { Grid, List, IconButton } from '@material-ui/core';
import { Button, Tabs, Tab, Typography, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { Form, Modal } from 'react-bootstrap';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import 'filepond/dist/filepond.min.css';

export default function Clip(props) {
    FilePond.registerPlugin(FilePondPluginFileValidateType)
    const api = axios.create({
        baseURL: 'http://localhost:3001/'
    })

    const [clips,setClips] = react.useState([]);
    const [clipName, setClipName] = react.useState('');
    const [uploadClip, setUploadClip] = react.useState(false);
    const [tabValue, setTabValue] = react.useState(0);
    const [folderName, setFolderName] = react.useState('');
    const [newFolderName, setNewFolderName] = react.useState('');
    const [folderCreate, setFolderCreate] = react.useState(false);
    const [deleteClipInFolderModal, setDeleteClipInFolderModal] = react.useState(false);
    const [clipsInFolder, setClipsInFolder] = react.useState([]);
    const [videoModal, setVideoModal] = react.useState(false)
    const [videoPath, setVideoPath] = react.useState('');
    const [clipInSelectFolder, setClipInSelectFolder] = react.useState([]);

    function createFolder(name) {
        api.post('/subject/clipCreateFolder', {
            Room_id: props.subject.Room_id,
            Subject_id: props.subject.Subject_id,
            Teacher_id: props.subject.Teacher_id,
            FolderName: name
        })
            .then(setFolderCreate(true))
            .then(setNewFolderName(name))
            .catch(err => console.log(err))
    }

    const [clipsInNoFolder, setClipInNoFolder] = react.useState([]);
    const [clipFolders, setClipFolders] = react.useState([]);
    const [selectVideo, setSelectVideo] = react.useState('');
    const [selectClipFolder, setSelectClipFolder] = react.useState('');
    const [clipFolderModal, setClipFolderModal] = react.useState(false);
    const [cancelBtn, setCancelBtn] = react.useState(true);
    const [okBtn, setOkBtn] = react.useState(false);
    const [deleteClipModal, setDeleteClipModal] = react.useState(false);
    const [deleteFolderModal, setDeleteFolderModal] = react.useState(false);
    const [deleteData, setDeleteData] = react.useState('');
    const [uploadBtn, setUploadBtn] = react.useState(false);
    const [deleteClipName, setDeleteClipName] = react.useState('');
    const [deleteClipId, setDeleteClipId] = react.useState('');

    function allVideosAndFolders(){
        api.post('/subject/inClipFolder', {
            Room_id: props.subject.Room_id,
            Subject_id: props.subject.Subject_id,
            Teacher_id: props.subject.Teacher_id,
            folders: 'noFolder'
        }).then(res => {
            if (res.data !== 'This path does not exits.') {
                setClipInNoFolder(res.data)
            }
        }).catch(err => console.log(err))
        api.post('/teacher/allClipFolders', {
            Room_id: props.subject.Room_id,
            Subject_id: props.subject.Subject_id,
            Teacher_id: props.subject.Teacher_id
        }).then(res2 => {
            var f = [];
            if (res2.data.length !== 0) {
                res2.data.map(v => {
                    if (v.split('/').at(-1) !== 'noFolder') {
                        f.push(v)
                    }
                    return null
                })
                setClipFolders(f)
            }
        }).catch(err => console.log(err))
    }

    react.useEffect(() => {
        if (props.subject) {
            allVideosAndFolders();
        }
    },[props.subject])

    return (
        <div>
            <div>
                {props.subject ? 
                    props.user.Teacher_id ? 
                        <Grid container justifyContent="center">
                            <Button variant='text' style={{ width: '100%', color: '#4377ED' }} onClick={() => {setUploadClip(true)}}>อัพโหลดคลิป</Button>
                            {clipFolders.length === 0 && clipsInNoFolder.length === 0 ?
                            <Typography>ว่างเปล่า</Typography>
                            :
                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <List style={{ width: '100%' }}>
                                    {clipsInNoFolder.length !== 0 && clipsInNoFolder.map((value,index) => {
                                        return(
                                            <ListItem
                                                key={`clipNo${index}`}
                                                disablePadding
                                                secondaryAction={
                                                    <IconButton color='secondary' onClick={() => {
                                                        setDeleteClipModal(true);
                                                        setDeleteData(value.File_Path);
                                                        setDeleteClipName(value.Clip_Name)
                                                        setDeleteClipId(value.File_Clip_id)
                                                    }}>
                                                        <DeleteForeverIcon />
                                                    </IconButton >
                                                }>
                                                <ListItemButton onClick={() => {
                                                    setVideoModal(true)
                                                    setVideoPath(value.File_Path)
                                                    setSelectVideo(value.Clip_Name)
                                                }}>
                                                    <ListItemIcon style={{ color:'#008000'}}><PlayCircleOutlineIcon /></ListItemIcon>
                                                    <ListItemText style={{ paddingLeft: '1rem' }} >{value.Clip_Name}</ListItemText>
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}
                                    {clipFolders.length !== 0 && clipFolders.map((value,index) => {
                                        return(
                                            <ListItem
                                                key={`clipFolderNo${index}`}
                                                disablePadding
                                                secondaryAction={
                                                    <IconButton color='secondary' onClick={() => {
                                                        setDeleteFolderModal(true);
                                                        setDeleteData(value);
                                                    }}>
                                                        <DeleteForeverIcon />
                                                    </IconButton >
                                                }>
                                                <ListItemButton onClick={() => {
                                                    api.post('subject/enterClipFolder', {
                                                        path: value
                                                    })
                                                        .then(res => setClipInSelectFolder(res.data))
                                                        .then(setSelectClipFolder(value.split('/').at(-1)))
                                                        .catch(err => console.log(err))
                                                    setClipFolderModal(true)
                                                }}>
                                                    <ListItemIcon><FolderIcon /></ListItemIcon>
                                                    <ListItemText style={{ paddingLeft: '1rem' }} >{value.split('/').at(-1)}</ListItemText>
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </Grid>
                            }
                        </Grid>
                        :
                        <div>
                            <Grid container justifyContent="center">
                                {clipFolders.length === 0 && clipsInNoFolder.length === 0 ?
                                    <Typography>ว่างเปล่า</Typography>
                                    :
                                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                        <List style={{ width: '90%' }}>
                                            {clipsInNoFolder.length !== 0 && clipsInNoFolder.map((value, index) => {
                                                return (
                                                    <Grid key={`clipNo${index}`} container direction='row'>
                                                        <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row' }}>
                                                            <ListItem button onClick={() => {
                                                                setVideoModal(true)
                                                                setVideoPath(value.File_Path)
                                                                setSelectVideo(value.Clip_Name)
                                                            }}>
                                                                <div style={{ color: 'green' }}><PlayCircleOutlineIcon /></div>
                                                                <ListItemText style={{ paddingLeft: '1rem' }} >{value.Clip_Name}</ListItemText>
                                                            </ListItem>
                                                        </Grid>
                                                    </Grid>
                                                );
                                            })}
                                            {clipFolders.length !== 0 && clipFolders.map((value, index) => {
                                                return (
                                                    <Grid key={`clipFolderNo${index}`} container direction='row'>
                                                        <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row' }}>
                                                            <ListItem button onClick={() => {
                                                                api.post('subject/enterClipFolder', {
                                                                    path: value
                                                                })
                                                                    .then(res => setClipInSelectFolder(res.data))
                                                                    .then(setSelectClipFolder(value.split('/').at(-1)))
                                                                    .catch(err => console.log(err))
                                                                setClipFolderModal(true)
                                                            }}>
                                                                <div style={{ color: 'gray' }}><FolderIcon /></div>
                                                                <ListItemText style={{ paddingLeft: '1rem' }} >{value.split('/').at(-1)}</ListItemText>
                                                            </ListItem>
                                                        </Grid>
                                                    </Grid>
                                                );
                                            })}
                                        </List>
                                    </Grid>
                                }
                            </Grid>
                        </div>
                    : 
                    <div>
                        <div style={{ width: '100%', justifyContent: 'center', display: 'flex' }} className='pdf-container'>เลือกวิชาที่จะแสดง</div>
                        <br/>
                    </div>
                }
            </div>

            {/* delete modal */}
            <div>
                <Modal centered backdrop="static" show={deleteClipModal || deleteFolderModal || deleteClipInFolderModal}>
                    <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
                        {deleteClipModal && <Typography>คุณแน่ใจหรือไม่ว่าต้องการที่จะลบเนื้อหานี้ ?</Typography>}
                        {deleteClipInFolderModal && <Typography>คุณแน่ใจหรือไม่ว่าต้องการที่จะลบเนื้อหานี้ ?</Typography>}
                        {deleteFolderModal && <Typography>คุณแน่ใจหรือไม่ว่าต้องการที่จะลบโฟลเดอร์นี้ ?</Typography>}
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Button variant='outlined' onClick={() => {
                            if (deleteClipInFolderModal){
                                setDeleteClipInFolderModal(false);
                                setDeleteData('');
                                setDeleteClipId('');
                                setDeleteClipName('');
                            }
                            else{
                                setDeleteClipModal(false);
                                setDeleteFolderModal(false);
                                setDeleteData('');
                                setDeleteClipId('');
                                setDeleteClipName('');
                            }
                        }}>ยกเลิก</Button>
                        <Button variant='outlined' color='error' onClick={async() => {
                            if (deleteClipModal){
                                var h = [];
                                api.delete('/teacher/deleteClip',{
                                    data:{
                                        name: deleteClipName,
                                        path: deleteData,
                                        id: deleteClipId
                                    }
                                })
                                .then(() => {
                                    h = clipsInNoFolder.filter(e => e.Clip_Name !== deleteClipName);
                                    setClipInNoFolder(h);
                                })
                                .then(() => {
                                    setDeleteClipModal(false);
                                    setDeleteFolderModal(false);
                                    setDeleteData('');
                                    setDeleteClipName('');
                                    setDeleteClipId('');
                                })
                                .catch(err => console.log(err))
                            }

                            if (deleteClipInFolderModal){
                                var k = [];
                                api.delete('/teacher/deleteClip', {
                                    data: {
                                        name: deleteClipName,
                                        path: deleteData,
                                        id: deleteClipId
                                    }
                                })
                                    .then(() => {
                                        k = clipsInNoFolder.filter(e => e.Clip_Name !== deleteClipName);
                                        setClipInSelectFolder(k);
                                    })
                                    .then(() => {
                                        setDeleteClipInFolderModal(false);
                                        setDeleteFolderModal(false);
                                        setClipFolderModal(true);
                                        setDeleteData('');
                                        setDeleteClipName('');
                                        setDeleteClipId('');
                                    })
                                    .catch(err => console.log(err))
                            }

                            if(deleteFolderModal){
                                await api.delete('/teacher/deleteClipFolder',{
                                    data:{
                                        path: deleteData
                                    }
                                })
                                .then(() => {
                                    setDeleteClipModal(false);
                                    setDeleteFolderModal(false);
                                    setDeleteData('');
                                    setDeleteClipName('');
                                })
                                .catch(err => console.log(err))
                                allVideosAndFolders()
                            }
                        }}>ลบ</Button>
                    </Modal.Footer>
                </Modal>
            </div>

            {/* folder clip modal */}
            <div>
                <Modal centered backdrop="static" show={clipFolderModal} onHide={() => {
                    setClipFolderModal(false)
                }}>
                    <Modal.Header closeButton><FolderIcon color='action' /><Typography style={{marginLeft:'0.5rem'}}>{selectClipFolder}</Typography></Modal.Header>
                    <Modal.Body>
                        <Grid container>
                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center',}}>
                                {props.user.Teacher_id ?
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Grid container direction='column'>
                                                <Grid item xs={12}>
                                                    <Form.Group>
                                                        <Form.Control style={{ width: '100%', marginBottom: '0.5rem' }} type='text' value={clipName} disabled={clips.length !== 0 ? true : false} placeholder='ชื่อคลิปที่จะอัพโหลดในโฟเดอร์นี้' onChange={(e) => setClipName(e.target.value)}></Form.Control>
                                                        <FilePond.FilePond
                                                            files={clips}
                                                            onupdatefiles={setClips}
                                                            allowMultiple={false}
                                                            disabled={clipName.length !== 0 ? false : true}
                                                            allowDrop
                                                            allowRevert
                                                            name="clip"
                                                            credits={false}
                                                            onprocessfilestart={() => setCancelBtn(false)}
                                                            acceptedFileTypes={['video/*']}
                                                            server={props.subject && {
                                                                process: `http://localhost:3001/teacher/uploadClip/${props.subject.Subject_id}/${props.subject.Teacher_id}/${props.subject.Room_id}/${selectClipFolder}/${clipName}`,
                                                                revert: null
                                                            }}
                                                            onprocessfiles={async () => {
                                                                await api.post('/teacher/uploadClipInFolder', {
                                                                    Subject_id: props.subject.Subject_id,
                                                                    Room_id: props.subject.Room_id,
                                                                    Teacher_id: props.subject.Teacher_id,
                                                                    folder: selectClipFolder
                                                                })
                                                                    .catch(err => console.log(err))
                                                                await api.post('/subject/inClipFolder', {
                                                                    Room_id: props.subject.Room_id,
                                                                    Subject_id: props.subject.Subject_id,
                                                                    Teacher_id: props.subject.Teacher_id,
                                                                    folders: selectClipFolder
                                                                })
                                                                    .then(res => {
                                                                        if (res.data !== 'This path does not exits.') {
                                                                            setClipsInFolder(res.data)
                                                                        }
                                                                    })
                                                                    .then(setUploadBtn(true))
                                                                    .catch(err => console.log(err))
                                                            }}
                                                            onprocessfilerevert={(f) => {
                                                                api.delete('/teacher/deleteClip', {
                                                                    data: {
                                                                        name: clipsInFolder[0].Clip_Name,
                                                                        path: clipsInFolder[0].File_Path,
                                                                        id: clipsInFolder[0].File_Clip_id
                                                                    }
                                                                })
                                                                    .then(() => {
                                                                        setClipsInFolder([]);
                                                                        setClipName('');
                                                                        setUploadBtn(false);
                                                                    })
                                                                    .catch(err => console.log(err))
                                                            }}
                                                            labelIdle='ลากและวางคลิปสอนของคุณที่นี่ หรือ <span class="filepond--label-action">เลือก</span>'
                                                        />
                                                    </Form.Group>
                                                </Grid>
                                                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    {uploadBtn && <Button color='primary' onClick={() => {
                                                        api.post('/subject/updateClipList', {
                                                            path: `/Users/yen/Desktop/FinalProject/component/final/src/components/TeacherUploadClip/${props.subject.Subject_id}/${props.subject.Teacher_id}/${props.subject.Room_id}/${selectClipFolder}`
                                                        }).then(() => {
                                                            api.post('subject/enterClipFolder', {
                                                                path: `/Users/yen/Desktop/FinalProject/component/final/src/components/TeacherUploadClip/${props.subject.Subject_id}/${props.subject.Teacher_id}/${props.subject.Room_id}/${selectClipFolder}`
                                                            }).then(res2 => setClipInSelectFolder(res2.data)).catch(err2 => console.log(err2))
                                                        }).then(() => {
                                                            setClips([]);
                                                            setClipName('');
                                                            setUploadBtn(false);
                                                        }).catch(err => console.log(err))
                                                    }}>อัพโหลด</Button>}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                                            {clipInSelectFolder.length === 0 ?
                                                <Typography>ว่างเปล่า</Typography>
                                            :
                                                <List style={{ width: '100%' }}>
                                                    {clipInSelectFolder.map((value, index) => {
                                                        return (
                                                            <ListItem
                                                                key={`clipNo${index}`}
                                                                disablePadding
                                                                secondaryAction={
                                                                    <IconButton color='secondary' onClick={() => {
                                                                        setDeleteClipInFolderModal(true);
                                                                        setClipFolderModal(false);
                                                                        setDeleteData(value.File_Path);
                                                                        setDeleteClipName(value.Clip_Name);
                                                                        setDeleteClipId(value.File_Clip_id);
                                                                    }}>
                                                                        <DeleteForeverIcon />
                                                                    </IconButton >
                                                                }>
                                                                <ListItemButton onClick={() => {
                                                                    setVideoModal(true)
                                                                    setVideoPath(value.File_Path)
                                                                    setSelectVideo(value.Clip_Name)
                                                                }}>
                                                                    <ListItemIcon style={{ color: '#008000' }}><PlayCircleOutlineIcon /></ListItemIcon>
                                                                    <ListItemText style={{ paddingLeft: '1rem' }} >{value.Clip_Name}</ListItemText>
                                                                </ListItemButton>
                                                            </ListItem>
                                                        );
                                                    })}
                                                </List>
                                            }
                                        </Grid>
                                    </Grid>
                                    :
                                    <List style={{ width: '90%' }}>
                                        {clipInSelectFolder.length === 0 ?
                                            <Typography style={{display:'flex',justifyContent:'center'}}>ว่างเปล่า</Typography>
                                        :
                                            clipInSelectFolder.map((value, index) => {
                                                return (
                                                    <Grid key={`clipNo${index}`} container direction='row'>
                                                        <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row' }}>
                                                            <ListItem button onClick={() => {
                                                                setVideoModal(true)
                                                                setVideoPath(value.File_Path)
                                                                setSelectVideo(value.Clip_Name)
                                                            }}>
                                                                <div style={{ color: 'green' }}><PlayCircleOutlineIcon /></div>
                                                                <ListItemText style={{ paddingLeft: '1rem' }} >{value.Clip_Name}</ListItemText>
                                                            </ListItem>
                                                        </Grid>
                                                    </Grid>
                                                );
                                            })
                                        }
                                    </List>
                                }
                            </Grid>
                        </Grid>
                    </Modal.Body>
                </Modal>
            </div>

            {/* Video Modal */}
            <div>
                <Modal centered backdrop="static" size="lg" show={videoModal} onHide={() => {
                    setVideoModal(false);
                    setVideoPath('');
                    //system performance
                    }}>
                    <Modal.Header closeButton>{selectVideo}</Modal.Header>
                    <Modal.Body>
                        {videoPath.length !== 0 && 
                        <video id="videoPlayer" width="100%" controls autoPlay>
                            <source src={`http://localhost:3001/teacher/video/${videoPath.split('/').at(-2)}/${videoPath.split('/').at(-1)}/${props.subject.Subject_id}/${props.subject.Teacher_id}/${props.subject.Room_id}`} type="video/mp4" />
                        </video>
                        }
                    </Modal.Body>
                </Modal>
            </div>

            {/* Modal upload Clip */}
            <Modal centered backdrop="static" show={uploadClip}>
                <Modal.Header>
                    อัพโหลดคลิป
                </Modal.Header>
                <Modal.Body>
                    <Tabs variant="fullWidth" value={tabValue} onChange={(e, v) => {
                        setTabValue(v);
                        return e
                    }} aria-label="basic tabs example">
                        <Tab label="สร้างโฟเดอร์" />
                        <Tab label="อัพโหลดคลิป" />
                    </Tabs>
                    <br/>
                    {tabValue === 0 ? 
                        <div>
                            <Grid container>
                                {newFolderName.length === 0 && <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row' }}>
                                    <CreateNewFolderIcon fontSize='large' style={{ color: 'gray', marginRight: '1rem' }} />
                                    <Form.Control style={{ width: '75%', height: '2.5rem' }} type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="ชื่อโฟลเดอร์" />
                                    {folderName.length === 0 ?
                                        <Button style={{ height: '2.5rem' }} disabled><AddIcon fontSize='large' /></Button>
                                        :
                                        <Button style={{ height: '2.5rem', color: '#4377ED' }} onClick={() => {
                                            createFolder(folderName);
                                            setFolderName('');
                                        }}><AddIcon fontSize='large' /></Button>
                                    }
                                </Grid>}
                                <Grid item xs={12}>
                                    {folderCreate && 
                                        <div>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <FolderIcon fontSize='large' style={{ color: 'gray' }} />
                                                <Typography style={{ marginTop: '0.5rem', paddingLeft: '0.5rem' }}>{newFolderName}</Typography>
                                            </div>
                                            <br />
                                            <Form.Group>
                                                <Form.Label>ชื่อคลิป</Form.Label>
                                                <Form.Control style={{ width: '100%' }} type='text' disabled={clips.length !== 0 ? true : false} value={clipName} onChange={(e) => setClipName(e.target.value)}></Form.Control>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>อัพโหลดคลิป</Form.Label>
                                                <FilePond.FilePond
                                                    files={clips}
                                                    onupdatefiles={setClips}
                                                    allowMultiple={false}
                                                    disabled={clipName.length !== 0 ? false : true}
                                                    allowDrop
                                                    allowRevert
                                                    name="clip"
                                                    credits={false}
                                                    onprocessfilestart={() => {
                                                        setCancelBtn(false);
                                                        setOkBtn(false);
                                                    }}
                                                    acceptedFileTypes={['video/*']}
                                                    server={{
                                                        process: `http://localhost:3001/teacher/uploadClip/${props.subject.Subject_id}/${props.subject.Teacher_id}/${props.subject.Room_id}/${newFolderName}/${clipName}`,
                                                        revert: null
                                                    }}
                                                    onprocessfiles={async () => {
                                                            await api.post('/teacher/uploadClipInFolder', {
                                                                Subject_id: props.subject.Subject_id,
                                                                Room_id: props.subject.Room_id,
                                                                Teacher_id: props.subject.Teacher_id,
                                                                folder: newFolderName
                                                            })
                                                                .catch(err => console.log(err))
                                                            await api.post('/subject/inClipFolder', {
                                                                Room_id: props.subject.Room_id,
                                                                Subject_id: props.subject.Subject_id,
                                                                Teacher_id: props.subject.Teacher_id,
                                                                folders: newFolderName
                                                            })
                                                                .then(res => {
                                                                    if (res.data !== 'This path does not exits.') {
                                                                        setClipsInFolder(res.data)
                                                                    }
                                                                })
                                                                .then(() => {
                                                                    setCancelBtn(true);
                                                                    setOkBtn(true);
                                                                })
                                                                .catch(err => console.log(err))
                                                        }
                                                    }
                                                    onprocessfilerevert={(f) => {
                                                        api.delete('/teacher/deleteClip', {
                                                            data: {
                                                                name: clipsInFolder[0].Clip_Name,
                                                                path: clipsInFolder[0].File_Path,
                                                                id: clipsInFolder[0].File_Clip_id
                                                            }
                                                        })
                                                            .then(() => {
                                                                setClipsInFolder([]);
                                                                setClipName('');
                                                            })
                                                            .catch(err => console.log(err))
                                                    }}
                                                    labelIdle='ลากและวางคลิปสอนของคุณที่นี่ หรือ <span class="filepond--label-action">เลือก</span>'
                                                />
                                            </Form.Group>
                                        </div>
                                    }
                                </Grid>
                            </Grid>
                        </div>
                        :
                        <div style={{ width: '100%' }} className='videosUploader-container'>
                            <Form.Group>
                                <Form.Label>ชื่อคลิป</Form.Label>
                                <Form.Control style={{ width: '100%' }} disabled={clips.length !== 0 ? true : false} type='text' value={clipName} onChange={(e) => setClipName(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>อัพโหลดคลิป</Form.Label>
                                <FilePond.FilePond
                                    files={clips}
                                    onupdatefiles={setClips}
                                    allowMultiple={false}
                                    allowDrop
                                    disabled={clipName.length !== 0 ? false : true}
                                    allowRevert
                                    name="clip"
                                    credits={false}
                                    onprocessfilestart={() => {
                                        setCancelBtn(false);
                                    }}
                                    acceptedFileTypes={['video/*']}
                                    server={{
                                        process: `http://localhost:3001/teacher/uploadClip/${props.subject.Subject_id}/${props.subject.Teacher_id}/${props.subject.Room_id}/noFolder/${clipName}`,
                                        revert: null
                                    }}
                                    onprocessfiles={async () => {
                                        createFolder('noFolder');
                                        await api.post('/teacher/uploadClipInFolder', {
                                            Subject_id: props.subject.Subject_id,
                                            Room_id: props.subject.Room_id,
                                            Teacher_id: props.subject.Teacher_id,
                                            folder: 'noFolder'
                                        })
                                            .catch(err => console.log(err))
                                        await api.post('/subject/inClipFolder', {
                                            Room_id: props.subject.Room_id,
                                            Subject_id: props.subject.Subject_id,
                                            Teacher_id: props.subject.Teacher_id,
                                            folders: 'noFolder'
                                        })
                                            .then(res => {
                                                if (res.data !== 'This path does not exits.') {
                                                    setClipsInFolder(res.data)
                                                }
                                            })
                                            .then(() => {
                                                setCancelBtn(true);
                                            })
                                            .catch(err => console.log(err))
                                    }}
                                    onprocessfilerevert={(f) => {
                                        api.delete('/teacher/deleteClip', {
                                            data: {
                                                name: clipsInFolder[0].Clip_Name,
                                                path: clipsInFolder[0].File_Path,
                                                id: clipsInFolder[0].File_Clip_id
                                            }
                                        })
                                            .then(() => {
                                                setClipsInFolder([]);
                                                setClipName('');
                                            })
                                            .catch(err => console.log(err))
                                    }}
                                    labelIdle='ลากและวางคลิปสอนของคุณที่นี่ หรือ <span class="filepond--label-action">เลือก</span>'
                                />
                            </Form.Group>
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Grid container justifyContent='space-around'>
                        {cancelBtn ?
                            <Button variant='outlined' color='error' onClick={async () => {
                                if(newFolderName.length === 0){
                                    if (clipsInFolder.length === 0) {
                                        setUploadClip(false)
                                        setClipName('');
                                    }
                                }
                                else{
                                    if(newFolderName === 'noFolder'){
                                        await Promise.all(
                                            clips.map(async v => {
                                                await api.delete('/subject/CancelClipFiles', {
                                                    data: {
                                                        path: `/Users/yen/Desktop/FinalProject/component/final/src/components/TeacherUploadClip/${props.subject.Subject_id}/${props.subject.Teacher_id}/${props.subject.Room_id}/noFolder`,
                                                        name: v.file.name
                                                    }
                                                })
                                                    .catch(err => console.log(err))
                                            })
                                        );
                                        await api.post('/subject/updateClipList', {
                                            path: `/Users/yen/Desktop/FinalProject/component/final/src/components/TeacherUploadClip/${props.subject.Subject_id}/${props.subject.Teacher_id}/${props.subject.Room_id}/noFolder`
                                        })
                                        .then(() => {
                                            setNewFolderName('');
                                            setUploadClip(false);
                                            setFolderCreate(false);
                                            setClipName('');
                                            setClipsInFolder([]);
                                            setClips([]);
                                            allVideosAndFolders();
                                        })
                                        .catch(err2 => console.log(err2))
                                    }
                                    else {
                                        api.delete('/subject/CancelClipFolder', {
                                            data: {
                                                path: `/Users/yen/Desktop/FinalProject/component/final/src/components/TeacherUploadClip/${props.subject.Subject_id}/${props.subject.Teacher_id}/${props.subject.Room_id}/${newFolderName}`
                                            }
                                        })
                                        .then(() => {
                                            setNewFolderName('');
                                            setUploadClip(false);
                                            setFolderCreate(false);
                                            setClipName('');
                                            setClipsInFolder([]);
                                            setClips([]);
                                            allVideosAndFolders();
                                        })
                                        .catch(err => console.log(err));
                                    }
                                }
                            }}>ยกเลิก</Button>
                        :
                            <Button variant='outlined' disabled>ยกเลิก</Button>
                        }
                        {okBtn ?
                        newFolderName.length === 0 ?
                            <Button variant='outlined' disabled>ตกลง</Button>
                            :
                            clipsInFolder.length === 0 ? 
                                <Button variant='outlined' color='primary' onClick={() => {
                                    setNewFolderName('');
                                    setFolderCreate(false);
                                    setUploadClip(false);
                                    setClipName('');
                                    allVideosAndFolders();
                                }}>ตกลง</Button>
                                :
                                <Button variant='outlined' color='primary' onClick={() => {
                                    setClips([]);
                                    setNewFolderName('');
                                    setClipsInFolder([]);
                                    setUploadClip(false);
                                    setFolderCreate(false);
                                    setClipName('');
                                    allVideosAndFolders();
                                }}>ตกลง</Button>
                        :
                        <Button variant='outlined' disabled>ตกลง</Button>
                        }
                    </Grid>
                </Modal.Footer>
            </Modal>
        </div>
    );
}