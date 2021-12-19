import * as react from 'react';
import {BrowserRouter as Router, Switch,Route,Redirect} from 'react-router-dom';
import Appbar from './components/Appbar';
import {userContext} from './userContext';
import Home from './components/Home'
import Login from './components/Login';
import Class from './components/Class';
import School from './components/School';
import Parent from './components/Parent';
import './App.css';
import axios from 'axios';
import { selectSubjectContext } from './components/selectSubjectContext';
import {socketContext} from './socketContext';
import socketIOClient from 'socket.io-client';
require('dotenv').config()

export default function App() {
  const ngrok = process.env.REACT_APP_NGROK_URL;
  const api = axios.create({ baseURL: ngrok })

  const [user,setUser] = react.useState([]);
  const homeRef = react.useRef(null);
  const classRef = react.useRef(null);
  const schoolRef = react.useRef(null);
  const parentRef = react.useRef(null);
  const [socket,setSocket] = react.useState(null);
  
  const [selectSubject, setSelectSubject] = react.useState(null);

  function getdata(){
    api.get('/',{
      headers : {
        'auth-token':localStorage.getItem('auth-token')
      }
    }).then(
      (result) => {
        setUser(result.data[0])
       }
    ).catch(err => {console.error(err)})
  }
  
  react.useEffect(() => {
    if(localStorage.getItem('auth-token') !== null){
      setSocket(socketIOClient(process.env.REACT_APP_NGROK_URL, {
        query: `token=${localStorage.getItem('auth-token')}`
      }))
      getdata()
    }
  },[])


  return(
    <div className='main'>
    <Router>
      <userContext.Provider value={{user,setUser}}>
      <selectSubjectContext.Provider value={{selectSubject,setSelectSubject}}>
      <socketContext.Provider value={{socket}}>
        <Appbar/>
        <Switch>
          <Route exact path="/login">
            {localStorage.getItem('auth-token') ? 
            <Redirect to='/home'/>
          :
          <Login/>
          }
            
          </Route>
          <Route exact path='/home'>
            <Home forwardedRef={homeRef}/>
            {/* {localStorage.getItem('auth-token') ? 
            :
            <Redirect to='/login'/>
            } */}
          </Route>
          <Route exact path='/studentWork'>
            <Class forwardedRef={classRef}/>
            {/* {localStorage.getItem('auth-token') ? 
            :
            <Redirect to='/login'/>
            } */}
          </Route>
          <Route exact path='/school'>
            <School forwardedRef={schoolRef}/>
            {/* {localStorage.getItem('auth-token') ? 
            :
            <Redirect to='/login'/>
            } */}
          </Route>
          <Route exact path='/parent'>
            <Parent forwardedRef={parentRef}/>
            {/* {localStorage.getItem('auth-token') ? 
            :
            <Redirect to='/login'/>
            } */}
          </Route>
          <Route path='*'>
          {localStorage.getItem('auth-token') ? <Redirect to='/home'/> : <Redirect to='/login'/>}
          </Route>
        </Switch>
      </socketContext.Provider>
      </selectSubjectContext.Provider>
      </userContext.Provider>
    </Router>
    </div>
  );
}
