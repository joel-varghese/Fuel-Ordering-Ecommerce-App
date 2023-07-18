import React, { useState, useEffect } from 'react';
import { getAccountHomeJson } from '../../actions/accountServices/accountHomeService';
import Select from '../select/select';
// import './accountHome.scss';
import Header from '../header/header';
import Input from '../input/input';
import { Row, Nav } from 'react-bootstrap';
import { IoIosSearch } from 'react-icons/io'
// import Company from './company';
// import User from './user';
// import Payment from './payment';
// import Locations from './locations';
import { fetchCompanyDetails } from '../../actions/accountServices/accountCompanyService';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
// import Aircraft from './aircraft';
// import Banking from './banking';
import CompanyDetailsForm from '../fboSignup/companyDetails';
import { Storage, jsonStringify } from '../../controls/Storage';
// import Documents from './document';
import OperatorSignupForm from '../operatorSignupForm/operatorSignupForm';
import FboSignupForm from '../fboSignup/FboSignupForm';
import AdminAddUser from "../admin/adminAddUser";
import  AdminSignupForm from "../admin/adminSignupForm";
import { lookupService } from '../../services/commonServices';
import arrowDownIcon from '../../assets/images/arrow-down_icon.svg';
import { Outlet, useNavigate,useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJSONData, getSearchSelectedTab } from '../../actions/universalSearch/searchHome/searchHomeActions';
import { getIsReorder, getIsSummary} from '../../actions/orderPlacementActions/orderPlacementActions'
export default function SearchHome(props) {
  let navigate = useNavigate()
  let {state} = useLocation()
  const [accountHomeData, setAccountHomeData] = useState(null);
  const [companyDetailsData, setCompanyDetailsData] = useState(null);
  const [adminAddUserData, setadminAddUsersData] = useState(null);
  const [adminSignUpData, setadminSignUpData] = useState(null);
  const [userType, setUserType] = useState("internal");
  const [accountTab, setAccountTab] = useState("")
  const [companyTab, setCompanyTab] = useState(true);
  const [addUser,  setUserTab]=useState(true);
  const [loggedinUser, setLoggedinUser] = useState("");
  const [companyDropDown, setCompanyDropDown] = useState([])
  const [companyList, setCompanyList] = useState([])
  const [companySearch, setCompanySearch] = useState(false)
  const dispatch = useDispatch()
  const searchHomeReducer = useSelector((state) => state.searchHomeReducer);
  const searchValue = searchHomeReducer && searchHomeReducer.searchValue && searchHomeReducer.searchValue?.tab;
  const jsonData = searchHomeReducer && searchHomeReducer.searchHomeJson && searchHomeReducer.searchHomeJson;
  const selectedTab = searchHomeReducer && searchHomeReducer.selectedTab && searchHomeReducer.selectedTab;
  let paylod = { 'blobname': 'searchHome.json' }
  useEffect(() => {
    getIsReorder(dispatch,false)
		getIsSummary(dispatch, false)
    if(Storage.getItem('userType')!='Barrel Fuel'){
      setUserType(Storage.getItem('userType').toLowerCase())
    }
    fetchJSONData(paylod,dispatch)
    
    
    setCompanyTab(true)

  },[selectedTab]);

   useEffect(()=>{
    setAccountHomeData(jsonData && jsonData.data && jsonData.data.data)
     navigate(`./${accountTab}`)
  },[jsonData,accountTab]) 

  useEffect(()=>{
    let tab = selectedTab && selectedTab.tab && selectedTab.tab
    setAccountTab(tab)
  },[selectedTab])
  
  const userRole = accountHomeData && accountHomeData.user ? accountHomeData.user : null;
  const searchData = accountHomeData && accountHomeData.search ? accountHomeData.search : null;
  const getAccountTabName = (tab) => {
    getSearchSelectedTab(tab.name,dispatch)
    setAccountTab(tab.name)
  }

  const getTabs = () => {

    return (
      <div className='bf-tabs-container bf-mrgt20'>
        {accountHomeData && accountHomeData.userTypes ?
          <>
            {accountHomeData.userTypes[userType].tabs.map((tab) => (

              <Nav variant="tabs" className='bf-tabs' >
                <Nav.Item>
                  <Nav.Link className={accountTab == tab.name ? "bf-active-tab" : ''} onClick={() => { getAccountTabName(tab) }}>{tab.title}</Nav.Link>
                </Nav.Item>
              </Nav>
            ))}
          </> : null}
      </div>
    )
  }

  return (
    <div className='bf-account-home-container'>
      {accountHomeData && companyTab ? <div className='bf-account-home'>
         <div className='bf-home-company-name bf-search-result-name'>{`${accountHomeData.searchResult} '${searchValue}'`}</div>
        {getTabs()}
        <div className='tab-details-container'><Outlet/></div>
      </div> : ""}
    </div>
  )
}
