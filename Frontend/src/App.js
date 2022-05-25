import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AdminLogin from "./Components/pages/AdminLogin";
import EmployeeLogin from "./Components/pages/EmployeeLogin";
import "./App.css";
import "./index.css";
import logo from "./images/logo-gratia.png";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function App() {
  const [link, setLink] = React.useState("");
  const location = useLocation();

  useEffect(() => {
    const path = window.location.pathname.split("/");
    setLink(path[path.length - 1]);
  }, [location]);

  return (
    <div className="App">
      <div className="gratia">
        <img src={logo} alt="logo" width="100%" />
      </div>

      <div className="appAside" />
      <div className="appForm">
        <div className="gratia-mobile">
          <img src={logo} alt="logo" width="100%" />
        </div>
        <div className="pageSwitcher">
          <Link
            to="adminlogin"
            className={
              link === "adminlogin"
                ? "pageSwitcherItem pageSwitcherItem-active"
                : "pageSwitcherItem"
            }
          >
            Admin
          </Link>
          <Link
            to="/"
            className={
              link === ""
                ? "pageSwitcherItem pageSwitcherItem-active"
                : "pageSwitcherItem"
            }
          >
            Employee
          </Link>
        </div>

        <div className="formTitle">
          <Link
            to="adminlogin"
            className={
              link === "adminlogin"
                ? "formTitleLink formTitleLink-active"
                : "formTitleLink"
            }
          >
            Admin
          </Link>
          or
          <Link
            to="/"
            className={
              link === ""
                ? "formTitleLink formTitleLink-active"
                : "formTitleLink"
            }
          >
            Employee
          </Link>
        </div>
        <Routes>
          <Route path="/" element={<EmployeeLogin />} />
          <Route path="adminlogin" element={<AdminLogin />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
