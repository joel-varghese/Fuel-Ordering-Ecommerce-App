import React, {useState, useEffect}from 'react';
import Menubar from './components/menubar/menubar';
import VideoScreen from './components/videoScreen/videoScreen';
import BarrelOfferings from './barrelOfferings/barrelOfferings';

import './landingPage.scss';
import Footer from './components/footer/footer';
import Feature from './components/features/feature';

import { useDispatch, useSelector } from 'react-redux';
import { fetchJSONData} from '../actions/landingPageActions/landingPageActions';
import { bfaImageService } from '../actions/BFAServices/BFAImageService';
import Loader from '../components/loader/loader';

const LandingPage = () => {
    const [landingData, setLandingData] = useState({});
    const dispatch = useDispatch();
    const payload = {'blobname': "landingPage.json"}
    const landingReducer = useSelector(state => state.landingReducer);
    const jsonData = landingReducer ?.landingJson;
    const [imageList, setImageList] = useState([]);
    let imagePayload = [];

    useEffect(() => {
        var element = document.querySelector('.grecaptcha-badge'); 
        if(element) { element.parentNode.removeChild(element);}
        fetchJSONData(dispatch, payload)
    },[]);

    useEffect(() => {
        if(jsonData.data) {
            let pageData = jsonData.data.data.landingPageData

            pageData && pageData.landingScreen.map((item)=> {
                if(item.type == "video") {
                    let video = item.imageDetails.url;
                    let videoObject = [
                        {
                            "name": item.imageDetails.name,
                            "url": video + '.mp4'
                        },
                        {
                            "name": item.imageDetails.name+'1',
                            "url": video + '.webm'
                        }
                    ]
                    imagePayload.push(...videoObject)
                }
            })
            pageData && imagePayload.push(pageData.bfOfferings.graph.imageDetails)
            pageData && pageData.bfOfferings.offeringContent.map((item)=> {
                if(item.type == "image" || item.type == 'listImage' || item.type == 'imageStore') {
                    imagePayload.push(item.imageDetails)
                }
            })
            pageData && pageData.bfOfferings.bfMobileDeals.map((item)=> {
                if(item.type == "image") {
                    imagePayload.push(item.imageDetails)
                }
            })
            pageData && pageData.bfOfferings.bfDeals.map((item)=> {
                if(item.type == "image") {
                    imagePayload.push(item.imageDetails)
                }
            })
            pageData && imagePayload.push(pageData.bfOfferings.bfSaving.imageDetails)
            pageData && imagePayload.push(pageData.bfOfferings.bfSaving.mobileImage.imageDetails)
            pageData && pageData.bfFeatures.features.map((item)=> {
                if(item.type == "image") {
                    imagePayload.push(item.imageDetails)
                }
            })
            pageData && pageData.footerScreen.map((item)=> {
                if(item.type == "video") {
                    let video = item.imageDetails.url;
                    let videoObject = [
                        {
                            "name": item.imageDetails.name,
                            "url": video + '.mp4'
                        },
                        {
                            "name": item.imageDetails.name+'1',
                            "url": video + '.webm'
                        }
                    ]
                    imagePayload.push(...videoObject)
                }
            })

            bfaImageService(imagePayload).then(response=>{
                setImageList(response.data)
            })
            setLandingData(pageData)
        }
    },[jsonData && jsonData.data])

    const getImageUrl = (imageDetails, type) => {
        let images = imageList;
        let url = '';
        let videoURLs = {}
        images.forEach((item,index) => {
            if(item.name === imageDetails.name) {
                if(type == 'video') {
                    videoURLs['mp4'] = item.url;
                    videoURLs['webm'] = images[index+1].url;
                } else {
                    url = item.url
                }
            }
        })
        return type == 'video' ? videoURLs : url;
    }


    return (
        <div className='bf-landing-page'>
            {!imageList.length ? <Loader /> : jsonData &&
                <>
                {
                    <Menubar />
                }
                {
                    landingData.landingScreen &&
                    <VideoScreen getImageUrl={getImageUrl} content={landingData.landingScreen} />
                }
                {
                    landingData.bfOfferings &&
                    <BarrelOfferings getImageUrl={getImageUrl} offerings={landingData.bfOfferings}/>
                }
                {
                    landingData.bfFeatures &&
                    <Feature getImageUrl={getImageUrl} bfFeatures={landingData.bfFeatures}/>
                }
                {
                    landingData.footerScreen &&
                    <VideoScreen getImageUrl={getImageUrl} content={landingData.footerScreen} className="footer-video"/>
                }
                {
                    <Footer />
                }
                </>
            }
        </div>
    )
}

export default LandingPage