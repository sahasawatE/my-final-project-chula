import react from 'react';
import { Typography, Button, Grid } from '@material-ui/core';
import axios from 'axios';
import {selectImgBlobReply} from './selectImgBlobReply';

var b64toBlob = require('b64-to-blob');

export default function ThreadReply(props){
    const api = axios.create({ baseURL: 'http://localhost:3001/' })
    const [readMore, setReadMore] = react.useState(false);
    const [replyImg, setReplyImg] = react.useState([]);

    const { setSelectImgReply, setShowThread} = react.useContext(selectImgBlobReply);

    function imgAns(v) {
        api.post('subject/img', {
            id: v.split('[')[1].split(']')[0].split(',')
        })
            .then(async(res2) => {
                var imgBlob = [];
                await Promise.all(
                    res2.data.map(async v1 => {
                        await api.post('/teacher/image', {
                            filePath: v1
                        })
                            .then(res => {
                                var blob = b64toBlob(res.data, "image/*");
                                var blobUrl = URL.createObjectURL(blob);
                                imgBlob.push(blobUrl);
                            })
                            .catch(err => console.log(err))
                        return null
                    })
                )
                setReplyImg(imgBlob)
            })
            .catch(err2 => console.log(err2))
    }

    react.useEffect(() => {
        if(props.img){
            imgAns(props.img)
        }
    },[])

    return(
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography style={{ paddingTop: '4px', paddingLeft: '8px', color: '#afafaf' }}>{props.user}</Typography>
                <div style={{ display: 'flex', flexDirection: 'row', paddingTop: '4px', paddingRight: '8px', color: '#afafaf' }}>
                    <Typography style={{ paddingRight: '0.5rem' }}>{props.date === 'วันนี้' ? props.date : `${props.date?.split('-')[2]}/${props.date?.split('-')[1]}/${props.date?.split('-')[0]}`}</Typography>
                    <Typography>{props.time}</Typography>
                </div>
            </div>
            {props.content?.length > 180 ?
                readMore ?
                    <div>
                        <Typography style={{ paddingTop: '0.5vh', paddingLeft: '16px', paddingRight: '8px', paddingBottom: '0.5rem' }}>{props.content}</Typography>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button color='primary' onClick={() => setReadMore(false)}>ย่อ</Button>
                        </div>
                    </div>
                    :
                    <div>
                        <div style={{ height: '15vh', overflow: 'hidden' }}>
                            <Typography style={{ paddingTop: '0.5vh', paddingLeft: '16px', paddingRight: '8px', paddingBottom: '0.5rem' }}>{props.content}</Typography>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button color='primary' onClick={() => setReadMore(true)}>อ่านต่อ</Button>
                        </div>
                    </div>
                :
                <Typography style={{ paddingTop: '0.5vh', paddingLeft: '16px', paddingRight: '8px', paddingBottom: '0.5rem' }}>{props.content}</Typography>
            }
            <Grid container justifyContent='center'>
                <Grid item xs={12} style={{display:'flex', flexDirection:'row', overflow:'scroll'}}>
                    {replyImg.length !== 0 && replyImg.map((value, index) => {

                        return (
                            <Button key={`imgReplyNo${index}`} onClick={() => {
                                setSelectImgReply(value);
                                setShowThread(false);
                            }}>
                                <img src={value} alt={`img${index}`} style={{ height: '4rem', width: '4rem' }} />
                            </Button>
                        );
                    })}
                </Grid>
            </Grid>
        </div>
    );
}