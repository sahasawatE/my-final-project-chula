import react from 'react';
import axios from 'axios';
import { List, ListItem, Paper, InputBase, IconButton } from '@mui/material';
import { grey } from '@mui/material/colors'
import SubjectListItem from './mobileSubjectListItem';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
require('dotenv').config()

export default function MobileSubjectList(props) {

    const ngrok = process.env.REACT_APP_NGROK_URL;
    const api = axios.create({ baseURL: ngrok })

    const [subjects, setSubjects] = react.useState([]);
    const [user, setUser] = react.useState('Teacher');

    const [searchString, setSearchString] = react.useState('');
    const [searchSubject, setSearchSubject] = react.useState([]);

    function subjectForTeacher(userId) {
        api.post('/teacher/allSubject', {
            Teacher_id: userId
        })
            .then(res => {
                var data = [];
                res.data.subjects.map((v, i) => {
                    return (data.push({
                        name: v.Subject_name,
                        room: res.data.room[i][0].Room_class,
                        subjectId: v.Subject_id,
                        roomId: res.data.room[i][0].Room_id
                    }))
                })

                setSubjects(data)
            })
            .catch(err => console.log(err))
    }

    function subjectForStudent(roomId) {
        api.post('/student/allSubject', {
            Room_id: roomId
        })
            .then(res => {
                var data = [];
                res.data.subjects.map((v, i) => {
                    return (data.push({
                        name: v.Subject_name,
                        room: res.data.room[i][0].Room_class,
                        subjectId: v.Subject_id,
                        roomId: res.data.room[i][0].Room_id
                    }))
                })

                setSubjects(data)
            })
            .catch(err => console.log(err))
    }

    react.useEffect(() => {
        if (props.user !== undefined && props.roomId !== undefined) {
            if (props.roomId.length !== 0) {
                setUser('student');
                subjectForStudent(props.roomId)
            }
            else {
                setUser('teacher');
                subjectForTeacher(props.user)
            }
        }
    }, [props.user, props.roomId]);

    return (
        <div style={{ height: '100%' }}>
            <Paper elevation={6} component="form" style={{ height: '13%', backgroundColor: '#ffffff', padding: '4px 8px', display: 'flex', alignItems: 'center', width: '100%', borderRadius: '16px' }}>
                <SearchIcon style={{ color: grey[500] }} />
                <InputBase
                    style={{ flex: 1, width: '100%', marginTop: '4px' }}
                    placeholder=" ค้นหาวิชา"
                    inputProps={{ 'aria-label': ' ค้นหาวิชา' }}
                    value={searchString}
                    onChange={(event) => {
                        setSearchString(event.target.value)
                        var searchResult = subjects.filter(element => {
                            const regex = new RegExp(`^${event.target.value}`, 'gi');
                            if (user.Student_id) {
                                return element.subjectId.match(regex) || element.name.match(regex)
                            }
                            else {
                                return element.subjectId.match(regex) || element.name.match(regex) || element.room.match(regex) || element.roomId.match(regex)
                            }
                        })

                        if (event.target.value.length === 0) {
                            setSearchSubject([]);
                        }
                        else {
                            setSearchSubject(searchResult)
                        }
                    }}
                />
                {searchString.length !== 0 &&
                    <IconButton style={{ width: '2rem', height: '2rem' }} onClick={() => {
                        setSearchString('');
                        setSearchSubject([]);
                    }} color='error'>
                        <ClearIcon />
                    </IconButton>
                }
            </Paper>
            <div style={{ height: '87%', overflow: 'auto' }}>
                {searchString.length === 0 ?
                    subjects.length !== 0 ?
                        <List>
                            {subjects.map((value, index) => {
                                if (user === 'teacher') {
                                    return (
                                        <ListItem key={`subjectNO${index}`}>
                                            <SubjectListItem value={value} user={user} />
                                        </ListItem>
                                    );
                                }
                                else {
                                    return (
                                        <ListItem key={`subjectNO${index}`}>
                                            <SubjectListItem value={value} user={user} />
                                        </ListItem>
                                    );
                                }
                            })}
                        </List>
                        :
                        <div style={{ paddingTop: '2rem', display: 'flex', justifyContent: 'center' }} >ว่างเปล่า</div>
                    :
                    searchSubject.length !== 0 ?
                        <List>
                            {searchSubject.map((value, index) => {
                                if (user === 'teacher') {
                                    return (
                                        <ListItem key={`subjectNO${index}`}>
                                            <SubjectListItem value={value} user={user} />
                                        </ListItem>
                                    );
                                }
                                else {
                                    return (
                                        <ListItem key={`subjectNO${index}`}>
                                            <SubjectListItem value={value} user={user} />
                                        </ListItem>
                                    );
                                }
                            })}
                        </List>
                        :
                        <div style={{ paddingTop: '2rem', display: 'flex', justifyContent: 'center' }}>ว่างเปล่า</div>
                }
            </div>
        </div>
    );
}