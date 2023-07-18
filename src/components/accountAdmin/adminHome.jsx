import React, { useState, useEffect } from 'react';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { useDispatch, useSelector } from 'react-redux';
import { Nav } from 'react-bootstrap';
import Loader from '../loader/loader';
import './admin.scss'
import { Outlet,useNavigate } from 'react-router-dom';
import { getAdminTab } from '../../actions/accountAdminAction/adminAction';


export default function AdminHome() {
    const [isBusy, setBusy] = useState(true)
    const [adminTab, setAdminTab] = useState("company");
    const [adminJson,setAdminJson] = useState({})
    const [modalText, setModalText] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const params = {"blobname":"admin.json"}
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const AdminReducer = useSelector((state) => state.AdminReducer);
    const selectedTab = AdminReducer?.selectedTabAdmin?.data;

    useEffect(() => {
        bfaJsonService(params).then(response=>{
            setAdminJson(response.data)
            setAdminTab(adminTab)
            setBusy(false)
        })
      },[selectedTab]);
      useEffect(()=>{
        navigate(`./${adminTab}`)
      },[adminTab])
      const getTabs = () => {
        return (
          <div className='bf-tabs-container bf-mrgt20'>
            {adminJson &&  adminJson ?
              <>
                {adminJson.tabs.map((tab) => (
    
                  <Nav variant="tabs" className='bf-tabs' >
                    <Nav.Item>
                      <Nav.Link className={adminTab == tab.name ? "bf-active-tab" : ''} onClick={() => { getAccountTabName(tab.name) }}>{tab.title}</Nav.Link>
                    </Nav.Item>
                  </Nav>
                ))}
              </> : null}
          </div>
        )
      }

      const getAccountTabName = (tab) => {
        getAdminTab(tab,dispatch)
        setAdminTab(tab)
      }

      return (<>
        {isBusy ? (
          (<Loader/>)
        ) : ( 
            <div className='bf-account-home-container'>
            <div className='bf-account-home bf-admin-account-container'>
            <div className='bf-home-company-name bf-search-result-name'>Account Administration</div>
              {getTabs()}
              <div className='tab-details-container  bf-admin-company-changes'><Outlet/></div>
          </div>
          </div>
              )}                  
      </>    
    );
    
}