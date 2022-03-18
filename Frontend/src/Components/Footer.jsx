import React from 'react'

function Footer() {
  return (
    <footer class="footer">
    <div class="container">
      <div class="row">
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#AboutUs">About Us</a></li>
            <li><a href="#Services">Our Services</a></li>
          </ul>
        </div>
        <div class="footer-col">
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
    <p class="copyright"><small>&copy; Copyright YYYY, Gratia Technology</small></p>
  </footer>
  )
}

export default Footer