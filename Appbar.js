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
import { userContext } from '../userContext';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Notification from './notification/Notification';
import HomeIcon from '@material-ui/icons/Home';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import axios from 'axios';
import { selectSubjectContext } from './selectSubjectContext';

export default function Appbar() {
    const api = axios.create({ baseURL: 'http://localhost:3001/'})
    const { user } = react.useContext(userContext);
    const [anchorEl, setAnchorEl] = react.useState(null);
    const [anchorElNoti, setAnchorElNoti] = react.useState(null);
    const open = Boolean(anchorEl);
    const openNoti = Boolean(anchorElNoti);

    const {selectSubject} = react.useContext(selectSubjectContext)

    const [notifications, setNotifications] = react.useState([]);
    const [newNotiCount, setNewNotiCount] = react.useState(0);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleNoti = (event) => {
        setAnchorElNoti(event.currentTarget);
        if(user.Student_id){
            if (newNotiCount !== 0) {
                api.post('/student/seenNotification', {
                    Student_id: user.Student_id
                }).then(res => {
                    setNewNotiCount(res.data);
                }).catch(err => console.log(err))
            }
        }
        else if(user.Teacher_id){
            if (newNotiCount !== 0) {
                api.post('/teacher/seenNotification', {
                    Teacher_id: user.Teacher_id
                }).then(res => {
                    setNewNotiCount(res.data);
                }).catch(err => console.log(err))
            }
        }
    };

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
                setNewNotiCount(parseInt(newNoti.data))
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
                .then(newNoti => {setNewNotiCount(parseInt(newNoti.data))})
                .catch(err2 => console.log(err2))
            })
            .catch(err1 => console.log(err1))
        }).catch(err => console.log(err))
    }
    const MINUTE_MS = 60000;

    react.useEffect(() => {
        if (user.Student_id) {
            getStudentNoti(user.Room_id);
        }

        if (user.Teacher_id) {
            getTeacherNoti(user.Teacher_id)
        }

        const interval = setInterval(() => {
            // console.log('Logs every minute');
            if (user.Student_id) {
                getStudentNoti(user.Room_id);
            }

            if (user.Teacher_id) {
                getTeacherNoti(user.Teacher_id)
            }
        }, MINUTE_MS);

        return () => clearInterval(interval);
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
                            <IconButton color={window.location.pathname === '/home' ? "inherit" : "default"} onClick={() => {window.location.replace('/home')}}>
                                <HomeIcon/>
                            </IconButton>
                            <IconButton color={window.location.pathname === '/school' ? "inherit" : "default"} onClick={() => { window.location.replace('/school') }}>
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
                                        <Badge badgeContent={newNotiCount === 0 ? null : newNotiCount} color="error">
                                            <NotificationsIcon/>
                                        </Badge>
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