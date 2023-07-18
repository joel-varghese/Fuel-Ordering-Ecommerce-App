import React, { useState, useEffect } from 'react';
import MobileLogo from '../../assets/images/bf-mobile-dashboard-logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import { getMobileHeaderText } from '../../actions/commonActions/commonActions';
import './mobileHeader.scss';
import { Navbar } from 'react-bootstrap';

const MobileHeader = (props) => { 
    
    const dispatch = useDispatch()
    const commonReducer = useSelector(state => state.commonReducer);
    const mobileHeaderText = commonReducer && commonReducer.mobileHeaderText && commonReducer.mobileHeaderText.data;

    useEffect(()=> {
        getMobileHeaderText(dispatch, props.name)
    },[])
    return (
        
        <div className='bf-mobile-view-header bf-mobile-header-container'>
        <div>
        <Navbar.Brand href={"./"}>
            <img src={MobileLogo} />
            </Navbar.Brand>
        </div>
        <span>
            {mobileHeaderText ? mobileHeaderText : ''}
        </span>
    </div>
    )
}

export default MobileHeader;