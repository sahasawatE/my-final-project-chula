import react from 'react';
import axios from 'axios';
import { Grid, Typography, Paper, IconButton, SwipeableDrawer, Chip, Collapse, Alert, Divider, Stack } from '@mui/material';
import { ListItem, ListItemText, List, ListItemIcon, InputBase } from '@material-ui/core'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import '../../App.css';
import { Box } from '@mui/system';

const drawerBleeding = 56;

require('dotenv').config()

export default function MobileStudentList(props) {
    const ngrok = process.env.REACT_APP_NGROK_URL;
    const api = axios.create({ baseURL: ngrok })

    const { canva } = props;
    const container = canva !== undefined ? () => canva().document.body : undefined;
    const [open, setOpen] = react.useState(false);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    const [openAlert, setOpenAlert] = react.useState(false);

    const [selectStudent, setSelectStudent] = react.useState(null);
    const [allStudents, setAllStudents] = react.useState([]);
    const [roomllStudents, setRoomAllStudents] = react.useState('');
    const [searchStudent, setSearchStudent] = react.useState([]);
    const [searchString, setSearchString] = react.useState('');

    react.useEffect(() => {
        setAllStudents(JSON.parse(localStorage.getItem('studentList')).students)
        setRoomAllStudents(JSON.parse(localStorage.getItem('studentList')).room)
    },[])

    react.useEffect(() => {
        setTimeout(() => setOpenAlert(false), 5000)
    }, [openAlert, setOpenAlert])

    return(
        <Grid container justifyContent='space-between' direction='column' style={{ height: '71vh' }}>
            <Grid item xs={12} style={{ height: '100%', marginTop: '2rem', marginRight: '0.75rem', marginLeft: '0.75rem' }}>
                <div className={'teacherBanner'} style={{ backgroundColor: '#fff', width: '100%', height: '10vh', marginBottom: '0.5rem', borderRadius:'16px' }}>
                    <Typography style={{ display: 'flex', justifyContent: 'center', paddingTop: '5%' }} variant='h5'>{roomllStudents}</Typography>
                </div>
                {allStudents.length === 0 ?
                    <Typography>ว่างเปล่า</Typography>
                    :
                    <Grid container direction='column'>
                        <Grid item xs={12}>
                            <Paper elevation={6} component="form" style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', width: '100%', backgroundColor: '#ffffff', borderRadius: '16px' }}>
                                <SearchIcon />
                                <InputBase
                                    style={{ flex: 1, width: '100%' }}
                                    placeholder=" ค้นหานักเรียน"
                                    inputProps={{ 'aria-label': ' ค้นหานักเรียน' }}
                                    value={searchString}
                                    onChange={(event) => {
                                        setSearchString(event.target.value)
                                        var listResult = allStudents.filter(element => {
                                            const regex = new RegExp(`^${event.target.value}`, 'gi');
                                            return element.Student_id.match(regex) || element.Student_FirstName.match(regex) || element.Student_LastName.match(regex)
                                        })

                                        if (event.target.value.length === 0) {
                                            setSearchStudent([]);
                                        }
                                        else {
                                            if (listResult.length === 0) {
                                                setSearchStudent([]);
                                            }
                                            else {
                                                setSearchStudent(listResult)
                                            }
                                        }
                                    }}
                                />
                                {searchString.length !== 0 &&
                                    <IconButton style={{ width: '2rem', height: '2rem' }} onClick={() => {
                                        setSearchString('');
                                        setSearchStudent([]);
                                    }} color='error'>
                                        <ClearIcon />
                                    </IconButton>
                                }
                            </Paper>
                            {searchStudent.length !== 0 &&
                                <Grid container direction='column' style={{ zIndex: '100', position: 'absolute' }}>
                                    <Grid item xs={12}>
                                        <Paper style={{ width: '93%', marginTop: '0.25rem', maxHeight: '32vh', overflow: 'scroll',borderRadius:'16px' }}>
                                            <div style={{ padding: '0.5rem' }}>
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
                                                                            setOpen(true)
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
                        <Grid item xs={12}>
                            <Paper style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem', maxHeight: '71vh', overflow: 'scroll', borderRadius: '16px' }}>
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
                                                        setOpen(true)
                                                    })
                                                    .catch(err => console.log(err))
                                            }} key={`studentId${index}`}>
                                                <ListItemIcon><AccountCircleIcon sx={{ fontSize: 40 }} /></ListItemIcon>
                                                <ListItemText primary={value.Student_id} secondary={`${value.Student_FirstName} ${value.Student_LastName}`} />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                }
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
                <Box
                    sx={{
                        px: 2,
                        pb: 4,
                        height: '93vh',
                        overflow: 'auto',
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                    }}
                >
                    <Grid container justifyContent='center'>
                        {selectStudent ?
                            <div style={{ padding: '0.5rem' }}>
                                <Grid container justifyContent='center' direction='row'>
                                    <Grid item style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }} xs={12}><AccountCircleIcon sx={{ fontSize: '7rem' }} /></Grid>
                                    <Grid item xs={12} style={{ margin: '2rem', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                        <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>{`${selectStudent.student.Student_FirstName} ${selectStudent.student.Student_LastName}`}</Typography>
                                        <Typography variant="body1" gutterBottom style={{ textAlign: 'center' }}>{selectStudent.student.Student_id}</Typography>
                                        <Typography variant="body1" gutterBottom style={{ textAlign: 'center' }}>{`นักเรียนห้อง ${roomllStudents}`}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container justifyContent='flex-start' direction='column'>
                                        <Stack spacing={1} alignItems='center'>
                                            <Stack spacing={1} direction='row'>
                                                {selectStudent.student.Student_Phone.length !== 0 &&
                                                    <Chip
                                                        onClick={() => window.open(`tel:${selectStudent.student.Student_Phone}`)}
                                                        color='primary'
                                                        icon={<LocalPhoneIcon />}
                                                        label={selectStudent.student.Student_Phone}
                                                    />
                                                }
                                                {selectStudent.student.Student_Email.length !== 0 &&
                                                    <Chip
                                                        onClick={() => window.open(`mailto:${selectStudent.student.Student_Email}`, '_blank')}
                                                        color='secondary'
                                                        icon={<EmailIcon />}
                                                        label={selectStudent.student.Student_Email}
                                                    />
                                                }
                                            </Stack>
                                            <Stack spacing={1} direction='row'>
                                                {selectStudent.student.Student_Address.length !== 0 &&
                                                    <Chip
                                                        variant="outlined"
                                                        icon={<LocationOnIcon />}
                                                        label={<Typography noWrap style={{ maxWidth: '50vw' }}>{selectStudent.student.Student_Address}</Typography>}
                                                    />
                                                }
                                            </Stack>
                                            <Stack spacing={1} direction='row'>
                                                {selectStudent.student.Student_LineId.length !== 0 &&
                                                    <Chip
                                                        variant="outlined"
                                                        color='success'
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(selectStudent.student.Student_LineId)
                                                            setOpenAlert(true)
                                                        }}
                                                        icon={<img alt='hok1' style={{ height: '1.8rem', width: '1.8rem' }} src="https://img.icons8.com/color/144/000000/line-me.png" />}
                                                        label={<Typography noWrap style={{ maxWidth: '25vw' }}>{selectStudent.student.Student_LineId}</Typography>}
                                                    />
                                                }
                                                {selectStudent.student.Student_Facebook.length !== 0 &&
                                                    <Chip
                                                        variant="outlined"
                                                        color='primary'
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(selectStudent.student.Student_Facebook)
                                                            setOpenAlert(true)
                                                        }}
                                                        icon={<img alt='hok2' style={{ height: '1.8rem', width: '1.8rem' }} src="https://img.icons8.com/fluency/144/000000/facebook-new.png" />}
                                                        label={<Typography noWrap style={{ maxWidth: '25vw' }}>{selectStudent.student.Student_Facebook}</Typography>}
                                                    />
                                                }
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                </Grid>
                                <br />
                                <Divider />
                                <Grid container justifyContent='center' direction='row'>
                                    <Grid item style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }} xs={12}><AccountCircleIcon sx={{ fontSize: '7rem' }} /></Grid>
                                    <Grid item xs={12} style={{ margin: '2rem', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                        <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>{`${selectStudent.parent.Parent_FirstName} ${selectStudent.parent.Parent_LastName}`}</Typography>
                                        {/* <Grid container justifyContent='flex-start' direction='column'>
                                        <Grid item xs={12}><Typography>{`${selectStudent.parent.Parent_FirstName} ${selectStudent.parent.Parent_LastName}`}</Typography></Grid>
                                    </Grid> */}
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container justifyContent='flex-start' direction='column'>
                                        <Stack spacing={1} alignItems='center'>
                                            <Stack spacing={1} alignItems='center'>
                                                <Stack spacing={1} direction='row'>
                                                    {selectStudent.parent.Parent_phone.length !== 0 &&
                                                        <Chip
                                                            onClick={() => window.open(`tel:${selectStudent.parent.Parent_phone}`)}
                                                            color='primary'
                                                            icon={<LocalPhoneIcon />}
                                                            label={selectStudent.parent.Parent_phone}
                                                        />
                                                    }
                                                    {selectStudent.parent.Parent_Email.length !== 0 &&
                                                        <Chip
                                                            onClick={() => window.open(`mailto:${selectStudent.parent.Parent_Email}`, '_blank')}
                                                            color='secondary'
                                                            icon={<EmailIcon />}
                                                            label={selectStudent.parent.Parent_Email}
                                                        />
                                                    }
                                                </Stack>
                                                <Stack spacing={1} direction='row'>
                                                    {selectStudent.parent.Parent_Address.length !== 0 &&
                                                        <Chip
                                                            variant="outlined"
                                                            icon={<LocationOnIcon />}
                                                            label={<Typography noWrap style={{ maxWidth: '50vw' }}>{selectStudent.parent.Parent_Address}</Typography>}
                                                        />
                                                    }
                                                </Stack>
                                                <Stack spacing={1} direction='row'>
                                                    {selectStudent.parent.Parent_LineId.length !== 0 &&
                                                        <Chip
                                                            variant="outlined"
                                                            color='success'
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(selectStudent.parent.Parent_LineId)
                                                                setOpenAlert(true)
                                                            }}
                                                            icon={<img alt='hok1' style={{ height: '1.8rem', width: '1.8rem' }} src="https://img.icons8.com/color/144/000000/line-me.png" />}
                                                            label={<Typography noWrap style={{ maxWidth: '25vw' }}>{selectStudent.parent.Parent_LineId}</Typography>}
                                                        />
                                                    }
                                                    {selectStudent.parent.Parent_Facebook.length !== 0 &&
                                                        <Chip
                                                            variant="outlined"
                                                            color='primary'
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(selectStudent.parent.Parent_Facebook)
                                                                setOpenAlert(true)
                                                            }}
                                                            icon={<img alt='hok2' style={{ height: '1.8rem', width: '1.8rem' }} src="https://img.icons8.com/fluency/144/000000/facebook-new.png" />}
                                                            label={<Typography noWrap style={{ maxWidth: '25vw' }}>{selectStudent.parent.Parent_Facebook}</Typography>}
                                                        />
                                                    }
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </div>
                            :
                            <div style={{ display: 'flex', justifyContent: 'center', color: 'GrayText' }}><Typography>--- เลือกนักเรียนเพื่อแสดง ---</Typography></div>
                        }
                    </Grid>
                    <br />
                    <Collapse in={openAlert}>
                        <Alert>
                            คัดลอกเรียบร้อย
                        </Alert>
                    </Collapse>
                </Box>
            </SwipeableDrawer>
        </Grid>
    );
}