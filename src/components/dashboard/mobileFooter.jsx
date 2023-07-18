import MenuIcon from '../../assets/images/footer-menu-icon.svg'
import Notifications from '../../assets/images/mobile-notification-icon.svg'
import Add from '../../assets/images/mobile-add-fuel.svg'
import Favorites from '../../assets/images/mobile-favorites.svg'
import Orders from '../../assets/images/mobile-orders-icon.svg'
import Logout from '../../assets/images/logout-icon.svg'
import FooterHome from '../../assets/images/footer_home.svg'
import FooterOrders from '../../assets/images/footer_orders.svg'

import './mobileFooter.scss';
import { useEffect, useState } from 'react'
import SideMenu from './SideMenu'
import { fetchJWTTokenFromLogin } from '../../actions/loginService/loginActions'
import { getSelectedTab, getSelectedUser } from '../../actions/accountHome/accountHomeActions'
import { getMobileFavoriteFbo, getMobileHeaderText } from '../../actions/commonActions/commonActions';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import {Storage} from '../../controls/Storage';
import { CgProfile } from 'react-icons/cg'
import { Nav } from 'react-bootstrap'
import { getOrderTab } from '../../actions/orderActions/orderCompletedAction'
import { getIsEditMultiple, getIsEditSingle, getIsMultiSummary, getIsOrderAccept, getIsOrderClose, getIsPreviousScreen, getIsPricePending, getIsReorder, getIsSummary, getLegData, getLegLevel, getLegType, getMultiLegPricePending, getMultipleLeg } from '../../actions/orderPlacementActions/orderPlacementActions'
import { invoiceScreen } from '../../actions/orderActions/disputeAction'
import { getClickViewOrder } from '../../actions/orderPlacementActions/orderViewHomeActions'
import { getEditLegData, getIsEdit } from '../../actions/orderPlacementActions/multiLegActions'
import { getOrderDetails, setMobileOrderDetails } from '../../actions/searchFuelOrder/searchFuelOrderActions'
export default function MobileFooter(props) {
    const [showMenuItems, setShowMenuItems] = useState(false);
    const [profileImage, setprofileImage] = useState(null);
    const [selectedTab, setSelectedTab] = useState('Dashboard');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const commonReducer = useSelector((state) => state.commonReducer);
    const loggedinUserType = commonReducer?.loggedInUserType?.data;
    useEffect(()=>{
        let profileDetails = props.profileData
        let imageData = profileDetails && profileDetails.profilePicture? profileDetails.profilePicture: '';
        let newData = ''
        if(imageData){
            newData = `data:image/jpg;base64,${imageData}`
        }
        setprofileImage(newData)
    },[props.profileData])

    const clearReduxForNewFuelOrder = () => {
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
    }

    const onProfileClick = (text)=>{
        switch (text) {
            case "profile":
                // props.changeTab(text)
                navigate(`./${text}`)
                break;
            case "logout":
                fetchJWTTokenFromLogin(dispatch, {})
                Storage.removeItem('jwtToken')
                Storage.removeItem('selectedUserType')
                Storage.removeItem('selectedTab')
                Storage.removeItem('userRoles')
                Storage.removeItem('organizationName')
                Storage.removeItem('organizationId')
                Storage.removeItem('email')
                Storage.removeItem('userType')
                Storage.removeItem('accessLevel')
                getSelectedUser("", dispatch)
                getSelectedTab('',dispatch)
                navigate('/login')
                break;
            case "notification":
                getSelectedTab("Notification",dispatch)
                props.changeTab(text);
                break;
            case "orders":
                getOrderTab('active',dispatch)
                navigate(`./order`);
                break;
            case "dashboard":
                setSelectedTab('Dashboard')
                getSelectedTab("Dashboard",dispatch)
                getMobileHeaderText(dispatch,"Dashboard")
                navigate(`./`)
                break;
            case "neworder":
                clearReduxForNewFuelOrder()
                getMobileFavoriteFbo(dispatch,false);
                navigate(`./fuelorder`); 
                break;
            case "favorites":
                clearReduxForNewFuelOrder()
                getSelectedTab("Favorites",dispatch)
                getMobileFavoriteFbo(dispatch,true);
                navigate(`./fuelorder`);
                break;
            case "locations":
                getSelectedTab("location",dispatch)
                navigate(`./account`);
                break;
            case "notification":
                getSelectedTab("Notifications",dispatch)
                getMobileHeaderText(dispatch,"Notifications")
                navigate(`./notification`);
                break;
            default:
                break;
        }
    }

    const handleMobileMenu = () => {
        setShowMenuItems(!showMenuItems);
        getSelectedTab("More",dispatch)
    }

    return(
        <div className="bf-mobile-footer-menus">
            <div className={`d-flex d-flex-column ${selectedTab == 'Dashboard' || selectedTab == 'Orders' ? 'bf-tab-active':''}`}>
            {
            loggedinUserType.toLowerCase() != 'fbo' ?
                <>
                    <img className='bf-footer-ordres' onClick={()=>onProfileClick('orders')} src={Orders} />
                    <span onClick={()=>onProfileClick('orders')}>Orders</span>
                </> : 
                <>
                    <img onClick={()=>onProfileClick('dashboard')} src={FooterHome} />
                    <span onClick={()=>onProfileClick('dashboard')}>Dashboard</span>
                </>
            }
            </div> 
            <div className={`d-flex d-flex-column ${selectedTab == 'Locations' || selectedTab == 'Favorites' ? 'bf-tab-active':''}`}>
                {loggedinUserType.toLowerCase() == 'fbo' ?
                    <>
                        <img onClick={()=>onProfileClick('locations')} src={Favorites} />
                        <span onClick={()=>onProfileClick('locations')}>Locations</span>
                    </> : 
                    <>
                        <img onClick={()=>onProfileClick('favorites')} src={Favorites} />
                        <span onClick={()=>onProfileClick('favorites')}>Favorites</span>
                    </>
                }
            </div>
            <div className='d-flex d-flex-column'>
            {loggedinUserType.toLowerCase() != 'fbo' ?
                <>
                    <img onClick={()=>onProfileClick('neworder')}src={Add} />
                    <span onClick={()=>onProfileClick('neworder')} >New Order</span>
                </> : 
                <>
                    <img onClick={()=>onProfileClick('orders')} src={FooterOrders} />
                    <span onClick={()=>onProfileClick('orders')} >Orders</span>
                </>
            }
            </div>
            <div onClick={()=>onProfileClick('notification')} className={`d-flex d-flex-column ${selectedTab == 'Notification' ? 'bf-tab-active':''}`}>
                <img src={Notifications} />
                <span>Notifications</span>
            </div>
            <div className={`d-flex d-flex-column  bf-more ${selectedTab == 'More' ? 'bf-tab-active':''}`} onClick={handleMobileMenu}>
                <img src={MenuIcon} />
                <span>More</span>
            </div>
            {showMenuItems &&
                <div className="bf-mobile-dashboard-nav">
                    <SideMenu
                        tabs={props.tabs}
                        changeTab={props.changeTab}
                        orderButton={props.orderButton}
                        addNew = {props.addNew}
                        handleSideMenu = {props.handleSideMenu}
                        showSideMenu = {props.showSideMenu}
                        handleMobileMenu = {handleMobileMenu} 
                    />
                    <div className='bf-mobile-profile-nav'>
                        <div className='profile' onClick={()=>onProfileClick('profile')}>
                        {profileImage ? 
                        <img  className='bf-user-profile-img' src={profileImage}/>
                        :
                        <CgProfile className='bf-user-icon'/>} My Profile
                        </div>
                        <div className="logout" onClick={()=>onProfileClick('logout')}>
                            <img src={Logout} /> Logout
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}