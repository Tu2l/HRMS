import React from 'react';
import avatar from './../images/avatar-main.png';

function Cards() {
  return (
    <ul class="cards">
    <li>
      <div class="card">
        <img src={avatar} class="card__image" alt="" />
        <div class="card__overlay">
          <p class="card__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?
          </p>
        </div>
      </div>
      <center>
        <h3 className="card-title">Services</h3>
      </center>
    </li>
    <li>
      <div class="card">
        <img src={avatar} class="card__image" alt="" />
        <div class="card__overlay">
          <p class="card__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?
          </p>
        </div>
      </div>
      <center>
        <h3 className="card-title">Services</h3>
      </center>
    </li>
    <li>
      <div class="card">
        <img src={avatar} class="card__image" alt="" />
        <div class="card__overlay">
          <p class="card__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?
          </p>
        </div>
      </div>
      <center>
        <h3 className="card-title">Services</h3>
      </center>
    </li>
    <li>
      <div class="card">
        <img src={avatar} class="card__image" alt="" />
        <div class="card__overlay">
          <p class="card__description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, blanditiis?
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