import React, { useState } from 'react';
import Heartpredictcontext from './hearpredictcontext';

const Heartpredictstate = (props) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('auth-token') || null);
  const [role,setrole]=useState(localStorage.getItem('role')||null);
  const [details,setdetails]=useState(null);
  const Signupfun = async (credentials) => {
    const response = await fetch("http://localhost:5000/api/auth/Signup", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: credentials.role,
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
      })
    });
    const res = await response.json();
    setrole(credentials.role);
    if (res.success) {
      localStorage.setItem("auth-token", res.authToken);
      localStorage.setItem("role",res.role)
      setAuthToken(res.authToken); 
      setrole(res.role)

      return true; 
    }
    return false;
  }

  const Loginfun = async (credentials) => {
    const response = await fetch("http://localhost:5000/api/auth/Login", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      })
    });
    const res = await response.json();
    if (res.success) {
      localStorage.setItem("auth-token", res.authToken);
            localStorage.setItem("role",res.role)
            setrole(res.role)
      setAuthToken(res.authToken); 
      return true;
    }
    return false;
  };

  const Logoutfun = () => {
    localStorage.removeItem('auth-token');
          localStorage.removeItem("role")

    setAuthToken(null); 
    setrole(null);
  };
const Getuser = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/getuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });

      const res = await response.json();
      if (res.success) {
        const userData = {
          name: res.name || "",
          email: res.email || "",
          role: res.role || "",
          id:res.id||""
        };
        setdetails(userData);
        return true;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    return false;
  };
const Updatepass = async (credentials) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/resetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
           body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      })
      });

      const res = await response.json();

      if (res.success) {
        return true;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    return false;
  };
  return (
    <Heartpredictcontext.Provider value={{ Signupfun, Loginfun, Logoutfun, authToken,role,Getuser,details,Updatepass}}>
      {props.children}
    </Heartpredictcontext.Provider>
  );
}

export default Heartpredictstate;
