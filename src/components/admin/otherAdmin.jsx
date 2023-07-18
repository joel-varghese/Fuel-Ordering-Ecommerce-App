import React, { useState } from 'react';

import ButtonComponent from '../button/button';
import {Link, withRouter} from 'react-router-dom';
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { createBrowserHistory } from "history";
import Header from '../header/header';

const history = createBrowserHistory({forceRefresh:true})


const OtherAdminSignup = props => {
  const adminSignupList = [
    {
        label: 'PAGE UNDER CONSTRUCTION',
        navLink: '/add-additional-user'
    }
  ]
  const naviLinkTo = (link) => {
    history.push(link);
  };
  return (
    <>
    <Header styleClass='bf-admin-landing-page' isLoggedIn={true}/>
    <div className="mb-3 admin-signup d-flex align-items-center justify-content-center">
        
            {adminSignupList.map((item) => 
              <p>{item.label}</p>      
                
                    
            )}
        
    </div>
    <div className="d-flex align-items-center justify-content-center">Copyright © 2022 Barrel Fuel</div>
    </>
  );
}
export default OtherAdminSignup;
