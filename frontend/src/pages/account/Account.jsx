import React from "react";
import "./account.css";
import { MdDashboard } from "react-icons/md";
const Account = () => {
  return (
    <div>
      <div className="profile">
        <h2>My Profile</h2>
        <div className="profile-info">
          <p>
            <strong>Name - Kulshan Mehra</strong>
          </p>
          <p>
            <strong>Email - kulshanmehra@gmail.com</strong>
          </p>
          <button className="common-btn">
            <MdDashboard />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
