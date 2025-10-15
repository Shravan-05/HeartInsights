import React,{useContext, useEffect} from 'react';
import UserHealthDashboard from'./UserHealthDashboard.jsx';
import Hospitalanalysis from './Hospitalanalysis.jsx';
import Heartpredictcontext from '../Context/hearpredictcontext.jsx';
const Overallhealthanalysis = () => {
    const context=useContext(Heartpredictcontext);
  return (
    <>
    <div style={{minHeight:'60vh'}}>
         <Hospitalanalysis/>
 <UserHealthDashboard/>
 </div>
    </>
  )
}

export default Overallhealthanalysis
