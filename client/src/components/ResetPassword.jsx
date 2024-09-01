import React, { useState } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:3000/auth/reset-password/${token}`, {
        password,
      })
      .then((res) => {
        if (res.data.status) {
          setMessage(res.data.message);
          setTimeout(() => {
            navigate("/login");
          }, 3000); // Redirect after 3 seconds
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage(err.response?.data?.message || "An error occurred while resetting the password");
      });
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        <label htmlFor="password">New Password:</label>
        <input
          type="password"
          id="password"
          autoComplete="new-password"
          placeholder="Enter new password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {message && <div className="message">{message}</div>}
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;