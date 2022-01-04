import react from 'react';
import { userContext } from '../../userContext';
import { Grid, makeStyles, Paper, Typography, Button} from '@material-ui/core';
import axios from 'axios';
import SubjectList from './mobileSubjectList'
import SubjectDocs from './mobileSubjectDocs';
import { subjectContext } from '../subjectContext';
import ForumIcon from '@mui/icons-material/Forum';
import Thread from './mobileThread';
import {toggleContext} from '../toggleContext';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { selectSubjectContext } from '../selectSubjectContext';
import PersonIcon from '@material-ui/icons/Person';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import '../../App.css';

import { Accordion, AccordionDetails, AccordionSummary, SpeedDial } from '@mui/material';
import { blue, yellow } from '@mui/material/colors';

const drawerBleeding = 56;

const useStyles = makeStyles((theme) => ({
    paperRight: {
        // marginLeft: theme.spacing(1),
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
        // marginLeft: theme.spacing(1),
        width: '100%',
        color: theme.palette.text.secondary,
        height: '100%',
        marginBottom: '8vh',
        marginTop: theme.spacing(2)
    },
    paperLeftBottom: {
        // marginRight: theme.spacing(1),
        width: '100%',
        color: theme.palette.text.secondary,
        height: '100%',
        marginBottom: '8vh',
        marginTop: theme.spacing(2)
    },
}));
require('dotenv').config()

