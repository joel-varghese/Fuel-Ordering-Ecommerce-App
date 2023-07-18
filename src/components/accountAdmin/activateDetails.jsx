import React, { useState, useEffect } from 'react';
import Select from '../select/select';
import '../account/accountHome.scss'
import { Row, Nav, Form } from 'react-bootstrap';
import { IoIosSearch } from 'react-icons/io'
import { Storage, jsonStringify } from '../../controls/Storage';
import AdminAddUser from "../admin/adminAddUser";
import  AdminSignupForm from "../admin/adminSignupForm";
import { lookupService } from '../../services/commonServices';
import arrowDownIcon from '../../assets/images/arrow-down_icon.svg';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJSONData, getCompany, getSelectedTab, getSelectedUser } from '../../actions/accountHome/accountHomeActions';
import { getMobileHeaderText } from '../../actions/commonActions/commonActions';

export default function ActivateDetails() {
  const [accountHomeData, setAccountHomeData] = useState(null);
  const [userType, setUserType] = useState();
  const [accountTab, setAccountTab] = useState("")
  const [companyTab, setCompanyTab] = useState(true);
  const [loggedinUser, setLoggedinUser] = useState("");
  const [companyDropDown, setCompanyDropDown] = useState([])
  const [companyList, setCompanyList] = useState([])
  const [companySearch, setCompanySearch] = useState(false)
  const [companyValue, setCompanyValue] = useState("")
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [refresh, setrefresh] = useState(false)
  const [currentTab, setCurrentTab] = useState('company')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const accountHomeReducer = useSelector((state) => state.accountHomeReducer);
  const commonReducer = useSelector((state) => state.commonReducer);
  const selectedUser = "operator";
  const jsonData = accountHomeReducer && accountHomeReducer.accountHomeJson && accountHomeReducer.accountHomeJson;
  const selectedTab = "company";
  const selectedCompany = accountHomeReducer && accountHomeReducer.selectedCompany && accountHomeReducer.selectedCompany.company;
  const company =  commonReducer?.loggedInCompany?.data;
  let currentPath = window.location.pathname.toString()
  currentPath = currentPath.split("/")
  const paylod = { 'blobname': 'activateDetails.json' }
  useEffect(() => {
    fetchJSONData(paylod, dispatch)
    let selectedType = Storage.getItem('userType')
    setLoggedinUser(selectedType)
    getCompany(selectedCompany? selectedCompany : company, dispatch)
    let tab = selectedTab && selectedTab.tab && selectedTab.tab
    let user = selectedUser && selectedUser && selectedUser 
    if (selectedType === "Barrel Fuel" || selectedType === "internal") {
      if(user){
        setUserType(user)
        getSelectedUser(user,dispatch)
        getSelectedTab( tab,dispatch)
        if(user!=="internal"){
          setCompanyValue(selectedCompany? selectedCompany : company )
        }
      }else{
        setUserType('internal')
        getSelectedTab( 'user',dispatch)
        getSelectedUser('internal',dispatch)
      }
      
      
    } else {
      let companyName = selectedCompany ? selectedCompany : company
      setCompanyValue(companyName)
      getCompany(companyName, dispatch)
      getSelectedUser(user,dispatch)
      getSelectedTab( tab,dispatch)
      setUserType(selectedType.toLocaleLowerCase())
      getSelectedUser(selectedType.toLocaleLowerCase(), dispatch)
    }
    getCompanyDropdown(selectedType)
    setCompanyTab(true)
  },
    []);

//   useEffect(()=>{
//     let user = selectedUser && selectedUser.user && selectedUser.user
//     getCompanyDropdown(user)
//     if(user){
//       setUserType(user)
//       if (user === "internal"  ){
//         setCurrentTab('user')
//         navigate(`./user`, {state:{companyValue:companyValue}})
//         getMobileHeaderText(dispatch, 'User')
//       } else {
//         navigate(`./company`, {state:{companyValue:companyValue}})
//         getMobileHeaderText(dispatch, 'Company')
//         setCurrentTab('company')
//       }
//     }
//   },[selectedUser])
//   useEffect(()=>{
//     let tab = selectedTab && selectedTab.tab && selectedTab.tab
//     if(tab){
//       setAccountTab(tab)
//       navigate(`./${tab}`, {state:{companyValue:selectedCompany}})
//     }
//   },[selectedTab])
  useEffect(()=>{
    setAccountHomeData(jsonData && jsonData.data && jsonData.data.data)
    
  },[jsonData,refresh]) 
//   useEffect(() => {
//     window.addEventListener('click', onSearchBlur);
//     setCurrentTab(currentPath[currentPath.length-1])
//   }, [companySearch,currentPath]);

  const ondropDownClick =(name)=>{
    Storage.setItem('organizationName', name)
    let tab = selectedTab && selectedTab.tab && selectedTab.tab
    getCompany(name, dispatch)
    setCompanyValue(name)
    setrefresh(!refresh)
    setCompanySearch(false)
  }
  const onHandleChange = (e) => {
    // getSelectedUser(e.target.value,dispatch)
    // setCompanyValue("")
    // getCompany('',dispatch)
    // getCompanyDropdown(e.target.value)
    // setrefresh(!refresh)
  };
  const getCompanyDropdown = (userType)=>{
    let header = {
      "userType": userType
    }
    let requestData = {
      "serviceName": "companyName",
      "headers" : header
    }
    if(userType != 'internal') {
      lookupService(requestData).then(((res)=>{    
        let data = res?.body ? JSON.parse(res.body): ""
        setCompanyDropDown(data)
        setCompanyList(data)   
      }))
    }
  

  }
  const onHandleBlur = (e, item) => {
    let data = e.target.value
  };
  const userRole = accountHomeData && accountHomeData.user ? accountHomeData.user : null;
  const searchData = accountHomeData && accountHomeData.search ? accountHomeData.search : null;
  const getAccountTabName = (tab) => {
    if(companyValue){
      getSelectedTab(tab.name,dispatch)
      navigate(`./${tab.name}`, {state:{companyValue:companyValue}})
    }
    setShowAddPopup(false)
    
    getMobileHeaderText(dispatch, tab.mobileHeader)
  }
  const enableNewCompanyForm = () => {
    setCompanyTab(false)
  }
  const getAccountTab = (e) => {
    console.log(e.target.value)
    accountHomeData.userTypes[userType].tabs.map((tab) => {
      if(tab.name == e.target.value) {
        getAccountTabName(tab)
      }
    })
  }
  const getMobileOptions = ()=>{
    let options = []
    accountHomeData.userTypes[userType].tabs.map((tab) => (
      // <option value={tab.name}>{tab.title}</option>
      options.push({
        title:tab.title,
        value:tab.name
      })
    ))
    return options
  }
  const getMobileDropDown = () => {
    return (
      <div className='bf-show-mobile d-flex d-flex-column bf-mrgb10 bf-mobile-tabs-dropdown bf-mobile-pad'>
        {accountHomeData &&  userType && accountHomeData.userTypes ?
          <>
            <Select className='bf-select-component' Label= {"Select View"} formDataSet = {currentTab} handleChange={(e) => getAccountTab(e)} Options= {getMobileOptions()}/>
          </>: null
        }
      </div>

    )
  }

  const getTabs = () => {
    return (
      <div className='bf-tabs-container bf-hide-mobile bf-mrgt20'>
        {accountHomeData &&  userType && accountHomeData.userTypes ?
          <>
            {accountHomeData.userTypes[userType].tabs.map((tab) => (
              <Nav variant="tabs" className='bf-tabs' >
                <Nav.Item>
                  <Nav.Link className={currentTab == tab.name ? "bf-active-tab" : ''} onClick={() => { getAccountTabName(tab) }}>{tab.title}</Nav.Link>
                </Nav.Item>
              </Nav>
            ))}
          </> : null}
      </div>
    )
  }
  const onSearchFocus = ()=>{
    if(selectedUser == "internal"){
      setCompanySearch(false)
    }
    else{
      setCompanySearch(true)
    }
  }
  const onSearchBlur = (e)=>{
    if(e.target.parentElement.className != 'bf-accout-sugesstion-dropdown' && e.target.parentElement.className != 'search') {
      setCompanySearch(false);
    }
  }
  const handleSearchChange = (e) => {
    let data = companyList && companyList
    let value = (e.target.value).toLowerCase()
    let newData = data && data.filter((d)=>d.toLowerCase().includes(value))
    setCompanyValue(value)
    setCompanyDropDown(newData)
  }
  return (
    <div className='bf-account-home-container'>
      {accountHomeData && accountHomeData && companyTab && userRole ? <div className='bf-account-home'>
        {loggedinUser =="Barrel Fuel" ? <div className='bf-userBar'>
          <Select
            colWidth={userRole.styles ? userRole.styles.colWidth : ""}
            Type={userRole.type}
            Label={userRole.label}
            Placeholder={userRole.placeholder}
            isRequred={userRole.isRequired}
            Options={userRole.options}
            Name={userRole.name}
            disabled={true}
            formDataSet={userType}
            handleChange={(e) => onHandleChange(e, userRole)}
            handleBlur={(e) => onHandleBlur(e, userRole)}
          />

          <div className="search" >
            <IoIosSearch className='search-icon' />
            <input
              type={searchData.type}
              name={searchData.name}
              value={companyValue}
              id={searchData.name}
              disabled={true}
              placeholder={searchData.placeholder}
              className={"search-input form-control"}
              onChange={(e) =>{handleSearchChange(e) }}
              onFocus = {(e)=>onSearchFocus()}
            />
            {/* {loggedinUser =="Barrel Fuel" && selectedUser.user == 'internal' ? null: <img src={arrowDownIcon} className='bf-down-arrow' />}
            {companySearch && selectedUser != "internal" &&
            <ul className='bf-accout-sugesstion-dropdown'>
              { companyDropDown && companyDropDown.length ? companyDropDown.map((comp)=>(
                <li onClick={(e)=>{ondropDownClick(comp)}}>{comp}</li>
              )):<li>No Match Found</li>}
            </ul>} */}
          </div>
        </div> : <div className='bf-home-company-name'>{Storage.getItem('organizationName')}</div>}
        {getTabs()}
        {getMobileDropDown()}
        <div className='tab-details-container'><Outlet/></div>
      </div> : ''}
    </div>
  )
}
