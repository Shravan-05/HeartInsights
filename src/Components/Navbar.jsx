import React, { useState,useEffect,useContext } from 'react'
import '../STYLE/Navbar.css'
import {
  Link
} from "react-router-dom";
import Heartpredictcontext from '../Context/hearpredictcontext';

const Navbar = (props) => {
 
  const context= useContext(Heartpredictcontext);

  return (
<nav id="topnav" className={`${context.authToken ? '' : 'bgblue'}`}>
      <div id="logo">
        <p id="logoname">HeartInsight</p>
      </div>
      
      <input type='checkbox' id="check"/>
              {context.authToken ? (
      <ul id="navs">
        <li className='li'><Link to="/" className='a'>Home</Link></li>
      <li className="li"><Link to="/dashboard" className="a">Dashboard</Link></li>
      <li className="li"><Link to="/Prediction" className="a">Prediction</Link></li>
      <li className="li"><Link to="/ResultHistory" className="a">ResultsHistory</Link></li>
      <li className="li"><Link to="/Aiagent" className="a">AI Agent</Link></li>
      <li className="li"><Link to="/About" className="a">About</Link></li>
      </ul>

  ):<>
      <div className="auth-links">
  <Link to="/Login" className="btn-login">Login</Link>
  <Link to="/Signup" className="btn-signup">Signup</Link>
</div>

  </>}

{context.authToken && (

      <div id="user-profile">
            <div id="menubars">
        <label htmlFor="check"><img src='https://cdn-icons-png.flaticon.com/512/1828/1828859.png' id="open" alt="Open menu"/></label>
        <label htmlFor="check"><img src='https://cdn-icons-png.flaticon.com/128/10412/10412365.png' id="close" alt="Close menu"/></label>
      </div>

<img 
  src="https://cdn-icons-png.flaticon.com/128/3177/3177440.png" 
  alt="User Avatar" 
  className="avatar"
/>

          <div id="drop-down">
      <Link to='/profile'  className='dropa' >Profile</Link>
<Link to='/Login' className='dropa'  onClick={() => {
    context.Logoutfun(); 
    history("/login");  
    props.setpopupfun({ msg: 'Logout Successfully',type: "success" });

  }}>
  Logout
</Link>
    </div>
      </div>
)}

    </nav>
  )
}

export default Navbar