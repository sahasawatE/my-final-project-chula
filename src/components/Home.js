import react from 'react';
import { userContext } from '../userContext';
import { Grid, makeStyles, Paper, Typography, Button } from '@material-ui/core';
import axios from 'axios';
import Todo from './notification/Todo';
import DaySub from './TimetableComponent/DaySub';
import SubjectDocs from './subjectDetail/SubjectDocs';
import {subjectContext} from './subjectContext';
import Thread from './Thread';
import { selectSubjectContext } from './selectSubjectContext';
import PersonIcon from '@material-ui/icons/Person';

const useStyles = makeStyles((theme) => ({
    paperRight: {
        marginLeft: theme.spacing(1),
        color: theme.palette.text.secondary,
        height: '100%'
    },
    paperLeft: {
        marginRight: theme.spacing(1),
        color: theme.palette.text.secondary,
        height: '100%'
    },
    block: {
        width: '100%',
        height: '9vh',
        textAlign: 'center'
    }, 
    paperRightBottom: {
        marginLeft: theme.spacing(1),
        color: theme.palette.text.secondary,
        height: '100%',
        marginBottom:'8vh',
        marginTop: theme.spacing(2)
    },
    paperLeftBottom: {
        marginRight: theme.spacing(1),
        color: theme.palette.text.secondary,
        height: '100%',
        marginBottom: '8vh',
        marginTop: theme.spacing(2)
    },
}));

