import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Profile from "./Components/Profile";
import Error404 from "./Components/Error404";
import Payslip from "./Components/pages/Payslip";
import AdminLogin from "./Components/pages/AdminLogin";
import EmployeeLogin from "./Components/pages/EmployeeLogin";

const rootElement = document.getElementById("root");

/* Check if login was successful, only on finding the logCheck the user will be successfully routed */

const logCheck = localStorage.getItem("data");

render(
  /* Routes to different Links */

  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/payslip/*" element={<Payslip />} />
        <Route path="/" element={<App />}>
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/employeelogin" element={<EmployeeLogin />} />
        </Route>

        {/* check for the profile route done here */}

        {logCheck ? (
          <Route path="/profile/*" element={<Profile />} />
        ) : (
          <Route path="/" element={<App />} />
        )}

        {/* route for random/ wrong URLs */}

        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  rootElement
);
