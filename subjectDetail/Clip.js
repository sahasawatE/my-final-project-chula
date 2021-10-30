import react from 'react';
// import { Player } from 'video-react';
import * as FilePond from 'react-filepond';
import axios from 'axios';
import { Grid } from '@material-ui/core';
import {Button,Tabs,Tab, Typography} from '@mui/material';
import { Form, Modal } from 'react-bootstrap';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@material-ui/icons/Folder';
import 'filepond/dist/filepond.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

var b64toBlob = require('b64-to-blob');
// import "node_modules/video-react/dist/video-react.css";
//https://video-react.js.org/
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

    return (
        <div>
            <div>
                {props.subject ? 
                    props.user.Teacher_id ? 
                        <Grid container justifyContent="center">
                            <Button variant='text' style={{ width: '100%', color: '#4377ED' }} onClick={() => {setUploadClip(true)}}>อัพโหลดคลิป</Button>
                            
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
                        <Button variant='outlined' color='error'>ยกเลิก</Button>
                        <Button variant='outlined' color='primary'>ตกลง</Button>
                    </Grid>
                </Modal.Footer>
            </Modal>
        </div>
    );
}