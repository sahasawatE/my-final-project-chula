import react from 'react';
import axios from 'axios';
import { List, ListItem } from '@mui/material';
import SubjectListItem from './SubjectListItem';

export default function SubjectList(props) {

    const api = axios.create({
        baseURL: 'http://localhost:3001/'
    })

    const [subjects, setSubjects] = react.useState([]);
    const [user, setUser] = react.useState('Teacher');

    function subjectForTeacher(userId){
        api.post('/teacher/allSubject',{
            Teacher_id: userId
        })
        .then(res => {
            var data = [];
            res.data.subjects.map((v,i) => {
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

    function subjectForStudent(roomId){
        api.post('/student/allSubject',{
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
        if(props.user !== undefined && props.roomId !== undefined){
            if(props.roomId.length !== 0){
                setUser('student');
                subjectForStudent(props.roomId)
            }
            else{
                setUser('teacher');
                subjectForTeacher(props.user)
            }
        }
    },[props.user,props.roomId]);

    return(
        <div style={{ height: '100%', overflow: 'auto'}}>
            {subjects.length !== 0 ?
            <List>
                {subjects.map((value,index) => {
                    if(user === 'teacher'){
                        return (
                            <ListItem key={`subjectNO${index}`}>
                                <SubjectListItem value={value} user={user} />
                            </ListItem>
                        );
                    }
                    else{
                        return(
                            <ListItem key={`subjectNO${index}`}>
                                <SubjectListItem value={value} user={user}/>
                            </ListItem>
                        );
                    }
                })}
            </List>
            :
            <div>ว่างเปล่า</div>
            }
        </div>
    );
}