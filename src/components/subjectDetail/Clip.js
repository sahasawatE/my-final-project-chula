import react from 'react';
import * as FilePond from 'react-filepond';
import axios from 'axios';
import { Grid, ListItem, ListItemText, List } from '@material-ui/core';
import {Button,Tabs,Tab, Typography} from '@mui/material';
import { Form, Modal } from 'react-bootstrap';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@material-ui/icons/Folder';
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
    const [clipsInFolder, setClipsInFolder] = react.useState([]);
    const [videoModal, setVideoModal] = react.useState(false)
    const [videoPath, setVideoPath] = react.useState('');

    function createFolder(name) {
        api.post('/subject/clipCreateFolder', {
            Room_id: props.subject.Room_id,
            Subject_id: props.subject.Subject_id,
            Teacher_id: props.user.Teacher_id,
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

    react.useEffect(() => {
        if(props.user.Teacher_id){
            if (props.subject) {
                api.post('/subject/inClipFolder',{
                    Room_id: props.subject.Room_id,
                    Subject_id: props.subject.Subject_id,
                    Teacher_id: props.user.Teacher_id,
                    folders : 'noFolder'
                }).then(res => {
                    if (res.data !== 'This path does not exits.') {
                        setClipInNoFolder(res.data)
                    }
                }).catch(err => console.log(err))
                api.post('/teacher/allClipFolders',{
                    Room_id: props.subject.Room_id,
                    Subject_id: props.subject.Subject_id,
                    Teacher_id: props.user.Teacher_id
                }).then(res2 => {
                    var f = [];
                    if(res2.data.length !== 0){
                        res2.data.map(v => {
                            if(v.split('/').at(-1) !== 'noFolder'){
                                f.push(v)
                            }
                            return null
                        })
                        setClipFolders(f)
                    }
                }).catch(err => console.log(err))
            }
        }
        else{
            if (props.subject) {
                console.log(props.subject, props.user.Student_id)
            }
        }
    },[props.subject])

    return (
        <div>
            <div>
                {props.subject ? 
                    props.user.Teacher_id ? 
                        <Grid container justifyContent="center">
                            <Button variant='text' style={{ width: '100%', color: '#4377ED' }} onClick={() => {setUploadClip(true)}}>อัพโหลดคลิป</Button>
                            <br/>
                            {clipFolders.length === 0 && clipsInNoFolder.length === 0 ?
                            <Typography>ว่างเปล่า</Typography>
                            :
                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <List style={{ width: '90%' }}>
                                    {clipsInNoFolder.length !== 0 && clipsInNoFolder.map((value,index) => {
                                        return(
                                            <Grid key={`clipNo${index}`} container direction='row'>
                                                <Grid item xs={10} style={{ display: 'flex', flexDirection: 'row' }}>
                                                    <ListItem button onClick={() => {
                                                        setVideoModal(true)
                                                        setVideoPath(value.File_Path)
                                                        setSelectVideo(value.Clip_Name)
                                                    }}>
                                                        <div style={{color:'green'}}><PlayCircleOutlineIcon /></div>
                                                        <ListItemText style={{ paddingLeft: '1rem' }} >{value.Clip_Name}</ListItemText>
                                                    </ListItem>
                                                </Grid>
                                                {/* <Grid item xs={2}>
                                                    <Button style={{ height: '100%' }} color='secondary' onClick={() => {
                                                        setModalDeleteFile(true);
                                                        setDataDelete(value);
                                                    }}><DeleteForeverIcon /></Button>
                                                </Grid> */}
                                            </Grid>
                                        );
                                    })}
                                    {clipFolders.length !== 0 && clipFolders.map((value,index) => {
                                        return(
                                            <Grid key={`clipFolderNo${index}`} container direction='row'>
                                                <Grid item xs={10} style={{ display: 'flex', flexDirection: 'row' }}>
                                                    <ListItem button onClick={() => {
                                                        setSelectClipFolder(value.split('/').at(-1))
                                                        setClipFolderModal(true)
                                                    }}>
                                                        <div style={{ color: 'gray' }}><FolderIcon /></div>
                                                        <ListItemText style={{ paddingLeft: '1rem' }} >{value.split('/').at(-1)}</ListItemText>
                                                    </ListItem>
                                                </Grid>
                                                {/* <Grid item xs={2}>
                                                    <Button style={{ height: '100%' }} color='secondary' onClick={() => {
                                                        setModalDeleteFile(true);
                                                        setDataDelete(value);
                                                    }}><DeleteForeverIcon /></Button>
                                                </Grid> */}
                                            </Grid>
                                        );
                                    })}
                                </List>
                            </Grid>
                            }
                        </Grid>
                        :
                        <div>student route</div>
                    : 
                    <div>
                        <div style={{ width: '100%', justifyContent: 'center', display: 'flex' }} className='pdf-container'>เลือกวิชาที่จะแสดง</div>
                        <br/>
                    </div>
                }
            </div>

            {/* folder clip modal */}
            <div>
                <Modal centered backdrop="static" show={clipFolderModal} onHide={() => {
                    setClipFolderModal(false)
                }}>
                    <Modal.Header closeButton>{selectClipFolder}</Modal.Header>
                </Modal>
            </div>

            {/* Video Modal */}
            <div>
                <Modal centered backdrop="static" show={videoModal} onHide={() => {
                    setVideoModal(false);
                    setVideoPath('');
                    //system performance
                    }}>
                    <Modal.Header closeButton>{selectVideo}</Modal.Header>
                    <Modal.Body>
                        {videoPath.length !== 0 && 
                        <video id="videoPlayer" width="100%" controls autoPlay>
                            <source src={`http://localhost:3001/teacher/video/${videoPath.split('/').at(-2)}/${videoPath.split('/').at(-1)}/${props.subject.Subject_id}/${props.user.Teacher_id}/${props.subject.Room_id}`} type="video/mp4" />
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
                                                <Form.Control style={{ width: '100%' }} type='text' disabled={clips.length !== 0 ? true : false} onChange={(e) => setClipName(e.target.value)}></Form.Control>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>อัพโหลดคลิป</Form.Label>
                                                <FilePond.FilePond
                                                    files={clips}
                                                    onupdatefiles={setClips}
                                                    allowMultiple={false}
                                                    disabled={clipName.length !== 0 ? false : true}
                                                    allowDrop
                                                    allowRevert={false}
                                                    name="clip"
                                                    credits={false}
                                                    acceptedFileTypes={['video/*']}
                                                    server={`http://localhost:3001/teacher/uploadClip/${props.subject.Subject_id}/${props.user.Teacher_id}/${props.subject.Room_id}/${newFolderName}/${clipName}`}
                                                    onprocessfiles={async () => {
                                                            await api.post('/teacher/uploadClipInFolder', {
                                                                Subject_id: props.subject.Subject_id,
                                                                Room_id: props.subject.Room_id,
                                                                Teacher_id: props.user.Teacher_id,
                                                                folder: newFolderName
                                                            })
                                                                .catch(err => console.log(err))
                                                            await api.post('/subject/inClipFolder', {
                                                                Room_id: props.subject.Room_id,
                                                                Subject_id: props.subject.Subject_id,
                                                                Teacher_id: props.user.Teacher_id,
                                                                folders: newFolderName
                                                            })
                                                                .then(res => {
                                                                    if (res.data !== 'This path does not exits.') {
                                                                        setClipsInFolder(res.data)
                                                                    }
                                                                })
                                                                .then(() => {
                                                                    setClips([]);
                                                                    setClipName('')
                                                                })
                                                                .catch(err => console.log(err))
                                                        }
                                                    }
                                                    labelIdle='ลากและวางคลิปสอนของคุณที่นี่ หรือ <span class="filepond--label-action">เลือก</span>'
                                                />
                                            </Form.Group>
                                            {clipsInFolder.length > 0 && clipsInFolder.map((value, index) => {
                                                return (
                                                    <div key={`clipUploadNo${index}`}>
                                                        {value.Clip_Name}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    }
                                </Grid>
                            </Grid>
                        </div>
                        :
                        <div style={{ width: '100%' }} className='videosUploader-container'>
                            <Form.Group>
                                <Form.Label>ชื่อคลิป</Form.Label>
                                <Form.Control style={{ width: '100%' }} disabled={clips.length !== 0 ? true : false} type='text' onChange={(e) => setClipName(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>อัพโหลดคลิป</Form.Label>
                                <FilePond.FilePond
                                    files={clips}
                                    onupdatefiles={setClips}
                                    allowMultiple={false}
                                    allowDrop
                                    disabled={clipName.length !== 0 ? false : true}
                                    allowRevert={false}
                                    name="clip"
                                    credits={false}
                                    acceptedFileTypes={['video/*']}
                                    server={`http://localhost:3001/teacher/uploadClip/${props.subject.Subject_id}/${props.user.Teacher_id}/${props.subject.Room_id}/noFolder/${clipName}`}
                                    onprocessfiles={async () => {
                                        await createFolder('noFolder');
                                        await api.post('/teacher/uploadClipInFolder', {
                                            Subject_id: props.subject.Subject_id,
                                            Room_id: props.subject.Room_id,
                                            Teacher_id: props.user.Teacher_id,
                                            folder: 'noFolder'
                                        })
                                            .catch(err => console.log(err))
                                        await api.post('/subject/inClipFolder', {
                                            Room_id: props.subject.Room_id,
                                            Subject_id: props.subject.Subject_id,
                                            Teacher_id: props.user.Teacher_id,
                                            folders: 'noFolder'
                                        })
                                            .then(res => {
                                                if (res.data !== 'This path does not exits.') {
                                                    setClipsInFolder(res.data)
                                                }
                                            })
                                            .then(() => {
                                                setClips([]);
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
                        {clips.length === 0 ?
                            <Button variant='outlined' color='error' onClick={() => {
                                if(newFolderName.length === 0){
                                    if (clipsInFolder.length === 0) {
                                        setUploadClip(false)
                                    }
                                }
                                else{
                                    if(newFolderName === 'noFolder'){
                                        console.log('delete files in folder called noFolder')
                                    }
                                    else {
                                        if (clipsInFolder.length === 0) {
                                            console.log('delete folder')
                                        }
                                        else {
                                            console.log('delete files and folder')
                                        }
                                    }
                                }
                            }}>ยกเลิก</Button>
                        :
                            <Button variant='outlined' disabled>ยกเลิก</Button>
                        }
                        <Button variant='outlined' color='primary'>ตกลง</Button>
                    </Grid>
                </Modal.Footer>
            </Modal>
        </div>
    );
}