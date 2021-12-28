import react from "react";
import { Modal } from 'react-bootstrap';
import {TextField,Button,Grid} from '@material-ui/core'
import Link from '@mui/material/Link';
import axios from "axios";
import '../App.css'
import {AccountCircle} from '@material-ui/icons';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import logo from '../bgImg/image 9.png'
import { blue } from "@mui/material/colors";
require('dotenv').config()

export default function Login(){
    const ngrok = process.env.REACT_APP_NGROK_URL;
    const api = axios.create({ baseURL: ngrok })

    const userInputRef = react.useRef(null);
    const submitLogin = react.useRef(null);

    const [show, setShow] = react.useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // const {student,setStudent} = react.useContext(userContext);
    const [token,setToken] = react.useState(null);

    const Login = (id,pw) => {
        api.post('login',{
            User_id : id,
            User_password : pw
        }).then((result) => {
            if (result.data){
                setToken(result.data);
                window.location.replace('/home');
                localStorage.setItem('auth-token',result.data);
            }
            else{
                alert("invalid id or password");
                userInputRef.current.focus();
            }
        }).catch(err => {
            console.error(err)
        })
    }
    react.useEffect(() => {
    const data = localStorage.getItem('auth-token');
        try{
            if(data){
                setToken(data);
            }
        }catch(err){
            console.error(err)
        }
    },[token]);

    const [userId,setUserId] = react.useState("")
    const [userPassword,setUserPassword] = react.useState("")
    const stidhandle = (e) => {
        setUserId(e.target.value);
    }
    const stpwhandle = (e) => {
        setUserPassword(e.target.value);
    }
    const submit = () => {
        Login(userId,userPassword)
    }
    return(
        <div className='loginContainer'>
            <div className='login'>
                <Grid container justifyContent='space-around'>
                    <Grid item xs={5}>
                        <img src={logo} alt='school logo' style={{height:'55vh',width:'40vw',marginTop:'-2.5rem'}} />
                        <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: '2rem', paddingTop: '1.5rem', fontSize: '24px' }}>
                            <b style={{ color: '#FFD72B' }}>T</b><b style={{ color: blue[400] }}>K</b> <b style={{color:'white'}}>&nbsp; Online Center</b>
                        </div>
                    </Grid>
                    <Grid item xs={5}>
                        <div className='loginBox'>
                            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '1.5rem'}}>
                                <h2 style={{color:'#1B5ABC', fontWeight:'bold'}}>ยินดีต้อนรับเข้าสู่ระบบ</h2>
                            </div>
                            <Grid container style={{paddingBottom:'1.5rem'}}>
                                <Grid item xs={2} style={{marginTop:'4vh'}}>
                                    <AccountCircle style={{ fontSize: 36, color:'white' }}/>
                                </Grid>
                                <Grid item xs={10}>
                                    <TextField inputRef={userInputRef} style={{marginTop:'16px',width:'100%'}} label="เลขประจำตัว" type='text' value={userId} onKeyPress={(e) => e.key === 'Enter' && submitLogin?.current.click()} onChange={stidhandle}/>
                                </Grid>
                            </Grid>
                            <Grid container style={{ paddingBottom: '2rem' }}>
                                <Grid item xs={2} style={{ marginTop: '4vh' }}>
                                    <VpnKeyIcon style={{ fontSize: 36, color: 'white' }}/>
                                </Grid>
                                <Grid item xs={10}>
                                    <TextField style={{ marginTop: '16px', width: '100%' }} label="รหัสผ่าน" type='password' value={userPassword} onChange={stpwhandle} onKeyPress={(e) => e.key === 'Enter' && submitLogin?.current.click()}/>
                                </Grid>
                            </Grid>
                            <Grid container style={{ paddingBottom: '1.5rem' }}>
                                <Button ref={submitLogin} style={{marginTop:'16px',backgroundColor:'#1B5ABC',color:'white',width:'100%',borderRadius:'50px'}} variant="contained" onClick={submit}><b>เข้าสู่ระบบ</b></Button>
                            </Grid>
                            <div style={{ marginTop: '16px', width: '100%', justifyContent: 'center', display: 'flex', paddingBottom: '0.5rem' }}><Link href="#" underline="hover" onClick={handleShow}>ลืมรหัสผ่าน</Link></div>
                        </div>
                    </Grid>
                </Grid>
            </div>

            <div>
                <Modal
                    centered
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    backdropClassName="modal"
                >
                    <Modal.Header>
                        <Modal.Title>ลืมเลขประจำตัวหรือรหัสผ่าน</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p style={{display:'flex',justifyContent:'center'}}>หากลืมเลขประจำตัวหรือรหัสผ่าน 
                        กรุณาติดต่อเจ้าหน้าที่</p>
                        <p style={{ display: 'flex', justifyContent: 'center' }}>เบอร์ 0xx-xxx-xxxx</p>
                        <p style={{ display: 'flex', justifyContent: 'center' }}>หรืออีเมล Help@mail.com</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{ marginTop: '16px', backgroundColor: '#1B5ABC', color: 'white', width: '100%', borderRadius: '50px' }} variant="contained" onClick={handleClose}>
                            ตกลงและปิดหน้าต่างนี้
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}