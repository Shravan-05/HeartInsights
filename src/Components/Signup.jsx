import React, { useState, useContext,useEffect } from "react";
import "../STYLE/auth.css";
import Heartpredictcontext from "../Context/hearpredictcontext";
import { useNavigate } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
export default function Signup(props) {
  const context = useContext(Heartpredictcontext);
  const history = useNavigate();
  const [inputValue, setInputValue] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleCPassword = () => setShowCPassword((prev) => !prev);

  useEffect(() => {
      AOS.init({
        duration: 1200,
        once: true, 
      });
    }, []);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await context.Signupfun(inputValue);
    if (success) {
      history("/");
              props.setpopupfun({ msg: 'Signup Successfully',type: "success" });

    } else {
              props.setpopupfun({ msg: 'Invalid Credentials',type: "danger" });
    }
      setInputValue({role:"",name:"",email:"",password:"",cpassword:""});

  };

  return (
    <div className="container">
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>

      <div className="login-box" data-aos="zoom-in">
        <div className="logo">
          <i className="fa-solid fa-heart-pulse"></i>
        </div>
        <h2 className="loginheader">Create Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <select
              name="role"
              value={inputValue.role}
              onChange={changeHandler}
              required
            >
              <option value="">Select Role</option>
              <option value="Patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
            <i className="fa-solid fa-user-shield logicon"></i>
          </div>

          <div className="input-box">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={inputValue.name}
              onChange={changeHandler}
              required
            />
            <i className="fa-solid fa-user logicon"></i>
          </div>

          <div className="input-box">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={inputValue.email}
              onChange={changeHandler}
              required
            />
            <i className="fa-solid fa-envelope logicon"></i>
          </div>

          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={inputValue.password}
              onChange={changeHandler}
              required
            />
            <i
              className={`fa-solid ${
                showPassword ? "fa-eye-slash" : "fa-eye"
              } logicon`}
              onClick={togglePassword}
              style={{ cursor: "pointer" }}
            ></i>
          </div>

          <div className="input-box">
            <input
              type={showCPassword ? "text" : "password"}
              name="cpassword"
              placeholder="Confirm Password"
              value={inputValue.cpassword}
              onChange={changeHandler}
              required
            />
            <i
              className={`fa-solid ${
                showCPassword ? "fa-eye-slash" : "fa-eye"
              } logicon`}
              onClick={toggleCPassword}
              style={{ cursor: "pointer" }}
            ></i>
          </div>

          <button type="submit" className="btn">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
