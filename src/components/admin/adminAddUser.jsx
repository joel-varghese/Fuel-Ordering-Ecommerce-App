import React, { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import logo from '../../assets/images/barrel_fuel_logo.png'
import Row from 'react-bootstrap/Row';
import Input from '../input/input';
import Select from '../select/select';
import Radio from '../radio/radio';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import ButtonComponent from '../button/button';
import MultiSelectCheckbox from '../multiSelect/multiSelectCheckbox';
import { ButtonGroup } from 'react-bootstrap';
import './admin.scss';
import * as xlsx from "xlsx";
import { useLocation, useNavigate } from 'react-router-dom';
import CustomModal from '../customModal/customModal';
import { adminAddUserSave } from '../../actions/adminAddUserService/adminAddUserService';
import Subheading from '../subHeading/subHeading';
import { SendMailToUsers } from '../../services/commonServices';
import Loader from '../loader/loader';
import { Storage } from '../../controls/Storage';
import Nav from 'react-bootstrap/Nav';

import AviationFacts from '../aviationFacts/aviationFacts';
import { useDispatch, useSelector } from 'react-redux';
import  OperatorTemplate  from '../../assets/files/OperatorTemplate.xlsx'
import  FBOTemplate  from '../../assets/files/FBOTemplate.xlsx'
import { bulkNotification, saveNotificationList } from '../../actions/notificationService/notificationAction';
import { encryptData } from '../../services/commonServices';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';
import { getMobileHeaderText } from '../../actions/commonActions/commonActions';

function AdminAddUser(props) {
    const {state} = useLocation()
    const [formData , setFormData] = useState({});
    const [formFieldData , setFormFieldData] = useState([]);
    const [fieldList, setFieldList] = useState([]);
    const [formErrors , setFormErrors] = useState({});
    const [formFieldErrors , setFormFieldErrors] = useState([]);
    const [operatorCheck , setoperatorCheck] = useState(false);
    const [disable , setdisable] = useState(true);
    const [loader,setLoader]=useState(false)
    let navigate = useNavigate();
    const [storageOrgName , setStorageOrgName] = useState(Storage.getItem('organizationName'));
    const [currentUserRole , setCurrentUserRole] = useState();
    /* const {state} = useLocation();
    const { currentUserRole, storageOrgName } = state ? state:{}; */
    const restrictedFields = ['userType'];
    const [scrollPosition, setScrollPosition] = useState();
    const [clear, setClear] = useState();
    const [filterLocation, setfilterLocation] = useState([]);
    const [isBusy, setBusy] = useState(true);
    const [acclvl, setacclvl] = useState(true);
    const [template,setTemplate]= useState('')
    const loggedInUser = Storage.getItem('userType') ? Storage.getItem('userType') :""
    const loginName = Storage.getItem('email')
    const orgName = Storage.getItem('organizationName')
    const access = JSON.parse(Storage.getItem('accessLevel'))[0]
    const dispatch = useDispatch()
    const AccountReducer = useSelector((state) => state.accountHomeReducer);
    const selectedUser = AccountReducer && AccountReducer.selectedUser && AccountReducer.selectedUser.user && AccountReducer.selectedUser.user;
    const dashboardReducer = useSelector((state) => state.dashboardReducer)
	  const profileDetails = dashboardReducer && dashboardReducer.profileData && dashboardReducer.profileData.data
    useEffect(() => {
      let loc=[]
      profileDetails && profileDetails.locationAccess && profileDetails.locationAccess.forEach((val)=>{
        if(val.accessLevel=='Level 2 (Standard)'){
          val.locations.forEach((location)=>{
            loc.push(location)
          })
        }
      })
      setfilterLocation(loc)
      setCurrentUserRole(selectedUser && selectedUser)
        let accessLevel=JSON.parse(Storage.getItem('accessLevel'))
        let access=accessLevel.map((level)=>level.toLowerCase())
        if(access.includes("super") || selectedUser =='Barrel Fuel' || selectedUser =='internal' || loggedInUser=='Barrel Fuel'){
            setacclvl(false)
          }
        if(selectedUser!=='Barrel Fuel'){
          if(selectedUser.toLowerCase() == 'operator'){
            setoperatorCheck(true);
          }
          setdisable(false);
        }

        bfaJsonService({"blobname":"addAdminUser.json"}).then(response=>{
            setInitialState(response.data.addAdminUserData);
            setFieldList(response.data.addAdminUserData)
            setBusy(false);
            
            /* setFieldList(fboSignupList.addAdminUserData)
            setBusy(false);
            setInitialState(fboSignupList.addAdminUserData); */
        })
        if(selectedUser == "operator"){
          setTemplate(OperatorTemplate)
        }
        else if(selectedUser == "fbo"){
          setTemplate(FBOTemplate)
        }
    },[]);

    const getFormErrorRules = (item) => {
        return {
          isValid: item.isRequired ? item.defaultValue ? true : false : true,
          isTouched: false,
          activeValidator: {},
          validations: item.validations,
          isRequired: item.isRequired,
          minLength: item.minLength,
          maxLength: item.maxLength
        };
      }
     const setInitialState= (adminAddUserData, isClear, isClearSubField)=> {
        let formErrors = {};
        let data = {};
        let fields = [];
        let details = {};
        let errDetails = {};
        const formDataSet = {};
        let formdetails=[];
        let formFieldError = [];
        const fieldTypeArr = ['input', 'checkbox', 'select','multiselectcheckbox','radio'];
        adminAddUserData.length && adminAddUserData[0].sections.subSections.forEach((items)=>{
            
            items.fields && items.fields.forEach( (item) => {
                if (fieldTypeArr.includes(item.component.toLowerCase())) {
                    if(item.name==='userType'){
                      if(selectedUser){
                        formDataSet[item.name] = selectedUser 
                      }
                      else{
                        if(currentUserRole != "Barrel Fuel"){
                          formDataSet[item.name] = currentUserRole;
                        }
                        else formDataSet[item.name] = formData && formData[item.name] ? formData[item.name] :item.defaultValue ? item.defaultValue:"";
                        (formDataSet[item.name] === "Operator") ? setoperatorCheck(true) : setoperatorCheck(false)
                      }
                        
                    }else if(item.name==='organizationName'){ 
                        if(currentUserRole != "Barrel Fuel"){
                            formDataSet[item.name] = storageOrgName;
                        }
                        else formDataSet[item.name] = isClear ? (item.defaultValue ? item.defaultValue : "") : formData && formData[item.name] ? formData[item.name] :item.defaultValue?item.defaultValue:"";
                    }else { 
                        formDataSet[item.name] = isClear ? (item.defaultValue ? item.defaultValue : "") : formData && formData[item.name] ? formData[item.name] :item.defaultValue?item.defaultValue:"";
                    }
                    formErrors[item.name] = getFormErrorRules(item);
                    //formErrors = { ...setPrevActiveValidator(formErrors, item) };
                }
            })

            items.fieldsArray && items.fieldsArray.forEach( (item,index) => {
                item.fields.forEach((item)=>{
                    if (fieldTypeArr.includes(item.component.toLowerCase())) {
                        details[item.name] = isClear || isClearSubField ? "" : formFieldData  && formFieldData.length>index ? formFieldData[index][item.name] : item.defaultValue?item.defaultValue:"";
                        errDetails[item.name] = getFormErrorRules(item);
                        if(isClear || isClearSubField) {}
                        else {errDetails = { ...setPrevActiveValidator(errDetails, item,index) }};
                    }
                })
                formdetails.push(JSON.parse(JSON.stringify(details)));
                formFieldError.push(JSON.parse(JSON.stringify(errDetails)));
            })
        });
 
        setFormFieldData(formdetails);
        setFormFieldErrors(formFieldError);
        setFormData(formDataSet);
        setFormErrors(formErrors);
    }

    const setPrevActiveValidator = (curFormErrors, item,index) => {
		//const { formErrors } = this.state;
		if (formFieldErrors[index]) {
			curFormErrors[item.name].isValid = formFieldErrors[index][item.name].isValid;
			curFormErrors[item.name].isTouched = formFieldErrors[index][item.name].isTouched;
			if (formFieldErrors[index][item.name].activeValidator !== {} && formFieldErrors[index][item.name].activeValidator.validation) {
				const activeValidator = curFormErrors[item.name].validations.filter((elem) => elem.validation === formFieldErrors[index][item.name].activeValidator.validation);
				if (activeValidator.length) {
					curFormErrors[item.name].activeValidator = activeValidator[0];
				}
			}
		}
		return curFormErrors;
	}
    const updateResultJsonNames =(uploadData) => {
        let resultArray = [];
        let fieldArray = {"Email":"additionalUserMail","Role":"additionalUserRole","Level of Access":"additionalUserLevelAccess","Location":"location"};
 
        uploadData.forEach(item => {
            let dummyOb = {};
            for(const property in item){
              if(fieldArray[property])
                dummyOb[fieldArray[property]] = item[property]
            }
            if(dummyOb && dummyOb.additionalUserMail){
              let hasVal = dummyOb.additionalUserMail.trim()
              if(hasVal) {
                resultArray.push(dummyOb)
              }
            }
        });
        let res = cancatinateRows(resultArray);
        return res;//resultArray //abc; 
    }
    
    const cancatinateRows = (data) => {
        const ObjecDataAt = {};
        for (let i = 0; i < data.length; i++) {
            let ObjKey = '';
            let value = [];
            let dummyOb = {}
            for (const property in data[i]) {
                if (property != 'location') {
                    ObjKey = ObjKey + `${property}|${data[i][property]}|`;
                } else {
                    //dummyOb["value"] = data[i][property];
                    //dummyOb["label"] = data[i][property];
                    //value.push(dummyOb);
                    value.push(data[i][property]);
                }
            }
            if (ObjecDataAt[ObjKey]) {
                ObjecDataAt[ObjKey] = [...ObjecDataAt[ObjKey],...value]
            } else {
                ObjecDataAt[ObjKey] = value;
            }
        }
        const updatedArray = []
        for (const property in ObjecDataAt) {
            let data = property.split('|');
            const updatedObj = {};
            for (let j = 0; j < data.length - 1; j++) {
                updatedObj[data[j]] = data[j + 1];
                j++;
    
            }
            updatedObj['location'] = ObjecDataAt[property];
            updatedArray.push(updatedObj);
    
        }
        return updatedArray;
    }
    const handleChange= (e, item,index,flag) => {
        let formDataSet = {};
        let fields; 
        let target = e.target; 
        let fieldName, fieldValue;
        if(item.type == "file"){
            //e.preventDefault();
            setClear()
            let fileData = target.files[0];
            let acceptedTypes = ["xls","xlsx","csv"];
            let getFileType = fileData.name.split('.');
            let nameLen = getFileType.length
            if(!acceptedTypes.includes(getFileType[nameLen-1])) 
              validateField(item.name, "fileType", fields);
            else {
              const reader = new FileReader();
              reader.onload = (e) => {
                  const data = e.target.result;
                  const workbook = xlsx.read(data, { type: "array" });
                  const sheetName = workbook.SheetNames[0];
                  const worksheet = workbook.Sheets[sheetName];
                  const fileJson = xlsx.utils.sheet_to_json(worksheet);
                  if(fileJson.length) {
                    let fieldArr = fieldList;
                    let arrLength = fieldArr[0].sections.subSections[2].fieldsArray.length;
                    fieldArr[0].sections.subSections[2].fieldsArray.splice(1,arrLength-1);
                    setFieldList(fieldArr);
                      let updatedJson = updateResultJsonNames(fileJson)
                      addMore(updatedJson.length);
                      //let updatedFormData = [...formFieldData,...updatedJson]
                      setFormFieldData(updatedJson);
                  }
              };
              reader.readAsArrayBuffer(e.target.files[0]);
            }
        }
            
            if(flag){
                fields = [];
                fields = JSON.parse(JSON.stringify(formFieldData));
                if(item.type == "multiSelectCheckbox"){
                    fieldName = item.name;
                    fieldValue = e.length ? e.map(i => i.value) : null;
                    fields[index][item.name] = fieldValue;
                }else{
                    fieldName = target.name;
                    fieldValue = target.value;
                    fields[index][fieldName] = fieldValue;
                }
                // if(item.name==='additionalUserMail'){
                //     validateField(fieldName, fieldValue, fields,index,flag);
                // }
                setFormFieldData(fields);  
            }
            else {
                fieldName = target.name;
                fieldValue = target.value;
                fields = {};
                fieldValue=fieldValue.trim()
                if(e.target.name==='organizationName'){
                  let fieldArr = fieldList;
                  let arrLength = fieldArr[0].sections.subSections[2].fieldsArray.length;
                  fieldArr[0].sections.subSections[2].fieldsArray.splice(1,arrLength-1);
                  setFieldList(fieldArr);
                  setInitialState(fieldArr,false,true)
                  setClear('Clear')
                  setdisable(false)
                }
                if(target.type==='radio'){
                    fieldName = item.name;
                        if (fieldValue == "Operator")
                            setoperatorCheck(true);
                        else
                            setoperatorCheck(false);
                    
                }
                fields[fieldName] = fieldValue;
                formDataSet = {
                    ...formData,
                    ...fields
                };
                setFormData(formDataSet);
            }
        
        
        //validateField(fieldName, fieldValue, fields, true);
        
    }
    const handleBlur= (e, item,index,flag) => {
        let formDataSet = {};
        const fields = {};
        /* let formValid = this.state.formValid;
        const fieldValidationErrors = {...this.state.formErrors}; */
        let target = e.target; 
        let fieldName, fieldValue;
        fieldName = target.name;
        if(item.type == "input"){
          e.target.value = e.target.value.trim();
        }
        fieldValue = target.value;
        fields[fieldName] = fieldValue;
        if(item.name==='additionalUserMail'){
          validateField(fieldName, fieldValue, fields,index,flag);
        }
            // validateField(
            // fieldName, fieldValue, fields, true
            // );
          
    }
    const validateField = (fieldName, value, fields,index, flag, isDuplicated) => {
        const fieldValidationErrors = {
            ...formErrors
        };
        const NewFieldValidationErrors = [
            ...formFieldErrors
        ];
        let fieldValidationError = null;
        if (flag) {
          fieldValidationError =
            formFieldErrors[index][fieldName];
        } else {
          fieldValidationError = fieldValidationErrors[fieldName];
        }
    
        let validationObj = {};
        validationObj = checkValidationByValidationTypes(value, fieldValidationError,fieldName, isDuplicated);
        let errcount = validationObj.errcount;
        if (flag) {
            /* NewFieldValidationErrors[index][fieldName] = {
              ...validationObj.fieldValidationError
            }; */
            if (!errcount) {
              NewFieldValidationErrors[index][fieldName].isValid = true;
              NewFieldValidationErrors[index][fieldName].activeValidator = {};
            } else {
              NewFieldValidationErrors[index][fieldName].isValid = false;
              NewFieldValidationErrors[index][fieldName].activeValidator = validationObj.fieldValidationError.activeValidator;
            }
            setFormFieldErrors(NewFieldValidationErrors);
		    } else {
            if (!errcount) {
              fieldValidationErrors[fieldName].isValid = true;
              fieldValidationErrors[fieldName].activeValidator = {};
            } else {
              fieldValidationErrors[fieldName].isValid = false;
              fieldValidationErrors[fieldName].activeValidator = validationObj.fieldValidationError.activeValidator;
            }
            setFormErrors(fieldValidationErrors);
		    } 
        // customValidation(
        //     fieldName, value, validationObj,index
        // );
    }
    
      const checkValidationByValidationTypes = (value, fieldValidationError, fieldName, isDuplicated) => {
    
        let fieldValidations = fieldValidationError.validations;
        let errcount = 0;
        if(fieldValidations && fieldValidations.length){
          for(let i=0;i<fieldValidations.length;i++){
        
            let validationType = fieldValidationError.validations[i].validation;
            if(validationType === 'IsMandatory') {
              let check = false;
              if (!value) { check = true }
              else if(fieldName == "location") { check = value && value.length ? false : true }
              if(check){
                errcount++;
                fieldValidationError.activeValidator = fieldValidationError.validations[i];
              }
            }
            else if(validationType === 'CheckRegex'){
              let check = false;
              if (!new RegExp(fieldValidationError.validations[i].validateRule).test(value)) {
                  check = true;
              }
              if(fieldName == "additionalUserMail"){
                  let splitVal = value.split('@');
                  let replacedVal = splitVal[0].replaceAll('_','').replaceAll('.','')
                  if(replacedVal){}
                  else {
                    check = true
                  }
              }
              if(check){
                errcount++;
                fieldValidationError.activeValidator = fieldValidationError.validations[i];
              }
            }
            else if(validationType === 'CheckBFDomain'){
              if(new RegExp(fieldValidationError.validations[i].validateRule).test(value)){
                let eSplit = value.split('@');
                if(eSplit.length && eSplit[1]){
                  let convertToLower = eSplit[1].toLowerCase();
                  if(convertToLower == "barrelfuel.com"){
                  }
                  else {
                    errcount++;
                    fieldValidationError.activeValidator = fieldValidationError.validations[i];
                  }
                }
              }
            }
            else if(validationType === 'IsDuplicated'){
              if( isDuplicated === true ) {
                errcount++;
                fieldValidationError.activeValidator = fieldValidationError.validations[i];
              }
            }
            else if(validationType === 'fileType'){
              if( value === 'fileType' ) {
                errcount++;
                fieldValidationError.activeValidator = fieldValidationError.validations[i];
              }
            }
            if(errcount > 0){
                return {
                    fieldValidationError: fieldValidationError,
                    errcount: errcount
                  };
            }
          }
        }
        return {
          fieldValidationError: fieldValidationError,
          errcount: errcount
        };
    }
    
      const validateForm = () => {
        let formValid = true;
        const formErrorKeys = Object.keys(formErrors);
        for (let i = 0; i < formErrorKeys.length; i++) {
            const fieldName = formErrorKeys[i];
            if (!formErrors[fieldName].isValid) {
                formValid = formErrors[fieldName].isValid;
                return formValid;
              }
        }
        formFieldErrors.map((val,index)=>{
            Object.keys(val).forEach((fieldname)=>{
              if(operatorCheck){
                if(fieldname!=='location'){
                  if (!formFieldErrors[index][fieldname].isValid) {
                      formValid = formFieldErrors[index][fieldname].isValid;
                      return formValid;
                    }
                }
              }else{
                if (!formFieldErrors[index][fieldname].isValid) {
                  formValid = formFieldErrors[index][fieldname].isValid;
                  return formValid;
                }
              }     
            })
        })
        return formValid;
    }
    const removeButton = (e, item,index) => {
        let fieldArr = fieldList;
        fieldArr[0].sections.subSections[2].fieldsArray.splice(index,1);
        setFieldList(fieldArr);
        let updatedFormFieldData = formFieldData;
        updatedFormFieldData.splice(index,1)
        setFormFieldData(updatedFormFieldData);
        let updatedFormFieldErrors = formFieldErrors;
        updatedFormFieldErrors.splice(index,1)
        setFormFieldErrors(updatedFormFieldErrors);
        setInitialState(fieldArr);
    }

    const formSaveData = () => {
        let saveJson = {};
        let finalJson = {};
        let fieldData = JSON.parse(JSON.stringify(formFieldData));
        fieldData.forEach((item,index) => {
            for(let property in item){
                if(property === "location"){
                    let locArr = [];
                    if(formData["userType"] == "Operator"){

                    }
                    else {
                        let locVal = item["location"];
                        locVal.length && locVal.forEach(list => {
                           // let locObj={}
                           // locObj["city"] = list;
                            locArr.push(list)
                        })
                    }
                    item["location"] = locArr;
                }
            };
        });
        saveJson["organizationName"] = formData.organizationName;
        saveJson["userType"] = formData.userType; 
        saveJson["additionalUserRequests"] = fieldData;
        //finalJson["additionalUserSignupRequest"] = saveJson
        return saveJson;
    }

    const sendEmails = (excludeList) => {
        let sendEmailObj = fieldList.length && fieldList[0].sections.emailBody;
        var html = sendEmailObj.html;
        var firstString = "Hi User,";
        var loc = html.indexOf(":");
        let emails=[]
        formFieldData.forEach(item=>{
          if(emails.length==0 || !emails.includes(item.additionalUserMail)){
            if(excludeList && excludeList.length && excludeList.includes(item.additionalUserMail)) { }
            else emails.push(item.additionalUserMail)
          }
        })
        emails.forEach(item => {
            let emailId = encryptData(item);
            var activeLink = process.env.REACT_APP_DOMAIN_URL+'/'+sendEmailObj.redirectURI + emailId;
            let html1 = firstString + html.substring(0, loc) + activeLink + html.substring(loc + 1, html.length);
            let data = {
                to: item,
                from: sendEmailObj.fromEmailId,
                subject: sendEmailObj.title,
                text: sendEmailObj.paragraph,
                html: html1
            }
            SendMailToUsers(data);
        })
        
    }

    const duplicateCheck = () => {
      let dupInd = [];
      formFieldData.forEach((ob,index) => {
        let email = ob.additionalUserMail;
        let loc = ob.location;
        let flagIndex = [];
        for(let i = index+1;i<formFieldData.length;i++){
          if(formFieldData[i]["additionalUserMail"] == email){
            if(!operatorCheck){
              let locArr = formFieldData[i]["location"];
              locArr.forEach( l => {
              if(loc.includes(l)){
                flagIndex.push(i);
                flagIndex.push(index);
              } 
            })
            }else{
              flagIndex.push(i);
              flagIndex.push(index);
            }
            
          }
        }
        dupInd = new Set([...dupInd, ...flagIndex])
      })
      let convertArr = [...dupInd];
      console.log("convertArr" , convertArr);
      if(convertArr.length) {
        convertArr.forEach(dup => {
          Object.keys(formFieldData[dup]).forEach((fieldName)=> {
            if(fieldName == 'additionalUserMail'){
              validateField(
                fieldName,
                formFieldData[dup][fieldName],
                { [fieldName]: formFieldData[dup][fieldName] },
                dup,
                true,
                true
              );
            }
          })
        })
        return false;
      }
      else return true;
      setLoader(false)
    }

    const handleClick = (e, item,index) => {
        if(item.name === "clear"){
          setdisable(false)
            setClear('Clear')
            setInitialState(fieldList, true);
            navigate('/dashboard/account/user');
        }else if(item.name === "addNew"){
            addMore();
        }
        else if(item.name === "remove"){
            removeButton(e, item,index);
        }
        else{
          let isFormValid
          const fieldValidationErrors = {
            ...formErrors
          };
            //fieldName, value, fields, subIndex, isTouched
            // Object.keys(fieldValidationErrors).forEach((fieldName, index) => {
            //     if (typeof formData[fieldName] === 'object') {
            //         formData[fieldName].forEach((fieldObj, fieldIndex) => {
            //             Object.keys(fieldObj).forEach(fldName => {
            //                 validateField(fldName, fieldObj[fldName], { [fieldName]: formData[fieldName] });
            //             });
            //         });
            //     } else {
            //         validateField(
            //             fieldName,
            //             formData[fieldName],
            //             { [fieldName]: formData[fieldName] }
            //         );
            //     }
            // });
            Object.keys(fieldValidationErrors).forEach((fieldName, index) => {
              validateField(
                  fieldName,
                  formData[fieldName],
                  { [fieldName]: formData[fieldName] }
              );
          });
            formFieldData.forEach((val,index)=>{
                Object.keys(val).forEach((fieldName) => {
                        validateField(
                            fieldName,
                            formFieldData[index][fieldName],
                            { [fieldName]: formFieldData[index][fieldName] },
                            index,
                            true
                        );
                    })
            })
            isFormValid = validateForm();
            if(isFormValid){
              setLoader(true)
              let noDuplicates = duplicateCheck();
              if(noDuplicates){
                  let saveData = formSaveData();
                  adminAddUserSave(saveData).then(res =>{
                      if(res.data.accountRegister){
                          if(res.data.accountRegister == "SUCCESS"){
                            setLoader(false)
                            if(selectedUser == "operator"){
                              if(loginName != ""){
                                let arrayReq = []
                                let msg = ""
                                formFieldData.forEach((item,index)=>{
                                  let payload = {}
                                  payload.type = "create"
                                  payload.notificationMessage = fieldList[0].sections.notifyMessage.msg1+loginName+fieldList[0].sections.notifyMessage.msg2+item.additionalUserMail+fieldList[0].sections.notifyMessage.msg3
                                  payload.organizationName = orgName
                                  payload.loginUserName = loginName
                                  payload.sendNotificationTo = "ORG Internal"
                                  payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
                                  payload.access_levels = ["Level 1 (Admin)"]
                                  payload.isActionable = false
                                  payload.actionTaken = ""
                                  payload.category = "account"
                                  payload.readInd = false
                                  arrayReq[index] = payload
                                  setLoader(false)
                                })
                                bulkNotification(arrayReq,dispatch).then((res)=>{
                    
                                })
                              }
                            }
                            if(selectedUser == "fbo"){
                              if(loginName != ""){
                                let arrayReq = []
                                let msg = ""
                                formFieldData.forEach((item,index)=>{                                
                                  let payload = {}
                                  payload.type = "create"
                                  payload.notificationMessage = fieldList[0].sections.notifyMessage.msg1+loginName+fieldList[0].sections.notifyMessage.msg2+item.additionalUserMail+fieldList[0].sections.notifyMessage.msg3
                                  payload.organizationName = orgName
                                  payload.loginUserName = loginName
                                  payload.sendNotificationTo = "ORG Internal"
                                  payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
                                  payload.access_levels = ["Level 1 (Admin)","Level 2 (Standard)"]
                                  payload.isActionable = false
                                  payload.actionTaken = ""
                                  payload.category = "account"
                                  payload.readInd = false
                                  arrayReq[index] = payload
                              })
                              bulkNotification(arrayReq,dispatch).then((res)=>{
                    
                              })
                              }
                            }
                              setIsSuccess(true);
                              setModalText(fieldList.length && fieldList[0].sections.modal[0].successModal.paragraph)
                              sendEmails(res.data.registeredUsers);
                              let auditPayload = {"ModuleName":"Admin Add User",
                                                  "TabName":"Add new user",
                                                  "Activity":"For "+selectedUser+" added new users",
                                                  "ActionBy":Storage.getItem('email'),
                                                  "Role":JSON.parse(Storage.getItem('userRoles')),
                                                  "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                            saveAuditLogData(auditPayload, dispatch)

                          }
                          else {
                            let duplicateEmailIds = [];
                            // setModalText(res.data.accountRegister);
                              formFieldData.forEach((val,index)=>{
                                Object.keys(val).forEach((fieldName) => {
                                  
                                      if( fieldName === "additionalUserMail") {
                                        function isDuplicated(value) {
                                          return value.additionalUserMail === formFieldData[index][fieldName];
                                        }
                                        var dupObj = res.data.additionalUserRequests.filter(isDuplicated);
                                        if( dupObj[0].duplicate === true ) {
                                          duplicateEmailIds.push(dupObj[0].additionalUserMail)
                                        }
                                        validateField(
                                            fieldName,
                                            formFieldData[index][fieldName],
                                            { [fieldName]: formFieldData[index][fieldName] },
                                            index,
                                            true,
                                            dupObj[0].duplicate
                                        );
                                      }
                                    })
                            })
                            let duplicateErrorMsg = "<p>Registeration Failed, Following User Email Id(s) Are Already Registered.</p><p>"+duplicateEmailIds+"</p>";
                            setModalText(duplicateErrorMsg);
                          }
                      }
                      else if(res.data.errorcode){
                        setLoader(false)
                        if(res.data.errorcode == 113){
                          // let mail = res.message.split(":")[1]
                          //   let userData = formData
                          //   let index = 0
                          //   let error = formErrors
                          //   userData.forEach((user,i)=>{
                          //       if(user.additionalUserMail == mail){
                          //           index = i
                          //       }
                          //   })
                          //   error[index].additionalUserMail.isValid = false
                          //   error[index].additionalUserMail.activeValidator.errorMessage = " "
                          //   console.log(formErrors)
                          //   setFormErrors(error)
                          //   setModalText(operatorSignupList.length && operatorSignupList[0].sections[0].modal[0].failModal.paragraph);
                          let msg = res.data.message;
                          var loc = msg.indexOf(":");
                          let popupMsg = "Oops! " + msg.substring(loc + 1, msg.length) + " Already Exists"
                          setModalText(popupMsg);
                          setLoader(false)
                        }
                      }else if(res.data.message){
                        setModalText(res.data.message);
                      }
                      setScrollPos();
                      setShow(true);
                      document.getElementById('root').style.filter = 'blur(5px)';
                  })
                }
                else {
                  setModalText("Duplicate entries found. Please check the highlighted entries.");
                  setScrollPos();
                  setLoader(false)
                  setShow(true);
                }
            }
            else{
                setModalText(fieldList.length && fieldList[0].sections.modal[0].mandatoryModal.paragraph)
                setScrollPos();
                setShow(true);
                document.getElementById('root').style.filter = 'blur(5px)';
                setLoader(false)
            }
        }
        
    }

    const [show, setShow] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [modalText, setModalText] = useState();
    const handleClose = () => {
    setShow(false);
    setLoader(false)
    document.getElementById('root').style.filter = 'none';
    resetScrollPos();
    if(isSuccess){
        setIsSuccess(false);
        navigate('/dashboard/account/user');
    }
    }
    const resetScrollPos = () => {
      window.scrollTo(0,scrollPosition)
    }
    const setScrollPos = () => {
        let scrollpos = window.scrollY;
        setScrollPosition(scrollpos);
        window.scrollTo(0,0);
    }
    const renderModal = (modal) => {
        let modalData = modalText;
        return (
        <CustomModal
            show={show}
            size="lg"
            onHide={handleClose}
            modelBodyContent= {modalData}
            buttonText={fieldList.length && fieldList[0].sections.modal[0].mandatoryModal.primaryButton.text}
        />		
        );
    };
    const addMore = (numberOfObjs)=>{
        let usedField=fieldList[0].sections.subSections[2].fieldsArray
        const  addNewFiled ={}
        const temp = JSON.parse(JSON.stringify(fieldList[0].sections.subSections[2].fieldsArray[usedField.length-1].fields));       
        
        addNewFiled['fields'] = temp
        let list=fieldList
        if(numberOfObjs){
            for(let i=0;i<(numberOfObjs-1);i++){
                list[0].sections.subSections[2].fieldsArray.push(addNewFiled);
            }
        }
        else list[0].sections.subSections[2].fieldsArray.push(addNewFiled);

        setFieldList(list)
        numberOfObjs ? setInitialState(list,false,true) : setInitialState(list)
    }

    const removeFormData = (item, index,flag) => {
      let fields;
      if(flag){
        fields = [...formFieldData];
        let fieldName = item.name;
        fields[index][fieldName] = "";
        setFormFieldData(fields);
      }
      else {
        fields = {...formData};
        let fieldName = item.name;
        fields[fieldName] = "";
        setFormData(fields);
      }
       
      //validateField(fieldName, "", fields,index,flag);
    }

    const getOperatorFields = (item,index,flag) => {
        switch(item.component.toUpperCase()) {
        case "INPUT":
            return (<Input 
                colWidth={item.styles ? item.styles.colWidth : ""} 
                Type={item.type} 
                Label={item.label}
                Name={item.name}
                id={item.id}
                clear={clear}
                disabled={(item.name==='bulkUpload' && disable) || item.name=="organizationName" ?true:false}
                Placeholder={item.placeholder}
                Accept={item.accept}
                isRequred={item.isRequired}
                maxLength={item.maxLength}
                minLength={item.minLength}
                styles={item.styles}
                handleChange={(e) => handleChange(e, item,index,flag)}
                handleBlur={(e) => handleBlur(e, item,index,flag)}
                fieldError={
                    formErrors && 
                    formErrors[item.name] && !formErrors[item.name].isValid/* 
                    && (
                        formErrors[item.name].isTouched
                    ) */
                }
                errorMessage={
                    formErrors  &&
                    formErrors[item.name] && formErrors[item.name]
                        .activeValidator
                        .errorMessage
                }
                formDataSet={formData && formData[item.name] ? formData[item.name] : item.defaultValue ? item.defaultValue : ''}
                />)
        case "SELECT":
            return (<Select 
                colWidth={item.styles ? item.styles.colWidth : ""} 
                className={item.className}
                Type={item.type} 
                Label={item.label}
                Name={item.name}
                disabled={state.addNewUser ? true : false}
                Placeholder={item.placeholder}
                isRequred={item.isRequired}
                maxLength={item.maxLength}
                minLength={item.minLength}
                dynamicSelect={item.dynamicSelect}
                lookupReference={item.dynamicSelect ? item.lookupReference : null}
                handleChange={(e) => handleChange(e, item,index,flag)}
                handleBlur={(e) => handleBlur(e, item,index,flag)}
                removeFormData = {() => removeFormData(item,index,flag)}
                dependentField = {item.dependentField}
                dependentFieldVal = {formData ? formData[item.dependentField] : null}
                accessLevel ={item.accessLevel}
                fieldError={
                    formErrors && 
                    formErrors[item.name] && !formErrors[item.name].isValid/* 
                    && (
                        formErrors[item.name].isTouched
                    ) */
                }
                errorMessage={
                    formErrors  &&
                    formErrors[item.name] && formErrors[item.name]
                        .activeValidator
                        .errorMessage
                }
                formDataSet={formData && formData[item.name] ? formData[item.name] : item.defaultValue ? item.defaultValue : ''}/>)
        case "RADIO":
            return (<>{state && state.addNewUser && state.addNewUser ? null : <Radio type={item.type} 
                Label={item.label} 
                Name={item.name}
                formDataSet={formData && formData[item.name] ? formData[item.name] : item.defaultValue ? item.label : ''}
                colWidth={item.styles ? item.styles.colWidth : ''}
                options={item.options}
                className={item.styles? item.styles.className: ''}
                handleChange={(e) => handleChange(e, item,flag)}
                handleBlur={(e) => handleBlur(e, item,flag)}/>}</>)
        case "BUTTON":
            return (<ButtonComponent 
                    Label={item.label} 
                    Type={item.type} 
                    Name={item.name}
                    className={item.styles.className}
                    handleClick = {(e) => handleClick(e, item,index)} />)
        case "PARAGRAPH":
            return (<Subheading label={item.label} />)
            
        case 'LINK':
          return (<div className={`${formErrors && formErrors['bulkUpload'] && formErrors['bulkUpload'].activeValidator.errorMessage ? 'bf-error-temp' : ''} bf-download-sample-xl`}><a className={`col-md-${item.styles.colWidth}`} href={template} download="file">{item.label}</a></div> )
        };
    }
    const getOperatorFields2 = (item,index,flag) => {
        switch(item.component.toUpperCase()) {
        case "INPUT":
            return (<Input 
                colWidth={item.styles ? item.styles.colWidth : ""} 
                Type={item.type} 
                Label={item.label}
                Name={item.name}
                id={item.id}
                disabled={disable}
                Placeholder={item.placeholder}
                isRequred={item.isRequired}
                maxLength={item.maxLength}
                minLength={item.minLength}
                handleChange={(e) => handleChange(e, item,index,flag)}
                handleBlur={(e) => handleBlur(e, item,index,flag)}
                fieldError={
                    formFieldErrors && formFieldErrors.length&&
                    formFieldErrors[index][item.name] && !formFieldErrors[index][item.name].isValid/* 
                    && (
                        formErrors[item.name].isTouched
                    ) */
                }
                errorMessage={
                    formFieldErrors  && formFieldErrors.length&&
                    formFieldErrors[index][item.name] && formFieldErrors[index][item.name]
                        .activeValidator
                        .errorMessage 
                }
                formDataSet={formFieldData && formFieldData.length ? formFieldData[index][item.name] : item.defaultValue ? item.defaultValue : ''}
                />)
        case "SELECT":
            return (<Select 
                colWidth={item.styles ? item.styles.colWidth : ""} 
                Type={item.type} 
                Label={item.label}
                Name={item.name}
                disabled={disable}
                Placeholder={item.placeholder}
                isRequred={item.isRequired}
                maxLength={item.maxLength}
                minLength={item.minLength}
                dynamicSelect={item.dynamicSelect}
                tooltip={operatorCheck?item.tooltipOperator: item.tooltipFbo}
                isAdmin = {acclvl}
                lookupReference={item.dynamicSelect ? item.lookupReference : null}
                handleChange={(e) => handleChange(e, item,index,flag)}
                handleBlur={(e) => handleBlur(e, item,index,flag)}
                removeFormData = {() => removeFormData(item,index,flag)}
                dependentField = {item.dependentField}
                dependentFieldVal = {formData ? formData[item.dependentField] : null}
                accessLevel ={item.accessLevel}
                fieldError={
                    formFieldErrors && formFieldErrors.length&&
                    formFieldErrors[index][item.name] && !formFieldErrors[index][item.name].isValid/* 
                    && (
                        formErrors[item.name].isTouched
                    ) */
                }
                errorMessage={
                    formFieldErrors  && formFieldErrors.length&&
                    formFieldErrors[index][item.name] && formFieldErrors[index][item.name]
                        .activeValidator
                        .errorMessage 
                }
                formDataSet={formFieldData && formFieldData.length ? formFieldData[index][item.name] : item.defaultValue ? item.defaultValue : ''}/>)
        case "BUTTON":
            return (<ButtonComponent 
                    Label={item.label} 
                    Type={item.type} 
                    Name={item.name}
                    className={item.styles.className}
                    handleClick = {(e) => handleClick(e, item,index)} />)
        case "MULTISELECTCHECKBOX":
            return (<MultiSelectCheckbox 
                Label={item.label} 
                Name={item.name}
                isRequred={item.isRequired}
                colWidth={item.styles ? item.styles.colWidth : ''}
                dynamicSelect={item.dynamicSelect}
                placeholder={item.placeholder}
                filterLocation={item.name=='location'?filterLocation:null}
                isAdmin = {acclvl}
                disabled={disable}
                lookupReference={item.dynamicSelect ? item.lookupReference : null}
                handleChange={(e) => handleChange(e, item,index,flag)}
                checked={item.name==='location'&& operatorCheck?true:false}
                handleBlur={(e) => handleBlur(e, item,index,flag)}
                removeFormData = {() => removeFormData(item,index,flag)}
                dependentField = {item.dependentField}
                dependentFieldVal = {formData ? formData[item.dependentField] : null}
                fieldError={
                    formFieldErrors && formFieldErrors.length&&
                    formFieldErrors[index][item.name] && !formFieldErrors[index][item.name].isValid/* 
                    && (
                        formErrors[item.name].isTouched
                    ) */
                }
                errorMessage={
                    formFieldErrors  && formFieldErrors.length&&
                    formFieldErrors[index][item.name] && formFieldErrors[index][item.name]
                        .activeValidator
                        .errorMessage 
                }
                formDataSet={formFieldData && formFieldData.length ? formFieldData[index][item.name] : item.defaultValue ? item.defaultValue : ''}
                />)
        };
    }
    const getHeaderText = (JsonPageName) => {
        let finalHeader;
        if(currentUserRole != "Barrel Fuel"){
            //finalHeader = JsonPageName + ' - ' + storageOrgName
            finalHeader = JsonPageName
        }
        else finalHeader = JsonPageName
        getMobileHeaderText(dispatch, finalHeader)
        return finalHeader
    }
  return (<>
    {isBusy ? (<Loader />) : (
    <div className={`d-flex d-flex-row login-section bf-operator-enrollment-section signup-section ${show ? 'bf-show-model-blr' : ''} 
    ${selectedUser ? 'bf-dashboard-signup bf-dashboard-fbo-signup bf-dashboard-user-signup' : ''}`}>
        <div className={`${selectedUser ? '' : "w-70p"} login-form d-flex d-flex-column`}>
            {selectedUser ? null :<div className="d-flex d-flex-row align-item-center justify-content-between bf-menu-header">
              <Nav.Link href={'./admin'}>
                <img src={logo} alt="Barrel Fuel Logo" className='login-logo'/>
              </Nav.Link>
              <Nav.Link href={'./admin'}>Home</Nav.Link> 
            </div>}
            <Form className='admin-add-user' autoComplete='off'>
                <h1 className='d-flex bf-heading'>{getHeaderText(fieldList[0].pageName)}</h1>
                
                <div className={`${selectedUser ? 'bf-dashboard-signup-body' : ''}`}>
                  <div>
                        {
                            fieldList[0].sections && fieldList[0].sections.subSections.map((item) => (<Row className='mb-2'>
                            
                                <Row>
                                  {item.fields && item.fields.map((field) => {
                                      if(currentUserRole == "Barrel Fuel") {
                                          return getOperatorFields(field,false)
                                      } else {
                                          if(!restrictedFields.includes(field.name)) {
                                              return getOperatorFields(field,false)
                                          } 
                                      }
                                  })}
                                </Row>
                            {item.fieldsArray && item.fieldsArray.map((item,index) => (<Row className='bf-mrgb-0'>
                                { 
                                  item.fields.map((val)=>{
                                    if(val.type != "button")
                                    return getOperatorFields2(val,index,true)
                                  })
                                }
                                <Row className={`bf-buttons-section ${selectedUser.toLowerCase() == 'operator' ? 'bf-operator-add-remove' : ''}`}>{ 
                                  item.fields.map((val)=>{
                                    if(val.type == "button"){
                                      if((fieldList[0].sections.subSections[2].fieldsArray && fieldList[0].sections.subSections[2].fieldsArray.length==1 && index == 0 && val.name == "remove") ||
                                          (fieldList[0].sections.subSections[2].fieldsArray && ((fieldList[0].sections.subSections[2].fieldsArray.length-1) != index) && val.name == "addNew"))
                                      {}
                                      else return getOperatorFields2(val,index,true)
                                    }
                                  })
                                }</Row>
                                
                            </Row>))}
                            </Row>

                        ))
                        }
                
                  </div>
                </div>
                        
                    {fieldList[0].sections.subSections.map((item) => (<Row className='mb-3'>
                           
                            <ButtonGroup>
                                {item.buttons && item.buttons.map((item) => (<>
                                {getOperatorFields(item)}</>
                            ))}
                    </ButtonGroup>
                            </Row>
                            

                        ))}
                     
                <div className={`${selectedUser ? 'bf-dashboard-signup-buttons add-user-buttons' : '' } d-grid gap-2 mb-5`}>
                  { ! loader ?
                    <ButtonGroup>
                        {fieldList[0].sections.buttons.map((item) => (<>
                                {getOperatorFields(item)}</>
                                
                            ))}
                    </ButtonGroup> : <div className="bf-mrgb-0"><Loader height="auto"/></div>}
                </div> 
                    {show?renderModal():null}
                
                
                {/* <div className="d-grid gap-2 mb-5">
                    <ButtonGroup>
                        <Button className="bf-btn-login" variant="primary" type="submit">
                            Create User
                        </Button>
                        <Button className="bf-btn-login" variant="primary" type="submit">
                            Clear
                        </Button>
                    </ButtonGroup>
                </div> */}
            </Form>
        </div>
        {selectedUser ? null :<div className='d-flex bg-image-container w-30p'>
            <div className='d-flex d-flex-column bf-login-right-sec'>
            {fieldList[0] && fieldList[0].sections && fieldList[0].sections.aviationFacts &&
                <AviationFacts facts={fieldList[0].sections.aviationFacts}/>
            }
            </div>
        </div>}
    </div>)}
    </>
  );
}

export default AdminAddUser;