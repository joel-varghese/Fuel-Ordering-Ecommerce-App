import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss'
import CustomModal from '../customModal/customModal';
import { CgProfile } from 'react-icons/cg';
import EditWhiteIcon from '../../assets/images/edit_white_icon.svg';
import './myProfile.scss'
import { useSelector } from 'react-redux';
import Loader from '../loader/loader';

function ProfileImage(props) {
    const [src, setSrc] = useState(null);
    const [crop, setCrop] = useState({ aspect: 16 / 9 });
    const [image, setImage] = useState(null);
    const [output, setOutput] = useState();
    const [modalShow, setModalShow] = useState(false);
    const [imageData, setImageData]= useState();
    const [imageBlob, setImageBlob] = useState()
    const [bannerImage,setBannerImage] = useState(null);
    const [hidecrop,sethidecrop]=useState(true)
    const dashboardReducer = useSelector((state) => state.dashboardReducer)
    const profileD = dashboardReducer && dashboardReducer.profileData && dashboardReducer.profileData.data && dashboardReducer.profileData.data
    
    useEffect(()=>{
      const imageStirng = profileD && profileD?.profilePicture && profileD.profilePicture
      const bannerSrc = profileD && profileD?.bannerImage && profileD.bannerImage
      let newSrc = ''
      let newBannerSrc = ''
      if(imageStirng){
        newSrc = `data:image/jpg;base64,${imageStirng}`
      }
      if(bannerSrc){
        newBannerSrc = `data:image/jpg;base64,${bannerSrc}`
      }
      setOutput(newSrc)
      setImageData(newSrc)
      setBannerImage(newBannerSrc)
    },[profileD])

    useEffect(()=>{
      sethidecrop(props.popupdata)
      if(props.popupdata) {
        setModalShow(false)
        document.getElementById('root').style.filter = 'none';
      }

    },[props.popupdata])

    const selectImage = (e) => {
    let file = e.target.files[0]
      setSrc(URL.createObjectURL(file));
      setModalShow(true)
      document.getElementById('root').style.filter = 'blur(5px)';
      e.target.value = null;
    };
    const getBannerImage = (e) => {
      let file = e.target.files[0];
      getBase64(file).then((data) => {
        setBannerImage(data)
        props.updateBanner(data)
      })
    }
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        })
    }
    const onImageLoaded =(e)=>{
        console.log(e.target)
        setImage(e.target)
    }
    const uploadProfile = ()=>{
      props.getProfileImage(output)
      // setModalShow(false)
      // document.getElementById('root').style.filter = 'none';
    }
    const getCroppedImage=()=>{
        return(
          <div className={ hidecrop ?`d-flex d-flex-row align-items-center justify-content-between bf-profilepic-edit`: ""}>
          { hidecrop ? <><div className='bf-crop-profilepic-sec'>
             {src && (
                <div>
                  <ReactCrop crop={crop} onChange={c => {setCrop(c)}} >
                    <img style={{height:'50vh'}} onLoad={onImageLoaded}
                    src={src} />
                  </ReactCrop>
                </div>
              )}
              <button onClick={cropImageNow}>Crop</button>
            </div>
            <div>{output && <>
              <div className='bf-ouput-img'><img src={output} /></div>
              <button className='bf-btn-primary bf-btn-upload' onClick={(e)=>{uploadProfile()}}>Upload</button></>}
            </div> </>:
            <Loader height='auto'/>
          }
         
          </div>
        )
    }
    const  closeModal = () => {
        setModalShow(false)
        document.getElementById('root').style.filter = 'none';
        setOutput(null)
        setImage(null)
        setSrc(null)

    }

    const cropImageNow = () => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');
    
      const pixelRatio = window.devicePixelRatio;
      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';
    
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
      );
        
      // Converting to base64
      const base64Image = canvas.toDataURL('image/jpeg');
      setOutput(base64Image);
      
    };
    
    return (
      <>
        <div className='bf-user-banner'>
          {!bannerImage ? 
            <div className='bf-banner-text'>Add Banner</div> : <div className='bf-banner-image' style={{"backgroundImage" : "url("+bannerImage+")"}}></div>}
          <div className='bf-profile-banner-edit-sec'>
            <label htmlFor='profileBanner' className='bf-upload-icon'>
              <span>Edit</span><img src={EditWhiteIcon} alt='edit icon'/> 
            </label>
            <input
                id='profileBanner'
                className='bf-hidden'
                type="file"
                accept="image/*"
                onChange={(e) => {
                  getBannerImage(e)
                }}
              />
          </div>
          <div className='bf-profile-sec'>
            {imageData ? <img src={imageData} className="bf-profile-image"/> : <CgProfile className='bf-profile-image'/>}
            <label htmlFor='profilePic' className='bf-upload-icon'>
              <span>Edit</span><img src={EditWhiteIcon} alt='edit icon'/> 
            </label>
            <input
                id='profilePic'
                className='bf-hidden'
                type="file"
                accept="image/*"
                onChange={(e) => {
                  selectImage(e);
                }}
              />
          </div>
        </div>
        
        <CustomModal
        isHtmlContent = {true}
        show={modalShow}
        onHide={() => closeModal()}
        hide={() => closeModal()}
        title={''}
        modelBodyContent={getCroppedImage()}
        />
      </>
    );
}

export default ProfileImage