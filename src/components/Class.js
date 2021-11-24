import react from 'react';
// import { Form } from 'react-bootstrap';
import { Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
// import {BrowserRouter as Reouter,Route,Redirect} from 'react-router-dom';

var b64toBlob = require('b64-to-blob');

export default function Class({ forwardedRef }) {
    const api = axios.create({
        baseURL: 'http://localhost:3001/'
    })

    const studentSubmittedWork = JSON.parse(localStorage.getItem('studentSubmittedWork'));

    const [studentWork, setStudentWork] =react.useState([]);

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
                window.open(blobUrl, '_blank');
            }
        }).catch(err => console.log(err))
    }

    react.useEffect(() => {
        api.post('/student/prepareWork', {
            Subject_id: studentSubmittedWork.Subject_id,
            Student_id: studentSubmittedWork.Student_id,
            Room_id: studentSubmittedWork.Room_id,
            Teacher_id: studentSubmittedWork.Teacher_id,
            workName: studentSubmittedWork.Work_Name,
            score: studentSubmittedWork.Score
        })
            .then(res => {
                setStudentWork(res.data);
            })
            .catch(err => console.log(err))
    }, [studentSubmittedWork])

    return(
    <div ref={forwardedRef} className="App">
        <br/>
        <br/>
        <Grid container justifyContent='center' style={{height:'90vh'}}>
            <Grid item xs={10}>
                <Paper style={{height:'100%'}}>
                    <Typography>{JSON.stringify(studentSubmittedWork)}</Typography>
                    {studentWork.map((value,index) => {
                        return(
                            <div key={`studentWorkNO${index}`}>
                                <Typography>{JSON.stringify(value)}</Typography>
                            </div>
                        );
                    })}
                </Paper>
            </Grid>
        </Grid>
        <br/>
        <br/>
    </div>        
    );
}
