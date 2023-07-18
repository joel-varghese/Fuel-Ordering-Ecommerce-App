import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import './dashboard.scss';
import DashboardTabs from './tabs/DashboardTabs';
import SideMenu from './SideMenu';
import MobileFooter from './mobileFooter';
import DashboardHeader from './DashboardHeader';
import { Storage } from '../../controls/Storage';
import Loader from '../loader/loader';
import Home from '../home'
import { useNavigate } from 'react-router-dom';
import { fetchJSONData,  getUpdateProfileData } from '../../actions/dashboardServices/dasboardActions';
import { useDispatch, useSelector } from 'react-redux';
import { getCompany, getSelectedTab, getSelectedUser } from '../../actions/accountHome/accountHomeActions';
import { getMobileHeaderText, showClientscreen } from '../../actions/commonActions/commonActions';
import { getSelectedCompanyTax, getSelectedTab1 , getTaxSelectedUser} from '../../actions/taxFees/taxFeesHomeActions';
import {getDiscountSelectedCompany} from '../../actions/clientPortal/discountAction';
import {getSelectedTabFuel, getSelectedCompanyFP  } from '../../actions/fuelPriceHome/fuelPriceHomeActions';
import { getOrderTab } from '../../actions/orderActions/orderCompletedAction';
import { getIsReorder, getIsSummary} from '../../actions/orderPlacementActions/orderPlacementActions'
import { getOnboardingView } from '../../actions/accountEnrollService/accountEnrollAction';
const Dashboard = () => {
    const [jsonData, setJsonData] = useState({});
    const [changeTab, setChangeTab] = useState('Dashboard');
	const [userType, setUserType] = useState();
	const [profileData, setProfileData] = useState(null)
	const [addNewItem, setAddNewItem] = useState()
	const [moddata, setModData] = useState()
	const fldData = jsonData && jsonData.dashboardData && jsonData.dashboardData[0]
    const menuItems = fldData && fldData.dashboard;
	const orderButton = fldData && fldData.orderButton
	const headerData = fldData && fldData.header
	const navigate = useNavigate()
	let dispatch = useDispatch()
	const dashboardReducer = useSelector((state) => state.dashboardReducer)
	const dashboardJson = dashboardReducer && dashboardReducer.dashboardJson
	const profileDetails = dashboardReducer && dashboardReducer.profileData
	const payload = { 'blobname': "dashboard.json" };
	const [isFuelOrder, setIsFuelOrder] = useState(false);
	const [showSideMenu, setShowSideMenu] = useState(false);

    useEffect(() => {
		let userID = Storage.getItem("email") && Storage.getItem("email")!="undefined" ? Storage.getItem("email") : "arun666@gmail.com"
		let jsonPayload = {
			payload:{loginUserName: userID}
		}
		let user = Storage.getItem("userType")
        fetchJSONData(dispatch,payload)
		getUpdateProfileData(dispatch,jsonPayload,'','')
		setUserType(user)
		//getSelectedCompany(null,dispatch)
    }, []);

	useEffect(()=>{
		setJsonData(dashboardJson && dashboardJson.data && dashboardJson.data.data && dashboardJson.data.data)
		setProfileData(profileDetails && profileDetails.data && profileDetails.data)
	},[dashboardJson,profileDetails]);
	let currentPath = window.location.pathname.toString()
    currentPath = currentPath.split('/')
    useEffect(()=>{
        if(currentPath.includes('fuelorder') || currentPath.includes('review') || currentPath.includes('viewopen') || currentPath.includes('reports')) {
			setIsFuelOrder(true);
		} else {
			setIsFuelOrder(false);
		}
	    window.addEventListener('click', showLeftNav);
      },[currentPath])

	useEffect(() => {
		getMobileHeaderText(dispatch, 'Dashboard')
	},[])

	const menuTabs = menuItems && menuItems.length && menuItems.filter((m)=>
		m.users.includes(userType)
	)
	const showLeftNav = (e)=> {
		if(showSideMenu) {
			let allFields = e.path.map(ele => {
				return ele.className 
			})
			if(allFields.indexOf('bf-dashboard-body') !== -1) {
				setShowSideMenu(false)
			}
		}
	}
	const changeTheTab =(tabName) =>{
		getIsReorder(dispatch,false)
		getIsSummary(dispatch, false)
		if(tabName == "account"){
			let selectedType = Storage.getItem('userType')
			getCompany('',dispatch)
			if (selectedType === "Barrel Fuel"  ) {
				getSelectedTab( 'user',dispatch)
				getSelectedUser('internal',dispatch)
				
			  } else {
				getSelectedUser(selectedType.toLocaleLowerCase(),dispatch)
				getSelectedTab('company',dispatch)
			  }
		}else if(tabName == 'client-onboarding'){
			showClientscreen(true,dispatch)
			getOnboardingView('FBO',dispatch)
		}else if(tabName == 'tax-fees'){
			getSelectedTab1('taxes',dispatch)
			getSelectedCompanyTax('',dispatch)
			let selectedType = Storage.getItem('userType')
			if (selectedType === "Barrel Fuel"  ) {
				getTaxSelectedUser("internal",dispatch)
				
			  } else {
				getTaxSelectedUser(selectedType.toLocaleLowerCase(),dispatch)

			  }

		}else if(tabName == 'client-portal'){
			getDiscountSelectedCompany('',dispatch)
		} else if(tabName ==='fuel-pricing'){
			getSelectedCompanyFP('',dispatch)
			getSelectedTabFuel('active',dispatch)
		} else if(tabName ==='order'){
			getOrderTab('active',dispatch)
		}
		navigate(`./${tabName}`,{state:{clientonboard:true}})
		
	}
	const setAddNew = (addItem) => {
		setAddNewItem(addItem)
	}
	const handleSideMenu = (flag) => {
		setShowSideMenu(flag)
	}
	return (
		<>
		{profileData?
		<>
		{jsonData && jsonData.dashboardData  && menuTabs.length ?
		<div className={`d-flex bf-dashboard-section-container ${isFuelOrder ? 'bf-fuel-order-container' : ''}`}>
			<div className='menu-list'>
				<SideMenu 
					tabs={menuTabs && menuTabs}
					changeTab={changeTheTab}
					orderButton={orderButton}
					addNew = {setAddNew}
					handleSideMenu = {handleSideMenu}
					showSideMenu = {showSideMenu}
				 />
			</div>
			<div className='bf-dashboard-body'>
				<div className='bf-dashboard-header'>
					<DashboardHeader profileData={profileData} changeTab={changeTheTab} fieldData={headerData} showSideMenu = {showSideMenu}/>
				</div>
				<div className='bf-dashboard-tabs-container'>
					<DashboardTabs  addItem = {addNewItem} tbName={changeTab}  profileData={profileData}/>
				</div>
			</div>
			
			<MobileFooter  
				tabs={menuTabs && menuTabs}
				changeTab={changeTheTab}
				orderButton={orderButton}
				addNew = {setAddNew}
				handleSideMenu = {handleSideMenu}
				showSideMenu = {showSideMenu}
				profileData={profileData}
			/>
		</div> : ""
		}
		</>: <Loader/>}
		</>
	);
};


export default Dashboard;
