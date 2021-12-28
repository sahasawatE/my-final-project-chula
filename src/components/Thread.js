import {Grid,Button, Typography, IconButton} from '@material-ui/core';
import react from 'react';
import axios from 'axios'
import { socketContext } from '../socketContext';
import { selectSubjectContext } from './selectSubjectContext';
import { userContext } from '../userContext';
import { selectImgBlobReply } from './selectImgBlobReply';
import { Modal } from 'react-bootstrap';
import * as FilePond from 'react-filepond';
import ThreadReply from './ThreadReply';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

var b64toBlob = require('b64-to-blob');
require('dotenv').config();

export default function Thread() {
    FilePond.registerPlugin(
        FilePondPluginFileValidateType,
        FilePondPluginFileValidateSize,
        FilePondPluginImageExifOrientation,
        FilePondPluginImagePreview
    );

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

    const ngrok = process.env.REACT_APP_NGROK_URL;
    const api = axios.create({ baseURL: ngrok })

    const {socket} = react.useContext(socketContext)

    const {selectSubject} = react.useContext(selectSubjectContext);
    const {user} = react.useContext(userContext);
    const [postModal,setPostModal] = react.useState(false)
    const [title,setTitle] = react.useState('');
    const [q,setQ] = react.useState('');
    const [res,setRes] = react.useState(null);
    const [thread,setThread] = react.useState([]);
    const [reply,setReply] = react.useState([]);
    const [a,setA] = react.useState('');
    const [availableBtn, setAvailableBtn] = react.useState(true);
    const [threadF, setThreadF] = react.useState([]);
    const [imgBlob, setImgBlob] = react.useState([]);
    const [mode, setMode] = react.useState(0);
    const [selectImgReply, setSelectImgReply] = react.useState(null);
    const [replyMsg, setReplyMsg] = react.useState([]);

    function pushSocketNotification() {
        socket?.emit('push-notification')
    }

    function threadPost(id){
        if(user.Student_id){
            api.post('/subject/PostThread', {
                Student_id: user.Student_id,
                Subject_id: selectSubject.name,
                Room_id: selectSubject.room,
                Title: title,
                Detail: q,
                fileList: JSON.stringify(id)
            }).then(result => {
                setRes(result.data);
                setPostModal(false);
                setTitle('');
                setQ('');
            }).catch(err => console.log(err))
        }
        else if(user.Teacher_id){
            api.post('/subject/PostThread', {
                Teacher_id: user.Teacher_id,
                Subject_id: selectSubject.name,
                Room_id: selectSubject.room,
                Title: title,
                Detail: q,
                fileList: JSON.stringify(id)
            }).then(result => {
                setRes(result.data);
                setPostModal(false);
                setTitle('');
                setQ('');
            }).catch(err => console.log(err))
        }
        else{
            return null
        }
        setThreadF([]);
        setImgBlob([]);
        pushSocketNotification()
    }

    function sendMsg(a, student, teacher, subject, thread, room) {
        socket?.emit('sent-message', {
            user: student ? student : teacher,
            subject: subject,
            thread: thread,
            room: room,
            msg: a
        })
        pushSocketNotification()
    }

    function sendMsgAndImg(f,a,student,teacher,subject,thread,room) {
        socket?.emit('sent-message-image', {
            user: student ? student : teacher,
            subject: subject,
            thread: thread,
            room: room,
            file: f,
            msg: a
        })
        pushSocketNotification()
    }

    function ansTheard(a){
        if(user.Student_id){
            sendMsg(a, user.Student_id, null, threadData.Subject_id, threadData.Thread_id, threadData.Room_id)
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
        else if (user.Teacher_id) {
            sendMsg(a, null, user.Teacher_id, threadData.Subject_id, threadData.Thread_id, threadData.Room_id)
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
        setThreadF([]);
        setImgBlob([]);
    }
    function ansTreadImg(fileList,ans){
        if(user.Teacher_id){
            sendMsgAndImg(fileList, ans,null,user.Teacher_id,threadData.Subject_id,threadData.Thread_id,threadData.Room_id)
        }
        else{
            sendMsgAndImg(fileList, ans, user.Student_id, null, threadData.Subject_id, threadData.Thread_id, threadData.Room_id)
        }
        api.post('/subject/postThreadImg',{
            file: fileList,
            ans: ans
        })
        .then(res => {
            setThreadF([]);
            setImgBlob([]);
            setA(res.data);
        })
        .then(() => {
            api.post('/subject/pushNotification',{
                detail: `${user.Teacher_id ? user.Teacher_id : user.Student_id} ตอบกระทู้`,
                Student_id: user.Teacher_id ? '' : user.Student_id,
                Teacher_id: user.Teacher_id ? user.Teacher_id : '',
                Room_id: threadData.Room_id,
                Subject_id: threadData.Subject_id
            }).catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }

    const [showThread, setShowThread] = react.useState(false);
    const [threadData, setThreadData] = react.useState(null);
    const [threadDataImg, setThreadDataImg] = react.useState(null);
    const [threadImg, setThreadImg] = react.useState(null);
    const [answer, setAnswer] = react.useState('');

    const commentSection = react.useRef(null);

    react.useEffect(() => {
        if(selectSubject){
            api.post('/subject/Threads',{
                Subject_id : selectSubject.name,
                Room_id : selectSubject.room,
            }).then(res1 => {
                setThread(res1.data[0]);
                setReply(res1.data[1]);
<<<<<<< HEAD
=======
                // console.log(res.data[1][0])
>>>>>>> 999d8ec025d1423aab99129a49da7faed60ad8f8
                setAnswer('');
                setA('');
            })
            .catch(err => console.log(err))
        }
    },[res,selectSubject]);

    react.useEffect(() => {
        socket?.on('new-message', (messageNew) => {
            setReplyMsg((list) => [...list, {
                Detail: messageNew.msg,
                Example_file: "",
                Reply_to: messageNew.thread,
                Student_id: messageNew.user[0] === "t" ? "" : messageNew.user,
                Teacher_id: messageNew.user[0] === "t" ? messageNew.user : "",
                Thread_id: "",
                Title: ""
            }])
        })
        socket?.on('new-message-image',(messageData) => {
            setReplyMsg((list) => [...list, {
                Detail: messageData.msg,
                Example_file: "",
                Reply_to: messageData.thread,
                Student_id: messageData.user[0] === "t" ? "" : messageData.user,
                Teacher_id: messageData.user[0] === "t" ? messageData.user : "",
                Thread_id: "",
                Title: "",
                b64file: messageData.fileData
            }])
        })
    }, [socket])

    react.useEffect(() => {
        setAnswer('');
        setA('');
        commentSection.current?.scroll({ top: commentSection.current.scrollHeight, behavior: 'smooth' });
    },[a]);

    react.useEffect(() => {
        if (threadDataImg !== false){
            api.post('/subject/img',{
                id: threadDataImg
            })
            .then(async res => {
                var imgBlob = [];
                await Promise.all(
                    res.data.map(async v1 => {
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
                setThreadImg(imgBlob)
            })
            .catch(err => console.log(err))
        }
    }, [threadDataImg])

    const [threadDate, setThreadDate] = react.useState(null);
    const [threadtime, setThreadTime] = react.useState(null);
    const [selectThreadImg, setSelectThreadImg] = react.useState(null);

    const [readMore, setReadMore] = react.useState(false);
    const [files, setFiles] = react.useState([]);
    const [addImgModal, setAddImgModal] = react.useState(false);
    const [u ,setU] = react.useState(true);
    const [selectBlob, setSelectBlob] = react.useState(null);

    react.useEffect(() => {
        if(threadData){
            const date = threadData.Time.split(' ')[0];
            const time = threadData.Time.split(' ')[1].split('.')[0];

            setThreadDate(date);
            setThreadTime(time);
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
                                    setThreadDataImg(value.Example_file !== '' && value.Example_file.split('[')[1].split(']')[0].split(','))
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
                    <Modal centered backdropClassName="modal" backdrop="static" show={postModal} onHide={() => {
                        setPostModal(false);
                        setTitle('');
                        setQ('');
                    }}>
                        <Modal.Header closeButton>สร้างกระทู้</Modal.Header>
                        <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
                            <Grid container direction="row">
                                <Grid item xs={12} style={{paddingBottom:'1rem'}}>
                                    <label htmlFor="title">ชื่อเรื่อง</label>
                                    <br/>
                                    <input style={{width:'100%'}} value={title} id="title" type="text" onChange={(e) => setTitle(e.target.value)} placeholder="เขียนชื่อหัวข้อที่ต้องการถามโพสต์" />
                                </Grid>
                                <Grid item xs={12}>
                                    <label htmlFor="title">คำถาม</label>
                                    <br/>
                                    <textarea id='thread' value={q} onChange={(e) => setQ(e.target.value)} placeholder="เขียนคำถาม" style={{ width: '100%',height:'100px' }}></textarea>
                                </Grid>
                                {threadF.length !== 4 && 
                                    <Grid item xs={12}>
                                        <Button style={{width:'100%'}} color='primary' onClick={() => {
                                            setAddImgModal(true);
                                            setPostModal(false);
                                            setMode(1)
                                        }}>เพิ่มรูป</Button>
                                    </Grid>
                                }
                                {threadF.length !== 0 &&
                                    <Grid container justifyContent='center' direction='row' style={{overflow:'scroll'}}>
                                        {imgBlob.map((value,index) => {
                                            return (
                                                <Grid item xs={12 / threadF.length} key={`fileUploadNo${index}`}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '1rem', width: '70px' }}>
                                                        <Button onClick={() => {
                                                            setPostModal(false);
                                                            setSelectBlob(value);
                                                            setMode(1)
                                                        }}><img style={{ height: '50px', width: '70px'}} alt={index} src={value}/></Button>
                                                        <Button style={{wigth:'100%'}} color='secondary' onClick={() => {
                                                            api.delete('/subject/cancelReplyImg', {
                                                                data: {
                                                                    fileList: [threadF[index]]
                                                                }
                                                            })
                                                                .then(res => {
                                                                    if (res.data === 'canceled') {
                                                                        setThreadF(threadF.filter(e => e !== threadF[index]))
                                                                        setImgBlob(imgBlob.filter(e => e !== imgBlob[index]))
                                                                    }
                                                                })
                                                                .catch(err => console.log(err))
                                                        }}><CancelIcon /></Button>
                                                    </div>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                }
                            </Grid>
                        </Modal.Body>
                        <Modal.Footer style={{display:'flex', justifyContent:'space-around'}}>
                            <Button variant="outlined" color="secondary" onClick={() => {
                                setPostModal(false);
                                setTitle('');
                                setQ('');
                            }}>ยกเลิก</Button>
                            {title !== '' && q !== '' ? 
                                <Button variant="outlined" color="primary" onClick={() => {
                                    var id = [];
                                    threadF.map(v => {
                                        id.push(v.File_Thread_id)
                                        return null
                                    })
                                    threadPost(id)
                                }}>โพสต์</Button>
                            :
                                <Button variant="outlined" color="primary" disabled onClick={() => threadPost()}>โพสต์</Button>
                            }
                        </Modal.Footer>
                    </Modal>
                </div>
                {threadData ? 
                <div>
                    <Modal centered backdropClassName="modal" show={showThread} backdrop="static" size="lg" aria-labelledby="contained-modal-title-vcenter" onHide={() => {
                        setAnswer('');
                        setShowThread(false);
                        setReadMore(false);
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
                                        <div id='T' style={{maxHeight:'46vh',overflow:'scroll'}}>
                                            {threadData?.Detail.length > 300 ? 
                                            readMore ? 
                                                <div>
                                                    <Typography>{threadData.Detail}</Typography>
                                                    <div style={{display:'flex',justifyContent:'flex-end'}}>
                                                        <Button color='primary' onClick={() => setReadMore(false)}>ย่อ</Button>
                                                    </div>
                                                </div>
                                                :
                                                <div>
                                                    <div style={{height:'25vh',overflow:'hidden'}}>
                                                        <Typography>{threadData.Detail}</Typography>
                                                    </div>
                                                    <div style={{display:'flex',justifyContent:'flex-end'}}>
                                                        <Button color='primary' onClick={() => setReadMore(true)}>อ่านต่อ</Button>
                                                    </div>
                                                </div>
                                            :
                                            <Typography>{threadData.Detail}</Typography>
                                            }
                                        </div>
                                        <Grid container>
                                            {threadData?.Example_file !== '' && threadData.Example_file.split('[')[1].split(']')[0].split(',').map((value,index) => {
                                                return(
                                                    <Button onClick={() => {
                                                        setSelectThreadImg(threadImg[index]);
                                                        setShowThread(false);
                                                    }} key={`threadImgNO${value}`}>
                                                        <img src={threadImg[index]} alt={`threadImgNO${value}`} style={{width:'4rem', height:'4rem'}} />
                                                    </Button>
                                                );
                                            })
                                            }
                                        </Grid>
                                    </div>
                                </Grid>
                                <Grid item xs={6} style ={{width:'50%'}}>
                                    <Typography>คำตอบ</Typography>
                                    <div style={{maxHeight:'36vh', overflow:'scroll'}} ref={commentSection}>
                                    {reply || replyMsg ? 
                                    reply.concat(replyMsg).map((value,index) => {
                                        if(String(value.Reply_to) === String(threadData.Thread_id)){
                                            return(
                                                <selectImgBlobReply.Provider value={{ setSelectImgReply, setShowThread }} key={`replyNo${index}`}>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-start', backgroundColor: '#f3f3f3', margin: '0.5rem 0 0 0', borderRadius: '4px', flexDirection: 'column' }}>
                                                        <ThreadReply user={value.Student_id ? value.Student_id : value.Teacher_id} content={value.Detail} img={value.Example_file} b64={value.b64file ? value.b64file : null} />
                                                    </div>
                                                </selectImgBlobReply.Provider>
                                            )
                                        }
                                        return null;
                                    }) 
                                    :
                                    null
                                    }
                                    </div>
                                    <br/>
                                    {threadF.length !== 0 &&
                                        <Grid container justifyContent='center' direction='row' style={{overflow:'scroll'}}>
                                                {imgBlob.map((value,index) => {
                                                    return (
                                                        <Grid item xs={12 / threadF.length} key={`fileUploadNo${index}`}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '1rem', width: '70px' }}>
                                                                <Button onClick={() => {
                                                                    setShowThread(false);
                                                                    setSelectBlob(value);
                                                                }}><img style={{ height: '50px', width: '70px'}} alt={index} src={value}/></Button>
                                                                <Button style={{wigth:'100%'}} color='secondary' onClick={() => {
                                                                    api.delete('/subject/cancelReplyImg', {
                                                                        data: {
                                                                            fileList: [threadF[index]]
                                                                        }
                                                                    })
                                                                        .then(res => {
                                                                            if (res.data === 'canceled') {
                                                                                setThreadF(threadF.filter(e => e !== threadF[index]))
                                                                                setImgBlob(imgBlob.filter(e => e !== imgBlob[index]))
                                                                            }
                                                                        })
                                                                        .catch(err => console.log(err))
                                                                }}><CancelIcon /></Button>
                                                            </div>
                                                        </Grid>
                                                    );
                                                })}
                                        </Grid>
                                    }
                                    <Grid container style={{marginTop:'1rem'}}>
                                        <Grid item xs={2}>
                                            {u || threadF.length !== 4 ?
                                            <IconButton color="primary" onClick={() => {
                                                setAddImgModal(true);
                                                setShowThread(false);
                                            }}><AddIcon/></IconButton>
                                            :
                                            <IconButton disabled><AddIcon/></IconButton>
                                            }
                                        </Grid>
                                        <Grid item xs={8}>
                                            <textarea id='answer' value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="เขียนคำตอบ" style={{ width: '100%', height: '50px', maxHeight: '115px', minHeight: '50px' }}></textarea>
                                        </Grid>
                                        <Grid item xs={2}>
                                            {answer === '' ?
                                                threadF.length === 0 ? 
                                                    <IconButton disabled><SendIcon/></IconButton>
                                                    :
                                                    <IconButton color="primary" onClick={() => {
                                                        ansTreadImg(threadF, answer)
                                                    }}><SendIcon/></IconButton>
                                                :
                                                <IconButton color="primary" onClick={() => {
                                                    if(threadF.length === 0){
                                                        ansTheard(answer);
                                                    }
                                                    else{
                                                        ansTreadImg(threadF, answer);
                                                    }
                                                }}><SendIcon/></IconButton>
                                            }
                                        </Grid>
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

            {/* img modal */}
            <Modal centered backdropClassName="modal" show={selectBlob !== null} aria-labelledby="contained-modal-title-vcenter" onHide={() => {
                if(mode === 1){
                    setSelectBlob(null);
                    setPostModal(true);
                    setMode(0)
                }
                else if(mode === 2){
                    setSelectBlob(null);
                    setShowThread(true);
                    setMode(0)
                }
                else{
                    setSelectBlob(null);
                    setShowThread(true);
                }
            }}>
                <img src={selectBlob} alt='hok'/>
            </Modal>

            {/* img reply modal */}
            <Modal centered backdropClassName="modal" show={selectImgReply !== null} aria-labelledby="contained-modal-title-vcenter" onHide={() => {
                setSelectImgReply(null);
                setShowThread(true);
            }}>
                <img src={selectImgReply} alt='hok' />
            </Modal>

            {/* img thread modal */}
            <Modal centered backdropClassName="modal" show={selectThreadImg !== null} aria-labelledby="contained-modal-title-vcenter" onHide={() => {
                setSelectThreadImg(null);
                setShowThread(true);
            }}>
                <img src={selectThreadImg} alt='hok' />
            </Modal>

            {/* upload image modal */}
            <Modal centered backdropClassName="modal" show={addImgModal} backdrop="static" aria-labelledby="contained-modal-title-vcenter">
                <Modal.Header>อัพโหลดรูป</Modal.Header>
                <Modal.Body>
                    <Grid container style={{maxHeight:'55vh',overflow:'scroll'}}>
                        <Grid item xs={12}>
                            <FilePond.FilePond
                                files={files}
                                onupdatefiles={setFiles}
                                allowMultiple={true}
                                maxFiles={4 - threadF.length}
                                acceptedFileTypes={['image/*']}
                                allowDrop
                                name="file"
                                onaddfilestart={() => {
                                    //submit btn issue
                                    if(files.length !== 0){
                                        setAvailableBtn(false);
                                    }
                                    else{
                                        setAvailableBtn(true);
                                    }
                                }}
                                onprocessfilerevert={(f) => {
                                    if (selectSubject && user) {
                                        api.delete('/subject/fileThread', {
                                            data: {
                                                name: f.file.name,
                                                roomId: selectSubject.room,
                                                subjectId: selectSubject.name,
                                                userId: user.Student_id ? user.Student_id : user.Teacher_id,
                                                threadId: threadData ? threadData.Thread_id : ''
                                            }
                                        })
                                            .then(res => console.log(res.data))
                                            .then(() => {
                                                files.map(v => {
                                                    if(v.file === f.file){
                                                        setImgBlob(imgBlob.filter(e => e !== imgBlob[files.indexOf(v)]))
                                                    }
                                                    return null
                                                })
                                            })
                                            .then(setFiles(files.filter(e => e.file !== f.file)))
                                            .then(setThreadF(threadF.filter(e => e.File_Path !== `/Users/yen/Desktop/FinalProject/component/final/src/components/ThreadFile/${selectSubject.room}/${selectSubject.name}/${user.Student_id ? user.Student_id : user.Teacher_id}/${threadData ? threadData.Thread_id : ''}/${f.file.name}`)))
                                            .catch(err => console.log(err))
                                    }
                                }}
                                server={
                                    selectSubject && user ? {
                                        process: `${ngrok}subject/fileThread/${selectSubject.room}/${selectSubject.name}/${user.Student_id ? user.Student_id : user.Teacher_id}/${threadData ? threadData.Thread_id : ''}`,
                                        revert: null
                                    }
                                    :
                                    null
                                }
                                onprocessfile={(err,f) => {
                                    if(err){
                                        console.log(err)
                                    }
                                    else{
                                        if (selectSubject && user) {
                                            api.post('/subject/fileThreadId', {
                                                name: f.file.name,
                                                roomId: selectSubject.room,
                                                subjectId: selectSubject.name,
                                                userId: user.Student_id ? user.Student_id : user.Teacher_id,
                                                reply: threadData ? threadData.Thread_id : ''
                                            })
                                                .then(res => {
                                                    setThreadF([...threadF, res.data[0]])
                                                    api.post('/teacher/image',{
                                                        filePath: res.data[0].File_Path
                                                    })
                                                    .then(res2 => {
                                                        var blob = b64toBlob(res2.data, "image/*")
                                                        var blobUrl = URL.createObjectURL(blob);
                                                        setImgBlob([...imgBlob,blobUrl])
                                                    })
                                                    .catch(err2 => console.log(err2))
                                                })
                                                .catch(err => console.log(err))
                                        }
                                    }
                                }}
                                onprocessfiles={() => setAvailableBtn(true)}
                                credits={false}
                                labelIdle={`ลากและวางรูปของคุณที่นี่ หรือ <span class="filepond--label-action">เลือก</span> สูงสุด ${4 - threadF.length} รูป`}
                            />
                        </Grid>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <Grid container justifyContent='space-between'>
                        {availableBtn ? 
                        files.length === 0 ?
                            <Button color='secondary' onClick={() => {
                                if(mode === 1){
                                    setFiles([]);
                                    setAddImgModal(false);
                                    setMode(0);
                                    setPostModal(true);
                                }
                                else{
                                    setFiles([]);
                                    setAddImgModal(false);
                                    setShowThread(true);
                                }
                            }}>ยกเลิก</Button>
                            :
                            <Button color='secondary' onClick={() => {
                                api.delete('/subject/cancelReplyImg',{
                                    data:{
                                        fileList: threadF
                                    }
                                })
                                .then(res => {
                                    if (res.data === 'canceled'){
                                        setThreadF([]);
                                        setImgBlob([]);
                                        setFiles([]);
                                        setAddImgModal(false);
                                        setShowThread(true);
                                    }
                                })
                                .catch(err => console.log(err))
                            }}>ยกเลิก</Button>
                        :
                        <Button disabled>ยกเลิก</Button>
                        }
                        {availableBtn ? 
                        files.length === 0 ?
                            <Button disabled>อัพโหลด</Button>
                            :
                            mode === 1 ?
                                <Button color='primary' onClick={() => {
                                        setFiles([]);
                                        // setImgBlob([]);
                                        setU(false);
                                        setAddImgModal(false);
                                        setMode(0)
                                        setPostModal(true);
                                }}>อัพโหลด</Button>
                                :
                                imgBlob.length === threadF.length ?
                                    <Button color='primary' onClick={() => {
                                            setFiles([]);
                                            // setImgBlob([]);
                                            setU(false);
                                            setAddImgModal(false);
                                            setShowThread(true);
                                    }}>อัพโหลด</Button>
                                    :
                                    <Button disabled>อัพโหลด</Button>
                        :
                        <Button disabled>อัพโหลด</Button>
                        }
                    </Grid>
                </Modal.Footer>
            </Modal>
        </div>
    );
}