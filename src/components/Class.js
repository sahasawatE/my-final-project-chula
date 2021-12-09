import react from 'react';
import { Modal } from 'react-bootstrap';
import { Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from 'axios';
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
        <br/>
        <Grid container justifyContent='center' style={{height:'90vh'}}>
            <Grid item xs={10}>
                <Paper style={{height:'100%'}}>
                    <Typography>{JSON.stringify(studentSubmittedWork)}</Typography>
                    <Typography>ชื่องาน {studentSubmittedWork.work.Work_Name}</Typography>
                    <Typography>ลายละเอียด {studentSubmittedWork.work.Work_Detail}</Typography>
                    <Typography>คะแนนเต็ม {studentSubmittedWork.work.Score} คะแนน</Typography>
                    <Typography>สร้างตอน {`${startDate[2]}/${startDate[1]}/${startDate[0]}`} เวลา {`${startTime[0]}:${startTime[1]}`}</Typography>
                    <Typography>ส่งก่อน {`${EndDate[2]}/${EndDate[1]}/${EndDate[0]}`} เวลา {EndTime}</Typography>
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
                    <Typography>ส่งตอน {`${studentSubmitDate[2]}/${studentSubmitDate[1]}/${studentSubmitDate[0]}`} เวลา {`${studentSubmitTime[0]}:${studentSubmitTime[1]}`}</Typography>
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
                </Paper>
            </Grid>
        </Grid>
        <br/>
        <br/>

        {/* Image modal */}
        <div>
            <Modal centered show={teacherImgBlobUrl !== null || imgBlobUrl !== null} aria-labelledby="contained-modal-title-vcenter" onHide={() => {
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
