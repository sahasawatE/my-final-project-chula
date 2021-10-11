import {Button, Grid,Typography} from '@material-ui/core';
import React from 'react';
import { subjectContext } from '../subjectContext';

export default function SubjectBlock(props){

    const {selectSubject, setSelectSubject } = React.useContext(subjectContext)

    const [select,setSelect] = React.useState(false);
    if(props.thissub){
        localStorage.setItem('selectSubject', JSON.stringify({
            name: props.name,
            day: props.day
        }));
    }
    function selectDay(){
        localStorage.setItem('selectSubject',JSON.stringify({
            name: props.name,
            day : props.day,
            room : props.room
        }));
        setSelect(!select);
        setSelectSubject({
            name: props.name,
            day: props.day,
            room: props.room
        })
    }

    React.useEffect(() => {
        if(selectSubject){
            if(selectSubject.name === props.name && selectSubject.day === props.day){
                setSelect(true)
            }
            else{
                setSelect(false)
            }
        }
        else{
            setSelect(false)
        }
    },[selectSubject,props.name,props.day])

    // console.log(selectSubject.name === props.name)
    // console.log(selectSubject.day === props.day)

    return(
        <Grid item xs={1}>
            <Button variant="outlined" onClick={() => selectDay()} style={{
                    width: `${props.duration}00%`,
                    height: '9vh',
                    textAlign: 'center',
                    marginLeft: `${props.time}00%`,
                    marginTop: '-8px',
                    backgroundColor : select ? "#ffd700" : "#ffffff"
                }}>
                <Typography style={{ paddingTop: '1vh' }} variant="body2" gutterBottom>{props.name}</Typography>
            </Button>
        </Grid>
    );
}