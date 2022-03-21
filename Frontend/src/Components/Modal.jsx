import React, {useState} from "react";
import "./Modal.css";
import swal from 'sweetalert';

/* Get data from API endpoint */

// const url = window.location.href.toString().contains("localhost")?'http://localhost:5000/api/rol/login': '/api/rol/login';

async function loginUser(credentials) {
  return fetch('/api/rol/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
 }

 /*Login logic here for the Login Popup Modal*/

export default function Modal({ setOpenModal }) {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await loginUser({
      email,
      password
    });

    /* check if the data accessing has passed/ failed */

    if (!response.error) {
      swal("Logged In", response.message, "success", {
        buttons: false,
        timer: 2000,
      })
      .then((value) => {
        localStorage.setItem('data', JSON.stringify(response['data']));
        window.location.href = "/profile";
      });
    } else {
      swal("Login Failed", response.message, "error");
    }
  }


  return (

    /* Login Form */

    <div className="modalBackground">
      <div className="modalContainer">
        <div className="login-box">
          <h3>Login</h3>
        </div>
        <form onSubmit={handleSubmit} method="POST">
          <div className="user-box">
            <input
              onChange={e => setEmail(e.target.value)}
              type="text"
              id="email"
              name="email"
              required
            />
            <label>Email</label>
          </div>
          <div className="user-box">
            <input
              onChange={e => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              required
            />
            <label>Password</label>
          </div>
          <button
            className="style-btn"
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            CANCEL
          </button>{" "}
          &nbsp; &nbsp; &nbsp;
          <button className="style-btn">SUBMIT</button>
        </form>
      </div>
    </div>
  );
}
