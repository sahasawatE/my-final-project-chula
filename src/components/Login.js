import react from "react";
// import { userContext } from "../userContext";
import {TextField,Button,Grid} from '@material-ui/core'
import axios from "axios";
import '../App.css'
import {AccountCircle} from '@material-ui/icons';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
require('dotenv').config()

export default function Login(){
    const ngrok = process.env.REACT_APP_NGROK_URL;
    const api = axios.create({ baseURL: ngrok })

    const userInputRef = react.useRef(null);

    // const {student,setStudent} = react.useContext(userContext);
    const [token,setToken] = react.useState(null);

    const Login = (id,pw) => {
        api.post('login',{
            User_id : id,
            User_password : pw
        }).then((result) => {
            if (result.data){
                setToken(result.data);
                window.location.replace('/');
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
        <div style={{backgroundImage: 'url(https://images.unsplash.com/photo-1506765515384-028b60a970df?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmFubmVyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80)'}} className='loginContainer'>
            <div className='login'>
                <div className='loginlogo'></div>
                <Grid container spacing={1} justifyContent="center" className='loginBox'>
                    <div>
                        <h2 style={{color:'#1B5ABC'}}>ยินดีต้อนรับเข้าสู่ระบบ</h2>
                    </div>
                    <Grid container>
                        <Grid item xs={2} style={{marginTop:'4vh'}}>
                            <AccountCircle style={{ fontSize: 36 }}/>
                        </Grid>
                        <Grid item xs={10}>
                            <TextField inputRef={userInputRef} style={{marginTop:'16px',width:'100%'}} label="เลขประจำตัว" type='text' value={userId} onChange={stidhandle}/>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={2} style={{ marginTop: '4vh' }}>
                            <VpnKeyIcon style={{ fontSize: 36 }}/>
                        </Grid>
                        <Grid item xs={10}>
                            <TextField style={{ marginTop: '16px', width: '100%' }} label="รหัสผ่าน" type='password' value={userPassword} onChange={stpwhandle}/>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Button style={{marginTop:'16px',backgroundColor:'#1B5ABC',color:'white',width:'100%'}} variant="contained" onClick={submit}><b>เข้าสู่ระบบ</b></Button>
                    </Grid>
                    <div style={{marginTop:'16px', width:'100%',justifyContent:'center',display:'flex'}}><p>ลืมรหัสผ่าน</p></div>
                </Grid>
            </div>
        </div>
    );
}