import React from 'react'

function Footer() {
  return (
    <footer className="footer">
    <div className="container">
      <div className="row">
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#AboutUs">About Us</a></li>
            <li><a href="#Services">Our Services</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Follow Us</h4>
          <ul>
            <li><a href="#FB">Facebook</a></li>
            <li><a href="#TWT">Twitter</a></li>
            <li><a href="#INS">Instagram</a></li>
            <li><a href="#LNK">LinkedIn</a></li>
          </ul>
        </div>
      </div>
    </div>
    <p className="copyright"><small>&copy; Copyright YYYY, Gratia Technology</small></p>
  </footer>
  )
}

export default Footer