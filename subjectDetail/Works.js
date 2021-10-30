import { Grid, Button, Typography, List, ListItem, ListItemText, IconButton } from '@material-ui/core';
import { Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import react from 'react';
import { selectSubjectContext } from '../selectSubjectContext';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Chip from '@mui/material/Chip';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ClearIcon from '@mui/icons-material/Clear';
import ImageIcon from '@mui/icons-material/Image';
import * as FilePond from 'react-filepond';
import 'filepond/dist/filepond.min.css'

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

var b64toBlob = require('b64-to-blob');

export default function Works(props) {
    FilePond.registerPlugin(FilePondPluginFileValidateType)
    const api = axios.create({
        baseURL: 'http://localhost:3001/'
    })
    const user = props.user
    const {selectSubject} = react.useContext(selectSubjectContext);

    const [studentUpload, setStudentUpload] = react.useState(false);
    const [studentPrepareWorkFile, setStudentPrepareWorkFile] = react.useState([]);

    const [works,setWorks] = react.useState([]);
    const [modalCreateWork,setModalCreateWork] = react.useState(false)
    const [workName, setWorkName] = react.useState('');
    const [workDetail, setWorkDetail] = react.useState('');
    const [workFile, setWorkFile] = react.useState([]);
    const [workPoint,setWorkPoint] = react.useState(10);
    const [workDeadline, setWorkDeadline] = react.useState('');
    const createWorkRef = react.useRef(null);
    const [addFile,setAddFile] = react.useState(false);
    const [deleteWork,setDeleteWork] = react.useState(null)
    const [deleteModal, setDeleteModal] = react.useState(false);

    function createWork(name,detail,deadline,point){
        api.post('/teacher/addWork',{
            Subject_id : selectSubject.name,
            Teacher_id : user.Teacher_id,
            Room_id : selectSubject.room,
            Work_Name : name,
            Work_Detail : detail,
            End : deadline,
            Score : point
        }).then(afterCreateWork).catch(err => console.log(err))
    }

    function updataCreateWork(name, detail, deadline, point){
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

    function getAllWork(){
        if(user.Teacher_id){
            api.post('/teacher/allWork',{
                Teacher_id : user.Teacher_id,
                Subject_id : selectSubject.name,
                Room_id : selectSubject.room
            }).then(res => setWorks(res.data)).catch(err => console.log(err))
        }
    }

    function afterCreateWork(){
        setModalCreateWork(false);
        setWorkName('');
        setWorkDetail('');
        setWorkPoint(10);
        setAddFile(false);
        setWorkFile([]);
        getAllWork()
    }

    function deleteHandle(work){
        api.delete('/teacher/deleteWork',{
            data:{
                selectedWork : work
            }
        })
        .then(setDeleteModal(false))
        .then(setWorks(works.filter(p => p !== work)))
        .catch(err => console.log(err))
    }

    function deletePrepare(pwork){
        if(pwork.length === 0){
            setModalCreateWork(false);
            setWorkName('');
            setWorkPoint(10);
            setAddFile(false);
            setWorkFile([]);
        }
        else{
            api.delete('/teacher/deletePrepare', {
                data: {
                    Room_id: props.subject.Room_id,
                    Teacher_id: props.user.Teacher_id,
                    Subject_id: props.subject.Subject_id,
                    Work_Name: workName
                }
            })
            .then(setModalCreateWork(false))
            .then(setWorkName(''))
            .then(setWorkDetail(''))
            .then(setWorkPoint(10))
            .then(setAddFile(false))
            .then(setWorkFile([]))
            .catch(err => console.log(err))
        }
    }

    //teacher
    if(user.Teacher_id){
        const [selectWork, setSelectWork] = react.useState(null);
        const [teacherWorkModal, setTeacherWorkModal] = react.useState(false);
        const [readMore, setReadMore] = react.useState(false);
        const [teacherWorkFiles, setTeacherWorkFiles] = react.useState([]);
        const [viewWorkSubmit, setViewWorkSubmit] = react.useState(false);
        const [submittedStudent,setSubmittedStudent] = react.useState([]);
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
                    window.open(blobUrl, '_blank');
                }
            }).catch(err => console.log(err))
        }
        react.useEffect(() => {
            createWorkRef.current?.scroll({ top: createWorkRef.current.scrollHeight, behavior: 'smooth' }) 
        },[workFile])
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
            if(selectSubject){
                getAllWork()
            }
        },[user,selectSubject])
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                {selectSubject ? 
                    <Button onClick={() => setModalCreateWork(true)} style={{ color:'#4377ED'}}>สร้างงาน</Button>
                    :
                    <Typography style={{width:'100%',display:'flex',justifyContent:'center'}}>เลือกวิชาที่จะแสดง</Typography>
                }
                <br/>
                {selectSubject && works.length === 0 ? 
                <div style={{display:'flex',justifyContent:'center'}}>
                    <Typography>ยังไม่มีงานตอนนี้</Typography>
                </div>
                :
                <List>
                    {works.map((value,index) => {
                        return(
                            <Grid key={index} container justifyContent="center">
                                <Grid item xs={10}>
                                    <ListItem button onClick={() => {
                                        setSelectWork(value);
                                        setTeacherWorkModal(true);
                                    }}>
                                        <ListItemText key={index} primary={value.Work_Name} />
                                    </ListItem>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        style={{ height: '100%' }}
                                        color="secondary"
                                        onClick={() => {
                                            setDeleteWork(value);
                                            setDeleteModal(true)
                                        }}
                                        >
                                        <DeleteForeverIcon color="secondary" />
                                    </Button>
                                </Grid>
                            </Grid>
                        )
                    })}
                </List>
                }

                {/*create modal */}
                <div>
                    <Modal centered backdrop="static" show={modalCreateWork} onHide={() => {
                        if (workFile.length === 0) {
                            deletePrepare([])
                        }
                        else {
                            deletePrepare(workFile)
                        }
                    }}>
                        <Modal.Header closeButton>สร้างงาน</Modal.Header>
                        <Modal.Body style={{ display: 'flex', justifyContent: 'center'}}>
                            <Grid container direction="column" justifyContent="space-between">
                                <Grid item xs={12} style={{ maxHeight: '65vh', overflow: 'scroll' }} innerRef={workFile.length === 0 ? null : createWorkRef}>
                                    <Grid container direction="column">
                                        {addFile ? 
                                        <div>
                                            <Form.Group>
                                                <Form.Label>ชื่องาน</Form.Label>
                                                <Form.Control style={{ width: '100%' }} type="text" disabled onChange={(e) => setWorkName(e.target.value)} placeholder="เขียนชื่อหัวข้อของงาน" />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>รายละเอียด</Form.Label>
                                                <Form.Control onChange={(e) => setWorkDetail(e.target.value)} disabled placeholder="เขียนรายละเอียดของงาน" as="textarea" rows={3} style={{ maxHeight: '95px' }} />
                                            </Form.Group>
                                            <Grid container direction='row' justifyContent='space-between'>
                                                <div style={{width:'70%'}}>
                                                    <Form.Group>
                                                        <Form.Label>กำหนดส่ง</Form.Label>
                                                        <Form.Control type='datetime-local' disabled onChange={(e) => setWorkDeadline(e.target.value)} />
                                                    </Form.Group>
                                                </div>
                                                <div style={{ width: '25%' }} >
                                                    <Form.Group>
                                                        <Form.Label>คะแนนเต็ม</Form.Label>
                                                        <Form.Control type='number' value={workPoint} disabled onChange={(e) => setWorkPoint(e.target.value)} />
                                                    </Form.Group>
                                                </div>
                                            </Grid>
                                        </div>
                                        :
                                        <div>
                                            <Form.Group>
                                                <Form.Label>ชื่องาน</Form.Label>
                                                <Form.Control style={{ width: '100%' }} type="text" onChange={(e) => setWorkName(e.target.value)} placeholder="เขียนชื่อหัวข้อของงาน" />
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>รายละเอียด</Form.Label>
                                                <Form.Control onChange={(e) => setWorkDetail(e.target.value)} placeholder="เขียนรายละเอียดของงาน" as="textarea" rows={3} style={{ maxHeight: '95px' }} />
                                            </Form.Group>
                                            <Grid container direction='row' justifyContent='space-between'>
                                                <div style={{width:'70%'}}>
                                                    <Form.Group>
                                                        <Form.Label>กำหนดส่ง</Form.Label>
                                                        <Form.Control type='datetime-local' onChange={(e) => setWorkDeadline(e.target.value)} />
                                                    </Form.Group>
                                                </div>
                                                <div style={{ width: '25%' }} >
                                                    <Form.Group>
                                                        <Form.Label>คะแนนเต็ม</Form.Label>
                                                        <Form.Control type='number' value={workPoint} onChange={(e) => setWorkPoint(e.target.value)} />
                                                    </Form.Group>
                                                </div>
                                            </Grid>
                                        </div>
                                        }
                                        {workName !== '' && workDetail !== '' && workDeadline !== '' ?
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                                <Button onClick={() => setAddFile(true)} color="primary">เพิ่มไฟล์</Button>
                                            </div>
                                            :
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                                <Button disabled>เพิ่มไฟล์</Button>
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
                                                acceptedFileTypes={['application/pdf','image/*']}
                                                allowRemove={false}
                                                name="file"
                                                credits={false}
                                                allowRevert={false}
                                                // onprocessfilerevert={(f) => {
                                                //     api.delete('/teacher/deleteOnePrepare',{
                                                //         data : {
                                                //             path : f.file.name,
                                                //             Room_id: props.subject.Room_id,
                                                //             Teacher_id: props.user.Teacher_id,
                                                //             Subject_id: props.subject.Subject_id,
                                                //             Work_Name: workName
                                                //         }
                                                //     }).then(console.log('deleted')).catch(err => console.log(err))
                                                // }}
                                                server={{
                                                    process : `http://localhost:3001/teacher/uploadWorkFiles/${props.subject.Subject_id}/${props.user.Teacher_id}/${props.subject.Room_id}/${workName}`
                                                }}
                                                labelIdle='ลากและวาง PDF ของคุณที่นี่ หรือ <span class="filepond--label-action">เลือก</span> สูงสุด 3 ไฟล์'
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
                                if(workFile.length === 0){
                                    deletePrepare([])
                                }
                                else{
                                    deletePrepare(workFile)
                                }
                            }}>ยกเลิก</Button>
                            {workName !== '' && workDetail !== '' && workDeadline !== '' ?
                                workFile.length === 0 ?
                                    <Button variant="outlined" color="primary" onClick={() => 
                                        createWork(workName,workDetail,workDeadline,workPoint)
                                    }>สร้าง</Button>
                                    :
                                    <Button variant="outlined" color="primary" onClick={() => 
                                        updataCreateWork(workName, workDetail, workDeadline, workPoint)
                                    }>สร้าง</Button>
                                :
                                <Button variant="outlined" color="primary" disabled>สร้าง</Button>
                            }
                        </Modal.Footer>
                    </Modal>
                </div>

                {/* deleteModal */}
                <div>
                    <Modal centered backdrop="static" show={deleteModal}>
                        <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
                            คุณต้องการที่จะลบเนื้อหานี้หรือไม่ ?
                        </Modal.Body>
                        <Modal.Footer style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Button variant="outlined" onClick={() => setDeleteModal(false)}>ยกเลิก</Button>
                            <Button variant="outlined" color="secondary" onClick={() => deleteHandle(deleteWork)}>ลบ</Button>
                        </Modal.Footer>
                    </Modal>
                </div>   

                {/* work modal */}
                <div>
                    {selectWork ?
                        <Modal centered show={teacherWorkModal} backdrop="static" onHide={() => {
                            setTeacherWorkModal(false)
                        }}>
                            <Modal.Header closeButton>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Typography>{selectWork.Work_Name}</Typography>
                                    <Typography style={{ paddingLeft: '16px', color: '#9A9A9A' }}>({selectWork.Score} คะแนน)</Typography>
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
                                                <Button color='primary' onClick={() => setReadMore(!readMore)}>{readMore ? 'ย่อ' : 'อ่านต่อ'}</Button>
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
                                        <Typography style={{ color: '#9A9A9A', paddingRight: '0.5rem' }}>ส่งก่อน {selectWork.End.split('T')[0].split('-')[2] + '/' + selectWork.End.split('T')[0].split('-')[1] + '/' + selectWork.End.split('T')[0].split('-')[0]}</Typography>
                                        <Typography style={{ color: '#9A9A9A' }}>เวลา {selectWork.End.split('T')[1]}</Typography>
                                    </div>
                                    <div>
                                        
                                    </div>
                                </Grid>
                            </Modal.Body>
                            <Modal.Footer style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <Button variant="outlined" color="secondary" onClick={() => {
                                    setTeacherWorkModal(false);
                                    setViewWorkSubmit(false);
                                }}>ปิด</Button>
                                <Button variant="outlined" color="primary" onClick={() => {
                                    api.post('/teacher/checkWork',{
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
                                }}>ดูการส่งงาน</Button>
                            </Modal.Footer>
                        </Modal>
                        :
                        null
                    }
                </div>

                {/* Submittion Work Modal */}
                <div>
                    {selectWork &&
                        <Modal centered show={viewWorkSubmit} backdrop="static" onHide={() => {
                            setViewWorkSubmit(false);
                            setTeacherWorkModal(true);
                        }}>
                            <Modal.Header closeButton>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Typography>การส่งงาน {selectWork.Work_Name}</Typography>
                                    <Typography style={{ paddingLeft: '16px', color: '#9A9A9A' }}>({selectWork.Score} คะแนน)</Typography>
                                </div>
                            </Modal.Header>
                            <Modal.Body>
                                {submittedStudent.length === 0 ?
                                    <div>
                                        <Typography>ว่างเปล่า</Typography>
                                    </div>
                                    :
                                    <div>
                                        {submittedStudent.map((value,index) => {
                                            return(
                                                <div style={{display:'flex',justifyContent:'space-between',flexDirection:'row'}} key={`listStudentThatSubmittedWorkNO${index}`}>
                                                    <Typography>{value.Student_id}</Typography>
                                                    {value.files.length !== 0 && <Typography>{value.files.split('[')[1].split(']')[0].split(',').length} ไฟล์</Typography>}
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
                                }}>ปิด</Button>
                            </Modal.Footer>
                        </Modal>
                    }
                </div>
            </div>
        );
    }
    //student
    else{
        const [studentOpenWork, setStudentOpenWork] = react.useState(false);
        const [selectWork, setSelectWork] = react.useState(null);
        const [readMore, setReadMore] = react.useState(false);
        const [studentWorkFiles, setStudentWorkFiles] = react.useState([]);
        const [isSubmit, setIsSubmit] = react.useState(false);

        function studentAllWorks(roomId,subjectId){
            api.post('/subject/studentWorks',{
                Room_id : roomId,
                Subject_id : subjectId
            }).then(res => setWorks(res.data)).catch(err => console.log(err))
        }

        function studentClickWorkFile(pathFile,type) {
            api.post('/subject/file', {
                path: pathFile,
                type : type
            }).then(result => {
                if(type === 'pdf'){
                    var blob = b64toBlob(result.data, "application/pdf")
                    var blobUrl = URL.createObjectURL(blob);
                    window.open(blobUrl, '_blank');
                }
                else if(type === 'image'){
                    blob = b64toBlob(result.data, "image/*")
                    blobUrl = URL.createObjectURL(blob);
                    window.open(blobUrl, '_blank');
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
            if(selectSubject){
                studentAllWorks(user.Room_id,selectSubject.name)
            }
        },[user,selectSubject])

        react.useEffect(() => {
            if(selectWork){
                api.post('/subject/allWorkFiles',{
                    File_Path : selectWork.File_Path
                }).then(res => {
                    setStudentWorkFiles(res.data);
                    api.post('/subject/checkStatusWork',{
                        selectWork : selectWork,
                        Student_id : props.user.Student_id
                    }).then(res2 => setIsSubmit(res2.data)).catch(err2 => console.log(err2))
                })
                .then(studentPrepareWork()).catch(err => console.log(err))
            }
        },[selectWork])

        return (
            <div>
                <div>
                    {selectSubject ?
                        null
                        :
                        <Typography style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>เลือกวิชาที่จะแสดง</Typography>
                    }
                    {selectSubject && works.length === 0 ?
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography>ยังไม่มีงานตอนนี้</Typography>
                        </div>
                        :
                        <List>
                            {works.map((value, index) => {
                                return (
                                    <Grid key={index} container justifyContent="center" direction='column'>
                                        <Grid item xs={12}>
                                            <ListItem button onClick={async() => {
                                                await setSelectWork(value);
                                                await setStudentOpenWork(true);
                                            }}>
                                                <ListItemText key={index} primary={value.Work_Name} />
                                            </ListItem>
                                        </Grid>
                                    </Grid>
                                )
                            })}
                        </List>
                    }
                </div>

                {/* work modal */}
                <div>
                    { selectWork ? 
                        <Modal centered backdrop="static" show={studentOpenWork} onHide={() => {
                        setStudentOpenWork(false);
                        setReadMore(false);
                        setSelectWork(null);
                        setStudentWorkFiles([]);
                        setStudentPrepareWorkFile([]);
                    }}>
                            <Modal.Header closeButton>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <Typography>{selectWork.Work_Name}</Typography>
                                    <div style={{ paddingLeft: '16px', marginTop: '-0.3rem' }}><Chip color={isSubmit ? 'success' : 'error'} variant='outlined' label={isSubmit ? 'ส่งแล้ว' : 'ยังไม่ส่ง'} /></div>
                                    <Typography style={{ paddingLeft: '16px', color: '#9A9A9A' }}>({selectWork.Score} คะแนน)</Typography>
                                </div>
                            </Modal.Header>
                        <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
                            <Grid container direction='column'>
                                <Grid container>
                                    <Grid item xs={12} style={{maxHeight:'32vh', overflow:'scroll'}}>
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
                                <div style={{paddingBottom:'0.5rem'}}>
                                    {selectWork.Work_Detail.length > 250 ? 
                                    <div style={{display:'flex',justifyContent:'flex-end'}}>
                                        <Button color='primary' onClick={() => setReadMore(!readMore)}>{readMore ? 'ย่อ' : 'อ่านต่อ'}</Button>
                                    </div>
                                    :
                                    null
                                    }
                                </div>
                                <div style={{paddingBottom:'0.5rem'}}>
                                    {studentWorkFiles.map((value,index) => {
                                        return(
                                            <div key={`workFile${value.Work_File_id}Index${index}`}>
                                                <Button style={{ width: '100%', display:'flex',justifyContent:'flex-start' }} onClick={() => studentClickWorkFile(value.File_path,value.File_type)}>
                                                    <div style={{ color: 'gray' }}>{value.File_type === 'pdf' ? <InsertDriveFileIcon /> : <ImageIcon />}</div>
                                                    <Typography style={{ paddingLeft: '0.5rem' }}>{value.File_path.split('\\').pop().split('/').pop()}</Typography>
                                                </Button>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div style={{paddingBottom:'0.5rem', display:'flex', justifyContent:'flex-end'}}>
                                        <Typography style={{ color: '#9A9A9A', paddingRight:'0.5rem' }}>ส่งก่อน {selectWork.End.split('T')[0].split('-')[2] + '/' + selectWork.End.split('T')[0].split('-')[1] + '/' + selectWork.End.split('T')[0].split('-')[0]}</Typography>
                                        <Typography style={{ color: '#9A9A9A' }}>เวลา {selectWork.End.split('T')[1]}</Typography>
                                </div>
                                {!isSubmit &&
                                    <div>
                                        {/* not complete yet */}
                                        <FilePond.FilePond
                                            files={workFile}
                                            onupdatefiles={setWorkFile}
                                            allowMultiple={true}
                                            maxFiles={3}
                                            allowDrop
                                            acceptedFileTypes={['application/pdf','image/*']}
                                            allowRemove={false}
                                            name="file"
                                            credits={false}
                                            allowRevert={false}
                                            // onprocessfilerevert={(f) => {
                                            //     //edit this function
                                            //     api.delete('/teacher/deleteOnePrepare',{
                                            //         data : {
                                            //             path : f.file.name,
                                            //             Room_id: props.subject.Room_id,
                                            //             Student_id: props.user.Student_id,
                                            //             Subject_id: props.subject.Subject_id,
                                            //             Work_Name: selectWork.Work_Name
                                            //         }
                                            //     }).then(console.log('deleted')).catch(err => console.log(err))
                                            // }}
                                            server={{
                                                process: `http://localhost:3001/student/uploadWorkFile/${props.subject.Subject_id}/${props.user.Student_id}/${props.subject.Room_id}/${selectWork.Work_Name}`
                                            }}
                                            onprocessfiles={() => setStudentUpload(true)}
                                            labelIdle='ลากและวางงานของคุณที่นี่ หรือ <span class="filepond--label-action">เลือก</span> สูงสุด 3 ไฟล์'
                                        />
                                    </div>
                                }
                                <div style={{ paddingBottom: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                    {studentUpload && <Button color="primary" onClick={async () => {
                                        await api.post('/student/updateWorkSubmit',{
                                            Subject_id: props.subject.Subject_id,
                                            Student_id: props.user.Student_id,
                                            Room_id: props.subject.Room_id,
                                            Teacher_id: props.subject.Teacher_id,
                                            workName: selectWork.Work_Name,
                                            score: selectWork.Score
                                        })
                                        .then(setWorkFile([]))
                                        .then(setStudentUpload(false))
                                        .catch(err => console.log(err))
                                        studentPrepareWork()
                                    }}>อัพโหลด</Button>}
                                </div>
                                <div style={{ maxHeight: '20vh', overflow:'scroll'}}>
                                    {studentPrepareWorkFile.length !== 0 && <Typography>ไฟล์ของคุณ</Typography>}
                                    {studentPrepareWorkFile.map((value,index) => {
                                        return(
                                            <Grid container justifyContent='space-between' key={`studentFileNo${index}`}>
                                                <Grid item xs={isSubmit ? 12 : 10} style={{ display: 'flex' }} zeroMinWidth>
                                                    <Button style={{ width: '100%', justifyContent: 'flex-start'}} onClick={() => studentClickWorkFile(value.File_Path, value.File_type)}>
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
                            </Grid>
                        </Modal.Body>
                        <Modal.Footer style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Button variant="outlined" color="secondary" onClick={() => {
                                setStudentOpenWork(false);
                                setReadMore(false);
                                setSelectWork(null);
                                setStudentWorkFiles([]);
                                setStudentPrepareWorkFile([]);
                            }}>ปิด</Button>
                            {studentPrepareWorkFile.length === 0 ?
                            <Button variant="outlined" disabled>ส่ง</Button>
                            :
                            isSubmit ? 
                                <Button color='primary' variant='outlined' onClick={() => {
                                    setIsSubmit(false);
                                    api.post('/student/editWork',{
                                        Subject_id: props.subject.Subject_id,
                                        Student_id: props.user.Student_id,
                                        Room_id: props.subject.Room_id,
                                        Teacher_id: props.subject.Teacher_id,
                                        workName: selectWork.Work_Name,
                                        score: selectWork.Score
                                    }).catch(err => console.log(err))
                                }}>แก้ไข</Button>
                                :
                                <Button variant="outlined" color="primary" onClick={() => {
                                    api.post('/student/submitwork',{
                                        Subject_id: props.subject.Subject_id,
                                        Student_id: props.user.Student_id,
                                        Room_id: props.subject.Room_id,
                                        Teacher_id: props.subject.Teacher_id,
                                        workName: selectWork.Work_Name,
                                        score: selectWork.Score
                                    }).then(() => {
                                        setStudentOpenWork(false);
                                        setReadMore(false);
                                        setSelectWork(null);
                                        setStudentWorkFiles([]);
                                        setStudentPrepareWorkFile([]);
                                    }).catch(err => console.log(err))
                                }}>ส่ง</Button>
                            }
                        </Modal.Footer>
                    </Modal>
                    :
                    null
                    }
                </div>
            </div>
        );
    }
}