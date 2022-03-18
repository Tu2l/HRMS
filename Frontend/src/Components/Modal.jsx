import React from "react";
import "./Modal.css";

function Modal({ setOpenModal }) {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="login-box">
          <h3>Login</h3>
        </div>
        <form>
          <div class="user-box">
            <input type="text" name="" required />
            <label>Username</label>
          </div>
          <div class="user-box">
            <input type="password" name="" required />
            <label>Password</label>
          </div>
          <button className="style-btn"
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            CANCEL
          </button> &nbsp; &nbsp; &nbsp;
          <button className="style-btn">SUBMIT</button>
        </form>
      </div>
    </div>
  );
}

export default Modal;
