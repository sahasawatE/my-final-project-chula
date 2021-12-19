import react from 'react';
import {
    AppBar,
    Toolbar,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Grid,
    Button,
    Badge
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { userContext } from '../userContext';
import { socketContext } from '../socketContext';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Notification from './notification/Notification';
import HomeIcon from '@material-ui/icons/Home';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import axios from 'axios';
import { selectSubjectContext } from './selectSubjectContext';
require('dotenv').config();

export default function Appbar() {
    const history = useHistory();
    const ngrok = process.env.REACT_APP_NGROK_URL;
    const api = axios.create({ baseURL: ngrok})
    const { user } = react.useContext(userContext);
    const [anchorEl, setAnchorEl] = react.useState(null);
    const [anchorElNoti, setAnchorElNoti] = react.useState(null);
    const open = Boolean(anchorEl);
    const openNoti = Boolean(anchorElNoti);
    const [socketUser, setSocketUser] = react.useState(null);

    const {selectSubject} = react.useContext(selectSubjectContext)
    const {socket} = react.useContext(socketContext)
    const [page, setPage] = react.useState(0);

    const [notifications, setNotifications] = react.useState([]);
    const [stnewNotiCount, setstNewNotiCount] = react.useState(0);
    const [tcnewNotiCount, settcNewNotiCount] = react.useState(0);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleNoti = (event) => {
        setAnchorElNoti(event.currentTarget);
        if(user.Student_id){
            if (stnewNotiCount !== 0) {
                api.post('/student/seenNotification', {
                    Student_id: user.Student_id
                }).then(res => {
                    setstNewNotiCount(res.data);
                }).catch(err => console.log(err))
            }
        }
        else if(user.Teacher_id){
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
        if(socketUser){
            socket?.on('new-notification', () => {
                if (socketUser.Student_id) {
                    getStudentNoti(socketUser.Room_id);
                }

                if (socketUser.Teacher_id) {
                    getTeacherNoti(socketUser.Teacher_id)
                }
            })
        }
    },[socket,socketUser])

    const handleClose = () => {
        setAnchorEl(null);
        setAnchorElNoti(null);
    };

    function getStudentNoti(id){
        api.post('/subject/StudentGetNotification',{
            Room_id : id,
            Student_id : user.Student_id
        }).then(result => {
            setNotifications(result.data);
            api.post('/subject/pushNotificationFeed',{
                Room_id : id,
                Noti: result.data,
                Student_id: user.Student_id
            }).then(newNoti => {
                setstNewNotiCount(parseInt(newNoti.data))
            }).catch(err2 => console.log(err2))
        }).catch(err => console.log(err))
    }

    function getTeacherNoti(teacherId){
        api.post('/teacher/teacherSubject', {
            Teacher_id: teacherId
        }).then(result => {
            api.post('/subject/TeacherGetNotification', {
                Teacher_id : teacherId,
                subjects : result.data
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
    }, [user,selectSubject])

    return (
        <div className="nav">
            <AppBar style={{
                backgroundColor:'#1B4E9C'
            }}>
                <Toolbar>
                    <div className="left">
                        <b><b style={{ color: '#FFD72B' }}>T</b><b style={{ color: '#4171B9' }}>K</b> Online Center</b>
                    </div>
                    <div className='center'>
                        {user.length === 0 ? 
                        <div></div>
                        :
                        <div>
                            <IconButton color={page === 0 ? "inherit" : "default"} onClick={() => {
                                // window.location.replace('/home')
                                setPage(0)
                                history.push('/home')
                            }}>
                                <HomeIcon/>
                            </IconButton>
                            <IconButton color={page === 1 ? "inherit" : "default"} onClick={() => { 
                                // window.location.replace('/school') 
                                setPage(1)
                                history.push('/school')
                            }}>
                                <AccountBalanceIcon />
                            </IconButton>    
                        </div>
                        }
                    </div>
                <div>
                    {user.length === 0 ?
                        window.location.pathname === '/login' ? 
                            <div></div>
                            :
                            <div><Button style={{color:'white'}} onClick={() => {
                                localStorage.clear();
                                window.location.replace('/login')
                            }}>log in</Button></div>
                        :
                        <div className='right'>
                            <div style={{marginTop:'1vh'}}>
                                    <IconButton
                                        onClick={handleNoti}
                                        color="inherit"
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
                                >
                                    <div style={{width:'30vw',minWidth:'20rem'}}>
                                        <Grid container justifyContent="center" direction="column">
                                            <Notification noti={notifications}/>
                                        </Grid>
                                    </div>
                                </Menu>
                            </div>
                            <div>
                                <IconButton
                                    onClick={handleMenu}
                                    color="default"
                                >
                                        <Avatar><AccountCircleIcon/></Avatar>
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={open}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={() => {
                                        localStorage.removeItem('auth-token');
                                        localStorage.removeItem('selectSubject');
                                        window.location.replace('/login')
                                    }}>Log out</MenuItem>
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