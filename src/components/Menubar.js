import React, { useState, Fragment, useEffect } from 'react'
import { FaBars } from 'react-icons/fa';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import { createBrowserHistory } from 'history'
import {ButtonToolbar} from 'react-bootstrap'
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import {
Nav,
NavContainer,
NavLogo,
NavItem,
NavLinks,
NavMenu,
MobileIcon,
} from './MenubarStyles';
import './Menubar.css';
import Home from './home';
import Login from './login/login';
import Signup from './signup/signup';
import Dashboard from './dashboard/index';
import FboSignup from './fboSignup/fboSignup';
import Admin from './admin/admin';
import OtherAdminSignup from './admin/otherAdmin';
import AdminSignupForm from './admin/adminSignupForm';
import FboSignupForm from './fboSignup/FboSignupForm';
import AdminAddUser from './admin/adminAddUser';
import Company from './account/company';
import User from './account/user';
import SearchUser from './universalSearch/users';
import SearchAircraft from './universalSearch/aircrafts';
import SearchCompany from './universalSearch/companies';
import SearchOrder from './universalSearch/orders';
import axios from 'axios';
import {Storage} from '../controls/Storage';
import OperatorEnrollmentForm from './operatorSignupForm/operatorEnrollmentForm';
import UserRegistrationForm from './userRegistration/userRegistrationForm';
import RegistrationForm from './registration/registrationForm';
import OperatorSignupForm from './operatorSignupForm/operatorSignupForm';
import OperatorSignup from './operatorSignupForm/OperatorSignup';
import SetPassword from './setPassword/SetPassword';
import ForgetPassword from './forgetPassword/ForgetPassword';
import AccountEnroll from './accountEnroll/accountEnroll';
import AccountHome from './account/accountHome'
import FuelPriceHome from './fuelPrice/fuelPriceHome.jsx'
import OperatorOnboarding from './onboarding/operatorOnboarding';
import Notifications from './notifications/notifications';
import MyProfile from "./myProfile/myProfile";
import UserTypeCheck from './account/UserTypeCheck';
import Statistics from './dashboard/Statistics/statistics';
import { getAccessLevel } from '../controls/commanAccessLevel';
import Aircraft from './account/aircraft';
import Locations from './account/locations';
import Documents from './account/document';
import Banking from './account/banking';
import Payment from './account/payment';
import UserProfile from './myProfile/UserProfile';
import { useSelector, useDispatch } from 'react-redux';
import SearchHome from './universalSearch/searchHome';

// Taxes & Fees page
import TaxFeesHome from './taxesFees/taxFeesHome';
import Taxes from './taxesFees/tax';
import Fees from './taxesFees/fees';
import AdditionalServices from './taxesFees/additionalServices';

import Active from './fuelPrice/active';
import Archive from './fuelPrice/archive';
import FuelTiers from './fuelPrice/fueltier';
//import { fetchJWTTokenFromLogin, fetchLoginData } from '../../actions/loginService/loginActions';
import LandingPage from '../marketingWebsite/index';
import About from '../marketingWebsite/components/about/about';
import Demo from '../marketingWebsite/components/demo/demo';
import Contact from '../marketingWebsite/components/contact/contact';
import AddNewFuel from './fuelPrice/addNewFuel.jsx';
import ClientPortalHome from './clientPortal/clientPortalHome';
import BulkUpload from './clientPortal/bulkUpload';
import { fetchCSRFTokenData } from '../actions/initConfig/InitConfigAction';
import Dispute from './orders/disputes';
import OrderTabHome from './orders/orderTabHome';
import ReviewDispute from './orders/reviewDispute';
import NewFuelOrderHome from './searchFuelOrder/newFuelOrderHome';
import ActiveOrder from './orders/activeOrder';
import OrderCompleted from './orders/orderCompleted';
import OrderHome from './orders/orderHome';
import ViewCompletedOrders from './orders/viewCompletedOrders';
import ViewDisputeOrder from './orders/viewDisputeOrder';
// import AuditLog from './auditLog/AuditLog'
 import AuditLog from './AuditLog/AuditLog'
