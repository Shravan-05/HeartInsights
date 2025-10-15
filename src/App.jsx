import Navbar from "./Components/Navbar";
import "./App.css";
import Home from "./Components/Home";
import {
  BrowserRouter as Router,
  RouterProvider,
  Route,
  Link,
  Routes,
  useNavigate,
} from "react-router-dom";
import Overallhealthanalysis from "./Components/Overallhealthanalysis";
import Fotter from "./Components/Fotter";
import Prediction from "./Components/Prediction";
import ResultHistory from "./Components/ResultHistory";
import Aiagent from "./Components/Aiagent";
import About from "./Components/About";
import Alert from "./Components/Alert";
import { useContext, useState } from "react";
import SinglePredictionOutput from "./Components/SinglePredictionOutput";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Heartpredictstate from "./Context/heartpredictstate";
import Heartpredictcontext from "./Context/hearpredictcontext";
import Profile from "./Components/Profile";
import Forget from "./Components/Forget";
function App() {
  const [popup, setpopup] = useState({ msg: "", type: "" });
  const context=useContext(Heartpredictcontext);
  return (
    <>
   <Router>
        <Navbar setpopupfun={setpopup}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Overallhealthanalysis />} />
          <Route
            path="/Prediction"
            element={<Prediction setpopupfun={setpopup} />}
          />
          <Route path="/ResultHistory" element={<ResultHistory />} />
          <Route path="/Aiagent" element={<Aiagent />} />
          <Route path="/About" element={<About setpopupfun={setpopup}/>} />
          <Route
            path="/SinglePredictionOutput"
            element={<SinglePredictionOutput />}
          />
          <Route path="/Login" element={<Login  setpopupfun={setpopup}/>} />
          <Route path="/Signup" element={<Signup  setpopupfun={setpopup}/>} />
          <Route path="/profile" element={<Profile details={context.details} setpopupfun={setpopup} />}/>
                    <Route path="/forget" element={< Forget setpopupfun={setpopup}/>}/>
        </Routes>
        <Alert popup={popup} setpopup={setpopup} />
<Fotter/>
      </Router>
   </>
  );
}

export default App;
