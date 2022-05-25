import React, { useState } from "react";
import swal from "sweetalert";

/* Get data from API endpoint */

async function loginUser(credentials) {
  const URL = window.location.href.startsWith("http://localhost")
    ? "http://localhost:5000/api/rol/login"
    : " /api/rol/login";
  return fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

function EmployeeLogin() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await loginUser({
      email,
      password,
    });

    /* check if the data accessing has passed/ failed */

    if (!response.error) {
      swal("Logged In", response.message, "success", {
        buttons: false,
        timer: 2000,
      }).then((value) => {
        localStorage.setItem("admin", false);
        localStorage.setItem("data", JSON.stringify(response["data"]));
        window.location.href = "/profile/employeedashboard";
      });
    } else {
      swal("Login Failed", response.message, "error");
    }
  };

  return (
    <div className="formCenter">
      <form className="formFields" onSubmit={handleSubmit} method="POST">
        <div className="formField">
          <label className="formFieldLabel" htmlFor="email">
            Employee Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            id="email"
            className="formFieldInput"
            placeholder="Enter your email"
            name="email"
            required
          />
        </div>

        <div className="formField">
          <label className="formFieldLabel" htmlFor="password">
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            className="formFieldInput"
            placeholder="Enter your password"
            name="password"
            required
          />
        </div>

        <div className="formField">
          <button className="formFieldButton">LOGIN</button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeLogin;