import ViewMultiLegOrders from './orders/viewMultiLegOrders';
import Reports from './Reports/reports';
import AdminHome from './accountAdmin/adminHome';
import CompanyChange from './accountAdmin/companyChange';
import Deactivate from './accountAdmin/deactivate';
import ActivateDetails from './accountAdmin/activateDetails';
import SystemVariables from './accountAdmin/systemVariables';
const Menubar = (props) => {
  const userType = Storage.getItem('userType') ? Storage.getItem('userType') : ''
  // const [jsonConfig, setJSONConfig] = useState([]);
  const history = createBrowserHistory({forceRefresh:true});
  

  const navigateLink = (link) => {
    history.push('/login')
  }

  const dispatch = useDispatch();
  const loginReducer = useSelector( (state) =>  state.loginReducer)
  const initConfigReducer = useSelector( (state) =>  state.initConfigReducer)

  const getCSRFToken = async () => {
    const baseUrl = process.env.REACT_APP_BASE_URL
    const response = await axios.get(`${baseUrl}/getCSRFToken`);
    axios.defaults.headers.post['X-CSRF-Token'] = response.data.CSRFToken;
    Storage.setItem('csrfToken', response.data.CSRFToken)
 };

  useEffect(() => {
    const csrfEnabled = process.env.REACT_APP_CSRF_ENABLED;
    if(csrfEnabled === 'true' ) {    
      fetchCSRFTokenData(dispatch).then( response => {
      })
    }
}, [])

const [colorChange, setColorchange] = useState(false);
const changeNavbarColor = () =>{
	if(window.scrollY >= 80){
	setColorchange(true);
	}
	else{
	setColorchange(false);
	}
};
window.addEventListener('scroll', changeNavbarColor);
return (
		<BrowserRouter basename="/bfdev/" history={history}>
    <div className='bf-menubar-section'>
      <main>
        <Routes>
        <Route exact path="" element={<LandingPage />} />
        <Route path="/about" element={<About /> } />
        <Route path="/demo" element={<Demo  /> } />
        <Route path="/contact" element={<Contact  /> } />
        {/* <Route path="/home" element={<LandingPage />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={ loginReducer && loginReducer.loginDetails && loginReducer.loginDetails.data ? <Dashboard /> : <LandingPage/>} >
            <Route index element={<Statistics />}/>
            <Route path="home" element={<Statistics />}/>
            <Route path="add-new-fuel" element={<AddNewFuel  /> } />
            <Route path="adduser" element={<AdminAddUser />}/>
            <Route path="admin-adduser" element={<AdminSignupForm />}/>
            <Route path="profile" element={<UserProfile />}/>
            <Route path="universalSearch" element={<SearchHome />}>
              <Route index path="user" element={<SearchUser/>}/>
              <Route path="aircraft" element={<SearchAircraft/>}/>
              <Route path="company" element={<SearchCompany/>}/>
              <Route path="order" element={<SearchOrder/>}/>
            </Route> 
             
            <Route path="fbo-signup" element={<FboSignupForm />} />
            <Route path="operator-signup" element={<OperatorSignupForm />} /> 
            <Route path="notification" element={<Notifications />}/>
            <Route path="client-portal" element={<ClientPortalHome/>}/>
            <Route path="discount-upload" element={<BulkUpload/>}/>
            <Route path="fuelorder" element={<NewFuelOrderHome/>}/>
            <Route path="add-new-fuel" element={<AddNewFuel />}/>
            <Route path="fuelorder/order" element={<OrderHome />}/>
            <Route path="audit-logs" element={<AuditLog/>}/>
            <Route path="account" element={<AccountHome />}>
              <Route index element={userType && (userType == 'internal' || userType == 'Barrel Fuel') ? <User/> : <Company/>}/>
              <Route path="company" element={<Company />}/>
              <Route path="user" element={<User />}/>
              <Route path="aircraft" element={<Aircraft />}/>
              <Route path="location" element={<Locations />}/>
              <Route path="documents" element={<Documents />}/>
              <Route path="banking-details" element={<Banking />}/>
              <Route path="payment-method" element={<Payment />}/>
            </Route>
            <Route path="add-new-fuel" element={<AddNewFuel  /> } />
            <Route path="fuel-pricing" element={<FuelPriceHome />}>
              <Route index element={<Active/>}/>
              <Route path="active" element={<Active />}/>
              <Route path="archive" element={<Archive />}/>
              <Route path="fuel-tiers" element={<FuelTiers />}/>
              
              
            </Route>
            <Route path="client-onboarding" element={<AccountEnroll />}/>

            <Route path="order" element={<OrderTabHome />}>
              <Route index path="active" element={<ActiveOrder />}/>
              <Route path="dispute" element={<Dispute />}/>
              <Route path="completed" element={<OrderCompleted />}/>
            </Route>
            <Route path="review" element={<ReviewDispute />}/>
            <Route path="viewopen" element={<ViewDisputeOrder />}/>
            <Route path="fuelorder/viewOrder" element={<ViewCompletedOrders />}/>
            <Route path="fuelorder/viewMultiOrder" element={<ViewMultiLegOrders />}/>

            <Route path="reports" element={<Reports />}/>
            
            <Route path="admin" element={<AdminHome />}>
              <Route index path="company" element={<CompanyChange/>}/>
              <Route path="deactivate" element={<Deactivate/>}/>
              <Route path="system" element={<SystemVariables/>}/>
            </Route>
            <Route path="activate" element={<ActivateDetails/>}>
            <Route index path="company" element={<Company />}/>
            </Route>
            <Route path="tax-fees" element={<TaxFeesHome />}>
              <Route index path="taxes" element={<Taxes />}/>
              <Route path="fees" element={<Fees />}/>
              <Route path="additionalServices" element={<AdditionalServices />}/>
            </Route>

          </Route>
          <Route path="/profile" element={<MyProfile />} />

              {/* <Route index element={userType && (userType == 'internal' || userType == 'Barrel Fuel') ? <User/> : <Company/>}/> */}
          
          {/* <Route path="/fbo-enrollment" element={isAuthenticate() ? <FboSignup /> : <Home /> } />
          <Route path="/operator-enrollment" element={isAuthenticate() ? <OperatorEnrollmentForm /> : <Home /> } /> */}
          
          <Route path="/fbo-enrollment" element={<FboSignup /> } />
          <Route path="/operator-enrollment" element={ <OperatorEnrollmentForm /> } />
          <Route path="/user-registration" element={<UserRegistrationForm/>} />
          <Route path="/registration" element={<RegistrationForm/>} />
          <Route path="/admin" element={ loginReducer && loginReducer.loginDetails && loginReducer.loginDetails.data ? <Admin /> : <Home/>} />
          <Route path="/otherAdmin" element={ loginReducer && loginReducer.loginDetails && loginReducer.loginDetails.data ? <OtherAdminSignup /> : <Home/>} />
          <Route path="/admin-signup" element={ <AdminSignupForm />} />
          <Route path="/fbo" element={<FboSignupForm />} />
          <Route path="/admin-user-signup" element={ loginReducer && loginReducer.loginDetails && loginReducer.loginDetails.data ? <AdminAddUser /> : <Home/>} />
          <Route path="/operator" element={<OperatorSignupForm />} /> 
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/UserTypeCheck" element={<UserTypeCheck />} />
          <Route path="/fbo-signup" element={<FboSignupForm />} />
          <Route path="/operator-signup-details" element={<OperatorSignupForm />} /> 
          <Route path="/account-enroll" element={<AccountEnroll />} />
          {/* <Route path="/fbo-onboarding" element={<FboOnboarding/>} /> */}
          {/* <Route path="/operator-onboarding" element={<OperatorOnboarding/>} />
          <Route path="/forget-password" element={<ForgetPassword />} />  */}
          <Route path="active" element={<Active />}/>
          <Route path="archive" element={<Archive />}/>
          <Route path="fuel-tiers" element={<Active />}/>
          {/* {RoutesWithSubRoutes(routes)} */}
        </Routes>
      </main>
    </div>
  </BrowserRouter>
	)

	const RoutesWithSubRoutes = routes => 
  routes.map((route, i) => (
    <Route
      key={i}
      exact={route.exact || false}
      path={route.path}
      render={props => <route.component {...props} routes={route.routes} />}
    />
  ));
}

export default Menubar;