export default function Home(props,{ forwardedRef }) {
    const api = axios.create({
        baseURL:'http://localhost:3001/'
    })
    const { user } = react.useContext(userContext);
    const {selectSubject,setSelectSubject} = react.useContext(selectSubjectContext);
    const classes = useStyles();

    const [subject, setSubject] = react.useState([])
    const [queryTeacher, setQueryTeacher] = react.useState(null);
    const [selectSubjectName, setSelectSubjectName] = react.useState('');

    react.useEffect(() => {
        if(selectSubject){
            api.post('/subject/subjectDetail', {
                Subject_id: selectSubject.name,
                Room_id: selectSubject.room
            }).then(res => setSelectSubjectName(res.data[0].Subject_name)).catch(err => console.log(err))
        }
    },[selectSubject])

    function getSubjectTime(){
        api.post('/subject/subjectTime',{
            "Room_id": user.Room_id
        })
        .then(result => {
            setSubject(result.data)
        })
        .catch(err => console.log(err))
    }

    function getTeacherSub(){
        api.post('/teacher/teacherSubject',{
            "Teacher_id" : user.Teacher_id
        }).then(result => {
            setSubject(result.data)
        }).catch(err => console.log(err))
    }

    function TeacherRoom(roomId){
        api.post('/student/queryTeacher',{
            "Room_id" : roomId
        }).then(res => setQueryTeacher(res.data[0])).catch(err => console.log(err))
    }

    react.useEffect(() => {
        if(user.Student_id){
            TeacherRoom(user.Room_id)
            getSubjectTime()
        }
        else if(user.Teacher_id){
            getTeacherSub()
        }
    },[user]);

    const mon = [];
    const tus = [];
    const wen = [];
    const thu = [];
    const fri = [];

    return (
        <div ref={forwardedRef} className="App">
            <br/><br/>
            {subject.map((value) => {
                const data = [value.date.split(','), value.Time_start.split(','), value.Time_end.split(',')];
                for(let i = 0; i < data[0].length; i++){
                    // console.log(value.Subject_id,data[0][i], data[1][i], data[2][i])
                    if(data[0][i] === "จันทร์"){
                        mon.push({
                            subject : value.Subject_id,
                            start : data[1][i],
                            end : data[2][i],
                            day : data[0][i],
                            room : value.Room_id
                        });
                    }
                    if (data[0][i] === "อังคาร") {
                        tus.push({
                            subject: value.Subject_id,
                            start: data[1][i],
                            end: data[2][i],
                            day: data[0][i],
                            room: value.Room_id
                        });
                    }
                    if (data[0][i] === "พุธ") {
                        wen.push({
                            subject: value.Subject_id,
                            start: data[1][i],
                            end: data[2][i],
                            day: data[0][i],
                            room: value.Room_id
                        });
                    }
                    if (data[0][i] === "พฤหัสบดี") {
                        thu.push({
                            subject: value.Subject_id,
                            start: data[1][i],
                            end: data[2][i],
                            day: data[0][i],
                            room: value.Room_id
                        });
                    }
                    if (data[0][i] === "ศุกร์") {
                        fri.push({
                            subject: value.Subject_id,
                            start: data[1][i],
                            end: data[2][i],
                            day: data[0][i],
                            room: value.Room_id
                        });
                    }
                }
                return null;
            })}
            <div style={{display:'flex', width:'40%',marginLeft:'8vw',paddingBottom:'1rem'}}>
                <Typography>{selectSubjectName}</Typography>
            </div>
            <Grid container justifyContent="center" alignItems="center" direction="row">
                <Grid item className='timetable' xs={7}>
                    <Paper className={classes.paperLeft}>
                        <Grid direction="column" container>
                            <Grid style={{ height: '9vh' }} container direction="row">
                                <Grid item xs={2}>
                                    <div className={classes.block}>
                                        <Typography style={{ paddingTop: '1vh' }} variant="body2" gutterBottom>คาบ / วัน</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={1}>
                                    <div className={classes.block}>
                                        <Typography style={{ paddingTop: '1vh' }} variant="body2" gutterBottom>8</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={1}>
                                    <div className={classes.block}>
                                        <Typography style={{ paddingTop: '1vh' }} variant="body2" gutterBottom>9</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={1}>
                                    <div className={classes.block}>
                                        <Typography style={{ paddingTop: '1vh' }} variant="body2" gutterBottom>10</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={1}>
                                    <div className={classes.block}>
                                        <Typography style={{ paddingTop: '1vh' }} variant="body2" gutterBottom>11</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={1}>
                                    <div className={classes.block}>
                                        <Typography style={{ paddingTop: '1vh' }} variant="body2" gutterBottom>12</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={1}>
                                    <div className={classes.block}>
                                        <Typography style={{ paddingTop: '1vh' }} variant="body2" gutterBottom>13</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={1}>
                                    <div className={classes.block}>
                                        <Typography style={{ paddingTop: '1vh' }} variant="body2" gutterBottom>14</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={1}>
                                    <div className={classes.block}>
                                        <Typography style={{ paddingTop: '1vh' }} variant="body2" gutterBottom>15</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={1}>
                                    <div className={classes.block}>
                                        <Typography style={{ paddingTop: '1vh' }} variant="body2" gutterBottom>16</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={1}>
                                    <div className={classes.block}>
                                        <Typography style={{ paddingTop: '1vh' }} variant="body2" gutterBottom>17</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                            <subjectContext.Provider value={{selectSubject,setSelectSubject}}>
                                <DaySub day='จ.' data={mon}/>
                                <DaySub day='อ.' data={tus} />
                                <DaySub day='พ.' data={wen} />
                                <DaySub day='พฤ.' data={thu} />
                                <DaySub day='ศ.' data={fri} />
                            </subjectContext.Provider>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item className='timetable' xs={3}>
                    <Paper className={classes.paperRight}>
                        <Todo todo={null}/>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container justifyContent="center" alignItems='baseline' direction="row">
                <Grid item xs={6}>
                    <Paper className={classes.paperLeftBottom}>
                        <Grid container justifyContent="center" direction="column">
                            <SubjectDocs teacher={user.Teacher_id} room={user.Room_id} selectedSubject={selectSubject}/>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={4} className={classes.paperRightBottom}>
                    <Paper style={{ marginBottom: '2vh', backgroundColor: '#1B4E9C'}}>
                        <Grid container justifyContent="center" direction="column">
                            <Button style={{width:'100%',color:'white'}}>
                                <b style={{ color: 'white', padding: '0rem' }}>รายชื่อนักเรียน</b>
                            </Button>
                        </Grid>
                    </Paper>
                    <Paper style={{ marginBottom: '2vh' }}>
                        <Grid container justifyContent="center" direction="column">
                            <b style={{ color: '#4171B9', padding: '0.5rem' }}>ครูประจำชั้น</b>
                            <div>
                                <Grid style={{maxWidth:'33.35vw'}} container direction="row" wrap="nowrap">
                                    <Grid item xs={2} style={{display:'flex',justifyContent:'center'}}>
                                        <PersonIcon fontSize="large" />
                                    </Grid>
                                    {queryTeacher ? 
                                    <Grid item xs={10} zeroMinWidth style={{display:'flex',flexDirection:'column'}}>
                                        <Typography noWrap>{queryTeacher.Teacher_FristName} {queryTeacher.Teacher_LastName}</Typography>
                                        <Typography noWrap>{queryTeacher.Teacher_Phone}</Typography>
                                        <Typography noWrap>{queryTeacher.Teacher_Email}</Typography>
                                    </Grid>
                                    :
                                    null
                                    }
                                </Grid>
                            </div>
                        </Grid>
                    </Paper>
                    <Paper>
                        <Grid container justifyContent="center" direction="column">
                            <Thread/>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}
