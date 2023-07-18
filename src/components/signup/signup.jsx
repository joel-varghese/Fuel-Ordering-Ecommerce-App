import React, { useState } from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { createBrowserHistory } from 'history'
import logo from '../../assets/images/barrel_fuel_logo.png'
import './signup.scss';
import Input from '../input/input';
import Checkbox from '../checkbox/checkbox';
import Nav from 'react-bootstrap/Nav';
import CollapseMenuIcon from '../../assets/images/collapse_arrow.svg';

import Header from '../header/header';
import MobileHeader from '../mobileHeader/mobileHeader';
function Signup() {
    const history = createBrowserHistory({forceRefresh:true});
    const navigate = useNavigate();


  return (
    <div className='d-flex d-flex-column login-section signup-container bf-signup-section'>
        <Header isLoggedIn={false}  styleClass="bf-no-links bf-logo-center bf-absolute"/>
        <Nav.Link href={'./'} className='bf-home-anchor'>Home</Nav.Link>
        <MobileHeader name="Sign Up" />
        <Nav.Link href={'./login'} className='bf-home-anchor mobile-home'>
            <img src={CollapseMenuIcon} /> Home
        </Nav.Link>
        <div className='d-flex align-items-center d-flex-row bf-100vh'>
            <div className="w-50p login-form d-flex align-items-center d-flex-column fbo-enroll-signup-sec">
                <div className='d-flex align-items-center justify-content-center d-flex-column'>
                    <h1>FBO</h1>
                    <div className='bf-info-text'>Are you looking to sell fuel?</div>
                    <div className='signup-text'>
                        <Nav.Link href='./fbo-enrollment' className='btn btn-primary'>Sign Up</Nav.Link>
                    </div>
                </div>
            </div>
            <div className="w-50p login-form d-flex align-items-center d-flex-column operator-enroll-signup-sec">
            <div className='d-flex align-items-center justify-content-center d-flex-column'>
                    <h1>OPERATOR</h1>
                    <div className='bf-info-text'>Are you looking to purchase fuel?</div>
                    <div className='signup-text'>
                        <Nav.Link className='btn btn-primary' href='./operator-enrollment'>Sign Up</Nav.Link>
                    </div>
                </div>
            </div>
        </div>
        <div className='copy-right-sec bf-absolute'>
            <span>Copyright © 2022 Barrel Fuel</span>
        </div>
    </div>
  );
}

export default Signup;