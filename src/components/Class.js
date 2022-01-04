import react from 'react';
import { Modal,Form } from 'react-bootstrap';
import { Button, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from 'axios';
import { grey } from '@mui/material/colors';
import 'bootstrap/dist/css/bootstrap.min.css';

var b64toBlob = require('b64-to-blob');
require('dotenv').config()

export default function Class({ forwardedRef }) {
    const ngrok = process.env.REACT_APP_NGROK_URL;
    const api = axios.create({ baseURL: ngrok })

    const studentSubmittedWork = JSON.parse(localStorage.getItem('studentSubmittedWork'));

    const [studentWork, setStudentWork] =react.useState([]);
    const [imgBlobUrl, setImgBlobUrl] = react.useState(null);
    const [teacherImgBlobUrl, setTeacherImgBlobUrl] = react.useState(null);
    const [teacherWorkFiles, setTeacherWorkFiles] = react.useState([]);

    const startDate = studentSubmittedWork.work.Start.split(' ')[0].split('-');
    const startTime = studentSubmittedWork.work.Start.split(' ')[1].split(':');

    const EndDate = studentSubmittedWork.work.End.split('T')[0].split('-');
    const EndTime = studentSubmittedWork.work.End.split('T')[1];

    const studentSubmitDate = studentSubmittedWork.student.Submit_date.split(' ')[0].split('-');
    const studentSubmitTime = studentSubmittedWork.student.Submit_date.split(' ')[1].split(':');

    const [score,setScore] = react.useState(0);
    const [comment ,setComment] = react.useState('');
    const [confirm, setConfirm] = react.useState(false);

    function getFile(pathFile,type){
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
                setImgBlobUrl(blobUrl)
                // window.open(blobUrl, '_blank');
            }
        }).catch(err => console.log(err))
    }

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
                setTeacherImgBlobUrl(blobUrl)
                // window.open(blobUrl, '_blank');
            }
        }).catch(err => console.log(err))
    }

    function downloadFile(path,type){
        api.post('/subject/file', {
            path: path,
            type: type
        }).then(result => {
            if (type === 'pdf') {
                var blob = b64toBlob(result.data, "application/pdf")
                var blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.setAttribute('download', path.split('/').at(-1));
                document.body.appendChild(link);
                link.click();
            }
            else if (type === 'image') {
                blob = b64toBlob(result.data, "image/*")
                blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.setAttribute('download', path.split('/').at(-1));
                document.body.appendChild(link);
                link.click();
            }
        }).catch(err => console.log(err))
    }

    react.useEffect(() => {
        api.post('/student/prepareWork', {
            Subject_id: studentSubmittedWork.student.Subject_id,
            Student_id: studentSubmittedWork.student.Student_id,
            Room_id: studentSubmittedWork.student.Room_id,
            Teacher_id: studentSubmittedWork.student.Teacher_id,
            workName: studentSubmittedWork.student.Work_Name,
            score: studentSubmittedWork.student.Score
        })
            .then(res => {
                setStudentWork(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    react.useEffect(() => {
        api.post('/subject/allWorkFiles', {
            File_Path: studentSubmittedWork.work.File_Path
        }).then(res => {
            setTeacherWorkFiles(res.data)
        }).catch(err => console.log(err))
    }, [])

    return(
    <div ref={forwardedRef} className="App">
        <br/>
        <Grid container justifyContent='center'>
            <Grid item xs={10}>
                <Paper style={{height: '100%',width:'100%'}}>
                    {/* <Typography>{JSON.stringify(studentSubmittedWork)}</Typography> */}
                    <div style={{padding:'2rem'}}>
                        <Typography variant='h5' style={{textAlign:'center'}}>{studentSubmittedWork.work.Work_Name}</Typography>
                        <Typography variant='body1' style={{width:'90%',margin:'auto',padding:'0.5rem'}}>{studentSubmittedWork.work.Work_Detail}</Typography>
                        <Typography variant='body1'>คะแนนเต็ม {studentSubmittedWork.work.Score} คะแนน</Typography>
                        <Typography variant='body1' color={grey[500]}>สร้างตอน {`${startDate[2]}/${startDate[1]}/${startDate[0]}`} เวลา {`${startTime[0]}:${startTime[1]}`}</Typography>
                        <Typography variant='body1' color={grey[500]}>ส่งก่อน {`${EndDate[2]}/${EndDate[1]}/${EndDate[0]}`} เวลา {EndTime}</Typography>
                        <List>
                            {teacherWorkFiles.map((value,index) => {
                                return(
                                    <ListItem key={`teacherWorkFilesNO${index}`} 
                                    disablePadding
                                    secondaryAction={
                                        <IconButton edge='start' aria-label="download" onClick={() => downloadFile(value.File_path, value.File_type)}>
                                            <FileDownloadIcon />
                                        </IconButton>
                                    }>
                                        <ListItemButton onClick={() => teacherClickWorkFile(value.File_path, value.File_type)}>
                                            <ListItemIcon>{value.File_type === 'image' ? <ImageIcon /> : <InsertDriveFileIcon />}</ListItemIcon>
                                            <ListItemText primary={value.File_path.split('/').at(-1)} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                        <br/>
                        <Typography variant='body1' color={grey[500]}>ส่งตอน {`${studentSubmitDate[2]}/${studentSubmitDate[1]}/${studentSubmitDate[0]}`} เวลา {`${studentSubmitTime[0]}:${studentSubmitTime[1]}`}</Typography>
                        <List>
                            {studentWork.map((value,index) => {
                                return(
                                    <ListItem key={`studentFileNO${index}`} 
                                    disablePadding
                                    secondaryAction={
                                        <IconButton edge="start" aria-label="download" onClick={() => downloadFile(value.File_Path, value.File_type)}>
                                            <FileDownloadIcon />
                                        </IconButton>
                                    }>
                                        <ListItemButton onClick={() => getFile(value.File_Path, value.File_type)}>
                                            <ListItemIcon>{value.File_type === 'image' ? <ImageIcon /> : <InsertDriveFileIcon />}</ListItemIcon>
                                            <ListItemText primary={value.File_Path.split('/').at(-1)} />
                                            {/* <Typography>{value.File_type}</Typography> */}
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>

                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>คะแนน</Form.Label>
                                <Form.Control type="number" placeholder="คะแนน" onChange={(e) => {setScore(e.target.value)}}/>
                                <Form.Text className="text-muted">
                                        ให้คะแนนนักเรียนคนนี้ (คะแนนเต็ม {studentSubmittedWork.work.Score} คะแนน)
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>ความคิดเห็นของผู้ตรวจ</Form.Label>
                                <Form.Control type="text" placeholder="ความคิดเห็น" onChange={(e) => {setComment(e.target.value)}}/>
                            </Form.Group>
                        </Form>
                        <div style={{display:'flex',justifyContent:'flex-end'}}>
                            <Button onClick={() => {
                                // console.log(studentSubmittedWork)
                                if (parseInt(score) <= parseInt(studentSubmittedWork.work.Score) && parseInt(score) > 0){
                                    setConfirm(true)
                                    // window.close()
                                }
                                else{
                                    alert('ควรให้คะแนนอย่างเหมาะสม')
                                    setScore(0)
                                }
                            }}>ให้คะแนน</Button>
                        </div>
                    </div>
                </Paper>
            </Grid>
        </Grid>
        <br/>
        <br/>

        {/* confirm modal */}
        <div>
            <Modal backdropClassName="modal" centered show={confirm} aria-labelledby="contained-modal-title-vcenter" onHide={() => {
                setConfirm(false)
            }}>
                <Modal.Body>
                    <Typography>ยืนยันการให้คะแนน และปิดแท็บนี้หรือไม่ ?</Typography>
                </Modal.Body>
                <Modal.Footer>
                    <Grid container justifyContent='space-between'>
                        <Button color='error' onClick={ () => setConfirm(false)}>ปิด</Button>
                        <Button onClick={() => {
                            api.post('/teacher/submitWorkScore',{
                                room: studentSubmittedWork.student.Room_id,
                                student: studentSubmittedWork.student.Student_id,
                                subject: studentSubmittedWork.student.Subject_id,
                                teacher: studentSubmittedWork.student.Teacher_id,
                                name: studentSubmittedWork.student.Work_Name,
                                files: studentSubmittedWork.student.files,
                                checked: 'true',
                                score: score,
                                comment: comment
                            }).then((res) => {
                                if(res.data === 'done'){
                                    alert('ให้คะแนนเรียบร้อย')
                                }
                            }).then(() => window.close()).catch(err => console.log(err))
                        }}>ตกลง</Button>
                    </Grid>
                </Modal.Footer>
            </Modal>
        </div>

        {/* Image modal */}
        <div>
            <Modal backdropClassName="modal" centered show={teacherImgBlobUrl !== null || imgBlobUrl !== null} aria-labelledby="contained-modal-title-vcenter" onHide={() => {
                setTeacherImgBlobUrl(null);
                setImgBlobUrl(null);
            }}>
                {teacherImgBlobUrl && <img src={teacherImgBlobUrl} alt='hok' />}
                {imgBlobUrl && <img src={imgBlobUrl} alt='hok' />}
            </Modal>
        </div>
    </div>        
    );
}
