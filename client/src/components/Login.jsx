import React, { useState } from "react";
import "../App.css";
import axios, { Axios } from "axios";
import { Link, useNavigate } from "react-router-dom";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/auth/Login", {
      email,
      password,
    }).then(res => {
      if(res.data.status) {
        navigate('/')

      }
     
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  };
  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label htmlFor="email">email:</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">password:</label>
        <input
          type="password"
          placeholder="***"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link to={'/forgotpassword'}>forgot password?</Link>
        <button type="submit">Login</button>
        <p>don't Have an account?</p> <Link to={'/signup'}>signup</Link>
      </form>
    </div>
  );
}

export default Login;
