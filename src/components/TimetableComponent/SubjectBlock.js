import {Button, Grid,Typography} from '@material-ui/core';
import React from 'react';
import axios from 'axios';
import { subjectContext } from '../subjectContext';

require('dotenv').config()

export default function SubjectBlock(props) {
    const ngrok = process.env.REACT_APP_NGROK_URL;

    const {selectSubject, setSelectSubject } = React.useContext(subjectContext)
    const [name, setName] = React.useState('');

    const [color, setColor] = React.useState("#ffd700");
    const [fontColor, setFontColor] = React.useState('black');

    const [select,setSelect] = React.useState(false);
    const [selectFromList, setSelectFromList] = React.useState(false);
    if(props.thissub){
        localStorage.setItem('selectSubject', JSON.stringify({
            name: props.name,
            day: props.day
        }));
    }
    function selectDay(){
        // localStorage.setItem('selectSubject',JSON.stringify({
        //     name: props.name,
        //     day : props.day,
        //     room : props.room
        // }));
        setSelect(!select);
        setSelectSubject({
            name: props.name,
            day: props.day,
            room: props.room
        })
    }

    //performance issue

    React.useEffect(() => { if (props.user.Student_id){
        setColor('#0074B7');
        setFontColor('white');
    } }, [props.user])

    React.useEffect(() => {
        axios.post(`${ngrok}askSubject`,{
            Subject_id: props.name
        }).then(res => setName(res.data[0].Subject_name)).catch(err => console.log(err))
    }, [ngrok, props.name]);

    React.useEffect(() => {
        if(selectSubject){
            if (selectSubject.name === props.name && selectSubject.room === props.room && selectSubject.day === props.day){
                setSelect(true)
                setSelectFromList(false)
            }
            else if (selectSubject.name === props.name && selectSubject.room === props.room && selectSubject.day.length === 0){
                setSelect(false)
                setSelectFromList(true)
            }
            else{
                setSelect(false)
                setSelectFromList(false)
            }
        }
        else{
            setSelect(false)
            setSelectFromList(false)
        }
    },[selectSubject,props.name,props.day,props.room])

    return(
        <Grid item xs={1}>
            <Button variant="outlined" onClick={() => selectDay()} style={{
                    width: `${props.duration}00%`,
                    color: select ? fontColor : selectFromList ? fontColor : "black",
                    height: '9vh',
                    textAlign: 'center',
                    marginLeft: `${props.time}00%`,
                    marginTop: '-8px',
                    backgroundColor: select ? color : selectFromList ? color : "#ffffff"
                }}>
                {props.duration === 1 ?
                <Typography style={{ paddingTop: '1vh' }} variant="body2" gutterBottom>{props.name}</Typography>
                :
                <div style={{width:'100%'}}>
                    <Typography noWrap style={{ paddingTop: '1vh' }} variant="body1" gutterBottom>{props.name}</Typography>
                    <Typography noWrap style={{ paddingTop: '0vh' }} variant="body2" gutterBottom>{name}</Typography>
                </div>
                }
            </Button>
        </Grid>
    );
}