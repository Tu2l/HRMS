import React from "react";
import Navbar from "./Navbar";

function Header() {
  return (
    <div id="main">
      <Navbar />
      <div className="name">
          <h1 className="hero-h1"><span>HUMAN RESOURCE MANAGEMENT SYSTEM</span></h1><br />
          <a className="read-more" href="#hrms"><span>Read More</span></a>
      </div>
    </div>
  );
}

export default Header;