import React, {useState, useEffect}from 'react';
import Menubar from '../menubar/menubar';

//import {BFAJsonService} from '../../actions/bfaJsonService/bfaJsonService';
import Footer from '../footer/footer';
import DemoDetails from './demoDetails';

import './demo.scss';

import { useDispatch, useSelector } from 'react-redux';
import { fetchJSONData} from '../../../actions/demoActions/demoActions';
import { bfaImageService } from '../../../actions/BFAServices/BFAImageService';
const Demo = () => {
    const [demoData, setDemoData] = useState();
    const payload = {'blobname': "demo.json"};
    const dispatch = useDispatch();
    const demoReducer = useSelector(state => state.demoReducer);
    const jsonData = demoReducer ?.demoJson;
    const [imageList, setImageList] = useState([]);
    let imagePayload = [];

    // useEffect(() => {
    //     fetchJSONData({'blobname': "demo.json"}).then(data => {
    //         setDemoData(data.data.demoData);
    //     });
    // },[]);

    useEffect(() => {
        console.log(payload)
        fetchJSONData(dispatch, payload)
    },[]);

    useEffect(() => {
        console.log(jsonData)
         if(jsonData.data) {
            let demoData = jsonData.data.data.demoData;
            demoData.landingScreen.map((item)=> {
                if(item.type == "image") {
                    imagePayload.push(item.imageDetails)
                }
            })
            bfaImageService(imagePayload).then(res => {
                setImageList(res.data)
            })
            setDemoData(demoData);
         }
    },[jsonData]);

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

    return (
        <div className='bf-demo'>
            {demoData &&
                <>
                {
                    <Menubar />
                }
                {
                    <DemoDetails getImageUrl={getImageUrl} landingScreen={demoData}/>
                }
                {
                    <Footer />
                }
                </>
            }
        </div>
    )
}

export default Demo