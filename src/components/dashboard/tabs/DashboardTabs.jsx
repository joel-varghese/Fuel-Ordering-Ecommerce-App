import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import logo from '../../../assets/images/barrel_fuel_logo.png';
import { IconContext } from "react-icons";
import { FaGasPump, FaMoneyCheckAlt, FaMoneyBill } from 'react-icons/fa';
// import { MdSupervisorAccount } from 'react-icons/md';
// import { TbDiscount2 } from 'react-icons/tb';
// import { HiDocumentReport } from 'react-icons/hi';
// import { FiEdit } from 'react-icons/fi';
import '../dashboard.scss';
import { ImAirplane, ImHome } from 'react-icons/im';
import { IoIosListBox, IoIosSearch } from 'react-icons/io';
import { BsCalendarWeekFill, BsCalculator } from 'react-icons/bs';
import { bfaJsonService } from '../../../actions/BFAServices/BFAJsonService';
import Notifications from '../../notifications/notifications';
import ProfileInfo from '../Profile/Profile';
import AccountHome from '../../account/accountHome'
import { MenuList } from '@mui/material';
import MyProfile from '../../myProfile/myProfile';
import Statistics from '../Statistics/statistics'
import UserProfile from '../../myProfile/UserProfile';
import AccountEnroll from '../../accountEnroll/accountEnroll';
import { Outlet } from 'react-router-dom';


const DashboardTabs = ( props) => {

    let paylod = { 'blobname': process.env.REACT_APP_STATISTICS };

    const [jsonData, setJsonData] = useState({});


    useEffect(() => {
        bfaJsonService(paylod).then(data => {
            setJsonData(data && data.data);
            // setInitialState(data.data);
        });
    }, []);

    let statisticsData = jsonData.staticData && jsonData.staticData && jsonData.staticData[0].statistics;
    const renderComponent = (name) => {
		
        switch(name){
            case "account":
                return(<AccountHome addNewItem={props.addItem}/>)
                break;
            case "profile":
                return(<UserProfile />)
                break;
            case "order":
                return(< UserProfile profileData={props.profileData}/>)
                break;
            case "notification":
                return(<Notifications />)
            case "clientOnboarding":
                    return(<AccountEnroll />)
            default:
                return(<Statistics/>)

        }
    
}

    return (
        <>
            {/* {renderComponent(props.tbName)} */}
            <Outlet/>
        </>
    );
};

export default DashboardTabs;
