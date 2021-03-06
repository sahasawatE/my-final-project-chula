import { Grid, Button, Typography, List, IconButton } from '@material-ui/core';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { toggleContext } from '../toggleContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import react from 'react';
import { selectSubjectContext } from '../selectSubjectContext';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Chip from '@mui/material/Chip';
import { socketContext } from '../../socketContext';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ClearIcon from '@mui/icons-material/Clear';
import ImageIcon from '@mui/icons-material/Image';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import * as FilePond from 'react-filepond';
import '../../App.css'
import 'filepond/dist/filepond.min.css'

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

var b64toBlob = require('b64-to-blob');
require('dotenv').config()

export default function MobileWorks(props) {
    const today = new Date();
    FilePond.registerPlugin(FilePondPluginFileValidateType)
    const ngrok = process.env.REACT_APP_NGROK_URL;
    const api = axios.create({ baseURL: ngrok })
    const user = props.user
    const { selectSubject } = react.useContext(selectSubjectContext);
    const { socket } = react.useContext(socketContext);
    const { setOpen } = react.useContext(toggleContext);

    const [studentUpload, setStudentUpload] = react.useState(false);
    const [studentPrepareWorkFile, setStudentPrepareWorkFile] = react.useState([]);

    const [works, setWorks] = react.useState([]);
    const [modalCreateWork, setModalCreateWork] = react.useState(false)
    const [workName, setWorkName] = react.useState('');
    const [workDetail, setWorkDetail] = react.useState('');
    const [workFile, setWorkFile] = react.useState([]);
    const [workPoint, setWorkPoint] = react.useState(10);
    const [workDeadline, setWorkDeadline] = react.useState('');
    const createWorkRef = react.useRef(null);
    const [addFile, setAddFile] = react.useState(false);
    const [deleteWork, setDeleteWork] = react.useState(null)
    const [deleteModal, setDeleteModal] = react.useState(false);

    function pushSocketNotification() {
        socket?.emit('push-notification')
    }

    function createWork(name, detail, deadline, point) {
        api.post('/teacher/addWork', {
            Subject_id: selectSubject.name,
            Teacher_id: user.Teacher_id,
            Room_id: selectSubject.room,
            Work_Name: name,
            Work_Detail: detail,
            End: deadline,
            Score: point
        }).then(afterCreateWork).catch(err => console.log(err))
    }

    function updataCreateWork(name, detail, deadline, point) {
        api.post('/teacher/addWorkWithFiles', {
            Subject_id: selectSubject.name,
            Teacher_id: user.Teacher_id,
            Room_id: selectSubject.room,
            Work_Name: name,
            Work_Detail: detail,
            End: deadline,
            Score: point
        }).then(afterCreateWork).catch(err => console.log(err))
    }

    function getAllWork() {
        if (user.Teacher_id) {
            api.post('/teacher/allWork', {
                Teacher_id: user.Teacher_id,
                Subject_id: selectSubject.name,
                Room_id: selectSubject.room
            }).then(res => setWorks(res.data)).catch(err => console.log(err))
        }
    }

    function afterCreateWork() {
        pushSocketNotification()
        setModalCreateWork(false);
        setOpen(true);
        setWorkName('');
        setWorkDetail('');
        setWorkPoint(10);
        setAddFile(false);
        setWorkFile([]);
        getAllWork();
    }

    function deleteHandle(work) {
        api.delete('/teacher/deleteWork', {
            data: {
                selectedWork: work
            }
        })
            .then(setDeleteModal(false))
            .then(setOpen(true))
            .then(setWorks(works.filter(p => p !== work)))
            .catch(err => console.log(err))
    }

    function deletePrepare(pwork) {
        if (pwork.length === 0) {
            setModalCreateWork(false);
            setOpen(true)
            setWorkName('');
            setWorkPoint(10);
            setAddFile(false);
            setWorkFile([]);
        }
        else {
            api.delete('/teacher/deletePrepare', {
                data: {
                    Room_id: props.subject.Room_id,
                    Teacher_id: props.user.Teacher_id,
                    Subject_id: props.subject.Subject_id,
                    Work_Name: workName
                }
            })
                .then(setModalCreateWork(false))
                .then(setOpen(true))
                .then(setWorkName(''))
                .then(setWorkDetail(''))
                .then(setWorkPoint(10))
                .then(setAddFile(false))
                .then(setWorkFile([]))
                .catch(err => console.log(err))
        }
    }

    //teacher
    if (user.Teacher_id) {
        const [selectWork, setSelectWork] = react.useState(null);
        const [teacherWorkModal, setTeacherWorkModal] = react.useState(false);
        const [readMore, setReadMore] = react.useState(false);
        const [teacherWorkFiles, setTeacherWorkFiles] = react.useState([]);
        const [viewWorkSubmit, setViewWorkSubmit] = react.useState(false);
        const [submittedStudent, setSubmittedStudent] = react.useState([]);
        const [teacherSelectImg, setTeacherSelectImg] = react.useState(null);

        const [hideWorkModal, setHideWorkModal] = react.useState(false);
        const [hideWork, setHideWork] = react.useState(null);
        const [unHideWorkModal, setUnHideWorkModal] = react.useState(false);
        const [unHideWork, setUnHideWork] = react.useState(null);

        function teacherClickWorkFile(pathFile, type) {
            api.post('/subject/file', {
                path: pathFile,
                type: type
            }).then(result => {
                if (type === 'pdf') {
                    var blob = b64toBlob(result.data, "application/pdf")
                    var blobUrl = URL.createObjectURL(blob);
                    window.open(blobUrl, '_blank');
                }
                else if (type === 'image') {
                    blob = b64toBlob(result.data, "image/*")
                    blobUrl = URL.createObjectURL(blob);
                    setTeacherSelectImg(blobUrl);
                    setTeacherWorkModal(false);
                }
            }).catch(err => console.log(err))
        }
        react.useEffect(() => {
            createWorkRef.current?.scroll({ top: createWorkRef.current.scrollHeight, behavior: 'smooth' })
        }, [workFile])
        react.useEffect(() => {
            if (selectWork) {
                api.post('/subject/allWorkFiles', {
                    File_Path: selectWork.File_Path
                }).then(res => {
                    setTeacherWorkFiles(res.data)
                }).catch(err => console.log(err))
            }
        }, [selectWork])

        react.useEffect(() => {
            if (selectSubject) {
                getAllWork()
            }
        }, [user, selectSubject])
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {selectSubject ?
                    <Button onClick={() => { setModalCreateWork(true); setOpen(false) }} style={{ color: '#4377ED' }}>????????????????????????</Button>
                    :
                    <Typography style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>??????????????????????????????????????????????????????</Typography>
                }
                {selectSubject && works.length === 0 ?
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography>???????????????????????????????????????????????????</Typography>
                    </div>
                    :
                    <List>
                        {works.map((value, index) => {
                            return (
                                <ListItem
                                    key={`workNO${index}`}
                                    disablePadding
                                    secondaryAction={
                                        <div>
                                            {value.Work_Status === 'close' ?
                                                <IconButton
                                                    onClick={() => {
                                                        setUnHideWork(value);
                                                        setUnHideWorkModal(true);
                                                    }}>
                                                    <VisibilityIcon />
                                                </IconButton>
                                                :
                                                <IconButton
                                                    onClick={() => {
                                                        setHideWork(value);
                                                        setHideWorkModal(true);
                                                    }}>
                                                    <VisibilityOffIcon />
                                                </IconButton>
                                            }
                                            <IconButton
                                                color="secondary"
                                                onClick={() => {
                                                    setDeleteWork(value);
                                                    setDeleteModal(true);
                                                    setOpen(false)
                                                }}>
                                                <DeleteForeverIcon color="secondary" />
                                            </IconButton>
                                        </div>
                                    }>
                                    <ListItemButton onClick={() => {
                                        setSelectWork(value);
                                        setTeacherWorkModal(true);
                                        setOpen(false)
                                    }}>
                                        <ListItemIcon style={value.Work_Status === 'open' ? { color: '#9F2B68' } : { color: '#8a8a8a' }}><DriveFileRenameOutlineIcon /></ListItemIcon>
                                        <ListItemText primary={<Typography style={value.Work_Status === 'open' ? null : { color: '#8a8a8a' }}>{value.Work_Name}</Typography>} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        })}
                    </List>
                }

                {/* hideModal */}
                <div>
                    <Modal centered backdrop="static" backdropClassName="modal" show={hideWorkModal}>
                        <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
                            ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?
                        </Modal.Body>
                        <Modal.Footer style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Button variant="outlined" onClick={() => setHideWorkModal(false)}>??????????????????</Button>
                            <Button variant="outlined" color="secondary" onClick={() => {
                                api.post('/teacher/hideWork', {
                                    work: hideWork
                                })
                                    .then(res => {
                                        if (res.data === 'updated') {
                                            setHideWorkModal(false);
                                            setHideWork(null);
                                            getAllWork()
                                        }
                                    })
                                    .catch(err => console.log(err))
                            }}>???????????????????????????????????????</Button>
                        </Modal.Footer>
                    </Modal>
                </div>

                {/* un-hideModal */}
                <div>
                    <Modal centered backdrop="static" backdropClassName="modal" show={unHideWorkModal}>
                        <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
                            ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?
                        </Modal.Body>
                        <Modal.Footer style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Button variant="outlined" color="secondary" onClick={() => setUnHideWorkModal(false)}>??????????????????</Button>
                            <Button variant="outlined" color="primary" onClick={() => {
                                api.post('/teacher/showWork', {
                                    work: unHideWork
                                })
                                    .then(res => {
                                        if (res.data === 'updated') {
                                            setUnHideWorkModal(false);
                                            setUnHideWork(null);
                                            getAllWork()
                                        }
                                    })
                                    .catch(err => console.log(err))
                            }}>??????????????????????????????????????????</Button>
                        </Modal.Footer>
                    </Modal>
                </div>

                {/*create modal */}
                <div>
                    <Modal centered backdrop="static" backdropClassName="modal" show={modalCreateWork} onHide={() => {
                        if (workFile.length === 0) {
                            deletePrepare([])
                        }
                        else {
                            deletePrepare(workFile)
                        }
                    }}>
                        <Modal.Header closeButton>????????????????????????</Modal.Header>
                        <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
                            <Grid container direction="column" justifyContent="space-between">
                                <Grid item xs={12} style={{ maxHeight: '65vh', overflow: 'scroll' }} innerRef={workFile.length === 0 ? null : createWorkRef}>
                                    <Grid container direction="column">
                                        {addFile ?
                                            <div>
                                                <Form.Group>
                                                    <Form.Label>?????????????????????</Form.Label>
                                                    <Form.Control style={{ width: '100%' }} type="text" disabled placeholder="???????????????????????????????????????????????????????????????" />
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label>??????????????????????????????</Form.Label>
                                                    <Form.Control disabled placeholder="???????????????????????????????????????????????????????????????" as="textarea" rows={3} style={{ maxHeight: '95px' }} />
                                                </Form.Group>
                                                <Grid container direction='row' justifyContent='space-between'>
                                                    <div style={{ width: '70%' }}>
                                                        <Form.Group>
                                                            <Form.Label>????????????????????????</Form.Label>
                                                            <Form.Control type='datetime-local' disabled />
                                                        </Form.Group>
                                                    </div>
                                                    <div style={{ width: '25%' }} >
                                                        <Form.Group>
                                                            <Form.Label>???????????????????????????</Form.Label>
                                                            <Form.Control type='number' value={workPoint} disabled />
                                                        </Form.Group>
                                                    </div>
                                                </Grid>
                                            </div>
                                            :
                                            <div>
                                                <Form.Group>
                                                    <Form.Label>?????????????????????</Form.Label>
                                                    <Form.Control style={{ width: '100%' }} type="text" onChange={(e) => setWorkName(e.target.value)} placeholder="???????????????????????????????????????????????????????????????" />
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label>??????????????????????????????</Form.Label>
                                                    <Form.Control onChange={(e) => setWorkDetail(e.target.value)} placeholder="???????????????????????????????????????????????????????????????" as="textarea" rows={3} style={{ maxHeight: '95px' }} />
                                                </Form.Group>
                                                <Grid container direction='row' justifyContent='space-between'>
                                                    <div style={{ width: '70%' }}>
                                                        <Form.Group>
                                                            <Form.Label>????????????????????????</Form.Label>
                                                            <Form.Control type='datetime-local' value={new Date(today.setDate(today.getDate() + 1)).toISOString().split('.')[0].substring(0, 16)} onChange={(e) => {
                                                                if (new Date(e.target.value) < new Date()) {
                                                                    alert('??????????????????????????????????????????????????????????????????????????????????????????');
                                                                    setWorkDeadline(new Date(today.setDate(today.getDate() + 1)).toISOString().split('.')[0].substring(0, 16))
                                                                }
                                                                else {
                                                                    setWorkDeadline(e.target.value)
                                                                }
                                                            }} />
                                                        </Form.Group>
                                                    </div>
                                                    <div style={{ width: '25%' }} >
                                                        <Form.Group>
                                                            <Form.Label>???????????????????????????</Form.Label>
                                                            <Form.Control type='number' value={workPoint} onChange={(e) => setWorkPoint(e.target.value)} />
                                                        </Form.Group>
                                                    </div>
                                                </Grid>
                                            </div>
                                        }
                                        {workName !== '' && workDetail !== '' && workDeadline !== '' ?
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                                <Button onClick={() => setAddFile(true)} color="primary">???????????????????????????</Button>
                                            </div>
                                            :
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                                <Button disabled>???????????????????????????</Button>
                                            </div>
                                        }
                                        {addFile ?
                                            <div>
                                                <FilePond.FilePond
                                                    files={workFile}
                                                    onupdatefiles={setWorkFile}
                                                    allowMultiple={true}
                                                    maxFiles={3}
                                                    allowDrop
                                                    acceptedFileTypes={['application/pdf', 'image/*']}
                                                    // allowRemove={false}
                                                    name="file"
                                                    credits={false}
                                                    allowRevert
                                                    onprocessfilerevert={(f) => {
                                                        api.delete('/teacher/deleteOnePrepare', {
                                                            data: {
                                                                path: f.file.name,
                                                                Room_id: props.subject.Room_id,
                                                                Teacher_id: props.user.Teacher_id,
                                                                Subject_id: props.subject.Subject_id,
                                                                Work_Name: workName
                                                            }
                                                        }).then(console.log('deleted')).catch(err => console.log(err))
                                                    }}
                                                    server={{
                                                        process: `${ngrok}teacher/uploadWorkFiles/${props.subject.Subject_id}/${props.user.Teacher_id}/${props.subject.Room_id}/${workName}`,
                                                        revert: null
                                                    }}
                                                    labelIdle='??????????????????????????? PDF ???????????????????????????????????? ???????????? <span class="filepond--label-action">???????????????</span> ?????????????????? 3 ????????????'
                                                />
                                            </div>
                                            :
                                            null
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Modal.Body>
                        <Modal.Footer style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Button variant="outlined" color="secondary" onClick={() => {
                                if (workFile.length === 0) {
                                    deletePrepare([])
                                }
                                else {
                                    deletePrepare(workFile)
                                }
                            }}>??????????????????</Button>
                            {workName !== '' && workDetail !== '' && workDeadline !== '' ?
                                workFile.length === 0 ?
                                    <Button variant="outlined" color="primary" onClick={() => {
                                        createWork(workName, workDetail, workDeadline, workPoint)
                                    }
                                    }>???????????????</Button>
                                    :
                                    <Button variant="outlined" color="primary" onClick={() => {
                                        updataCreateWork(workName, workDetail, workDeadline, workPoint)
                                    }
                                    }>???????????????</Button>
                                :
                                <Button variant="outlined" color="primary" disabled>???????????????</Button>
                            }
                        </Modal.Footer>
                    </Modal>
                </div>

                {/* img modal */}
                <Modal centered backdropClassName="modal" show={teacherSelectImg !== null} aria-labelledby="contained-modal-title-vcenter" onHide={() => {
                    setTeacherSelectImg(null);
                    setTeacherWorkModal(true);
                    setOpen(false)
                }}>
                    <img src={teacherSelectImg} alt='teacherSelectImg' />
                </Modal>

                {/* deleteModal */}
                <div>
                    <Modal centered backdropClassName="modal" backdrop="static" show={deleteModal}>
                        <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
                            ?????????????????????????????????????????????????????????????????????????????????????????????????????? ?
                        </Modal.Body>
                        <Modal.Footer style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Button variant="outlined" onClick={() => {setDeleteModal(false); setOpen(true)}}>??????????????????</Button>
                            <Button variant="outlined" color="secondary" onClick={() => deleteHandle(deleteWork)}>??????</Button>
                        </Modal.Footer>
                    </Modal>
                </div>

                {/* work modal */}
                <div>
                    {selectWork ?
                        <Modal centered backdropClassName="modal" show={teacherWorkModal} backdrop="static" onHide={() => {
                            setTeacherWorkModal(false)
                            setOpen(true)
                        }}>
                            <Modal.Header closeButton>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Typography>{selectWork.Work_Name}</Typography>
                                    <Typography style={{ paddingLeft: '16px', color: '#9A9A9A' }}>({selectWork.Score} ???????????????)</Typography>
                                </div>
                            </Modal.Header>
                            <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
                                <Grid container direction='column'>
                                    <Grid container>
                                        <Grid item xs={12} style={{ maxHeight: '32vh', overflow: 'scroll' }}>
                                            {selectWork.Work_Detail.length > 250 ?
                                                <Typography>{readMore ?
                                                    selectWork.Work_Detail
                                                    :
                                                    selectWork.Work_Detail.slice(0, 248) + ' ...'
                                                }</Typography>
                                                :
                                                <Typography>{selectWork.Work_Detail}</Typography>
                                            }
                                        </Grid>
                                    </Grid>
                                    <div style={{ paddingBottom: '0.5rem' }}>
                                        {selectWork.Work_Detail.length > 250 ?
                                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button color='primary' onClick={() => setReadMore(!readMore)}>{readMore ? '?????????' : '?????????????????????'}</Button>
                                            </div>
                                            :
                                            null
                                        }
                                    </div>
                                    <div style={{ paddingBottom: '0.5rem' }}>
                                        {teacherWorkFiles.map((value, index) => {
                                            return (
                                                <div key={`workFile${value.Work_File_id}Index${index}`}>
                                                    <Button style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }} onClick={() => teacherClickWorkFile(value.File_path, value.File_type)}>
                                                        <div style={{ color: 'gray' }}>{value.File_type === 'pdf' ? <InsertDriveFileIcon /> : <ImageIcon />}</div>
                                                        <Typography style={{ paddingLeft: '0.5rem' }}>{value.File_path.split('\\').pop().split('/').pop()}</Typography>
                                                    </Button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div style={{ paddingBottom: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                        <Typography style={{ color: '#9A9A9A', paddingRight: '0.5rem' }}>????????????????????? {selectWork.End.split('T')[0].split('-')[2] + '/' + selectWork.End.split('T')[0].split('-')[1] + '/' + selectWork.End.split('T')[0].split('-')[0]}</Typography>
                                        <Typography style={{ color: '#9A9A9A' }}>???????????? {selectWork.End.split('T')[1]}</Typography>
                                    </div>
                                    <div>

                                    </div>
                                </Grid>
                            </Modal.Body>
                            <Modal.Footer style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <Button variant="outlined" color="secondary" onClick={() => {
                                    setTeacherWorkModal(false);
                                    setOpen(true)
                                    setViewWorkSubmit(false);
                                }}>?????????</Button>
                                <Button variant="outlined" color="primary" onClick={() => {
                                    api.post('/teacher/checkWork', {
                                        Room_id: props.subject.Room_id,
                                        Teacher_id: props.user.Teacher_id,
                                        Subject_id: props.subject.Subject_id,
                                        Work_Name: selectWork.Work_Name
                                    })
                                        .then(res => {
                                            setSubmittedStudent(res.data)
                                        })
                                        .then(() => {
                                            setViewWorkSubmit(true);
                                            setTeacherWorkModal(false);
                                        })
                                        .catch(err => console.log(err))
                                }}>?????????????????????????????????</Button>
                            </Modal.Footer>
                        </Modal>
                        :
                        null
                    }
                </div>

                {/* Submittion Work Modal */}
                <div>
                    {selectWork &&
                        <Modal backdropClassName="modal" centered show={viewWorkSubmit} backdrop="static" onHide={() => {
                            setViewWorkSubmit(false);
                            setTeacherWorkModal(true);
                            setOpen(false)
                        }}>
                            <Modal.Header closeButton>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Typography>??????????????????????????? {selectWork.Work_Name}</Typography>
                                    <Typography style={{ paddingLeft: '16px', color: '#9A9A9A' }}>({selectWork.Score} ???????????????)</Typography>
                                </div>
                            </Modal.Header>
                            <Modal.Body>
                                {submittedStudent.length === 0 ?
                                    <div>
                                        <Typography>???????????????????????????</Typography>
                                    </div>
                                    :
                                    <div>
                                        {submittedStudent.map((value, index) => {
                                            return (
                                                <div key={`listStudentThatSubmittedWorkNO${index}`}>
                                                    {new Date(value.Submit_date) < new Date(selectWork.End) &&
                                                        <Button onClick={async () => {
                                                            // console.log(value);
                                                            localStorage.setItem('studentSubmittedWork', JSON.stringify({ student: value, work: selectWork }))
                                                            window.open('/studentWork', '_blank');
                                                        }} style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'start', width: '50%' }}>
                                                                <Typography>{value.Student_id} {value.files.length !== 0 && <>({value.files.split('[')[1].split(']')[0].split(',').length} ????????????)</>}</Typography>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', width: '50%' }}>
                                                                <Chip variant='outlined' color={value.is_Checked === 'false' ? 'error' : 'success'} label={value.is_Checked === 'false' ? '??????????????????????????????' : '????????????????????????'} />
                                                                <b style={{ color: 'grey' }}><b style={value.Student_score <= value.Score / 3 ? { color: 'red' } : value.Student_score <= (value.Score / 3) * 2 ? { color: 'orange' } : { color: 'green' }}>{value.Student_score}</b>{` / ${value.Score}`}</b>
                                                                <b style={{ color: 'green' }}>??????????????????????????????</b>
                                                            </div>
                                                        </Button>
                                                    }
                                                    {new Date(value.Submit_date) > new Date(selectWork.End) &&
                                                        <Button onClick={async () => {
                                                            // console.log(value);
                                                            localStorage.setItem('studentSubmittedWork', JSON.stringify({ student: value, work: selectWork }))
                                                            window.open('/studentWork', '_blank');
                                                        }} style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'start', width: '50%' }}>
                                                                <Typography>{value.Student_id} {value.files.length !== 0 && <>({value.files.split('[')[1].split(']')[0].split(',').length} ????????????)</>}</Typography>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', width: '50%' }}>
                                                                <Chip variant='outlined' color={value.is_Checked === 'false' ? 'error' : 'success'} label={value.is_Checked === 'false' ? '??????????????????????????????' : '????????????????????????'} />
                                                                <b style={{ color: 'grey' }}><b style={value.Student_score <= value.Score / 3 ? { color: 'red' } : value.Student_score <= (value.Score / 3) * 2 ? { color: 'orange' } : { color: 'green' }}>{value.Student_score}</b>{` / ${value.Score}`}</b>
                                                                <b style={{ color: 'red' }}>??????????????????</b>
                                                            </div>
                                                        </Button>
                                                    }
                                                </div>
                                            );
                                        })}
                                    </div>
                                }
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="outlined" color="secondary" onClick={() => {
                                    setTeacherWorkModal(true);
                                    setViewWorkSubmit(false);
                                }}>?????????</Button>
                            </Modal.Footer>
                        </Modal>
                    }
                </div>
            </div>
        );
    }
    //student
    else {
        const [studentOpenWork, setStudentOpenWork] = react.useState(false);
        const [selectWork, setSelectWork] = react.useState(null);
        const [readMore, setReadMore] = react.useState(false);
        const [studentWorkFiles, setStudentWorkFiles] = react.useState([]);
        const [isSubmit, setIsSubmit] = react.useState(false);
        const [isChecked, setIsChecked] = react.useState(false);
        const [comment, setComment] = react.useState('');
        const [studentScore, setStudentScore] = react.useState('');
        const [studentAddFile, setStudentAddFile] = react.useState([]);
        const [hok, setHok] = react.useState([]);
        const [studentSelectImg, setStudentSelectImg] = react.useState(null);

        function studentAllWorks(roomId, subjectId) {
            api.post('/subject/studentWorks', {
                Room_id: roomId,
                Subject_id: subjectId
            }).then(res => setWorks(res.data)).catch(err => console.log(err))
        }

        function studentClickWorkFile(pathFile, type) {
            api.post('/subject/file', {
                path: pathFile,
                type: type
            }).then(result => {
                if (type === 'pdf') {
                    var blob = b64toBlob(result.data, "application/pdf")
                    var blobUrl = URL.createObjectURL(blob);
                    window.open(blobUrl, '_blank');
                }
                else if (type === 'image') {
                    blob = b64toBlob(result.data, "image/*")
                    blobUrl = URL.createObjectURL(blob);
                    setStudentSelectImg(blobUrl);
                    setStudentOpenWork(false);
                }
            }).catch(err => console.log(err))
        }

        function studentPrepareWork() {
            api.post('/student/prepareWork', {
                Subject_id: props.subject.Subject_id,
                Student_id: props.user.Student_id,
                Room_id: props.subject.Room_id,
                Teacher_id: props.subject.Teacher_id,
                workName: selectWork.Work_Name,
                score: selectWork.Score
            })
                .then(res => setStudentPrepareWorkFile(res.data))
                .catch(err => console.log(err))
        }

        react.useEffect(() => {
            if (selectSubject) {
                studentAllWorks(user.Room_id, selectSubject.name)
            }
        }, [user, selectSubject])

        react.useEffect(() => {
            if (selectWork) {
                api.post('/subject/allWorkFiles', {
                    File_Path: selectWork.File_Path
                }).then(res => {
                    setStudentWorkFiles(res.data);
                    api.post('/subject/checkStatusWork', {
                        selectWork: selectWork,
                        Student_id: props.user.Student_id
                    }).then(res2 => {
                        setIsSubmit(res2.data[0].isSubmit)
                        setIsChecked(res2.data[0].is_Checked)
                        setComment(res2.data[0].comment)
                        setStudentScore(res2.data[0].Student_score)
                    }).catch(err2 => console.log(err2))
                })
                    .then(studentPrepareWork()).catch(err => console.log(err))
            }
        }, [selectWork])

        return (
            <div>
                <div>
                    {selectSubject ?
                        null
                        :
                        <Typography style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>??????????????????????????????????????????????????????</Typography>
                    }
                    {selectSubject && works.length === 0 ?
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography>???????????????????????????????????????????????????</Typography>
                        </div>
                        :
                        <List>
                            {works.map((value, index) => {
                                if (value.Work_Status === 'open') {
                                    return (
                                        <ListItem key={`workNO${index}`} button onClick={() => {
                                            setSelectWork(value);
                                            setStudentOpenWork(true);
                                            setOpen(false)
                                        }}>
                                            <ListItemIcon style={{ color: '#9F2B68' }}><DriveFileRenameOutlineIcon /></ListItemIcon>
                                            <ListItemText primary={value.Work_Name} />
                                        </ListItem>
                                    )
                                }
                                else {
                                    return null;
                                }
                            })}
                        </List>
                    }
                </div>

                {/* work modal */}
                <div>
                    {selectWork ?
                        <Modal backdropClassName="modal" centered backdrop="static" show={studentOpenWork} onHide={() => {
                            setStudentOpenWork(false);
                            setOpen(true)
                            setReadMore(false);
                            setSelectWork(null);
                            setStudentWorkFiles([]);
                            setStudentPrepareWorkFile([]);
                        }}>
                            <Modal.Header closeButton>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Typography>{selectWork.Work_Name}</Typography>
                                    <div style={{ paddingLeft: '16px', marginTop: '-0.3rem' }}>
                                        {isChecked === 'false' ?
                                            <Chip color={isSubmit ? 'success' : 'error'} variant='outlined' label={isSubmit ? '?????????????????????' : '???????????????????????????'} />
                                            :
                                            <Chip color={Number(studentScore) <= Number(selectWork.Score) / 3 ? 'error' : Number(studentScore) <= (Number(selectWork.Score) / 3)*2 ? 'warning' : 'success'} variant='outlined' label={`${studentScore} / ${selectWork.Score}`} />
                                        }
                                    </div>
                                    {isChecked === 'false' && <Typography style={{ paddingLeft: '16px', color: '#9A9A9A' }}>({selectWork.Score} ???????????????)</Typography>}
                                </div>
                            </Modal.Header>
                            <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
                                <Grid container direction='column'>
                                    <Grid container>
                                        <Grid item xs={12} style={{ maxHeight: '32vh', overflow: 'scroll' }}>
                                            {selectWork.Work_Detail.length > 250 ?
                                                <Typography>{readMore ?
                                                    selectWork.Work_Detail
                                                    :
                                                    selectWork.Work_Detail.slice(0, 248) + ' ...'
                                                }</Typography>
                                                :
                                                <Typography>{selectWork.Work_Detail}</Typography>
                                            }
                                        </Grid>
                                    </Grid>
                                    <div style={{ paddingBottom: '0.5rem' }}>
                                        {selectWork.Work_Detail.length > 250 ?
                                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button color='primary' onClick={() => setReadMore(!readMore)}>{readMore ? '?????????' : '?????????????????????'}</Button>
                                            </div>
                                            :
                                            null
                                        }
                                    </div>
                                    <div style={{ paddingBottom: '0.5rem' }}>
                                        {studentWorkFiles.map((value, index) => {
                                            return (
                                                <div key={`workFile${value.Work_File_id}Index${index}`}>
                                                    <Button style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }} onClick={() => studentClickWorkFile(value.File_path, value.File_type)}>
                                                        <div style={{ color: 'gray' }}>{value.File_type === 'pdf' ? <InsertDriveFileIcon /> : <ImageIcon />}</div>
                                                        <Typography style={{ paddingLeft: '0.5rem' }}>{value.File_path.split('\\').pop().split('/').pop()}</Typography>
                                                    </Button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div style={{ paddingBottom: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                        <Typography style={{ color: '#9A9A9A', paddingRight: '0.5rem' }}>????????????????????? {selectWork.End.split('T')[0].split('-')[2] + '/' + selectWork.End.split('T')[0].split('-')[1] + '/' + selectWork.End.split('T')[0].split('-')[0]}</Typography>
                                        <Typography style={{ color: '#9A9A9A' }}>???????????? {selectWork.End.split('T')[1]}</Typography>
                                    </div>
                                    {!isSubmit &&
                                        <div>
                                            <FilePond.FilePond
                                                files={studentAddFile}
                                                onupdatefiles={setStudentAddFile}
                                                allowMultiple={true}
                                                maxFiles={3}
                                                allowDrop
                                                acceptedFileTypes={['application/pdf', 'image/*']}
                                                // allowRemove={false}
                                                name="file"
                                                credits={false}
                                                allowRevert
                                                server={{
                                                    process: `${ngrok}student/uploadWorkFile/${props.subject.Subject_id}/${props.user.Student_id}/${props.subject.Room_id}/${selectWork.Work_Name}`,
                                                    revert: null
                                                }}
                                                onprocessfiles={async () => {
                                                    await api.post('/student/updateWorkSubmit', {
                                                        Subject_id: props.subject.Subject_id,
                                                        Student_id: props.user.Student_id,
                                                        Room_id: props.subject.Room_id,
                                                        Teacher_id: props.subject.Teacher_id,
                                                        workName: selectWork.Work_Name,
                                                        score: selectWork.Score
                                                    })
                                                        .catch(err => console.log(err))

                                                    await api.post('/student/prepareWork', {
                                                        Subject_id: props.subject.Subject_id,
                                                        Student_id: props.user.Student_id,
                                                        Room_id: props.subject.Room_id,
                                                        Teacher_id: props.subject.Teacher_id,
                                                        workName: selectWork.Work_Name,
                                                        score: selectWork.Score
                                                    })
                                                        .then(res => setHok(res.data))
                                                        .catch(err => console.log(err))

                                                    setStudentUpload(true);
                                                }}
                                                onprocessfilerevert={async (f) => {
                                                    await api.delete('/student/deletePrepareWorkFile', {
                                                        data: {
                                                            file: hok.filter(e => e.File_Path.split('/').at(-1) === f.file.name)[0]
                                                        }
                                                    }).catch(err => console.log(err))

                                                    await api.post('/student/updateWorkSubmit', {
                                                        Subject_id: props.subject.Subject_id,
                                                        Student_id: props.user.Student_id,
                                                        Room_id: props.subject.Room_id,
                                                        Teacher_id: props.subject.Teacher_id,
                                                        workName: selectWork.Work_Name,
                                                        score: selectWork.Score
                                                    })
                                                        .catch(err => console.log(err))
                                                }}
                                                labelIdle='???????????????????????????????????????????????????????????????????????? ???????????? <span class="filepond--label-action">???????????????</span> ?????????????????? 3 ????????????'
                                            />
                                        </div>
                                    }
                                    <div style={{ paddingBottom: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                        {studentUpload && <Button color="primary" onClick={async () => {
                                            setStudentAddFile([])
                                            setStudentUpload(false)
                                            studentPrepareWork()
                                        }}>?????????????????????</Button>}
                                    </div>
                                    <div style={{ maxHeight: '20vh', overflow: 'scroll' }}>
                                        {studentPrepareWorkFile.length !== 0 && <Typography>??????????????????????????????</Typography>}
                                        {studentPrepareWorkFile.map((value, index) => {
                                            return (
                                                <Grid container justifyContent='space-between' key={`studentFileNo${index}`}>
                                                    <Grid item xs={isSubmit ? 12 : 10} style={{ display: 'flex' }} zeroMinWidth>
                                                        <Button style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => studentClickWorkFile(value.File_Path, value.File_type)}>
                                                            <div style={{ color: 'gray' }}>{value.File_type === 'pdf' ? <InsertDriveFileIcon /> : <ImageIcon />}</div>
                                                            <Typography noWrap style={{ paddingLeft: '0.5rem' }}>{value.File_Path.split('\\').pop().split('/').pop()}</Typography>
                                                        </Button>
                                                    </Grid>
                                                    {!isSubmit &&
                                                        <Grid item xs={2} style={{ display: 'flex', justifyContent: 'center' }}>
                                                            <IconButton color='secondary' onClick={async () => {
                                                                await api.delete('/student/deletePrepareWorkFile', {
                                                                    data: {
                                                                        file: value
                                                                    }
                                                                }).catch(err => console.log(err))
                                                                await api.post('/student/updateWorkSubmit', {
                                                                    Subject_id: props.subject.Subject_id,
                                                                    Student_id: props.user.Student_id,
                                                                    Room_id: props.subject.Room_id,
                                                                    Teacher_id: props.subject.Teacher_id,
                                                                    workName: selectWork.Work_Name,
                                                                    score: selectWork.Score
                                                                }).catch(err => console.log(err))
                                                                studentPrepareWork()
                                                            }}><ClearIcon /></IconButton>
                                                        </Grid>
                                                    }
                                                </Grid>
                                            );
                                        })}
                                    </div>
                                    {isChecked !== 'false' &&
                                        <div style={{ maxHeight: '20vh', overflow: 'scroll', paddingTop:'2rem' }}>
                                            <Typography>???????????????????????????????????????????????????</Typography>
                                            <div style={{width:'85%',margin:'auto'}}>
                                                <Typography>{comment}</Typography>
                                            </div>
                                        </div>
                                    }
                                </Grid>
                            </Modal.Body>
                            <Modal.Footer style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <Button variant="outlined" color="secondary" onClick={() => {
                                    if (studentAddFile.length === 0) {
                                        setStudentOpenWork(false);
                                        setOpen(true)
                                        setReadMore(false);
                                        setSelectWork(null);
                                        setStudentWorkFiles([]);
                                        setStudentPrepareWorkFile([]);
                                    }
                                    else {
                                        alert('??????????????????????????????????????????????????????????????????????????????????????????????????????')
                                    }
                                }}>?????????</Button>
                                {studentPrepareWorkFile.length === 0 ?
                                    <Button variant="outlined" disabled>?????????</Button>
                                    :
                                    isChecked !== 'false' ?
                                    null
                                    :
                                    isSubmit === 'true' ?
                                        <Button color='primary' variant='outlined' onClick={() => {
                                            setIsSubmit(false);
                                            api.post('/student/editWork', {
                                                Subject_id: props.subject.Subject_id,
                                                Student_id: props.user.Student_id,
                                                Room_id: props.subject.Room_id,
                                                Teacher_id: props.subject.Teacher_id,
                                                workName: selectWork.Work_Name,
                                                score: selectWork.Score
                                            }).catch(err => console.log(err))
                                        }}>???????????????</Button>
                                        :
                                        <Button variant="outlined" color="primary" onClick={() => {
                                            if (studentAddFile.length !== 0) {
                                                alert('??????????????????????????????????????????????????????????????????????????????')
                                            }
                                            else {
                                                if (new Date(selectWork.End) < new Date()) {
                                                    alert('??????????????????')
                                                }

                                                api.post('/student/submitwork', {
                                                    Subject_id: props.subject.Subject_id,
                                                    Student_id: props.user.Student_id,
                                                    Room_id: props.subject.Room_id,
                                                    Teacher_id: props.subject.Teacher_id,
                                                    workName: selectWork.Work_Name,
                                                    score: selectWork.Score
                                                }).then(() => {
                                                    alert('????????????????????????????????????')
                                                }).then(() => {
                                                    setStudentOpenWork(false);
                                                    setOpen(true)
                                                    setReadMore(false);
                                                    setSelectWork(null);
                                                    setStudentWorkFiles([]);
                                                    setStudentPrepareWorkFile([]);
                                                }).catch(err => console.log(err))
                                            }
                                        }}>?????????</Button>
                                }
                            </Modal.Footer>
                        </Modal>
                        :
                        null
                    }
                </div>

                {/* img modal */}
                <Modal backdropClassName="modal" centered show={studentSelectImg !== null} aria-labelledby="contained-modal-title-vcenter" onHide={() => {
                    setStudentSelectImg(null);
                    setStudentOpenWork(true);
                }}>
                    <img src={studentSelectImg} alt='teacherSelectImg' />
                </Modal>
            </div>
        );
    }
}