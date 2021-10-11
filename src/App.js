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
import {selectSubjectContext} from './components/selectSubjectContext';


export default function App() {
  const api = axios.create({
    baseURL: 'http://localhost:3001/',
  });

  const [user,setUser] = react.useState([]);
  const homeRef = react.useRef(null);
  const classRef = react.useRef(null);
  const schoolRef = react.useRef(null);
  const parentRef = react.useRef(null);
  
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
      getdata()
    }
    else{
      console.log('login')
    }
  },[])

  //add route for submit work

  return(
    <div className='main'>
    <Router>
      <userContext.Provider value={{user,setUser}}>
      <selectSubjectContext.Provider value={{selectSubject,setSelectSubject}}>
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
          {localStorage.getItem('auth-token') ? 
          <Home forwardedRef={homeRef}/>
          :
          <Redirect to='/login'/>
          }
        </Route>
        <Route exact path='/class'>
          {localStorage.getItem('auth-token') ? 
          <Class forwardedRef={classRef}/>
          :
          <Redirect to='/login'/>
          }
        </Route>
        <Route exact path='/school'>
          {localStorage.getItem('auth-token') ? 
          <School forwardedRef={schoolRef}/>
          :
          <Redirect to='/login'/>
          }
        </Route>
        <Route exact path='/parent'>
          {localStorage.getItem('auth-token') ? 
          <Parent forwardedRef={parentRef}/>
          :
          <Redirect to='/login'/>
          }
        </Route>
        <Route path='*'>
        {localStorage.getItem('auth-token') ? <Redirect to='/home'/> : <Redirect to='/login'/>}
        </Route>
      </Switch>
      </selectSubjectContext.Provider>
      </userContext.Provider>
    </Router>
    </div>
  );
}
