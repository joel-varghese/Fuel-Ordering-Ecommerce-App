import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ImAirplane, ImHome } from 'react-icons/im';
import { FaGasPump, FaMoneyCheckAlt, FaMoneyBill } from 'react-icons/fa';
import { MdSupervisorAccount } from 'react-icons/md';
import { IoIosListBox, IoIosSearch } from 'react-icons/io';
import logo from '../../assets/images/barrel_fuel_logo.png';
import './sideMenu.scss';
import { Button, Col } from 'react-bootstrap';
import { Storage } from '../../controls/Storage';
import Navbar from 'react-bootstrap/Navbar';
import AuditLogIcon from '../../assets/images/auditlog_icon.svg';
import ReportsIcon from '../../assets/images/reports.svg';
import clientOnboardIcon from '../../assets/images/client-onboarding_icon.svg';
import clientPortalIcon from '../../assets/images/client_portal.svg';
import fuelPriceIcon from '../../assets/images/fuel_pricing.svg';
import { barrelFuelAccess, getAccessLevel,getSuperAccess } from '../../controls/commanAccessLevel';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJSONData, getSelectedTab, getSelectedUser } from '../../actions/accountHome/accountHomeActions';
import { enablePopUp } from '../../actions/commonActions/commonActions';
import { FiMenu } from "react-icons/fi";
import CollapseMenuIcon from '../../assets/images/collapse_arrow.svg';
import { getIsEditMultiple, getIsEditSingle, getIsMultiSummary, getIsOrderAccept, getIsOrderClose, getIsPreviousScreen, getIsPricePending, getIsReorder, getIsSummary, getLegData, getLegLevel, getLegType, getMultiLegPricePending, getMultipleLeg} from '../../actions/orderPlacementActions/orderPlacementActions'
import { invoiceScreen } from '../../actions/orderActions/disputeAction';
import { getClickViewOrder } from '../../actions/orderPlacementActions/orderViewHomeActions';
import { getEditLegData, getIsEdit } from '../../actions/orderPlacementActions/multiLegActions';
import Admin from '../../assets/images/bf_admin_icon.svg';
import { superLevelSideMenus } from '../../controls/commonConstants';
import { getOrderDetails, setMobileOrderDetails } from '../../actions/searchFuelOrder/searchFuelOrderActions';
const drawerWidth = 230;

