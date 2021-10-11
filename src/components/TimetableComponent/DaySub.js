import {Grid,Typography,makeStyles} from '@material-ui/core';
import React from 'react';
import SubjectBlock from './SubjectBlock';

const useStyles = makeStyles((theme) => ({
    block: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
    }
}));

export default function DaySub(props) {
    const classes = useStyles();

    const subject = props.data;

    // var today = new Date();
    // var d = today.getDay();
    // var h = today.getHours();

    // console.log(d,h)
    // console.log(subject)
    return (
        <Grid style={{ height: '9vh'}} container direction="row">
            <Grid item xs={2}>
                <div className={classes.block}>
                    <Typography style={{ paddingTop: '1vh' }} variant="body2" gutterBottom>{props.day}</Typography>
                </div>
            </Grid>
            {/* {JSON.stringify(subject)} */}
            {subject.map((value, index) => {
                return <SubjectBlock
                    room={value.room}
                    key={index}
                    day={value.day}
                    duration={Math.abs(parseFloat(value.start) - parseFloat(value.end))}
                    time={Math.abs(8.00 - parseFloat(value.start)) - index}
                    name={value.subject}
                />
            })}
        </Grid>
    );
    
}