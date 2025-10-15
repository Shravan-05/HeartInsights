import React, { useState,useContext } from "react";
import "../STYLE/auth.css";
import Heartpredictcontext from "../Context/hearpredictcontext";
import { useNavigate } from "react-router-dom";


export default function Forget(props) {
      const context = useContext(Heartpredictcontext);
const history=useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,         
      [name]: value,  
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const success = await context.Updatepass(inputValue);
  if (success) {
    history('/login'); 
                  props.setpopupfun({ msg: 'Successfully Updated password',type: "success" });

  } else {
              props.setpopupfun({ msg: 'Invalid Credentials',type: "danger" });
  }
  setInputValue({email:"",password:""});
};


  return (
    <div className="container">
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>

      <div className="login-box">
        <div className="logo">
          <i className="fa-solid fa-heart-pulse"></i>
        </div>
        <h2 className="loginheader">Heart Prediction Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="email"
              required
              placeholder="Email"
              name="email"
              onChange={changeHandler}
              value={inputValue.email}
            />
            <i className="fa-solid fa-envelope logicon"></i>
          </div>

          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              name="password"
              onChange={changeHandler}
              value={inputValue.password}
            />
            <i
              className={`fa-solid ${
                showPassword ? "fa-eye-slash" : "fa-eye"
              } logicon`}
              onClick={togglePassword}
              style={{ cursor: "pointer" }}
            ></i>
          </div>

          <button type="submit" className="btn">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
