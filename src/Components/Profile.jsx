import React, { useContext, useEffect } from "react";
import "../STYLE/profile.css";
import Heartpredictcontext from "../Context/hearpredictcontext";
import { useNavigate } from "react-router-dom";

const Profile = (props) => {
  const context = useContext(Heartpredictcontext);
  const { details, authToken, Getuser } = context;
const history=useNavigate();
  const { email = "", name = "", role = "" } = details || {};

  useEffect(() => {
    if (authToken) {
      Getuser();
    }
  }, [authToken, Getuser]);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">User Profile</h2>

        <div className="profile-field">
          <label>Name:</label>
          <p>{name || "Loading..."}</p>
        </div>

        <div className="profile-field">
          <label>Email:</label>
          <p>{email || "Loading..."}</p>
        </div>

        <div className="profile-field">
          <label>Role:</label>
          <p>{role || "Loading..."}</p>
        </div>

       <button
  className="logout-btn"
  onClick={() => {
    context.Logoutfun(); 
    history("/login");  
                      props.setpopupfun({ msg: 'Logout Successfully',type: "success" });
  }}
>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
