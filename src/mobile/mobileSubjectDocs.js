import axios from 'axios';
import React from 'react';
import MobileDocument from './mobileDocument';
import MobileClip from './mobileClip';
import MobileWork from './mobileWork';
import { Grid } from '@material-ui/core'
import { Tab, Tabs, Box } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import PropTypes from 'prop-types';
import { userContext } from '../../userContext';
import { blue, green, purple } from '@mui/material/colors';

require('dotenv').config()
// /Users/yen/Desktop/FinalProject/server/Route/uploads/

function TabPanel(props) {
    const { value, index } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            {value === 0 ?
                <Grid container justifyContent="center" direction="column" style={{ paddingTop: '1rem' }}>
                    <MobileDocument user={props.user} class={props.class} subject={props.subject} />
                </Grid>
                :
                value === 1 ?
                    <Grid container justifyContent="center" direction="column" style={{ paddingTop: '1rem' }} >
                        <MobileClip user={props.user} class={props.class} subject={props.subject} />
                    </Grid>
                    :
                    <Grid container justifyContent="center" direction="column" style={{ paddingTop: '1rem' }} >
                        <MobileWork user={props.user} class={props.class} subject={props.subject} />
                    </Grid>
            }
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function MobileSubjectDocs(props) {
    const ngrok = process.env.REACT_APP_NGROK_URL;
    // const api = axios.create({ baseURL: ngrok })

    const { user } = React.useContext(userContext);
    // const api = axios.create({
    //     baseURL: 'http://localhost:3001/'
    // })
    const room = props.room;
    const teacherId = props.teacher;
    const selectedSubject = props.selectedSubject

    const [subject, setSubject] = React.useState(null)
    const [roomClass, setRoomClass] = React.useState(null)

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    React.useEffect(() => {
        if (teacherId && selectedSubject) {
            axios.post(`${ngrok}teacher/subject`, {
                Teacher_id: teacherId,
                Room_id: selectedSubject.room,
                Subject_id: selectedSubject.name
            }).then(result => {
                axios.post(`${ngrok}student/studentList`, {
                    Room_id: selectedSubject.room
                }).then(res => {
                    setSubject(result.data[0])
                    setRoomClass(res.data[0].Room_class)
                })
            }).catch(error => console.log(error))
        }
        if (room && selectedSubject) {
            axios.post(`${ngrok}subject/subjectDetail`, {
                Subject_id: selectedSubject.name,
                Room_id: room
            }).then(result => {
                setSubject(result.data[0])
            }).catch(error => console.log(error))
        }
    }, [selectedSubject, room, teacherId, ngrok]);

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs" variant="fullWidth">
                    <Tab icon={<InsertDriveFileIcon />} style={value === 0 ? { flexDirection: 'row', color: blue[500] } : { flexDirection: 'row' }} label="&nbsp;เอกสาร" {...a11yProps(0)} />
                    <Tab icon={<PlayCircleOutlineIcon />} style={value === 1 ? { flexDirection: 'row', color: green[500] } : { flexDirection: 'row' }} label="&nbsp;คลิป" {...a11yProps(1)} />
                    <Tab icon={<DriveFileRenameOutlineIcon />} style={value === 2 ? { flexDirection: 'row', color: purple[500] } : { flexDirection: 'row' }} label="&nbsp;งาน" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0} user={user} class={roomClass} subject={subject} />
            <TabPanel value={value} index={1} user={user} class={roomClass} subject={subject} />
            <TabPanel value={value} index={2} user={user} class={roomClass} subject={subject} />
        </Box>
    );
}