export default function MobileHome(props, { forwardedRef }) {
    const { canva } = props;
    const ngrok = process.env.REACT_APP_NGROK_URL;
    const api = axios.create({ baseURL: ngrok })
    const { user } = react.useContext(userContext);
    const { selectSubject, setSelectSubject } = react.useContext(selectSubjectContext);
    const classes = useStyles();

    const [open, setOpen] = react.useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    const container = canva !== undefined ? () => canva().document.body : undefined;

    // const [subject, setSubject] = react.useState([])
    const [openThread, setOpenThread] = react.useState(false);
    const [queryTeacher, setQueryTeacher] = react.useState(null);
    const [selectSubjectName, setSelectSubjectName] = react.useState('');

    const [allStudents, setAllStudents] = react.useState([]);
    const [roomllStudents, setRoomAllStudents] = react.useState('');

    react.useEffect(() => {
        if (selectSubject) {
            api.post('/subject/subjectDetail', {
                Subject_id: selectSubject.name,
                Room_id: selectSubject.room
            }).then(res => setSelectSubjectName(res.data[0].Subject_name)).catch(err => console.log(err))
            api.post('/teacher/allStudents', {
                Room_id: selectSubject.room
            })
                .then(res => {
                    api.post('/teacher/askRoom', {
                        roomId: selectSubject.room
                    }).then(res2 => {
                        setRoomAllStudents(res2.data[0].Room_class);
                        setAllStudents(res.data);
                    }).catch(err2 => console.log(err2))
                })
                // .then(setOpenStudentList(true))
                .catch(err => console.log(err))
        }
        if (user.Teacher_id) {
            getLink(selectSubject?.room)
        }
    }, [selectSubject, setSelectSubject])

    const [link, setLink] = react.useState('')

    function TeacherRoom(roomId) {
        api.post('/student/queryTeacher', {
            "Room_id": roomId
        }).then(res => setQueryTeacher(res.data[0])).catch(err => console.log(err))
    }

    function getLink(room) {
        api.post('/askRoom', {
            Room_id: room
        }).then(res => setLink(res.data[0].Link)).catch(err => console.log(err))
    }

    react.useEffect(() => {
        if (user.Student_id) {
            TeacherRoom(user.Room_id)
            getLink(user.Room_id)
        }
    }, [user]);

    return (
        <div ref={forwardedRef} className="App" styles={{
            '.MuiDrawer-root > .MuiPaper-root': {
                height: `calc(55% - ${drawerBleeding}px)`,
                overflow: 'visible',
            }
        }}>
            <br /><br />
            <Box>
                <Grid container justifyContent="center" alignItems="center" direction="row">
                    <Grid item xs={10}>
                        {/* query a study link */}
                        <Paper className={classes.paperLeftBottom} style={{ marginBottom: '2vh', height: '2.2rem', borderRadius: '16px' }}>
                            <Grid container>
                                <Grid item xs={4} style={{ marginTop: '0.35rem', display: 'flex', justifyContent: 'center' }}>
                                    <Typography noWrap>ลิ้งค์ห้องเรียน : </Typography>
                                </Grid>
                                <Grid item xs={8} zeroMinWidth style={{ marginTop: '0.35rem', display: 'flex', justifyContent: 'flex-start' }}>
                                    <Link noWrap href={link} target={'_blank'} underline="hover">
                                        <Typography noWrap>{link}</Typography>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={10}>
                        <div className='timetable'>
                            <Paper className={classes.paperRight} style={{ borderRadius: '16px' }}>
                                <subjectContext.Provider value={{ selectSubject, setSelectSubject }}>
                                    <toggleContext.Provider value={{ setOpen }}>
                                        <SubjectList user={user.Teacher_id ? user.Teacher_id : ''} roomId={user.Teacher_id ? '' : user.Room_id} />
                                    </toggleContext.Provider>
                                </subjectContext.Provider>
                            </Paper>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ width: '100%' }}>
                                {user.Student_id &&           
                                    <Accordion style={{ marginBottom: '2vh', borderRadius: '16px', width: '100%' }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography><b style={{ color: '#4171B9', padding: '0.5rem' }}>ครูประจำชั้น</b></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div>
                                                <Grid style={{ width: '100%' }} container direction="row" wrap="nowrap">
                                                    <Grid item xs={2} style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <PersonIcon fontSize="large" />
                                                    </Grid>
                                                    {queryTeacher &&
                                                        <Grid item xs={10} zeroMinWidth style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <Typography noWrap>{queryTeacher.Teacher_FirstName} {queryTeacher.Teacher_LastName}</Typography>
                                                            <Typography noWrap><a href={`tel:${queryTeacher.Teacher_Phone}`}>{queryTeacher.Teacher_Phone}</a></Typography>
                                                            <Typography noWrap><a href={`mailto:${queryTeacher.Teacher_Email}`} target="_blank" rel="noreferrer">{queryTeacher.Teacher_Email}</a></Typography>
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                }
                            </div>
                        </div>
                    </Grid>
                    <SwipeableDrawer
                        container={container}
                        anchor="bottom"
                        open={open}
                        onClose={toggleDrawer(false)}
                        onOpen={toggleDrawer(true)}
                        swipeAreaWidth={drawerBleeding}
                        disableSwipeToOpen={false}
                        ModalProps={{
                            keepMounted: true,
                        }}
                    >
                        {selectSubjectName &&
                            <Grid container justifyContent="center" alignItems="center">
                                <Grid item xs={12}>
                                    <div className={user.Student_id ? 'studentBanner' : 'teacherBanner'} style={{ backgroundColor: '#fff', width: '100%', height: '10vh', marginBottom: '1rem' }}>
                                        <Typography style={{ display: 'flex', justifyContent: 'center', paddingTop: '5%' }} variant='h5'>{selectSubjectName}</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        }
                        <Box
                            sx={{
                                px: 2,
                                pb: 2,
                                height: '81vh',
                                overflow: 'auto',
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                            }}
                        >
                            {user.Teacher_id &&
                                <div style={{ marginBottom: '2vh' }}>
                                    <Grid container justifyContent="center" direction="column">
                                        <Button style={{ width: '100%', backgroundColor: yellow[600], borderRadius: '16px' }} onClick={() => {
                                            localStorage.setItem('studentList',JSON.stringify({room:roomllStudents,students:allStudents}))
                                            window.open('/studentList','_blank')
                                        }}>
                                            <b style={{ color: blue[800] }}>รายชื่อนักเรียน</b>
                                        </Button>
                                    </Grid>
                                </div>
                            }
                            <Paper style={{ borderRadius: '16px' }}>
                                <Grid container justifyContent="center" direction="column">
                                    <toggleContext.Provider value={{setOpen}}>
                                        <SubjectDocs teacher={user.Teacher_id} room={user.Room_id} selectedSubject={selectSubject} />
                                    </toggleContext.Provider>
                                </Grid>
                            </Paper>
                        </Box>
                        <SpeedDial
                            ariaLabel="SpeedDial basic example"
                            sx={{ position: 'absolute', bottom: 24, right: 24 }}
                            icon={<ForumIcon />}
                            onClick={() => setOpenThread(true) }
                        >
                        </SpeedDial>
                        <SwipeableDrawer
                            container={container}
                            anchor="bottom"
                            open={openThread}
                            onClose={() => setOpenThread(false)}
                            onOpen={() => setOpenThread(true)}
                            ModalProps={{
                                keepMounted: true,
                            }}
                        >
                            <toggleContext.Provider value={{setOpen, setOpenThread}}>
                                <Thread />
                            </toggleContext.Provider>
                        </SwipeableDrawer>
                    </SwipeableDrawer>
                </Grid>
            </Box>
        </div>
    );
}
