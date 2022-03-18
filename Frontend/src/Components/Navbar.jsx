import React, { useState } from "react";
import Modal from "./Modal";

function Navbar() {
  
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <nav className="header">
      <a href=" " className="home">
        GRATIA TECHNOLOGY
      </a>
      <ul class="nav__links">
        <li>
          <a href="#ContactUs">Contact Us</a>
        </li>
        <li>
          <a href="#About">About</a>
        </li>
      </ul>
      <button
        className="openModalBtn"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        LOGIN
      </button>
      {modalOpen && <Modal setOpenModal={setModalOpen} />}
    </nav>
  );
}

export default Navbar;
