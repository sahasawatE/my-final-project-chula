import react from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Grid,
    Button,
    Badge,
    ListItem
} from '@material-ui/core';
import { Menu, Typography, Drawer, Divider, List, ListItemIcon, ListItemText } from '@mui/material'
import { useHistory } from 'react-router-dom';
import { userContext } from '../../userContext';
import { socketContext } from '../../socketContext';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Notification from '../notification/Notification';
import HomeIcon from '@material-ui/icons/Home';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import Logout from '@mui/icons-material/Logout';
import axios from 'axios';
import '../../App.css';
import { selectSubjectContext } from '../selectSubjectContext';
import { blue, grey } from '@mui/material/colors';
import { Box } from '@mui/system';
require('dotenv').config();

export default function MobileAppbar() {
    const history = useHistory();
    const ngrok = process.env.REACT_APP_NGROK_URL;
    const api = axios.create({ baseURL: ngrok })
    const { user } = react.useContext(userContext);
    const [anchorElNoti, setAnchorElNoti] = react.useState(null);
    const openNoti = Boolean(anchorElNoti);
    const [socketUser, setSocketUser] = react.useState(null);

    const notiModal = react.useRef(null);

    const { selectSubject } = react.useContext(selectSubjectContext)
    const { socket } = react.useContext(socketContext)
    const [page, setPage] = react.useState(0);
    const [openDrawer, setOpenDrawer] = react.useState(false);

    const [notifications, setNotifications] = react.useState([]);
    const [stnewNotiCount, setstNewNotiCount] = react.useState(0);
    const [tcnewNotiCount, settcNewNotiCount] = react.useState(0);

    const handleNoti = (event) => {
        setAnchorElNoti(event.currentTarget);
        if (user.Student_id) {
            if (stnewNotiCount !== 0) {
                api.post('/student/seenNotification', {
                    Student_id: user.Student_id
                }).then(res => {
                    setstNewNotiCount(res.data);
                }).catch(err => console.log(err))
            }
        }
        else if (user.Teacher_id) {
            if (tcnewNotiCount !== 0) {
                api.post('/teacher/seenNotification', {
                    Teacher_id: user.Teacher_id
                }).then(res => {
                    settcNewNotiCount(res.data);
                }).catch(err => console.log(err))
            }
        }
    };

    react.useEffect(() => {
        if (socketUser) {
            socket?.on('new-notification', () => {
                if (socketUser.Student_id) {
                    getStudentNoti(socketUser.Room_id);
                }

                if (socketUser.Teacher_id) {
                    getTeacherNoti(socketUser.Teacher_id)
                }
            })
        }
    }, [socket, socketUser])

    const handleClose = () => {
        setAnchorElNoti(null);
    };

    function getStudentNoti(id) {
        api.post('/subject/StudentGetNotification', {
            Room_id: id,
            Student_id: user.Student_id
        }).then(result => {
            setNotifications(result.data);
            api.post('/subject/pushNotificationFeed', {
                Room_id: id,
                Noti: result.data,
                Student_id: user.Student_id
            }).then(newNoti => {
                setstNewNotiCount(parseInt(newNoti.data))
            }).catch(err2 => console.log(err2))
        }).catch(err => console.log(err))
    }

    function getTeacherNoti(teacherId) {
        api.post('/teacher/teacherSubject', {
            Teacher_id: teacherId
        }).then(result => {
            api.post('/subject/TeacherGetNotification', {
                Teacher_id: teacherId,
                subjects: result.data
            })
                .then(res => {
                    setNotifications(res.data);
                    api.post('/subject/teacherPushNotificationFeed', {
                        noti: res.data,
                        Teacher_id: teacherId
                    })
                        .then(newNoti => {
                            settcNewNotiCount(parseInt(newNoti.data))
                        })
                        .catch(err2 => console.log(err2))
                })
                .catch(err1 => console.log(err1))
        }).catch(err => console.log(err))
    }

    react.useEffect(() => {
        if (user.Student_id) {
            setSocketUser(user)
            getStudentNoti(user.Room_id);
        }

        if (user.Teacher_id) {
            setSocketUser(user)
            getTeacherNoti(user.Teacher_id)
        }
    }, [user, selectSubject])

    return (
        <div className="nav">
            <AppBar style={{
                // backgroundColor:'#1B4E9C'
                backgroundColor: '#fff'
                // backgroundColor: 'rgba(225, 225, 225, 0.4)',
                // backdropFilter:'blur(19px)'
            }}>
                <Toolbar>
                    <div className="left" style={{ width: '20vw'}}>
                        {user.length !== 0 &&
                        <react.Fragment>
                            <IconButton style={{ color: blue[900] }} onClick={() => setOpenDrawer(true)}>
                                <MenuIcon/>
                            </IconButton>
                            <Drawer
                                anchor={'left'}
                                open={openDrawer}
                                onClose={() => setOpenDrawer(false)}
                            >
                                <Box
                                    role="presentation"
                                    onClick={() => setOpenDrawer(false) }
                                    onKeyDown={() => setOpenDrawer(false) }
                                    style={{width:'85vw'}}
                                >
                                    <br/>
                                    <Grid container justifyContent='center'>
                                        <Grid item xs={10}>
                                            <Grid container>
                                                <Grid item xs={3}><AccountCircleIcon style={{fontSize:'4rem'}}/></Grid>
                                                <Grid item xs={9}>
                                                    {user.Student_id ?
                                                        <div>
                                                            <Typography variant='h6' style={{fontWeight:'bold'}} noWrap>{user.Student_FirstName} {user.Student_LastName}</Typography>
                                                            <Typography variant='body1' noWrap>{user.Student_id}</Typography>
                                                        </div>
                                                        :
                                                        <div>
                                                            <Typography variant='h6' style={{fontWeight:'bold'}} noWrap>{user.Teacher_FirstName} {user.Teacher_LastName}</Typography>
                                                            <Typography variant='body1' noWrap>{user.Teacher_id}</Typography>
                                                        </div>
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <br/>
                                    <Divider/>
                                    <Grid container justifyContent='center' style={{paddingBottom:'55vh'}}>
                                        <Grid item xs={10}>
                                            <List>
                                                <ListItem button style={page === 0 ? { color: blue[900] } : { color: grey[500] }} onClick={() => {
                                                    // window.location.replace('/home')
                                                    setPage(0)
                                                    history.push('/home')
                                                }}>
                                                    <ListItemIcon>
                                                        <HomeIcon />
                                                    </ListItemIcon>
                                                    <ListItemText>
                                                        <Typography style={{fontWeight:'bold'}}>หนัาหลัก</Typography>
                                                    </ListItemText>
                                                </ListItem>
                                                <ListItem button style={page === 1 ? { color: blue[900] } : { color: grey[500] }} onClick={() => {
                                                    // window.location.replace('/school') 
                                                    setPage(1)
                                                    history.push('/school')
                                                }}>
                                                    <ListItemIcon>
                                                        <AccountBalanceIcon />
                                                    </ListItemIcon>
                                                    <ListItemText>
                                                        <Typography style={{ fontWeight: 'bold' }}>รายชื่อครู</Typography>
                                                    </ListItemText>
                                                </ListItem>
                                            </List>
                                        </Grid>
                                    </Grid>
                                    <Divider/>
                                    <Grid container justifyContent='center'>
                                        <Grid item xs={10}>
                                            <List>
                                                <ListItem button onClick={() => {
                                                    localStorage.removeItem('auth-token');
                                                    localStorage.removeItem('selectSubject');
                                                    window.location.replace('/login')
                                                }}>
                                                    <ListItemIcon>
                                                        <Logout color='error' />
                                                    </ListItemIcon>
                                                    <ListItemText>
                                                        <Typography>ออกจากระบบ</Typography>
                                                    </ListItemText>
                                                </ListItem>
                                            </List>             
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Drawer>
                        </react.Fragment>
                        }
                    </div>
                    <div style={{ textAlign: 'center', width: '60vw' }}>
                        <b style={{ color: blue[700] }}><b style={{ color: '#FFD72B' }}>T</b><b style={{ color: '#4171B9' }}>K</b> Online Center</b>
                    </div>
                    <div style={{ width: '20vw' }}>
                        {user.length === 0 ?
                            window.location.pathname === '/login' ?
                                <div></div>
                                :
                                <div><Button style={{ color: blue[900] }} onClick={() => {
                                    localStorage.clear();
                                    window.location.replace('/login')
                                }}>log in</Button></div>
                            :
                            <div className='right'>
                                <div>
                                    <IconButton
                                        onClick={handleNoti}
                                        style={{ color: blue[900] }}
                                    >
                                        {user.Teacher_id ?
                                            <Badge badgeContent={tcnewNotiCount === 0 ? null : tcnewNotiCount} color="error">
                                                <NotificationsIcon />
                                            </Badge>
                                            :
                                            <Badge badgeContent={stnewNotiCount === 0 ? null : stnewNotiCount} color="error">
                                                <NotificationsIcon />
                                            </Badge>
                                        }
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorElNoti}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={openNoti}
                                        onClose={handleClose}
                                        PaperProps={{
                                            elevation: 0,
                                            sx: {
                                                overflow: 'visible',
                                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                mt: 5,
                                                borderRadius: '8px',
                                                '& .MuiAvatar-root': {
                                                    width: 32,
                                                    height: 32,
                                                    ml: -0.5,
                                                    mr: 1,
                                                },
                                                '&:before': {
                                                    content: '""',
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 18,
                                                    width: 10,
                                                    height: 10,
                                                    bgcolor: 'background.paper',
                                                    transform: 'translateY(-50%) rotate(45deg)',
                                                    zIndex: 0,
                                                },
                                            },
                                        }}
                                    >
                                        <div style={{ width: '85vw', minWidth: '40vw' }}>
                                            <Grid container justifyContent="center" direction="column">
                                                <Notification forwardedRef={notiModal} noti={notifications} />
                                            </Grid>
                                        </div>
                                    </Menu>
                                </div>
                            </div>
                        }
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}