import React, {useState, useEffect}from 'react';
import Menubar from '../menubar/menubar';

import Footer from '../footer/footer';
import AboutDetails from './aboutDetails';

import './about.scss';

import { useDispatch, useSelector } from 'react-redux';
import { fetchJSONData} from '../../../actions/aboutActions/aboutActions';
import Loader from '../../../components/loader/loader';
import { bfaImageService } from '../../../actions/BFAServices/BFAImageService';

const About = () => {
    const [aboutData, setAboutData] = useState();
    const dispatch = useDispatch();
    const payload = {'blobname': "about.json"}
    const aboutReducer = useSelector(state => state.aboutReducer);
    const jsonData = aboutReducer ?.aboutJson;
    const [imageList, setImageList] = useState([]);
    let imagePayload = [];

    useEffect(() => {
        fetchJSONData(dispatch, payload)
    },[]);

    useEffect(() => {
        if(jsonData.data) {
            let aboutData = jsonData.data.data.aboutData;
            aboutData.landingScreen.map((item)=> {
                if(item.type == "image") {
                    imagePayload.push(item.imageDetails)
                }
            })
            aboutData.videoSection.map((item) => {
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
            aboutData.moreDetails.features.map((item) => {
                if(item.type == "image") {
                    imagePayload.push(item.imageDetails)
                }
            })
            bfaImageService(imagePayload).then(res => {
                setImageList(res.data)
            })
            setAboutData(aboutData)
        }
    },[jsonData]);

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
        <div className='bf-about'>
            {!imageList.length? <Loader /> : jsonData && aboutData &&
                <>
                {
                    <Menubar />
                }
                {
                    <AboutDetails getImageUrl={getImageUrl} landingScreen={aboutData}/>
                }
                {
                    <Footer/>
                }
                </>
            }
        </div>
    )
}

export default About