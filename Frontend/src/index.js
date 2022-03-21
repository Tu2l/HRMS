import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Profile from "./Components/Profile";

const rootElement = document.getElementById("root");

/* Check if login was successful, only on finding the logCheck the user will be successfully routed */

const logCheck = localStorage.getItem('data');

render(

  /* Routes to different Links */

  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />

      {/* check for the profile route done here */}
      
      {logCheck ? (<Route path="profile" element={<Profile />} />):(<Route path="/" element={<App />} />)}

      {/* route for random/ wrong URLs */}

      <Route
        path="*"
        element={
          <main style={{ padding: "1rem" }}>
            <p>There's nothing here!</p>
          </main>
        }
      />
    </Routes>
  </BrowserRouter>,
  rootElement
);
