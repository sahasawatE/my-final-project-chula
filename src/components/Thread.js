import {Grid,Button, Typography} from '@material-ui/core';
import react from 'react';
import axios from 'axios';
import { selectSubjectContext } from './selectSubjectContext';
import { userContext } from '../userContext';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Teacher(){

    const d = new Date();
    var m = d.getMonth() + 1;
    var day = d.getDate();

    if (m < 10) {
        m = 0 + String(m)
    }
    else {
        m = d.getMonth() + 1
    }

    if (day < 10) {
        day = 0 + String(day)
    }
    else {
        day = d.getDate()
    }


    const today = `${d.getFullYear()}-${m}-${day}`

    const api = axios.create({ baseURL: 'http://localhost:3001/'})

    const {selectSubject} = react.useContext(selectSubjectContext);
    const {user} = react.useContext(userContext);
    const [postModal,setPostModal] = react.useState(false)
    const [title,setTitle] = react.useState('');
    const [q,setQ] = react.useState('');
    const [res,setRes] = react.useState(null);
    const [thread,setThread] = react.useState([]);
    const [reply,setReply] = react.useState([]);
    const [a,setA] = react.useState('');

    function threadPost(){
        if(user.Student_id){
            api.post('/subject/PostThread', {
                Student_id: user.Student_id,
                Subject_id: selectSubject.name,
                Room_id: selectSubject.room,
                Title: title,
                Detail: q
            }).then(result => {
                setRes(result.data);
                setPostModal(false);
            }).catch(err => console.log(err))
        }
        else if(user.Teacher_id){
            api.post('/subject/PostThread', {
                Teacher_id: user.Teacher_id,
                Subject_id: selectSubject.name,
                Room_id: selectSubject.room,
                Title: title,
                Detail: q
            }).then(result => {
                setRes(result.data);
                setPostModal(false);
            }).catch(err => console.log(err))
        }
        else{
            return null
        }
    }

    function ansTheard(a){
        if(user.Student_id){
            api.post('/subject/ReplyThread',{
                Student_id: user.Student_id,
                Teacher_id : null,
                Subject_id: threadData.Subject_id,
                Reply_to : threadData.Thread_id,
                Detail : a,
                Room_id : threadData.Room_id
            })
            .then(res => setA(res.data))
            .catch(err => console.log(err))    
        }
        else if(user.Teacher_id){
            api.post('/subject/ReplyThread', {
                Student_id: null,
                Teacher_id: user.Teacher_id,
                Subject_id: threadData.Subject_id,
                Reply_to: threadData.Thread_id,
                Detail: a,
                Room_id : threadData.Room_id
            })
            .then(res => setA(res.data))
            .catch(err => console.log(err))   
        }
        else{
            return null
        }
    }

    const [showThread, setShowThread] = react.useState(false);
    const [threadData, setThreadData] = react.useState(null);
    const [answer, setAnswer] = react.useState('');

    const commentSection = react.useRef(null);

    react.useEffect(() => {
        if(selectSubject){
            api.post('/subject/Threads',{
                Subject_id : selectSubject.name,
                Room_id : selectSubject.room,
            }).then(res => {
                setThread(res.data[0]);
                setReply(res.data[1]);
                setAnswer('');
                setA('');
            })
            .then(commentSection.current?.scroll({ top: commentSection.current.scrollHeight, behavior: 'smooth' }))
            .catch(err => console.log(err))
        }
    },[res,selectSubject,a])

    const [threadDate, setThreadDate] = react.useState(null);
    const [threadtime, setThreadTime] = react.useState(null);
    const [replyDate, setReplyDate] = react.useState([]);
    const [replyTime, setreplyTime] = react.useState([]);

    // const [readMore, setReadMore] = react.useState(false);

    react.useEffect(() => {
        if(threadData){
            const date = threadData.Time.split(' ')[0];
            const time = threadData.Time.split(' ')[1].split('.')[0];

            setThreadDate(date);
            setThreadTime(time);
        }
        if(reply){
            let date = [];
            let time = [];
            reply.map(value => {
                date.push(value.Time.split(' ')[0]);
                time.push(value.Time.split(' ')[1].split('.')[0]);
                return null;
            })
            setReplyDate(date);
            setreplyTime(time);
        }
        setTimeout(() => {
            commentSection.current?.scroll({ top: commentSection.current.scrollHeight, behavior: 'smooth' });
        },500)
    },[showThread,res,a])
    
    return(
        <div style={{display:'flex', justifyContent:'center', flexDirection:'column'}}>
            <b style={{ color: '#4171B9', padding: '0.5rem' }}>กระทู้</b>
            {selectSubject ? 
            <div>
                <Grid container justifyContent="center">
                    <Button onClick={() => setPostModal(true)} style={{width:'100%'}} color="primary">สร้างกระทู้พูดคุยกับครูและเพื่อน ๆ</Button>
                    {thread.length === 0 ?
                    <Typography>ยังไม่มีกระทู้ตอนนี้</Typography>
                    :
                    thread.map((value,index) => {
                        return(
                            <Grid key={index} container direction="row" justifyContent='flex-start'>
                                <Button onClick={() => {
                                    setShowThread(true);
                                    setThreadData(value);
                                }} style={{width:'100%'}}>
                                    <div style={{display:'flex',flexDirection:'column'}} >
                                        <div>{value.Title}</div>
                                        <div style={{ color: '#898989' }}>โพสต์โดย {value.Student_id ? value.Student_id : value.Teacher_id}</div>
                                    </div>
                                </Button>
                            </Grid>
                        );
                    })
                    }
                </Grid>

                <div>
                    <Modal centered backdrop="static" show={postModal} onHide={() => setPostModal(false)}>
                        <Modal.Header closeButton>สร้างกระทู้</Modal.Header>
                        <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
                            <Grid container direction="row">
                                <Grid item xs={12} style={{paddingBottom:'1rem'}}>
                                    <label htmlFor="title">ชื่อเรื่อง</label>
                                    <br/>
                                    <input style={{width:'100%'}} id="title" type="text" onChange={(e) => setTitle(e.target.value)} placeholder="เขียนชื่อหัวข้อที่ต้องการถามโพสต์" />
                                </Grid>
                                <Grid item xs={12}>
                                    <label htmlFor="title">คำถาม</label>
                                    <br/>
                                    <textarea id='thread' onChange={(e) => setQ(e.target.value)} placeholder="เขียนคำถาม" style={{ width: '100%',height:'100px' }}></textarea>
                                </Grid>
                            </Grid>
                        </Modal.Body>
                        <Modal.Footer style={{display:'flex', justifyContent:'space-around'}}>
                            <Button variant="outlined" color="secondary" onClick={() => {
                                setPostModal(false);
                                setTitle('');
                                setQ('');
                            }}>ยกเลิก</Button>
                            {title !== '' && q !== '' ? 
                                <Button variant="outlined" color="primary" onClick={() => threadPost()}>โพสต์</Button>
                            :
                                <Button variant="outlined" color="primary" disabled onClick={() => threadPost()}>โพสต์</Button>
                            }
                        </Modal.Footer>
                    </Modal>
                </div>
                {threadData ? 
                <div>
                    <Modal centered show={showThread} backdrop="static" size="lg" aria-labelledby="contained-modal-title-vcenter" onHide={() => {
                        setAnswer('');
                        setShowThread(false)
                    }}>
                        <Modal.Header closeButton>
                            <div style={{display: 'flex'}}>
                                <Typography>{threadData.Title}</Typography>
                                <Typography style={{paddingLeft:'1rem',color:'#afafaf'}}>{threadDate === today ? 'วันนี้' : threadDate}</Typography>
                                <Typography style={{paddingLeft:'0.5rem',color:'#afafaf'}}>{threadtime}</Typography>
                            </div>
                        </Modal.Header>
                        <Modal.Body style={{ display: 'flex'}}>
                            <Grid container direction="row" style={{maxHeight:'70vh',height:'100%'}}>
                                <Grid item xs={6} style={{ width: '50%'}}>
                                    <div style={{height:'46vh'}}>
                                        <Typography>คำถาม</Typography>
                                        <div style={{maxHeight:'46vh',overflow:'scroll'}}>
                                            <p>{threadData.Detail}</p>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={6} style ={{width:'50%'}}>
                                    <Typography>คำตอบ</Typography>
                                    <div style={{maxHeight:'36vh', overflow:'scroll'}} ref={commentSection}>
                                    {reply ? 
                                    reply.map((value,index) => {
                                        if(value.Reply_to === String(threadData.Thread_id)){
                                            return(
                                                <div id={`reply-${index}`} key={index} style={{ display: 'flex', justifyContent:'flex-start', backgroundColor:'#f3f3f3',margin:'0.5rem 0 0 0',borderRadius:'4px',flexDirection:'column'}}>
                                                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography style={{paddingTop:'4px',paddingLeft:'8px',color:'#afafaf'}}>{value.Student_id ? value.Student_id : value.Teacher_id}</Typography>
                                                            <div style={{ display: 'flex', flexDirection: 'row',paddingTop:'4px',paddingRight:'8px', color: '#afafaf' }}>
                                                            <Typography style={{ paddingRight: '0.5rem' }}>{replyDate[index] === today ? 'วันนี้' : replyDate[index]}</Typography>
                                                            <Typography>{replyTime[index]}</Typography>
                                                        </div>
                                                    </div>
                                                    {/*
                                                    this should be able to expand
                                                    document.getElementById(`reply-${index}`)?.clientHeight >= 64 ?
                                                    */}
                                                    <Typography style={{paddingTop:'0.5vh',paddingLeft:'16px',paddingRight:'8px',paddingBottom:'0.5rem'}}>{value.Detail}</Typography>
                                                </div>
                                            )
                                        }
                                        return null;
                                    }) 
                                    :
                                    null
                                    }
                                    </div>
                                    <Grid container style={{marginTop:'1rem'}}>
                                        <br/>
                                        <textarea id='answer' value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="เขียนคำตอบ" style={{ width: '100%',height:'50px',maxHeight:'115px',minHeight:'50px' }}></textarea>
                                    </Grid>
                                    <Grid container justifyContent='flex-end' style={{marginTop:'1rem'}}>
                                        {answer === '' ?
                                        <Button disabled>ตอบ</Button>
                                        :
                                        <Button color="primary" onClick={() => ansTheard(answer)}>ตอบ</Button>
                                        }
                                    </Grid>    
                                </Grid>
                            </Grid>
                        </Modal.Body>
                    </Modal>
                </div>
                :
                null
                }
            </div>
            :
            <div style={{display:'flex',justifyContent:'center'}}>
               <Typography>เลือกวิชาที่จะแสดง</Typography> 
            </div>
            }
        </div>
    );
}