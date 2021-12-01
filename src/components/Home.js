import react from 'react';
import { userContext } from '../userContext';
import { Grid, makeStyles, Paper, Typography, Button, ListItem, ListItemText, List, ListItemIcon, InputBase } from '@material-ui/core';
import axios from 'axios';
import SubjectList from './SubjectList'
import DaySub from './TimetableComponent/DaySub';
import SubjectDocs from './subjectDetail/SubjectDocs';
import {subjectContext} from './subjectContext';
import Thread from './Thread';
import { selectSubjectContext } from './selectSubjectContext';
import PersonIcon from '@material-ui/icons/Person';
import Link from '@mui/material/Link';
import { Modal } from 'react-bootstrap';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import 'bootstrap/dist/css/bootstrap.min.css';
import { IconButton } from '@mui/material';

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

    const [openStudentList, setOpenStudentList] =react.useState(false);

    const [allStudents, setAllStudents] = react.useState([]);
    const [roomllStudents, setRoomAllStudents] = react.useState('');

    const [selectStudent, setSelectStudent] = react.useState(null);

    const [searchStudent, setSearchStudent] = react.useState([]);
    const [searchString, setSearchString] = react.useState('');

    react.useEffect(() => {
        if(selectSubject){
            api.post('/subject/subjectDetail', {
                Subject_id: selectSubject.name,
                Room_id: selectSubject.room
            }).then(res => setSelectSubjectName(res.data[0].Subject_name)).catch(err => console.log(err))
        }
    },[selectSubject,setSelectSubject])

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
                        <subjectContext.Provider value={{ selectSubject, setSelectSubject }}>
                            <SubjectList user={user.Teacher_id ? user.Teacher_id : ''} roomId={user.Teacher_id ? '' : user.Room_id} />
                        </subjectContext.Provider>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container justifyContent="center" direction="row">
                <Grid item xs={6}>
                    {/* query a study link */}
                    <div className={classes.paperLeftBottom}>
                        <Paper style={{ marginBottom: '2vh', height: '2.2rem'}}>
                            <Grid container>
                                <Grid item xs={3} style={{ marginTop: '0.35rem', display: 'flex', justifyContent: 'center'}}>
                                    <Typography>ลิ้งค์ห้องเรียน : </Typography>
                                </Grid>
                                <Grid item xs={9} zeroMinWidth style={{ marginTop: '0.35rem', display: 'flex', justifyContent: 'flex-start'}}>
                                    <Link noWrap href="https://www.youtube.com/watch?v=GG7fLOmlhYg" target={'_blank'} underline="hover">
                                        <Typography>https://www.youtube.com/watch?v=GG7fLOmlhYg</Typography>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Paper>
                        <Paper>
                            <Grid container justifyContent="center" direction="column">
                                <SubjectDocs teacher={user.Teacher_id} room={user.Room_id} selectedSubject={selectSubject} />
                            </Grid>
                        </Paper>
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div className={classes.paperRightBottom}>
                        {user.Teacher_id ? 
                            <Paper style={{ marginBottom: '2vh', backgroundColor: '#1B4E9C' }}>
                                <Grid container justifyContent="center" direction="column">
                                    <Button style={{ width: '100%', color: 'white' }} onClick={() => {
                                        if(selectSubject){
                                            api.post('/teacher/allStudents', {
                                                Room_id: selectSubject.room
                                            })
                                            .then(res => {
                                                api.post('/teacher/askRoom',{
                                                    roomId: selectSubject.room
                                                }).then(res2 => {
                                                    setRoomAllStudents(res2.data[0].Room_class);
                                                    setAllStudents(res.data);
                                                }).catch(err2 => console.log(err2))
                                            })
                                            .then(setOpenStudentList(true))
                                            .catch(err => console.log(err))
                                        }
                                        else{
                                            // setOpenStudentList(true);
                                            alert('กรุณาเลือกวิชาที่จะแสดง')
                                        }
                                    }}>
                                        <b style={{ color: 'white' }}>รายชื่อนักเรียน</b>
                                    </Button>
                                </Grid>
                            </Paper>
                            :
                            <Paper style={{ marginBottom: '2vh' }}>
                                <Grid container justifyContent="center" direction="column">
                                    <b style={{ color: '#4171B9', padding: '0.5rem' }}>ครูประจำชั้น</b>
                                    <div>
                                        <Grid style={{ maxWidth: '33.35vw' }} container direction="row" wrap="nowrap">
                                            <Grid item xs={2} style={{ display: 'flex', justifyContent: 'center' }}>
                                                <PersonIcon fontSize="large" />
                                            </Grid>
                                            {queryTeacher ?
                                                <Grid item xs={10} zeroMinWidth style={{ display: 'flex', flexDirection: 'column' }}>
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
                        }
                        <Paper>
                            <Grid container justifyContent="center" direction="column">
                                <Thread/>
                            </Grid>
                        </Paper>
                    </div>
                </Grid>
            </Grid>

            {/* students modal */}
            <div>
                <Modal show={openStudentList} size="lg" aria-labelledby="contained-modal-title-vcenter" centered onHide={() => {
                    setOpenStudentList(false);
                    setSelectStudent(null);
                    setSearchStudent([]);
                    setSearchString('');
                }}>
                    <Modal.Header closeButton>{selectSubject ? `รายชื่อนักเรียน ห้อง${roomllStudents}` : 'กรุณาเลือกวิชาก่อน'}</Modal.Header>
                    {selectSubject && 
                        <Modal.Body>
                            <Grid container justifyContent='space-between' direction='row'>
                                <Grid item xs={6}>
                                    {allStudents.length === 0 ?
                                        <Typography>ว่างเปล่า</Typography>
                                        :
                                        <Grid container direction='column'>
                                            <Grid item xs={12}>
                                                <Paper component="form" style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', width: '100%', backgroundColor: '#ffffff' }}>
                                                    <SearchIcon/>
                                                    <InputBase
                                                        style={{ flex: 1, width:'100%' }}
                                                        placeholder=" ค้นหานักเรียน"
                                                        inputProps={{ 'aria-label': ' ค้นหานักเรียน' }}
                                                        value={searchString}
                                                        onChange={(event) => {
                                                            setSearchString(event.target.value)
                                                            var listResult = allStudents.filter(element => {
                                                                const regex = new RegExp(`^${event.target.value}`, 'gi');
                                                                return element.Student_id.match(regex) || element.Student_FirstName.match(regex) || element.Student_LastName.match(regex)
                                                            })

                                                            if(event.target.value.length === 0){
                                                                setSearchStudent([]);
                                                            }
                                                            else{
                                                                if(listResult.length === 0){
                                                                    setSearchStudent([]);
                                                                }
                                                                else{
                                                                    setSearchStudent(listResult)
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    {searchString.length !== 0 &&
                                                    <IconButton style={{width:'2rem',height:'2rem'}} onClick={() => {
                                                        setSearchString('');
                                                        setSearchStudent([]);
                                                    }} color='error'>
                                                        <ClearIcon />
                                                    </IconButton>
                                                    }
                                                </Paper>
                                                {searchStudent.length !== 0 &&
                                                <Grid container direction='column' style={{zIndex:'100',position:'absolute'}}>
                                                    <Grid item xs={12}>
                                                        <Paper style={{width:'48%',marginTop:'0.5rem',maxHeight:'32vh',overflow:'scroll'}}>
                                                            <div style={{padding:'0.5rem'}}>
                                                                <List>
                                                                    {searchStudent.length !== 0 &&
                                                                        searchStudent.map((value, index) => {
                                                                            return (
                                                                                <ListItem button onClick={() => {
                                                                                    api.post('/teacher/studentParent', {
                                                                                        Student_id: value.Student_id
                                                                                    })
                                                                                        .then(res => {
                                                                                            setSelectStudent({
                                                                                                student: value,
                                                                                                parent: res.data[0]
                                                                                            })
                                                                                            setSearchStudent('')
                                                                                        })
                                                                                        .catch(err => console.log(err))
                                                                                }} key={`searchResultNO${index}`}>
                                                                                    <ListItemIcon><AccountCircleIcon sx={{ fontSize: 40 }} /></ListItemIcon>
                                                                                    <ListItemText primary={value.Student_id} secondary={`${value.Student_FirstName} ${value.Student_LastName}`} />
                                                                                </ListItem>
                                                                            );
                                                                        })
                                                                    }
                                                                </List>
                                                            </div>
                                                        </Paper>    
                                                    </Grid>
                                                </Grid>
                                                }
                                            </Grid>
                                            <br/>
                                            <Grid item xs={12}>
                                                <List>
                                                    {allStudents.map((value, index) => {
                                                        return (
                                                            <ListItem style={selectStudent?.student === value ? { backgroundColor: "rgba(255, 215, 0, 0.5)", borderRadius: '0.5rem' } : null} button onClick={() => {
                                                                api.post('/teacher/studentParent', {
                                                                    Student_id: value.Student_id
                                                                })
                                                                    .then(res => {
                                                                        setSelectStudent({
                                                                            student: value,
                                                                            parent: res.data[0]
                                                                        })
                                                                    })
                                                                    .catch(err => console.log(err))
                                                            }} key={`studentId${index}`}>
                                                                <ListItemIcon><AccountCircleIcon sx={{ fontSize: 40 }} /></ListItemIcon>
                                                                <ListItemText primary={value.Student_id} secondary={`${value.Student_FirstName} ${value.Student_LastName}`} />
                                                            </ListItem>
                                                        );
                                                    })}
                                                </List>
                                            </Grid>
                                        </Grid>
                                    }
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container justifyContent='center' direction='column'>
                                        {selectStudent ?
                                        <div style={{ paddingLeft: '1rem', overflow: 'scroll', maxHeight: '65vh',width:'100%'}}>
                                            <Grid container justifyContent='center' direction='row'>
                                                <Grid item xs={3}><AccountCircleIcon sx={{ fontSize: '4rem' }} /></Grid>
                                                <Grid item xs={9}>
                                                    <Grid container justifyContent='flex-start' direction='column'>
                                                        <Grid item xs={12}><Typography>{selectStudent.student.Student_id}</Typography></Grid>
                                                        <Grid item xs={12}><Typography>{`${selectStudent.student.Student_FirstName} ${selectStudent.student.Student_LastName}`}</Typography></Grid>
                                                        <Grid item xs={12}><Typography>{`นักเรียนห้อง ${roomllStudents}`}</Typography></Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <br/>
                                            <Grid item xs={10} style={{paddingLeft:'2rem'}}>
                                                <Grid container justifyContent='flex-start' direction='column'>
                                                    {selectStudent.student.Student_Phone.length !== 0 &&
                                                    <a href={`tel:${selectStudent.student.Student_Phone}`}>
                                                        <Grid container style={{paddingBottom:'0.5rem'}}>
                                                            <Grid item xs={2}><LocalPhoneIcon/></Grid>
                                                            <Grid item xs={10}>{selectStudent.student.Student_Phone}</Grid>
                                                        </Grid>
                                                    </a>}
                                                    {selectStudent.student.Student_Email.length !== 0 && 
                                                    <a href={`mailto:${selectStudent.student.Student_Email}`} target="_blank" rel="noreferrer">
                                                        <Grid container style={{paddingBottom:'0.5rem'}}>
                                                            <Grid item xs={2}><EmailIcon/></Grid>
                                                            <Grid item xs={10}>{selectStudent.student.Student_Email}</Grid>
                                                        </Grid>
                                                    </a>}
                                                    {selectStudent.student.Student_Address.length !== 0 && 
                                                    <Grid container style={{paddingBottom:'0.5rem'}}>
                                                        <Grid item xs={2}><LocationOnIcon/></Grid>
                                                        <Grid item xs={10}>{selectStudent.student.Student_Address}</Grid>
                                                    </Grid>}
                                                    {selectStudent.student.Student_LineId.length !== 0 && 
                                                    <Grid container style={{paddingBottom:'0.5rem'}}>
                                                        <Grid item xs={2}><img alt='hok1' style={{height:'1.8rem',width:'1.8rem'}} src="https://img.icons8.com/color/144/000000/line-me.png"/></Grid>
                                                        <Grid item xs={10}>{selectStudent.student.Student_LineId}</Grid>
                                                    </Grid>}
                                                    {selectStudent.student.Student_Facebook.length !== 0 &&
                                                    <Grid container style={{paddingBottom:'0.5rem'}}>
                                                        <Grid item xs={2}><img alt='hok2' style={{height:'1.8rem',width:'1.8rem'}} src="https://img.icons8.com/fluency/144/000000/facebook-new.png"/></Grid>
                                                        <Grid item xs={10}>{selectStudent.student.Student_Facebook}</Grid>
                                                    </Grid>}
                                                </Grid>
                                            </Grid>
                                            <br/>
                                            <br/>
                                            <Grid container justifyContent='center' direction='row'>
                                                <Grid item xs={3}><AccountCircleIcon sx={{ fontSize: '4rem' }} /></Grid>
                                                <Grid item xs={9}>
                                                    <Grid container justifyContent='flex-start' direction='column'>
                                                        <Grid item xs={12}><Typography>{`${selectStudent.parent.Parent_FirstName} ${selectStudent.parent.Parent_LastName}`}</Typography></Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <br/>
                                            <Grid item xs={10} style={{paddingLeft:'2rem'}}>
                                                <Grid container justifyContent='flex-start' direction='column'>
                                                    {selectStudent.parent.Parent_phone.length  !== 0 &&
                                                    <a href={`tel:${selectStudent.parent.Parent_phone}`}>
                                                        <Grid container style={{paddingBottom:'0.5rem'}}>
                                                            <Grid item xs={2}><LocalPhoneIcon/></Grid>
                                                            <Grid item xs={10}>{selectStudent.parent.Parent_phone}</Grid>
                                                        </Grid>
                                                    </a>}
                                                    {selectStudent.parent.Parent_Email.length !== 0 && 
                                                    <a href={`mailto:${selectStudent.parent.Parent_Email}`} target="_blank" rel="noreferrer">
                                                        <Grid container style={{paddingBottom:'0.5rem'}}>
                                                            <Grid item xs={2}><EmailIcon/></Grid>
                                                            <Grid item xs={10}>{selectStudent.parent.Parent_Email}</Grid>
                                                        </Grid>
                                                    </a>}
                                                    {selectStudent.parent.Parent_Address.length !== 0 && 
                                                    <Grid container style={{paddingBottom:'0.5rem'}}>
                                                        <Grid item xs={2}><LocationOnIcon/></Grid>
                                                        <Grid item xs={10}>{selectStudent.parent.Parent_Address}</Grid>
                                                    </Grid>}
                                                    {selectStudent.parent.Parent_LineId.length !== 0 && 
                                                    <Grid container style={{paddingBottom:'0.5rem'}}>
                                                        <Grid item xs={2}><img alt='hok3' style={{height:'1.8rem',width:'1.8rem'}} src="https://img.icons8.com/color/144/000000/line-me.png"/></Grid>
                                                        <Grid item xs={10}>{selectStudent.parent.Parent_LineId}</Grid>
                                                    </Grid>}
                                                    {selectStudent.parent.Parent_Facebook.length !== 0 &&
                                                    <Grid container style={{paddingBottom:'0.5rem'}}>
                                                        <Grid item xs={2}><img alt='hok4' style={{height:'1.8rem',width:'1.8rem'}} src="https://img.icons8.com/fluency/144/000000/facebook-new.png"/></Grid>
                                                        <Grid item xs={10}>{selectStudent.parent.Parent_Facebook}</Grid>
                                                    </Grid>}
                                                </Grid>
                                            </Grid>
                                        </div>
                                        :
                                        <div style={{display:'flex', justifyContent:'center', color:'GrayText'}}><Typography>--- เลือกนักเรียนเพื่อแสดง ---</Typography></div>
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Modal.Body>
                    }
                </Modal>
            </div>
        </div>
    );
}
