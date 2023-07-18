import React, { useState, useEffect } from 'react';
import Select from '../select/select';
import { Row, Nav } from 'react-bootstrap';
import { IoIosSearch } from 'react-icons/io'
import { Storage, jsonStringify } from '../../controls/Storage';
import AdminAddUser from "../admin/adminAddUser";
import  AdminSignupForm from "../admin/adminSignupForm";
import { lookupService } from '../../services/commonServices';
import arrowDownIcon from '../../assets/images/arrow-down_icon.svg';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJSONData, getSelectedCompanyTax, getSelectedTab1, getTaxSelectedUser } from '../../actions/taxFees/taxFeesHomeActions';

export default function AccountHome() {
  const [accountHomeData, setAccountHomeData] = useState(null);
  const [userType, setUserType] = useState();
  const [accountTab, setAccountTab] = useState("");
  const [companyTab, setCompanyTab] = useState(true);
  const [loggedinUser, setLoggedinUser] = useState("");
  const [companyDropDown, setCompanyDropDown] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [companySearch, setCompanySearch] = useState(false);
  const [companyValue, setCompanyValue] = useState("");
  const [currentTab, setCurrentTab] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accountHomeReducer = useSelector((state) => state.taxFeesHomeReducer);
  const commonReducer = useSelector(state => state.commonReducer);
  const loggedInUserType = commonReducer && commonReducer.loggedInUserType && commonReducer.loggedInUserType.data;
  const loggedInCompany =  commonReducer?.loggedInCompany?.data;
  const selectedUser = accountHomeReducer && accountHomeReducer.selectedUser && accountHomeReducer.selectedUser?.user;
  const jsonData = accountHomeReducer && accountHomeReducer.taxFeesHomeJson && accountHomeReducer.taxFeesHomeJson;
  const selectedTab = accountHomeReducer && accountHomeReducer.selectedTab && accountHomeReducer.selectedTab;
  const selectedCompany = accountHomeReducer && accountHomeReducer.selectedCompany && accountHomeReducer.selectedCompany.company;
  const userRole = accountHomeData && accountHomeData.user ? accountHomeData.user : null;
  const searchData = accountHomeData && accountHomeData.search ? accountHomeData.search : null;
  let currentPath = window.location.pathname.toString()
  currentPath = currentPath.split("/")
  const paylod = { 'blobname': 'taxFeesHome.json' }
  const company =  commonReducer?.loggedInCompany?.data;
  useEffect(() => {
    fetchJSONData(paylod,dispatch)
    let selectedType = loggedInUserType
    setLoggedinUser(loggedInUserType)
    let tab = selectedTab && selectedTab.tab && selectedTab.tab
    let user = selectedUser && selectedUser 
    getSelectedCompanyTax(selectedCompany.length? selectedCompany : company,dispatch)
    setCompanyValue(selectedCompany.length?selectedCompany:company)

    if(user&&selectedCompany){
      tab && getSelectedTab1(tab,dispatch)
      getTaxSelectedUser(user,dispatch)
    }
    else{
      if (selectedType === "Barrel Fuel"  ) {
        getTaxSelectedUser('internal',dispatch)
        getSelectedTab1('taxes',dispatch)
      } else {
        let companyName = company
        getSelectedCompanyTax(companyName,dispatch)
        getTaxSelectedUser(selectedType.toLocaleLowerCase(),dispatch)
      }
    }
    getCompanyDropdown(selectedType)
    setCompanyTab(true)
  },[]);

  useEffect(()=>{
    let user = selectedUser && selectedUser
    getCompanyDropdown(user)
    setCompanyValue(selectedCompany.length?selectedCompany:company)
    setUserType(user)
    if(user){
      setAccountTab('taxes')
    }
  },[selectedUser])
  useEffect(()=>{
    setAccountHomeData(jsonData )
    navigate(`./${selectedTab.tab}`, {state:{companyValue:companyValue}})
  },[jsonData,selectedTab,refresh]) 
  useEffect(() => {
    window.addEventListener('click', onSearchBlur);
    setCurrentTab(currentPath[currentPath.length-1])

  }, [companySearch,currentPath]);

  const ondropDownClick =(name)=>{
    getSelectedCompanyTax(name,dispatch)
    setCompanyValue(name)
    setrefresh(!refresh)
    setCompanySearch(false)
  }
  const onHandleChange = (e, item) => {
    getTaxSelectedUser(e.target.value,dispatch)
    setCompanyValue("")
    getSelectedCompanyTax("",dispatch)
    getSelectedTab1('taxes',dispatch)

    if(e.target.value == 'internal'){
      setCompanyDropDown([])
      setCompanyList([])
    }
    else{
      getCompanyDropdown(e.target.value)
    }
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
      let data = JSON.parse(res.body)
      setCompanyDropDown(data)
      setCompanyList(data)
    }))
  }

  }
  const onHandleBlur = (e, item) => {
    let data = e.target.value
  };
  
  const getAccountTabName = (tab) => {
    if(companyValue){
      getSelectedTab1(tab,dispatch)
    }
    
  }
  const getTabs = () => {
    return (
      <div className='bf-tabs-container bf-mrgt20'>
        {accountHomeData &&  userType && accountHomeData.userTypes ?
          <>
            {accountHomeData.userTypes[userType].tabs.map((tab) => (

              <Nav variant="tabs" className='bf-tabs' >
                <Nav.Item>
                  <Nav.Link className={currentTab == tab.name ? "bf-active-tab" : ''} onClick={() => { getAccountTabName(tab.name) }}>{tab.title}</Nav.Link>
                </Nav.Item>
              </Nav>
            ))}
          </> : null}
      </div>
    )
  }
  const onSearchFocus = ()=>{
    setCompanySearch(true)
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
    setCompanyValue(e.target.value)
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
            disabled={loggedinUser =="Barrel Fuel" ? false : true}
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
              placeholder={searchData.placeholder}
              className={"search-input form-control"}
              onChange={(e) =>{handleSearchChange(e) }} 
              onFocus = {(e)=>onSearchFocus()}
            />
            {companySearch &&
            <ul className='bf-accout-sugesstion-dropdown'>
              { companyDropDown &&companyDropDown.length?companyDropDown.map((comp)=>(
                <li onClick={(e)=>{ondropDownClick(comp)}}>{comp}</li>
              )):<li>No Match Found</li>}
            </ul>}
          </div>
        </div> : <div className='bf-home-company-name'>{"Taxes & Fees"}</div>}
        {getTabs()}
        <div className='tab-details-container'><Outlet/></div>
      </div> : ''}
    </div>
  )
}
