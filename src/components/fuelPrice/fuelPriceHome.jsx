import React, { useState, useEffect } from 'react';
import Select from '../select/select';
import { Row, Nav } from 'react-bootstrap';
import { IoIosSearch } from 'react-icons/io'
import { Storage, jsonStringify } from '../../controls/Storage';
import { lookupService } from '../../services/commonServices';
import arrowDownIcon from '../../assets/images/arrow-down_icon.svg';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJSONData, getSelectedTabFuel, getSelectedUser, getSelectedCompanyFP } from '../../actions/fuelPriceHome/fuelPriceHomeActions';

export default function FuelPriceHome() {
  const [accountHomeData, setAccountHomeData] = useState(null);
  const [userType, setUserType] = useState();
  const [accountTab, setAccountTab] = useState("")
  const [companyTab, setCompanyTab] = useState(true);
  const [loggedinUser, setLoggedinUser] = useState(Storage.getItem('userType'));
  const [companyDropDown, setCompanyDropDown] = useState([])
  const [companyList, setCompanyList] = useState([])
  const [companySearch, setCompanySearch] = useState(false)
  const [companyValue, setCompanyValue] = useState("")
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [refresh, setrefresh] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const fuelPriceHomeReducer = useSelector((state) => state.fuelPriceHomeReducer);
  const commonReducer = useSelector(state => state.commonReducer);
  const loggedInUserType = commonReducer && commonReducer.loggedInUserType && commonReducer.loggedInUserType.data;
  const loggedInCompany =  commonReducer?.loggedInCompany?.data;
  const selectedUser = fuelPriceHomeReducer && fuelPriceHomeReducer.selectedUser && fuelPriceHomeReducer.selectedUser;
  const jsonData = fuelPriceHomeReducer && fuelPriceHomeReducer.fuelPriceHomeJson && fuelPriceHomeReducer.fuelPriceHomeJson;
  const selectedTab = fuelPriceHomeReducer && fuelPriceHomeReducer.selectedFuelPriceTab && fuelPriceHomeReducer.selectedFuelPriceTab;
  const selectedCompanyValue = fuelPriceHomeReducer && fuelPriceHomeReducer.selectedCompany && fuelPriceHomeReducer.selectedCompany;
  
  const { state } = useLocation();
  const paylod = { 'blobname': 'fuelPriceHome.json' }
  useEffect(() => {
    fetchJSONData(paylod,dispatch)
    let selectedType = loggedInUserType
    setLoggedinUser(selectedType)
    let tab = selectedTab && selectedTab.tab && selectedTab.tab
    let user = selectedUser && selectedUser.user && selectedUser.user
    getSelectedCompanyFP(selectedCompanyValue && selectedCompanyValue.company ?selectedCompanyValue.company :loggedInCompany,dispatch)
    if (selectedType === "Barrel Fuel"  ) {
      setUserType('internal')
      setAccountTab('active')
      getSelectedTabFuel(tab,dispatch)
      getSelectedUser('internal',dispatch)
      let selectedCompany = selectedCompanyValue.company && selectedCompanyValue.company !== null?selectedCompanyValue.company:loggedInCompany? loggedInCompany : ""
      setCompanyValue(selectedCompany)
      //setCompanyValue(selectedCompany)
      navigate(`./`+tab, {state:{companyValue:selectedCompany}})
      // if(selectedCompany){

      //   Storage.setItem('organizationName',selectedCompany)
      //   getSelectedCompanyFP(selectedCompany,dispatch)
      // } 
      // else {
      //   Storage.setItem('organizationName',undefined)
      //   getSelectedCompanyFP(null,dispatch)
      // }
      
    } else {
      let companyName = selectedCompanyValue.company && selectedCompanyValue.company !== null? selectedCompanyValue.company && selectedCompanyValue.company !== null:Storage.getItem('organizationName') && Storage.getItem('organizationName')!='undefined'  ? Storage.getItem('organizationName') : ""
      setCompanyValue(companyName)
      setUserType( selectedType.toLocaleLowerCase())
      setAccountTab('active')
      getSelectedTabFuel(tab,dispatch)
      navigate(`./`+tab, {state:{companyValue:companyName}})
      getSelectedUser(selectedType.toLocaleLowerCase(),dispatch)
      //getSelectedTab('active',dispatch)
    }
    getCompanyDropdown('fbo')
    //setCompanyTab(true)

  },[]);

  /* useEffect(()=>{
    let user = selectedUser && selectedUser.user && selectedUser.user
    getCompanyDropdown('fbo')
    if(user){
      setUserType(user)
      if (user === "internal"  ){
        setAccountTab('active')
        getSelectedTab('active',dispatch)
        //navigate(`./active`, {state:{companyValue:companyValue}})
      } else {
        setAccountTab('active')
        getSelectedTab('active',dispatch)
        //navigate(`./active`, {state:{companyValue:companyValue}})
      }
    }
  },[selectedUser]) */
  useEffect(()=>{
    let tab = selectedTab && selectedTab.tab && selectedTab.tab
    if(tab){
      setAccountTab(tab)
      navigate(`./${accountTab}`, {state:{companyValue:companyValue}})
    }
  },[selectedTab])
  useEffect(()=>{
    setAccountHomeData(jsonData && jsonData.data && jsonData.data.data)
    navigate(`./${accountTab}`, {state:{companyValue:companyValue}})
  },[jsonData,accountTab,refresh]) 
  useEffect(() => {
    window.addEventListener('click', onSearchBlur);
  }, [companySearch]);

  const ondropDownClick =(name)=>{
    Storage.setItem('organizationName', name)
    let tab = selectedTab && selectedTab.tab && selectedTab.tab
    getSelectedCompanyFP(name,dispatch)
    setCompanyValue(name)
    setrefresh(!refresh)
    setCompanySearch(false)
  }
  const onHandleChange = (e, item) => {
    getSelectedUser(e.target.value,dispatch)
    setCompanyValue("")
    //getCompanyDropdown(e.target.value)
    setrefresh(!refresh)
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
  const userRole = accountHomeData && accountHomeData.user ? accountHomeData.user : null;
  const searchData = accountHomeData && accountHomeData.search ? accountHomeData.search : null;
  const getAccountTabName = (tab) => {
    getSelectedTabFuel(tab.name,dispatch)
    setShowAddPopup(false)
  }
  const enableNewCompanyForm = () => {
    setCompanyTab(false)
  }
  const getTabs = () => {
    return (
      <div className='bf-tabs-container bf-mrgt20'>
        {accountHomeData &&  userType && accountHomeData.userTypes ?
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
  const onBlur = (e) =>{
     if(!companyDropDown.includes(e.target.value)){
      setCompanyValue("")
      getSelectedCompanyFP(null,dispatch)
      Storage.setItem('organizationName',undefined)
  } 
  }
 
  return (
    <div className='bf-account-home-container'>
      {accountHomeData && accountHomeData && companyTab && userRole ? <div className='bf-account-home'>
        <div className={`${Storage.getItem('userType') !=="Barrel Fuel"  ? 'bf-hide-fuelprice-company-search' : ''} bf-userBar`}>
        {loggedinUser ==="Barrel Fuel" ?
          <div className="search" >
            <IoIosSearch className='search-icon' />
            <input
              type={searchData.type}
              name={searchData.name}
              value={companyValue}
              id={searchData.name}
              placeholder={searchData.placeholder}
              className={"search-input form-control search-input-fuel-pricing"}
              onChange={(e) =>{handleSearchChange(e) }}
              onFocus = {(e)=>onSearchFocus()}
              onBlur = {(e) =>{onBlur(e)}}
            />
            {companySearch &&
            <ul className='bf-accout-sugesstion-dropdown'>
              { companyDropDown && companyDropDown.length ? companyDropDown.map((comp)=>(
                <li onClick={(e)=>{ondropDownClick(comp)}}>{comp}</li>
              )):<li>No Match Found</li>}
            </ul>}
          </div>
         :<div className='bf-home-company-name'>{accountHomeData?.Component}</div>} 
        </div>
        {getTabs()}
        <div className='tab-details-container'><Outlet/></div>
      </div> : ''}
    </div>
  )
}
