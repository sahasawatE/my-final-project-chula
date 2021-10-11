import { Button, ListItem, ListItemText,Grid,Typography} from "@material-ui/core";
import react from 'react';
import {selectSubjectContext} from '../selectSubjectContext';
// import react from 'react';

export default function NotiBlock(props){
    const {setSelectSubject} = react.useContext(selectSubjectContext);
    return(
        <ListItem onClick={() => {
            localStorage.setItem('selectSubject',JSON.stringify({
                name : props.subject,
                day : '',
                room : props.room
                })
            );
            setSelectSubject({
                name: props.subject,
                day: '',
                room: props.room
            })
        }}>
            <Button style={{width:'100%'}}>
                <Grid container direction="row">
                    <Grid item sm={2}>
                        <div style={{paddingLeft:'0',paddingTop:'1vh'}}>
                            <ListItemText>{`${props.time[0]}:${props.time[1]}`}</ListItemText>
                        </div>
                    </Grid>
                    <Grid item sm={10} style={{display:'flex',justifyContent:'flex-start'}}>
                        <Grid container wrap="nowrap" direction="column">
                            <Grid item xs={12} zeroMinWidth>
                                <Typography noWrap>{props.subject}</Typography>
                            </Grid>
                            <Grid item xs={12} zeroMinWidth>
                                <Typography noWrap>{props.title}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Button>
        </ListItem>
    );
}