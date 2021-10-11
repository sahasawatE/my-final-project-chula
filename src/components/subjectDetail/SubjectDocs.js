import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Documents from './Documents';
import Clip from './Clip';
import Works from './Works';
import axios from 'axios';
import React from 'react';
import {Grid} from '@material-ui/core'
import { userContext } from '../../userContext';

// /Users/yen/Desktop/FinalProject/server/Route/uploads/

export default function SubjectDocs(props){

    const { user } = React.useContext(userContext);
    // const api = axios.create({
    //     baseURL: 'http://localhost:3001/'
    // })
    const room = props.room;
    const teacherId = props.teacher;
    const selectedSubject = props.selectedSubject

    const [subject,setSubject] = React.useState(null)
    const [roomClass,setRoomClass] = React.useState(null)

    //query docs clips works, which is not subjectDetail
    //this query is just a test query

    React.useEffect(() => {
        if (teacherId && selectedSubject){
            axios.post('http://localhost:3001/teacher/subject', {
                Teacher_id: teacherId,
                Room_id: selectedSubject.room,
                Subject_id: selectedSubject.name
            }).then(result => {
                axios.post('http://localhost:3001/student/studentList', {
                    Room_id: selectedSubject.room
                }).then(res => {
                    setSubject(result.data[0])
                    setRoomClass(res.data[0].Room_class)
                })
            }).catch(error => console.log(error))
        }
        if (room && selectedSubject){
            axios.post('http://localhost:3001/subject/subjectDetail', {
                Subject_id: selectedSubject.name,
                Room_id: room
            }).then(result => {
                setSubject(result.data[0])
            }).catch(error => console.log(error)) 
        }
    },[selectedSubject,room,teacherId]);
    // const clip = [
    //     {
    //         date: '02-09-2021',
    //         subjectName: "วิชา1",
    //         chapter: 'บท1',
    //         title: 'เรื่องที่1',
    //         clipTitle:'บทที่1 เรื่องที่1 ตอนที่1'
    //     },
    //     {
    //         date: '02-09-2021',
    //         subjectName: "วิชา1",
    //         chapter: 'บท1',
    //         title: 'เรื่องที่2',
    //         clipTitle: 'บทที่1 เรื่องที่2 ตอนที่1'
    //     },
    //     {
    //         date: '02-09-2021',
    //         subjectName: "วิชา1",
    //         chapter: 'บท2',
    //         title: 'เรื่องที่1',
    //         clipTitle: 'บทที่2 เรื่องที่1 ตอนที่1'
    //     }
    // ];

    return(
        <div>
            <Tabs>
                <TabList>
                    <Tab>เอกสาร</Tab>
                    <Tab>คลิป</Tab>
                    <Tab>งาน</Tab>
                </TabList>

                <TabPanel>
                    <Grid container justifyContent="center" direction="column">
                        <Documents user={user} class={roomClass} subject={subject}/>
                    </Grid>
                </TabPanel>
                <TabPanel>
                    <Grid container justifyContent="center" direction="column">
                        <Clip user={user} class={roomClass} subject={subject}/>
                    </Grid>
                </TabPanel>
                <TabPanel>
                    <Grid container justifyContent="center" direction="column">
                        <Works user={user} class={roomClass} subject={subject}/>
                    </Grid>
                </TabPanel>
            </Tabs>
        </div>
    );
}