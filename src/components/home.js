import { Link } from 'react-router-dom';
import './home.scss';
import React, { useState,useEffect } from 'react';
import logo from '../assets/images/barrel_fuel_logo.png'
import Footer from './Footer';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { bfaJsonService } from '../actions/BFAServices/BFAJsonService';
import Header from './header/header';
import { Storage } from '../controls/Storage';


function Home(){


  const [isBusy, setBusy] = useState(true)
  const params = {"blobname":"home.json"}
  const [homedata, sethomedata] = useState({})

  useEffect(() => {
    var element = document.querySelector('.grecaptcha-badge');
    if(element) {
      element.parentNode.removeChild(element);
    }
    Storage.removeItem('jwtToken')
    Storage.removeItem('noOfAircrafts')
    Storage.removeItem('selectedUserType')
    Storage.removeItem('accessLevel')
    Storage.removeItem('selectedTab')
    Storage.removeItem('organizationId')
    Storage.removeItem('jwtToken')
    Storage.removeItem('noOfAircrafts')
    Storage.removeItem('jwtToken')
    Storage.removeItem('noOfAircrafts')
    bfaJsonService(params).then(response => {
        setBusy(false)
        sethomedata(response.data)
    })
}, [])

  const handleClick = (e) => {
        
  }

const getHomeFields = (item) => {
  switch(item.type.toUpperCase()) {
    case "LINK":
      return(
        <span 
        onClick={()=>handleClick(item.path)}>{item.label}
        </span>
      )
  }
}


return (
  <div className="home-container">
            {/* <img src={logo} alt="Barrel Fuel Logo" className='login-logo'/>
            
            {isBusy ? (
            <p>Loading</p>
            ) : ( 
              <>
              {homedata.headers.menutabs.map((item) => (
                      getHomeFields(item)                                      
              ))}
            </>
            )} */}
            <div className='home-screen'>
              <Header styleClass='bf-landing-page'/>
            </div>

            
  </div>
);
}
export default Home