import React, { useState } from "react";
import swal from "sweetalert";

/* Get Login details */

async function loginUser(credentials) {
  // console.log(credentials)
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

function AdminLogin() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await loginUser({
      email,
      password,
      userType: 1
    });

    /* check if the data accessing has passed/ failed */
    // console.log(response)

    if (!response.error) {
      swal("Logged In", response.message, "success", {
        buttons: false,
        timer: 2000,
      }).then((value) => {
        localStorage.setItem("admin", true);
        localStorage.setItem("data", JSON.stringify(response["data"]));
        window.location.href = "/profile/dashboard";
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
            Admin Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
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
          <button type="submit" className="formFieldButton">
            LOGIN
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;
