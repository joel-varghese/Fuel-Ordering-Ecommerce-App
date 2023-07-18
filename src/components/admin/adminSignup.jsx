import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { Storage } from '../../controls/Storage';
import Header from '../header/header';
import Loader from '../loader/loader';

const AdminSignup = props => {
  const [isBusy, setBusy] = useState(true);
  /* const [currentUserRole , setCurrentUserRole] = useState();
  const [storageOrgName , setStorageOrgName] = useState(Storage.getItem('organizationName')); */
  const [currentUserRole , setCurrentUserRole] = useState(Storage.getItem('userType'));
//   window.onbeforeunload = function () {
//         clearStorage();
//  }

  const userRoleArr = { 
    "Barrel Fuel": ["BF Admin", "BF Super Admin"],
    "FBO": ["FBO Super Admin", "Admin"],
    "Operator": ["Operator Admin", "Operator Super Admin"],
  };

  const adminSignupList = [
    {
        label: 'Admin Sign Up',
        name: 'adminSignUp',
        isAccessible: false,
        navLink: '/admin-signup'
    },
    {
        label: 'Operator Sign Up',
        name: 'OperatorSignUp',
        isAccessible: false,
        navLink: '/operator'
    },
    {
        label: 'FBO Sign Up',
        name: 'fboSignUp',
        isAccessible: false,
        navLink: '/fbo'
    },
    {
        label: 'Add Additional Users',
        name: 'additionalUsers',
        isAccessible: true,
        navLink: '/admin-user-signup'
    }
  ];
  const [adminList, setAdminList] = useState(adminSignupList);
  useEffect(() => {
    getLoginData();
    setBusy(false);
  },[]);

  const clearStorage = () => {
    Storage.clear();
  }

  const getLoginData = () => {
    if(currentUserRole == "Barrel Fuel"){
    /* let currRole;
    currRole = getUserRole();
    if(currRole == "Barrel Fuel"){ */
      let currList = adminList;
      currList.forEach(item => {
        item.isAccessible = true
      })
      setAdminList(currList);
    }
    
  };

  const getUserRole = () => {
    let storageUserRole = Storage.getItem('userRoles');
    storageUserRole = storageUserRole && JSON.parse(storageUserRole);
    let loginUserRole = storageUserRole && storageUserRole.length ? storageUserRole[0] : "";
    let currRole;
    if(loginUserRole) {
      for(let property in userRoleArr){
        let roleArray = userRoleArr[property];
        roleArray.forEach(role => {
          if(role === loginUserRole){
            setCurrentUserRole(property);
            currRole = property;
          }
        })
      }
    }
    return currRole;
  };
  let navigate = useNavigate();
  
  const navLinkTo = (item) => {
    /* if(item.name === "additionalUsers"){
      navigate(item.navLink, { state: { currentUserRole: currentUserRole, storageOrgName: storageOrgName} })
    }
    else  */navigate(item.navLink)
  };
  return (<>
    {isBusy ? (<Loader />) : (<>
    <Header styleClass='bf-admin-landing-page' isLoggedIn={true} userType = {currentUserRole}/>
    <div className="mb-3 admin-signup d-flex align-items-center justify-content-center">
        <ButtonGroup className='d-flex align-items-center justify-content-center d-flex-column'>
            {adminList.map((item) => 
                   item.isAccessible ?  <Button className="btn btn-signup" onClick = {()=>{navLinkTo(item)}}>
                        {item.label}
                    </Button> : null
            )}
        </ButtonGroup>
    </div>
    <div className="d-flex align-items-center justify-content-center">Copyright © 2022 Barrel Fuel</div>
    </>)
  }
  </>
  );
}
export default AdminSignup;
