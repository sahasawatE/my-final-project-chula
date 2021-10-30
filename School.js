import react from 'react';
import { userContext } from '../userContext';
// import {BrowserRouter as Reouter,Route,Redirect} from 'react-router-dom';

export default function School({forwardedRef}){
    const {user} = react.useContext(userContext);

    const [show,setShow] = react.useState(false);
    const toggle = () => {
        setShow(!show);
    }

    return(
    <div ref={forwardedRef} className="App">
        {show ? <p>{JSON.stringify(user)}</p>  : <p>school</p>}
        <button onClick={toggle}>{show ? 'Hide' : 'Show'}</button>
    </div>        
    );
}
