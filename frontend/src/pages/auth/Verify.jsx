import React from "react";
import "./auth.css";
import { Link } from "react-router-dom";
const Verify = () => {
  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Verify Account</h2>
        <form>
          <label htmlFor="otp">OTP</label>
          <input type="number" required />
          <button className="common-btn">Verify</button>
        </form>
        <p>
          Go to <Link to="/login">Login Page</Link>
        </p>
      </div>
    </div>
  );
};

export default Verify;
