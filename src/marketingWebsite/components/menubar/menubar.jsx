import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, {useState, useEffect}from 'react';
//import {BFAJsonService} from '../../actions/bfaJsonService/bfaJsonService';
import './menubar.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJSONData} from '../../../actions/menubarActions/menubarActions';
import { bfaImageService } from '../../../actions/BFAServices/BFAImageService';
import { HiMenu } from "react-icons/hi";

import { FaBars } from 'react-icons/fa';

const Menubar = props => {
    const [headerData, setHeaderData] = useState();
    const dispatch = useDispatch();
    const payload = {'blobname': "header.json"}
    const manubarReducer = useSelector(state => state.manubarReducer);
    const jsonData = manubarReducer && manubarReducer.menubarJson && manubarReducer.menubarJson;
    let imagePayload=[];
    let [imageList,setImageList] = useState([]);
    let currentPath = window.location.pathname.toString()
    currentPath = currentPath.split('/')
    // console.log(currentPath[2])
    let path = 2;
    if(process.env.REACT_APP_ENV && (process.env.REACT_APP_ENV.toUpperCase() != 'BFSIT' && process.env.REACT_APP_ENV.toUpperCase() != 'BFDEV')) {
        path = 1
    } else {
        path = 2
    }
    useEffect(() => {
        console.log(payload)
        fetchJSONData(dispatch, payload)
    },[]);

    useEffect(() => {
        console.log(jsonData)
         if(jsonData.data) {
            let headerData = jsonData.data.data.landingPageData.navigation
            headerData.logo.map((item) => {
                if(item.type == "image") {
                    imagePayload.push(item.imageDetails)
                }
            })
            bfaImageService(imagePayload).then(response=>{
                setImageList(response.data)
            })
            setHeaderData(headerData)
        }
    },[jsonData])
    
    const getImageUrl = (imageDetails) => {
        let images = imageList;
        let url = ''
        images.forEach((item,index) => {
            if(item.name === imageDetails.name) {
                url = item.url
            }
        })
        return url;
    }

    return (<>{headerData && 
        <Navbar fixed="top" bg="white" expand="lg" className={`bf-menubar bf-menu-env-${process.env.REACT_APP_ENV && process.env.REACT_APP_ENV}`}>
            <Container>
                <Navbar.Brand href="./" className="bf-landing-logo">
                    <img src={getImageUrl(headerData.logo[0].imageDetails)} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav">
                    <HiMenu className='bf-menu-icon' />
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav>
                        {headerData.navLinks.map((nav) => 
                            <Nav.Link className={currentPath[path] && currentPath[path].toUpperCase() === nav.text.toUpperCase() || (nav.text.toUpperCase() == 'HOME' && currentPath[path] === '') ? 'bf-active-nav' : ''}  href={nav.url}>{nav.text}</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    }</>
    )
}

export default Menubar;