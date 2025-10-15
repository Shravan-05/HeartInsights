import {React,useContext,useEffect} from 'react'
import '../STYLE/Fotter.css'
import { useNavigate } from "react-router-dom";
import Heartpredictcontext from '../Context/hearpredictcontext';
const Fotter = () => {
      let history=useNavigate();
      const context=useContext(Heartpredictcontext);
useEffect(() => {
    if (!context.authToken) {
      history("/Login");
    }
  }, []);

  if (!context.authToken) {
    return null; 
  }
  
  return (
    <div id="fotterparent">
        <div id='fotter1'>
            <div id="logodesp">
                <h2>HeartPredict</h2>
                <p>Advanced heart disease
prediction tor better heatth outcomes.</p>
            </div>
            <div id="quicklinks">
            <h2>Quick Links</h2>
      <ul id="navs1">
        <li><a href="#" className='atag'>Home</a></li>
        <li><a href='#' className='atag'>Dashboard</a></li>
        <li><a href='#' className='atag'>Prediction</a></li>
        <li><a href='#' className='atag'>ResultsHistory</a></li>
        <li><a href='#' className='atag'>AI Agent</a></li>
        <li><a href='#' className='atag'>About</a></li>
      </ul>
            </div>
                  <div id="support">
            <h2>Support</h2>
      <ul id="navs1">
        <li><a href="#" className='atag'>Help Center</a></li>
      </ul>
            </div>
                <div id="followus">
            <h2>Follow Us</h2>
            <img src='https://cdn-icons-png.flaticon.com/128/3670/3670147.png' className='fottericon'/>
                        <img src='https://cdn-icons-png.flaticon.com/128/5968/5968958.png' className='fottericon'/>
            <img src='https://cdn-icons-png.flaticon.com/128/4138/4138124.png' className='fottericon'/>

            </div>
        </div>
          
         <div id='fotter2'>
<p>2025 HeartPredict. An rights reserved | Medical Al Technology</p>
        </div>
    </div>
  )
}

export default Fotter
