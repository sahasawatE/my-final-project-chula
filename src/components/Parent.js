import react from 'react';
import { userContext } from '../userContext';
// import {BrowserRouter as Reouter,Route,Redirect} from 'react-router-dom';

export default function Parent({forwardedRef}){
    const {student} = react.useContext(userContext);

    const [show,setShow] = react.useState(false);
    const toggle = () => {
        setShow(!show);
    }

    return(
    <div style={{display:'flex',justifyContent:'center',paddingTop:'10vh',flexDirection:'column'}} ref={forwardedRef} className="App">
        {show ? <p>{JSON.stringify(student)}</p>  : <p>parent</p>}
        <button onClick={toggle}>{show ? 'Hide' : 'Show'}</button>
    </div>        
    );
}