export default function SideMenu(props) {
    const navigate = useNavigate()
    const [tabs, setTabs] = useState()
    const [tabClicked, setTabClicked] = useState(false)
    const [userType, setUserType] = useState('Barrel Fuel');
    const [selectedMenu, setSelectedMenu] = useState('dashboard');
    const [accessLevel, setAccessLevel] = useState();
    const [superaccess, setSuperAccessLevel] = useState();
    const [currentTab, setCurrentTab] = useState("")
    const [showSideMenu, setShowSideMenu] = useState(false)
    const commonReducer = useSelector((state) => state.commonReducer);
    const loggedinUserType = commonReducer?.loggedInUserType?.data;
    const accountHomeReducer = useSelector((state) => state.accountHomeReducer);
    const selectedUser = accountHomeReducer && accountHomeReducer.selectedUser && accountHomeReducer.selectedUser.user;
    const selectedTab = accountHomeReducer && accountHomeReducer.selectedTab && accountHomeReducer.selectedTab;
    const selectedCompany = accountHomeReducer && accountHomeReducer.selectedCompany && accountHomeReducer.selectedCompany.company;

    const dispatch = useDispatch()
    let currentPath = window.location.pathname.toString()
    currentPath = currentPath.split('/')
    useEffect(()=>{
      setUserType(loggedinUserType)
      setTabs(props.tabs)
      setAccessLevel(getAccessLevel(Storage.getItem('userType'), Storage.getItem('accessLevel')));
      setSuperAccessLevel(getSuperAccess(Storage.getItem('userType'), Storage.getItem('accessLevel')));
    },[props.tabs])
    useEffect(()=>{
      if(process.env.REACT_APP_ENV && (process.env.REACT_APP_ENV.toUpperCase() != 'BFSIT' && process.env.REACT_APP_ENV.toUpperCase() != 'BFDEV')) {
          if(currentPath.length === 2){
            setCurrentTab("home")
          }
          else {
            setCurrentTab(currentPath[2])
          }
          if(currentPath[2] === "account"){
            setTabClicked(true)
          }
        } else {
          if(currentPath.length === 3){
            setCurrentTab("home")
          }
          else {
            setCurrentTab(currentPath[3])
          }
          if(currentPath[3] === "account"){
            setTabClicked(true)
          }
      }
    },[currentPath])
    const onTabClick = (item)=>{
      if(accessLevel) {
        props.addNew()
      }
    props.changeTab(item.link)
      setSelectedMenu(item.name)
      if(item.name == "account"){
        setTabClicked(true)
      }
      else{
        setTabClicked(false)
      }
      if(props.handleMobileMenu) { 
        props.handleMobileMenu()
      };
    }
    const getTabName = (name)=>{
      let tabName = name.toLowerCase()
      let company = Storage.getItem("organizationName") ? Storage.getItem("organizationName") : ''
      // if(tabName == "account"){
      //   if(userType !== "Barrel Fuel"){
      //     if(company != undefined ){
      //       tabName = company
      //     }
      //   }
      // }
      return tabName
    }
    const handleAddClick = (e, item) => {
      if(accessLevel) {
        let selectedUserType = selectedUser
        Storage.setItem('selectedTab', item.actions)
        // props.addNew({"name": item.actions})
        if(item.actions == 'user') {
          if (selectedUserType === 'operator' || selectedUserType==='fbo') {
            navigate(`/dashboard/adduser`, {state:{addNewUser: true, selectedUser: selectedUserType}})
          } else {
            navigate(`/dashboard/admin-adduser`, {state:{addNewUser: true, selectedUser: selectedUserType}})
          }
        }
        else{
          getSelectedTab(item.actions,dispatch)
          enablePopUp(true,dispatch)
          navigate(`/dashboard/account/${item.actions}`, {state:{enableModal:true}})
        }
      }
    }
    const newFuelOrder = ()=>{
      getIsReorder(dispatch,false)
      getIsSummary(dispatch, false)
      getIsOrderAccept(dispatch,false)
      invoiceScreen(false,dispatch)
      getIsPreviousScreen(dispatch,'')
      getClickViewOrder(dispatch,false)
      getMultipleLeg(dispatch, false)
      getIsPricePending(dispatch,false)
      getMultiLegPricePending(dispatch,false)
      getLegData(dispatch,{})
      getLegType(dispatch, false)
      getLegLevel(dispatch,0)
      getIsEdit(dispatch,false);
      getIsEditSingle(dispatch,false)
      getIsOrderClose(dispatch,false)
      getIsEditMultiple(dispatch,false)
      getEditLegData(dispatch,{})
      getOrderDetails({},dispatch)
      setMobileOrderDetails({},dispatch)
      getIsMultiSummary(dispatch,false)
      if(loggedinUserType.toLowerCase()!=='fbo'){
        navigate('./fuelorder');
      }
      else{
        navigate('./order')
      }
    }
    const getIcons = (key)=>{
        switch (key) {
            case "home":
                return(
                    <ImHome/>
                )
                break;
            case "account":
                return(
                    <MdSupervisorAccount/>
                )
                break;
            case "order":
                return(
                    <IoIosListBox/>
                )
                break;
            case "client-onboarding":
                return(
                  <img src={clientOnboardIcon} alt="reports"/>
                )
                break;
            case "fuel-pricing":
                return(
                  <img src={fuelPriceIcon} alt="Fuel Pricing" className='bf-fuel-pricing'/>
                )
                break;
            case "tax-fees":
                return(
                    <FaMoneyCheckAlt/>
                )
                break;
            case "client-portal":
                return(
                  <img src={clientPortalIcon} alt="client portal" className='bf-client-portal-icon'/>
                )
                break;
                case "reports":
                    return(
                        <img src={ReportsIcon} alt="reports"/>
                    )
                    break;
                    case "admin":
                return(
                  <img src={Admin} alt="Fuel Pricing" className='bf-admin-icon'/>
                )
                break;
                case "audit-logs":
                    return(
                      <img src={AuditLogIcon} alt="audit log" className='bf-audit-log-icon'/>
                    )
                    break;
            default:
                break;
        }
    }
    const showFullMenu = (flag) => {

      // setShowSideMenu(!showSideMenu)
      props.handleSideMenu(flag);
    }
  return (
    <Box sx={{ display: 'flex' }} className={`bf-side-menu ${props.showSideMenu ? 'bf-show-side-menu': ''}`}>
      
      <Drawer
        className='bf-sideBar'
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Col xs={12} md={12} className='bg-white d-flex d-flex-column align-items-center'>
          <Navbar.Brand href= {"./dashboard"} className='bf-sidebar-logo'>
              <img src={logo} alt='Barrel Fuel Logo'/>
          </Navbar.Brand>
          <Button variant='dark' className='btn btn-primary btn-sm fs-md order-btn' size='lg' onClick={newFuelOrder}>
              {loggedinUserType.toLowerCase()=='fbo' ? props.orderButton.text2 : props.orderButton.text}
          </Button>
      </Col>
      
      <div className='bf-side-tabs-container'>
        <img src={CollapseMenuIcon} className="bf-slideIn" onClick={() => {showFullMenu(false)}}/>
        <List className='bf-side-tabs'  >
          {tabs && tabs.map((text, index) => (
            <>
            {text.name === "auditLogs" && !superaccess?"":
            <ListItem key={text.name} disablePadding>
              <ListItemButton className={`${currentTab == text.link ? "bf-active-menu-item" : ''} ${loggedinUserType.toLowerCase() == 'fbo' && text.hideOnMobileFBO ? 'bf-hide-on-mobile' : ''} ${text.hideOnMobile && text.hideOnMobile == true ? 'bf-hide-on-mobile' : ''} bf-menu-${text.name}`} onClick={(e)=>{onTabClick(text)}}>
                <ListItemIcon className='bf-tab-icon'>
                  {getIcons(text.link)}
                </ListItemIcon>
                <ListItemText className='bf-menu-item-text' primary={getTabName(text.text)} />
              </ListItemButton>
            </ListItem>}
            {text.subfields && text.subfields.length && tabClicked ?
              text.subfields.map((flds)=>{
                if(flds.user.toLowerCase() == selectedUser){
                  return(
                    <div className={`${selectedUser == "internal" ? 'bf-internal-user-actions' : (selectedUser == 'operator' ? 'bf-operator-actions' : 'bf-fbo-actions') } bf-menu-actions`}>
                      {flds.fields.map((fd)=>{
                        
                        return(<>
                        {(fd.actions=='location' || fd.actions=='aircraft' )?(
                          <ListItem key={fd.name} disablePadding>
                          <ListItemText className={superaccess&&selectedCompany?'' :  'bf-disable-add'} primary={fd.fieldName} onClick={(e) =>superaccess && selectedCompany&&handleAddClick(e, fd)} />
                          </ListItem>
                        ):(
                          <ListItem key={fd.name} disablePadding>
                          <ListItemText className={accessLevel&&selectedCompany||(selectedUser=='internal' && !barrelFuelAccess(Storage.getItem('userType'), Storage.getItem('accessLevel'))) ?'': 'bf-disable-add' } primary={fd.fieldName} onClick={(e) =>  (selectedCompany || selectedUser == "internal"&&!barrelFuelAccess(Storage.getItem('userType'), Storage.getItem('accessLevel'))) && handleAddClick(e, fd)}/>
                          </ListItem>
                        )
                        }</>)})// Admin Basic
                      
                      }
                    </div>
                  )
                }
              }) : ""}
              </>
          ))}
        </List>
        </div>
      </Drawer>
      <div className='bf-fuel-order-nav-links'>
        <div className='bf-side-tabs'>
          <div>
            <FiMenu className='bf-fuel-order-hamburger-menu' onClick={() => {showFullMenu(true)}}/>
          </div>
          <div className='bf-fuel-order-menu-items-list'>
            {tabs && tabs.map((text, index) => (
              <div key={text.name} disablePadding>
                <div className={`${currentTab == text.link ? "bf-active-menu-item" : ''} bf-menu-${text.name}`} onClick={(e)=>{onTabClick(text)}}>
                  <div className='bf-tab-icon'>
                    {getIcons(text.link)}
                  </div>
                  <div className='bf-menu-item-text'>{getTabName(text.text)} </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Box>
  );
}
