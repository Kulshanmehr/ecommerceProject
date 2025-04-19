import React from "react";
import "./home.css";
import Testimonials from "../../components/testimonials/Testimonials";
const Home = () => {
  return (
    <>
      <div className="home">
        <div className="home-content">
          <h1>Welcome to E-Learning Platform</h1>
          <p>Learn , Grow , Excel</p>
          <button className="common-btn" onClick={() => Navigate("/courses")}>
            Get Started
          </button>
        </div>
      </div>
      <Testimonials />
    </>
  );
};

export default Home;
