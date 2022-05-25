import React from 'react'
import error404 from "../images/error1.jpg"

function Error404() {
  return (
      <center>
        <div>
            <img src={error404} className="error-img" alt=""/>
        </div>
      </center>
  )
}

export default Error404