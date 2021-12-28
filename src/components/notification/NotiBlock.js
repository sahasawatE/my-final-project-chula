import { Button, Avatar, ListItem, ListItemText,Grid,Typography} from "@material-ui/core";
import react from 'react';
import {selectSubjectContext} from '../selectSubjectContext';
import ForumIcon from '@mui/icons-material/Forum'; //chat
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'; //file
import MovieIcon from '@mui/icons-material/Movie'; //clip
import BorderColorIcon from '@mui/icons-material/BorderColor'; //work
import axios from "axios";
import { blue } from "@mui/material/colors";

require('dotenv').config()

export default function NotiBlock(props){
    const ngrok = process.env.REACT_APP_NGROK_URL;
    const api = axios.create({ baseURL: ngrok })
    const {setSelectSubject} = react.useContext(selectSubjectContext);
    const [name, setName] = react.useState('');
    function subjectName(){
        api.post('/askSubject',{
            Subject_id: props.subject
        }).then(res => setName(res.data[0].Subject_name)).catch(err => console.log(err))
    }
    react.useEffect(() => subjectName(),[])
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
            <Button style={{width:'200%'}}>
                <Grid container direction="row" justifyContent='space-between'>
                    <Grid item sm={2}>
                        <div style={{ paddingLeft: '0', paddingTop: '1vh'}}>
                            {/* <ListItemText>{`${props.time[0]}:${props.time[1]}`}</ListItemText> */}
                            <Avatar style={{ backgroundColor: blue[100], color: blue[700], width: '48px', height: '48px'}}>
                                {props.title === "เพิ่มงานใหม่" ? 
                                <BorderColorIcon/>
                                :
                                props.title === 'อัพโหลดคลิป' ?
                                    <MovieIcon/>
                                    :
                                    props.title === 'อัพโหลดเอกสาร' ?
                                        <InsertDriveFileIcon/>
                                        :
                                        <ForumIcon/>
                                }
                            </Avatar>
                        </div>
                    </Grid>
                    <Grid item sm={7}>
                        <ListItemText>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection:'column'}}>
                                <Typography variant="subtitle1" style={{ display: 'flex', justifyContent: 'flex-start' }} noWrap>{props.title} </Typography>
                                <Typography noWrap>{props.subject} {name}</Typography>
                                {/* <ListItemText style={{ display: 'flex', justifyContent: 'flex-start' }}>{`${props.time[0]}:${props.time[1]}`}</ListItemText> */}
                            </div>
                        </ListItemText>
                    </Grid>
                    <Grid item sm={2} style={{display:'flex',justifyContent:'flex-start'}}>
                        <Grid container wrap="nowrap" direction="column">
                            {/* <Grid item xs={12} zeroMinWidth>
                                <Typography noWrap>{props.subject}</Typography>
                            </Grid> */}
                            <Grid item xs={12} zeroMinWidth>
                                <ListItemText variant="body2" style={{ display: 'flex', justifyContent: 'flex-start' }}>{`${props.time[0]}:${props.time[1]}`}</ListItemText>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Button>
        </ListItem>
    );
}