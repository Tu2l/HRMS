import React from 'react';
import avatar from './../images/avatar-main.png';

function Cards() {
  return (
    <ul className="cards">
    <li>
      <div className="card">
        <img src={avatar} className="card__image" alt="" />
        <div className="card__overlay">
          <p className="card__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?
          </p>
        </div>
      </div>
      <center>
        <h3 className="card-title">Services</h3>
      </center>
    </li>
    <li>
      <div className="card">
        <img src={avatar} className="card__image" alt="" />
        <div className="card__overlay">
          <p className="card__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?
          </p>
        </div>
      </div>
      <center>
        <h3 className="card-title">Services</h3>
      </center>
    </li>
    <li>
      <div className="card">
        <img src={avatar} className="card__image" alt="" />
        <div className="card__overlay">
          <p className="card__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?
          </p>
        </div>
      </div>
      <center>
        <h3 className="card-title">Services</h3>
      </center>
    </li>
    <li>
      <div className="card">
        <img src={avatar} className="card__image" alt="" />
        <div className="card__overlay">
          <p className="card__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?
          </p>
        </div>
      </div>
      <center>
        <h3 className="card-title">Services</h3>
      </center>
    </li>
  </ul>
  )
}

export default Cards