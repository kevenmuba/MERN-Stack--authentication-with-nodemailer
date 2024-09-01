import React, { useState } from "react";
import "../App.css";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  
  const navigate = useNavigate()
/*
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/auth/forgot-password", {
      email
      
    }).then(res => {
      if(res.data.status) {
        alert(' check your email link')
        console.log('check your email link')
        navigate('/login')

      }else {
        alert(res.data.message); // Show error message if any
      }
     
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  };*/
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/auth/forgot-password", {
        email,
      })
      .then((res) => {
        if (res.data.status) {
          setMessage(res.data.message);
          alert(res.data.message);
          console.log(res.data.message);
          navigate("/login");
        } else {
          setMessage(res.data.message); // Show error message if any
          console.log(res.data)
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage("An error occurred while sending the reset link");
      });
  };
  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>
        <label htmlFor="email">email:</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        {message && <div className="message">{message}</div>}
        <button type="submit">Send</button>
       
      </form>
    </div>
  )
}

export default ForgotPassword
