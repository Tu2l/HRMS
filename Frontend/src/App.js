import React, { useState } from "react";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Cards from "./Components/Cards";
import BodyContainer from "./Components/BodyContainer";
import Modal from "./Components/Modal";
import { Link } from "react-router-dom";
import "./index.css";

function App() {

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="App">
      
      {/* Navbar Links */}
      
      <nav className="header">
        <a href=" " className="home">
          GRATIA TECHNOLOGY
        </a>
        <ul className="nav__links">
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
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

      {/* Different components of the page rendered here */}

      <Header />
      <Cards />
      <BodyContainer />
      <Footer />
    </div>
  );
}

export default App;
