import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, { useState,useEffect } from 'react';
import './header.scss';

import logo from '../../assets/images/barrel_fuel_logo.png'
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { Storage } from '../../controls/Storage';
import { useLocation, useNavigate } from 'react-router-dom';
const Header = props => {

  const params = {"blobname":"home.json"}
  const [headerData, setheaderData] = useState({})
  let navigate = useNavigate();
  useEffect(() => {
    bfaJsonService(params).then(response => {
        setheaderData(response.data)
    })
  }, [])
  const clearStorage = () => {
    Storage.removeItem('jwtToken')
    navigate("/login")
  }
  const getNavLinks = (item) => {
    
    return <Nav.Link href={item.path} onClick ={() => { 
      if(item.label === "Log Out") {  
        clearStorage()
        
      }
    }
    }>{item.label}</Nav.Link>
  } 
  const getUserType = () => {
    if(props.userType){
      if(props.userType == "Barrel Fuel") return "Hi Admin!"
      else return "Hi "+props.userType+"!";
    }
  }
  return (
    <Navbar bg="light" expand="lg" className={`bf-header ${props.styleClass}`}>
      <Container fluid>
        <Navbar.Brand href={"./"} >
          <img src={logo} alt="Barrel Fuel Logo" className='login-logo'/>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="bf-flex-grow-initial">
          <Nav
            className="bf-nav-section my-lg-0"
            navbarScroll
          >
            {headerData.headers ?
              <div className='nav-menu'>
                {props.isLoggedIn ? 
                <div>
                  <div className='admin-name'>{getUserType()}</div>
                  {getNavLinks({path:'/login',label:'Log Out'})}
                </div> : 
                <>
                  {props.content ? 
                    <div className='nav-other-items'>
                      {props.content.map((item) => (
                        getNavLinks(item)                                      
                      ))}
                    </div>
                  :
                  <>
                    <div className='nav-items'>
                      {headerData.headers.menutabs.map((item) => (
                        getNavLinks(item)                                      
                      ))}
                    </div>
                    <div className='login-items'>
                      {headerData.headers.buttonTabs.map((item) => (
                        getNavLinks(item)                                      
                      ))}
                    </div> 
                  </>}
                </>}
              </div>: '' 
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;