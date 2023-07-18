import { Nav } from "react-bootstrap";
import React, {useState, useEffect}from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchJSONData} from '../../../actions/footerActions/footerActions';
import './footer.scss';
import { bfaImageService } from "../../../actions/BFAServices/BFAImageService";

const Footer = () => {
    const [footerData, setFooterData] = useState();
    const dispatch = useDispatch();
    const payload = {'blobname': "footer.json"}
    const footerReducer = useSelector(state => state.footerReducer);
    const jsonData = footerReducer && footerReducer.footerJson && footerReducer.footerJson;
    let imagePayload=[];
    let [imageList,setImageList] = useState([])
    useEffect(() => {
        fetchJSONData(dispatch, payload)
    },[]);

    useEffect(() => {
         if(jsonData.data) {
            let footerData = jsonData.data.data.footerData.footer;
            footerData.logo.map((item) => {
                if(item.type == "image") {
                    imagePayload.push(item.imageDetails)
                }
            })
            footerData.social.map((item) =>{
                if(item.type == "image") {
                    imagePayload.push(item.imageDetails)
                }
            })
            bfaImageService(imagePayload).then(response=>{
                setImageList(response.data)
            })
           setFooterData(footerData);
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

    return(
        <div className="d-flex align-items-center justify-content-between bf-footer">
            {footerData &&
                <>
                    <a className="bf-footer-image" href={"./"} >
                        {footerData.logo.map((item,index) => 
                        <>
                            <img src={getImageUrl(item.imageDetails)} className={`${index == 0 ? 'bf-desktop-logo' : 'bf-mobile-footer-logo'} `}/>
                         </>       
                        )}
                    </a>

                    <div className="bf-footer-links d-flex">
                        {footerData.links.map((link) => 
                            <Nav.Link href={link.url}>{link.text}</Nav.Link>
                        )}
                    </div>
                    <div className="d-flex bf-footer-social">
                        {footerData.social.map((link) => 
                            <Nav.Link href={link.url}>
                                <img src={getImageUrl(link.imageDetails)} />
                            </Nav.Link>
                        )}
                    </div>
                </>
            }
        </div>
    )
}

export default Footer;