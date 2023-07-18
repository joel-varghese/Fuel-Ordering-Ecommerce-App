import { Refresh } from '@mui/icons-material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUpdateProfileData } from '../../actions/dashboardServices/dasboardActions';
import { getUpdateProfile, saveValidateSecurityCode } from '../../actions/dashboardServices/dashboardServices';
import { fetchJSONData } from '../../actions/myProfile/myProfileActions';
import { saveNotificationList } from '../../actions/notificationService/notificationAction';
import { sender_Email } from '../../controls/commonConstants';
import { Storage } from '../../controls/Storage';
import { SendMailToUsers, SendSMSToUsers } from '../../services/commonServices';
import ButtonComponent from '../button/button';
import CustomModal from '../customModal/customModal';
import AccountDetails from './AccountDetails';
import AccountSettings from './AccountSettings';
import CustomProfileModal from './customProfileModal';
import ProfileDetails from './ProfileDetails';
import ProfileImage from './ProfileImage';
import ProfileModal from './ProfileModal';
import Loader from '../loader/loader';
import { getIsReorder, getIsSummary} from '../../actions/orderPlacementActions/orderPlacementActions'
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import { getLoggedInUser, getMobileHeaderText } from '../../actions/commonActions/commonActions';


function UserProfile(props) {
  const [fieldList, setFieldList] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [isBusy, setBusy] = useState(true);
  const [modalName, setmodalName] = useState('');
  const [profileData, setProfileData] = useState({});
  const [enableButton, setEnableButton] = useState(false);
  const [disableFields, setDisableFields] = useState(true);
  const [profileDetails, setProfileDetails] = useState({});
  const [fieldErrors, setfieldErrors] = useState({})
  const [modalText, setModalText] = useState("")
  const [customModal, setCustomModal] = useState(false)
  const [refresh, setRefresh] = useState(true);
  const [accountDetails, setAccountDetails] = useState({})
  const [resendOTP, setResendOTP] = useState(false);
  const [popupdata,setpopupdata]=useState(true)
  const [feildModal,setfeildModal]=useState(false);
  const [OTPSuccess, setOTPSucces] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [mobileNumber, setMobileNumber] =useState('')
  const [email, setEmail] =useState('')
  const [hide, setHide] = useState(true)
  const [emailchange,setemailchange] = useState(false)
  const [validationfailed, setValidationFailed] = useState()
  const dispatch = useDispatch()
  const dashboardReducer = useSelector((state) => state.dashboardReducer)
  const profileReducer = useSelector((state) => state.profileReducer)
  const profileJSON = profileReducer && profileReducer.profileJson
	const profileD = dashboardReducer && dashboardReducer.profileData && dashboardReducer.profileData.data
  const commonReducer = useSelector(state => state.commonReducer);
  const loggedInUserType = commonReducer && commonReducer.loggedInUserType && commonReducer.loggedInUserType.data;
  console.log(loggedInUserType)
  const loggedInUser = commonReducer && commonReducer.loggedInUser && commonReducer.loggedInUser.data;
  const loginReducer = useSelector( (state) =>  state.loginReducer)
  const accessLvl = loginReducer?.loginAccessLevel?.data ? loginReducer?.loginAccessLevel?.data :[]
  const jwtTokenData = JSON.parse(loginReducer.loginDetails.data)
  const orgName = Storage.getItem('organizationName')
  const loginName = Storage.getItem('email')
  const access = JSON.parse(Storage.getItem('accessLevel'))[0]

  let paylod = { 'blobname': 'myProfile.json' }
  useEffect(() => {
    let userID =loggedInUser ? loggedInUser : loginName
    console.log(userID)
    fetchJSONData(dispatch,paylod)
    let jsonPayload = {
      payload:{loginUserName: userID}
    }
    getUpdateProfileData(dispatch,jsonPayload,'','')
    let auditPayload = {"ModuleName":"Account",
                        "TabName":"User",
                        "Activity":userID+" Updated",
                        "ActionBy":Storage.getItem('email'),
                        "Role":JSON.parse(Storage.getItem('userRoles')),
                        "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
    saveAuditLogData(auditPayload, dispatch)
    if(!emailchange){
      getUpdateProfileData(dispatch,jsonPayload,'','')
    }else{
      setemailchange(false)
    }
    setBusy(false);
  }, [props, refresh,loggedInUser]);
  useEffect(()=>{
    getIsReorder(dispatch,false)
		getIsSummary(dispatch, false)
    getMobileHeaderText(dispatch, 'Profile') 
  },[])
  useEffect(() => {
    setFieldList(profileJSON && profileJSON.data && profileJSON.data.data.profileDetailsData)
    setProfileData(profileD && profileD);
    if (profileD && profileD.profilePicture){
    let profileFile = imagetoblob(`data:image/jpg;base64,${profileD.profilePicture}`)
      setProfileImage(profileFile)
    }
    if (profileD && profileD.bannerImage){
      let bannerFile = imagetoblob(`data:image/jpg;base64,${profileD.bannerImage}`)
      setBannerImage(bannerFile)
      }
  }, [profileD,profileJSON])

  const getProfileDetails = (data,errors) => {
    let flderrors = errors ? errors :fieldErrors
    setProfileDetails(data)
    setfieldErrors(flderrors)
  }
  const getAccountDetails = (data) => {
    setAccountDetails(data)
  }
  const enableSave = () => {
    setEnableButton(true)
  }
 

  const  dataURItoBlob = (dataURI)=>{
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
  }

  
  function imagetoblob(output){
    var ImageURL = output;
    // Split the base64 string in data and contentType
    var block = ImageURL.split(";");
    // Get the content type of the image
    var contentType = block[0].split(":")[1];// In this case "image/gif"
    // get the real base64 content of the file
    var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

    // Convert it to a blob to upload
    return b64toBlob(realData, contentType);
  }
  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
  
  const updateBanner=(src)=>{
    let file = imagetoblob(src)
    handleClick(profileD,"",file,false)

  }
  const getProfileImage = (src)=>{
    let file = imagetoblob(src)
  //  var profileFile = new File( [file], 'profileImage')
    let imageData = []
    setpopupdata(false)
    imageData.push(file)
    setProfileImage(file)
    handleClick(profileD,file,"",true)
  }
  const handleClick = (profileData,profile,banner,isProfile) => {
    const request ={
      isProfile: isProfile,
      payload : {
        "myProfileEdited": true,
        "firstName": profileData.firstName ? profileData.firstName : profileD.firstName,
        "middleName": profileData.middleName ? profileData.middleName  :  " " ,
        "lastName": profileData.lastName ? profileData.lastName : profileD.lastName,
        "roleType": profileData.roleType ? profileData.roleType : profileD.roleType,
        "mobileNumber":profileData.mobileNumber ? profileData.mobileNumber  : profileD.mobileNumber,
        "levelOfAccess":profileD.levelOfAccess,
        "password": profileData.password ? profileData.password : profileD.password,
        "username": profileData.emailAddress ? profileData.emailAddress : profileD.username,
        "emailNotifications":profileData.emailNotifications ? profileData.emailNotifications : profileD.emailNotifications, 
        "smsNotification":profileData.smsNotification ? profileData.smsNotification : profileD.smsNotification, 
        "localTime":profileData.localTime ? profileData.localTime : profileD.localTime,
        "utc":profileData.utc ? profileData.utc : profileD.utc,
        "userType": profileD.userType,
        "location": profileD.location,
        "loginUserName": profileD.username
      }
    }
    let requestPayload =  request
    let isValid= validateForm()
    if(isValid){
      getUpdateProfile(requestPayload,profile,banner).then((data) => {
        if (data) {
          console.log(data)
          setDisableFields(false)
          setEnableButton(false)
          setRefresh(!refresh)
          setpopupdata(true)
        }
      })
    }
    else{
      setModalText(fieldList[0].sections.modal[0].mandatoryModal.paragraph)
      setCustomModal(true)
    }
  }
  const validateForm = () => {
    let formValid = true;
    const formErrorKeys = Object.keys(fieldErrors);
    for (let i = 0; i < formErrorKeys.length; i++) {
        const fieldName = formErrorKeys[i];
        if (!fieldErrors[fieldName].isValid) {
            formValid = fieldErrors[fieldName].isValid;
          return formValid;
        }
    }
    return formValid;

  }
  const generateOTP = () => {
    let length = 6
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    console.log(OTP);
    return OTP
  };
  const getModal = () => {
    let data = fieldList.length && fieldList[0].sections && fieldList[0].sections.modal.filter((d) => d.name === modalName);
    return (
      <div>
        <ProfileModal fieldList={data} hide={hide}sendMail={sendEmails} sendSMS={sendSMS} validationfailed={validationfailed} validatePin={validatePin} OTPSuccess={OTPSuccess} resendOTP={resendOTP} feildModal={feildModal} />
      </div>
    )
  }
  const closeModal = () => {
    setModalShow(false)
    setHide(true)
    setOTPSucces('')
    setResendOTP(false)
    setValidationFailed()
    document.getElementById('root').style.filter = 'none';
  }
  const closeCustomModal = () => {
    setCustomModal(false)
    setHide(true)
    document.getElementById('root').style.filter = 'none';
  }

  const editModal = (name) => {
    setmodalName(name)
    setModalShow(true)
    document.getElementById('root').style.filter = 'blur(5px)';
    sendEmails(name, "")
  }
  const setEnableflag = () => {
    setDisableFields(false)
  }
  const validatePin = (item, fieldValue) => {
    let userName = profileD && profileD.username ? profileD.username : "";
    let fldValue = "";
    let validateEmailOrMobile = ""
    let modalText = ''
    let isEmailChange = false
    setValidationFailed("")
    const payload = {
      "myProfileEdited": true,
      "firstName": profileD.firstName,
      "middleName": ( profileD.middleName ? profileD.middleName : " " ),
      "lastName": profileD.lastName,
      "roleType": profileD.roleType,
      "mobileNumber": profileD.mobileNumber ,
      "password": profileD.password,
      "levelOfAccess": profileD.levelOfAccess,
      "username":  profileD.username,
      "userType": profileD.userType,
      "location": profileD.location,
      "emailNotifications":profileData.emailNotifications ? profileData.emailNotifications : profileD.emailNotifications, 
      "smsNotification":profileData.smsNotification ? profileData.smsNotification : profileD.smsNotification, 
      "localTime":profileData.localTime ? profileData.localTime : profileD.localTime,
      "utc":profileData.utc ? profileData.utc : profileD.utc,
      "loginUserName": profileD.username
    }
    if (item.name !== "passwordSubmit") {
      if (item.name === "passwordValidate") {
        validateEmailOrMobile = "email"
      }
      else if (item.name === "emailValidate") {
        setfeildModal(true)
        validateEmailOrMobile = "email"
        payload["emailAddress"] = email
        modalText = loggedInUserType && loggedInUserType == "Barrel Fuel" || profileD.levelOfAccess[0] == "Level 1 (Admin)" ? item.changeSuccess : item.success 
        setemailchange(true)
        isEmailChange = true
        let auditPayload = {"ModuleName":"Account",
                        "TabName":"User",
                        "Activity":profileD.username+" Updated Email ID To "+email,
                        "ActionBy":Storage.getItem('email'),
                        "Role":JSON.parse(Storage.getItem('userRoles')),
                        "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
      saveAuditLogData(auditPayload, dispatch)
      }
      else if (item.name === "mobileValidate") {
        setfeildModal(true)
        validateEmailOrMobile = "mobile"
        payload["mobileNumber"] = mobileNumber

        modalText = item.success
        let auditPayload = {"ModuleName":"Account",
                        "TabName":"User",
                        "Activity":profileD.username+" Updated Mobile Number",
                        "ActionBy":Storage.getItem('email'),
                        "Role":JSON.parse(Storage.getItem('userRoles')),
                        "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
      saveAuditLogData(auditPayload, dispatch)
      }
      const securityPayload = {
        payload:{ 
          "securityCode": fieldValue,
          "loginUserName": userName,
          "username":userName,
          "validateEmailOrMobile": validateEmailOrMobile,
          "securityCodeType": "validate"}
      }
      saveValidateSecurityCode(securityPayload, jwtTokenData.jwtToken).then((resp) => {
        if (resp && resp.message == "Validation failed") {
          setValidationFailed(item.validationFailed)
        }
        else{
          if(item.name !== "passwordValidate"){
            setModalShow(false)
            setCustomModal(true)
            setModalText(modalText)
            let request = {
              isProfile: false,
              payload: payload
            }
            getUpdateProfile(request).then((res)=>{
              setfeildModal(false)
              setemailchange(isEmailChange)
              setRefresh(!refresh)
              if(isEmailChange){
               if (loggedInUserType == "Barrel Fuel" ||profileD.levelOfAccess[0] == "Level 1 (Admin)" ){
                getLoggedInUser(email,dispatch)
                Storage.setItem('email', email);
                let jsonPayload = {
                  payload:{loginUserName: email}
                }
                getUpdateProfileData(dispatch,jsonPayload,'','')
               }
                // let payload = {}
                // payload.type = "update"
                // payload.notificationMessage = "Email Details has been edited by " + loginName+ "."
                // payload.organizationName = orgName
                // payload.loginUserName = loginName
                // payload.sendNotificationTo = "ORG Internal"
                // payload.access_levels = ["Level 1 (Admin)"]
                // payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
                // payload.isActionable = true
                // payload.actionTaken = ""
                // payload.category = "account"
                // payload.readInd = false
                // saveNotificationList(payload).then((res)=>{
      
                // })
              }
            })
          }
          setValidationFailed("")
          setHide(false)
        }

      })
    }
    else if (item.name === "passwordSubmit") {
      setfeildModal(true)
      payload["password"] = fieldValue
      let request = {
        isProfile: false,
        payload: payload
      }
      let auditPayload = {"ModuleName":"Account",
                        "TabName":"User",
                        "Activity":profileD.username+" Updated Password",
                        "ActionBy":Storage.getItem('email'),
                        "Role":JSON.parse(Storage.getItem('userRoles')),
                        "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
      saveAuditLogData(auditPayload, dispatch)
      getUpdateProfile(request).then((res)=>{
        if(res){
        setfeildModal(false)
      }
      setCustomModal(true)
      setModalText(item.success)
      setModalShow(false)
      setRefresh(!refresh)
      })
      
    }
  }
  const sendSMS = (item,fieldValue)=>{
    let oneTimePassword = generateOTP()
    setHide(false)
    let number = fieldValue ? parseInt(fieldValue.replace(/\D/g,'')) : mobileNumber
    setMobileNumber(number)

    let payload= {
      payload:{
        "body": `${fieldList[0].mobileOTP.text1}  ${oneTimePassword} ${fieldList[0].mobileOTP.text2}`,
        "from": "+13027790839",
        "to": `+91${number}`
      }
    }
    const securityPayload = {
      payload:{
        "securityCode": oneTimePassword,
        "loginUserName": profileD.username,
        "username":profileD.username,
        "validateEmailOrMobile": "mobile",
        "securityCodeType": "generate"}
    }
    saveValidateSecurityCode(securityPayload)
    SendSMSToUsers(payload)
    if(item.name == 'mobileResendCode') {
      setResendOTP(true)
      setOTPSucces(item.success)
    }
  }
  const sendEmails = (item, fieldValue,pwItem) => {
    // let emailBody = {
    //   "title": "Update Email",
    //   "paragraph": "Hello",
    //   "html": "Please enter the below 6 digit pin <br><br>  : <br><br> # to change your email<br>"
    // };
    let emailBody = fieldList[0].emailbodyEmail
    let fldValue = '';
    let OTP = '';
    let userName = profileD && profileD.username ? profileD.username : "";
    let validateEmailOrMobile = ""
    if (item === "password") {
      // emailBody = {
      //   "title": "Reset Password",
      //   "paragraph": "Hello",
      //   "html": "Please enter the below 6 digit pin <br><br>  : <br><br> # to change your Password<br>"
      // }
      emailBody = fieldList[0].emailbodyPassword
      fldValue = profileD && profileD.username ? profileD.username : "";
      OTP = generateOTP()
      validateEmailOrMobile = "email"
      if(pwItem && pwItem.name == 'passwordResendCode') {
        setResendOTP(true)
        setOTPSucces(pwItem.success)
      }
    }
    else if (item.name === "emailSubmit" || item.name === "emailResendCode" ) {
      setHide(false)
      emailBody = fieldList[0].emailbodyEmail

      // emailBody = {
      //   "title": "Update Email",
      //   "paragraph": "Hello",
      //   "html": "Please enter the below 6 digit pin <br><br>  : <br><br> # to change your email<br>"
      // }
      validateEmailOrMobile = "email"
      fldValue = fieldValue ? fieldValue : email
      setEmail(fldValue)
      OTP = generateOTP()
      if(item.name == 'emailResendCode') {
        setResendOTP(true)
        setOTPSucces(item.success)
      }
    }
    
    const securityPayload = {
      payload:{
        "securityCode": OTP,
        "username":userName,
        "loginUserName": userName,
        "validateEmailOrMobile": validateEmailOrMobile,
        "securityCodeType": "generate"}
    }
    var html = emailBody.html
    var loc = html.indexOf(":");
    var hashLoc = html.indexOf("#");
    html = `${html.substring(0, loc) } <b>${OTP}</b> ${html.substring(hashLoc + 1, html.length)}`;

    const emailPayload = {
      "to": [fldValue],
      "from": sender_Email,
      "subject": emailBody.title,
      "text": emailBody.paragraph,
      "html": html
    }
    if(fldValue){
      SendMailToUsers(emailPayload);
    }
    if(OTP){
    saveValidateSecurityCode(securityPayload, jwtTokenData.jwtToken)
}
  }
  return (

    <>
      {fieldList && fieldList.length && profileData?
        <>
          <ProfileImage getProfileImage={getProfileImage} updateBanner={updateBanner} popupdata={popupdata}/>
          <div className='bf-profile-data-section'>
            <div className='bf-profile-data-section-fields'>
              <ProfileDetails
                fieldList={fieldList}
                profileData={profileData}
                enableSave={enableSave}
                disableFields={disableFields}
                getProfileDetails={getProfileDetails}
              />
              <AccountDetails
                fieldList={fieldList}
                editModal={editModal}
                profileData={profileData}
                getAccountDetails={getAccountDetails}
              />
              <AccountSettings fieldList={fieldList} profileData={profileData} enableSave={enableSave} getProfileDetails={getProfileDetails}/>
              <div className='d-flex d-flex-row align-items-center justify-content-center bf-profile-buttons'>
                <ButtonComponent
                  Label={fieldList[0].button.label}
                  Type={fieldList[0].button.type}
                  Name={fieldList[0].button.name}
                  className={fieldList[0].button.styles.className}
                  disabled={!enableButton ? fieldList[0].button.disabled : false}
                  handleClick={(e) => handleClick(profileDetails,'','')}
                />
              </div>
            </div>
          </div>
        </>
        : ""}
      {modalName && modalShow ? <CustomProfileModal
        show={modalShow}
        onHide={() => closeModal()}
        hide={() => closeModal()}
        title={''}
        size={"md"}
        modelBodyContent={getModal()}
      /> : ""}
      {customModal && modalText ? <CustomModal
        show={customModal}
        onHide={() => closeCustomModal()}
        hide={() => closeCustomModal()}
        title={''}
        isHtmlContent = {false}
        size={"md"}
        modelBodyContent={modalText}
        buttonText={fieldList[0].sections.modal[0].mandatoryModal.primaryButton.text}
      /> : ""}
    </>
  )
}

export default UserProfile