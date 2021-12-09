import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Documents from './Documents';
import Clip from './Clip';
import Works from './Works';
import axios from 'axios';
import React from 'react';
import {Grid} from '@material-ui/core'
import { userContext } from '../../userContext';

require('dotenv').config()
// /Users/yen/Desktop/FinalProject/server/Route/uploads/

export default function SubjectDocs(props){
    const ngrok = process.env.REACT_APP_NGROK_URL;
    // const api = axios.create({ baseURL: ngrok })

    const { user } = React.useContext(userContext);
    // const api = axios.create({
    //     baseURL: 'http://localhost:3001/'
    // })
    const room = props.room;
    const teacherId = props.teacher;
    const selectedSubject = props.selectedSubject

    const [subject,setSubject] = React.useState(null)
    const [roomClass,setRoomClass] = React.useState(null)

    React.useEffect(() => {
        if (teacherId && selectedSubject){
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
        if (room && selectedSubject){
            axios.post(`${ngrok}/subject/subjectDetail`, {
                Subject_id: selectedSubject.name,
                Room_id: room
            }).then(result => {
                setSubject(result.data[0])
            }).catch(error => console.log(error)) 
        }
    },[selectedSubject,room,teacherId,ngrok]);

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