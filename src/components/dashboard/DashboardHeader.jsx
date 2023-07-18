import React, {useEffect, useState}from 'react';
import { Col, Dropdown, Nav, Navbar, NavItem, NavLink } from 'react-bootstrap';
import { IoIosSearch } from 'react-icons/io';
import { BsFillBellFill } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { useLocation, useNavigate } from 'react-router-dom';
import {Storage} from '../../controls/Storage';
import Notifications from './Notifications';
import arrowDownIcon from '../../assets/images/arrow-down_icon.svg';
import editIcon from '../../assets/images/header_edit_icon.svg';

import './dashboardHeader.scss';
import { fetchJWTTokenFromLogin } from '../../actions/loginService/loginActions';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanyDetails } from '../../actions/accountServices/accountCompanyService';
import { getCompany, getSelectedTab, getSelectedUser } from '../../actions/accountHome/accountHomeActions';
import { getSearchSelectedTab, getSearchValue } from '../../actions/universalSearch/searchHome/searchHomeActions';
import logo from '../../assets/images/barrel_fuel_logo.png';
import MobileLogo from '../../assets/images/bf-mobile-dashboard-logo.svg';
import { getLoggedInUserType } from '../../actions/commonActions/commonActions';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';

function DashboardHeader(props) {
    const [accessLevel, setAccessLevel] = useState("")
    const [show, setShow] = useState(false)
    const [dropSearch, setdropSearch] = useState(false)
    const [searchDropDown, setsearchDropDown] = useState([])
    const [originalSearchDropDown, setOriginalSearchDropDown] = useState([])
    const [searchValue, setsearchValue] = useState("")
    const [tab, setTab] = useState("")
    const [userName, setuserName] = useState("");
    const [profileImage, setprofileImage] = useState(null)
    const [filterValue, setfilterValue] = useState("")
    const menuData = props.fieldData.profile.menuItems;
    const userType = Storage.getItem('userType')
    const commonReducer = useSelector(state => state.commonReducer);
    const loggedInUserType = commonReducer && commonReducer.loggedInUserType && commonReducer.loggedInUserType.data;
    const mobileHeaderText = commonReducer && commonReducer.mobileHeaderText && commonReducer.mobileHeaderText.data;
    const dispatch = useDispatch()
    useEffect(()=>{
        window.addEventListener('click', handleSearchBlur);
        let profileDetails = props.profileData
        let accessLevel = profileDetails && profileDetails.levelOfAccess? profileDetails.levelOfAccess : ""
        let name = profileDetails && profileDetails.firstName? profileDetails.firstName: "";
        let imageData = profileDetails && profileDetails.profilePicture? profileDetails.profilePicture: '';
        let newData = ''
        if(imageData){
            newData = `data:image/jpg;base64,${imageData}`
        }
        let levelOfAccess = accessLevel
        if(loggedInUserType == "Barrel Fuel"){
            if(accessLevel[0] === "Level 3 (Basic)"){
                levelOfAccess = "Basic"
            }
            else{
                levelOfAccess = "Admin"
            }
        } else {
            levelOfAccess = accessLevel[0].split("(")[0];
        }
        setAccessLevel(levelOfAccess)
        setuserName(name)
        setprofileImage(newData)

    },[props.profileData]) 
    const showMenu = ()=>{
        setShow(true)
    }
    const hideMenu = ()=>{
        setShow(false)
    }
    const fetchSuggestions = (val)=>{
        let array=[]
        let details={'organizationName': Storage.getItem('organizationName')!='undefined'?Storage.getItem('organizationName'):"",'filter':val}
        if(val.charAt(0).toLowerCase()=='n'){
            if(userType.toLocaleLowerCase()=='fbo'){
                details.service='allaircraftsinfo'
            }else if(userType.toLocaleLowerCase()=='operator'){
                details.service='aircraft'
            }else{
                details.service='tailnumber'
            }  
            setTab('aircraft')
        }else{
            if(userType.toLocaleLowerCase()=='fbo'){
                details.service='user'
            }else if(userType.toLocaleLowerCase()=='operator'){
                details.service='fboorgandoperatorfilter'
            }else{
                details.service='orgusernames'
            }
            
            setTab('user')
        }
        fetchCompanyDetails(details).then((res)=>{
            let responseData = res && res
            if(userType.toLocaleLowerCase()=='fbo' || userType.toLocaleLowerCase()=='operator'){
                if(details.service =='fboorgandoperatorfilter'){
                    responseData  && responseData.res.name.map((item,index)=>{ 
                            array.push(item)  
                       }) 
                }else{
                    responseData  && responseData.res.map((item,index)=>{
                        if(details.service =='user'){
                            let name=item.firstName+' '+item.lastName
                            if(name?.toLowerCase().includes(val?.toLowerCase())){
                                array.push(name) 
                            }
                        }else if(details.service =='aircraft'){
                            array.push(item.tailNumber) 
                        }
                       })
                }  
            }else{
                if(details.service =='orgusernames'){
                    responseData  && responseData.name.map((item,index)=>{
                            array.push(item)    
                       })
                }else if(details.service =='tailnumber'){
                    responseData  && responseData.map((item,index)=>{
                        array.push(item.tailNumber)    
                   })
                }
               
            }
            array.length && array.sort((a,b)=>{
               if(a?.toLowerCase().startsWith(val?.toLowerCase()) && !b?.toLowerCase().startsWith(val?.toLowerCase())){
                return -1;
               }else if(b?.toLowerCase().startsWith(val?.toLowerCase()) && !a?.toLowerCase().startsWith(val?.toLowerCase())){
                return 1;
               }
               return 0;
            })
            setsearchDropDown(array)  
            setOriginalSearchDropDown(array)
            setdropSearch(true)
        })
    }
    let navigate = useNavigate()
    const getNotifications = ()=>{
    }

    const handleSearchChange = (e) => {
        setsearchValue(e.target.value)
        let value = (e.target.value).toLowerCase()
        if(value.length == 3){
             fetchSuggestions(value)
             setfilterValue(e.target.value)
            // setdropSearch(true)
            // let newData = data.filter((d)=>d.toLowerCase().includes(value))
            // setsearchDropDown(newData)
        }else if(value.length > 3){
            let data = originalSearchDropDown
             setdropSearch(true)
             let newData = data.filter((d)=>d.toLowerCase().includes(value))
             setsearchDropDown(newData)
        }else if(value.length < 3){
             setdropSearch(false)
        }
        
    }

    const handleSearchBlur = (e) => {
        if(e.target.parentElement.className != 'bf-accout-sugesstion-dropdown' && e.target.parentElement.className != 'd-flex bf-relative') {
            setdropSearch(false)
          }
        // setdropSearch(false)
    }

    const onKeyDown =(e)=>{
        if(e.keyCode === 13){
            getSearchSelectedTab(tab,dispatch)
            setdropSearch(false)
            if(e.target.value.length>=3){
                getSearchValue(e.target.value,dispatch)
                navigate(`./universalSearch`)
                setsearchValue('')
            }
        }else if(e.keyCode === 9){
            setdropSearch(false)
        }
    }

    const ondropDownClick =(val)=>{
        getSearchSelectedTab(tab,dispatch)
        setdropSearch(false)
        getSearchValue(val,dispatch)
        setsearchValue('')
        // setsearchValue(val)
        navigate(`./universalSearch`)
    }

    const onProfileClick = (text)=>{
        switch (text) {
            case "profile":
                // props.changeTab(text)
                navigate(`./${text}`)
                break;
            case "logout":
                 // audit log
                let payload = {"ModuleName":"Logout",
                    "TabName":"Logout",
                    "Activity":userName+" Logged Out",
                    "ActionBy":Storage.getItem('email'),
                    "Role":JSON.parse(Storage.getItem('userRoles')),
                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                    saveAuditLogData(payload, dispatch)
                //
                navigate('/login')
                break;
            case "notification":
                props.changeTab(text)
            default:
                break;
        }
    }
  return (
    <>
    <Navbar className="navbar navbar-light bf-global-header" >
        <Navbar.Brand href="./dashboard" className={`bf-sidebar-logo bf-logo-fuel-order ${props.showSideMenu ? 'bf-hide-visibility' : ''}`}>
            <img src={logo} alt='Barrel Fuel Logo'/>
        </Navbar.Brand>
        <NavItem className='bf-global-search-component'>
            <div xs={12} md={12} className='d-flex bf-relative'>
                <IoIosSearch className='search-icon'/>
                <input type={props.fieldData.search.type} placeholder={props.fieldData.search.text}
                onChange={(e) =>{handleSearchChange(e) }}
                value={searchValue}
                name = {"searchBar"}
                onKeyDown={(e) =>{onKeyDown(e) }}
                // onBlur={(e) =>{handleSearchBlur(e) }}
                className='custom-searchbar' />
                {dropSearch &&
            <ul className='bf-accout-sugesstion-dropdown'>
              { searchDropDown && searchDropDown.map((comp)=>(
                <li onClick={(e)=>{ondropDownClick(comp)}}>{comp}</li>
              ))}
            </ul>}
            </div>
        </NavItem>
        <div className='d-flex align-items-center'>
            <NavItem className='bf-global-notifications'>
                <div xs={12} md={12} className='d-flex'>
                    <Notifications onNotificationClick={onProfileClick}/>
                </div>
            </NavItem>
            <NavItem className='d-flex align-items-center justify-content-center'>
                <div className='bf-relative' onClick={(e)=>{onProfileClick('profile')}}>
                    {profileImage ? 
                        <img  className='bf-user-profile-img' src={profileImage}/>
                        :
                        <CgProfile className='bf-user-icon'/>}
                    <img src={editIcon} alt="Edit Icon" className='bf-edit-profile-icon'/>
                </div>
                <Dropdown
                    show={show}
                    onFocus={(e)=>{showMenu()}}
                    onMouseEnter={(e)=>{showMenu()}} 
                    onMouseLeave={(e)=>{hideMenu()}}
                    onBlur={(e)=>{hideMenu()}}
                >
                    <Dropdown.Toggle id="bf-menu-userdropdown" className="d-flex align-items-center">
                        <div className='d-flex d-flex-column align-items-start'>
                            <span className='bf-menu-user-name' title={`${userName}`}>{`Hi ${userName.charAt(0).toUpperCase() + userName.slice(1)}`}</span>
                            <span className='bf-access-level'>{accessLevel}</span>
                        </div>
                        <img src={arrowDownIcon} alt="arrow" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="bf-user-menu-dropdown">
                        {menuData && menuData.map((tab)=>(
                            <Dropdown.Item href="" onClick={(e)=>{onProfileClick(tab.name)}}>{tab.text}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </NavItem>
        </div>
    </Navbar>
    <div className='bf-mobile-view-header'>
        <div>
            <img src={MobileLogo} />
        </div>
        <span>
            {mobileHeaderText ? mobileHeaderText : ''}
        </span>
    </div>
    </>
  )
}

export default DashboardHeader