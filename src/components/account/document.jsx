import React, { useState,useEffect } from 'react';
import Input from '../input/input';
import Select from '../select/select';
import Radio from '../radio/radio';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import ButtonComponent from '../button/button';
import MultiSelectCheckbox from '../multiSelect/multiSelectCheckbox';
// import './company.scss';
import * as xlsx from "xlsx";
import { useLocation, useNavigate } from 'react-router-dom';
import CustomModal from '../customModal/customModal';
import EditFormModal from '../customModal/editModal';
import { adminAddUserSave } from '../../actions/adminAddUserService/adminAddUserService';
import Subheading from '../subHeading/subHeading';
import { SendMailToUsers } from '../../services/commonServices';
import Loader from '../loader/loader';
import CompanyDetails from './companyDetails';
import MembershipDetails from './memberShip';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import BFTable from '../table/table'
import { Button } from 'react-bootstrap';
import { flightInformationService } from '../../actions/tailNumberService/tailNumberService';
import { deleteDocuments, uploadDocument } from '../../actions/accountServices/accountCompanyService';
import { getFieldIsValid } from '../../controls/validations';
import { Storage } from '../../controls/Storage';
import NewDocTable from '../table/newDocTable';
import DeleteIcon from '../../assets/images/delete_icon.svg';
import UploadIcon from '../../assets/images/upload_icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocumentData, fetchJSONData } from '../../actions/accountDocuments/accountDocumentsActions';
import { getAccessLevel } from '../../controls/commanAccessLevel';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';

function Documents(props) {
    
    const [fieldList, setFieldList] = useState(null);
    const {state} = useLocation();
    const [restricted, setrestricted] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [formErrors, setformErrors] = useState({});
    const [isBtnValidate,setbtnValidate]=useState(false);
    const [hidden,sethidden]=useState(true);
    const [deleteDisable,setdeleteDisable]=useState(false);
    const [refresh,setrefresh]=useState(0);
    const [aircraftId,setaircraftId]=useState(0);
    const [documentId,setdocumentId]=useState([]);
    const [editmodalShow, seteditModalShow] = useState(false);
    const [deleted, setdelete] = useState(false);
    const [modalText, setModalText] = useState("");
    const [formdata, setformdata] = useState({});
    const [rows, setRows] = useState([]);
    const [allowAccess, setAllowAccess]= useState(false);
    const [newRows, setnewRows] = useState([]);
    const [loading, setLoading] = useState(false)

    let paylod = { 'blobname': 'accountDocument.json' }
    const dispatch = useDispatch();
    const documentReducer = useSelector(state => state.documentReducer);
    const jsonData = documentReducer && documentReducer.documentJson && documentReducer.documentJson;
    const documentData = documentReducer && documentReducer.documentData && documentReducer.documentData && documentReducer.documentData.data
    const loader = documentReducer && documentReducer.fileData && documentReducer.fileData;
    const accountHomeReducer = useSelector((state) => state.accountHomeReducer);
    const selectedCompany = accountHomeReducer && accountHomeReducer.selectedCompany && accountHomeReducer.selectedCompany.company;
    function createData(name, calories, fat, carbs, protein,button) {
      return {
        "aircraftTailNumber":name,
        "serialNumber":calories,
        "manufacturerName":fat,
        "aircraftType":carbs,
        "homeBaseAirport":protein,
        "Buttons":button
      };
    }
    
    const [isBusy, setBusy] = useState(true);
    useEffect(() => {
      const allowAccess = getAccessLevel(Storage.getItem('userType'), Storage.getItem('accessLevel'))
      setAllowAccess(allowAccess)
      const levelOfAccess = JSON.parse(Storage.getItem('accessLevel'))[0]
      if(Storage.getItem('userType') === "Barrel Fuel") {
        setdeleteDisable(true)
      }  
      else{
        if (levelOfAccess.toLowerCase() !== 'super'){
          setdeleteDisable(true)
        }
      }
      document.getElementById('root').style.filter = 'none';
      let companyDetails={'service': 'documents', 'organizationName': selectedCompany}
      fetchJSONData(dispatch,paylod)
      fetchDocumentData(dispatch, companyDetails)
      
      
  }, [refresh,selectedCompany]);

  
  useEffect(()=>{
    let data = jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.documentData
    setLoading(loader && loader)
    setFieldList(data)
    let aircraftData = [];
    let responseData = documentData && documentData.res
    setRows(responseData)
    setBusy(false);
          //setInitialState(data.data.documentData[0].aircraftInformation)
        //   fetchCompanyDetails(companyDetails).then((response) => {
            
        // })
  },[fieldList,jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.documentData, documentData,loader])
  
  const isValidFileExtenstion = (fileName) => {

    if (fileName.toLowerCase().endsWith(".png") || fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg") || fileName.toLowerCase().endsWith("pdf") || fileName.toLowerCase().endsWith("doc") || fileName.toLowerCase().endsWith("docx")) {
        return true;
    } else {
        return false
    }

  }
  const onHandleFileChange = (e,field) => {
    let target=e.target
    let formdataset={}
    const fields = {};
    if(target.files[0]){
      let invalidType=isValidFileExtenstion(target.files[0].name)
      if(target.files[0].size > 5242880){
        setModalText(fieldList[0].modal.uploadError.text)
        setModalShow(true)
        document.getElementById('root').style.filter = 'blur(5px)';
      }else if(!invalidType){
        setModalText(fieldList[0].modal.uploadError2.text)
        setModalShow(true)
        document.getElementById('root').style.filter = 'blur(5px)';
      }else{
        setBusy(true)  
        let payload={}
        payload.saveJSON={
          "service":"document",
          "json":{"organizationName":selectedCompany}
        }
        uploadDocument(payload,target.files[0]).then((res)=>{
          if(res.message=="data Updated Successfully"){
            let auditPayload = {"ModuleName":"Account",
                                    "TabName":"Document",
                                    "Activity":JSON.stringify(target.files[0])+"Added",
                                    "ActionBy":Storage.getItem('email'),
                                    "Role":JSON.parse(Storage.getItem('userRoles')),
                                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                                saveAuditLogData(auditPayload, dispatch)
            setrefresh(refresh+1)
          }else{
            setModalText("Technical error")
            setModalShow(true)
          }
          
        })
      }
    }   
  }

   const onHandleChange = (e,field) => {
        
  }

  const onHandleBlur = (e,field) => {
      
  }

  const onClickSubmit = (e,item) => {
    if(!deleted ||documentId.length==0){
      sethidden(!hidden)
      setdelete(!deleted)
    }else{
      sethidden(!hidden)
      setModalText(fieldList[0].modal.deactivate.text)
      setModalShow(true)
      document.getElementById('root').style.filter = 'blur(5px)';
      setdelete(!deleted)
    }
    
  }

  const onChecked = (e,row) => {
    let docId=[...documentId]
    let obj={}
    if(e.target.checked){
      obj.documentid=row.documentid.toString()
      docId.push(obj)
      setdocumentId(docId)
    }else{
      docId.forEach((obj,index)=>{
        Object.keys(obj).forEach((id)=>{
          if(obj[id]==row.documentid){
            docId.splice(index,1)
          }
        })
      })
      setdocumentId(docId)
    }
    
  }
  
  const viewFile = (e,row) => {
    // console.log(row)
    let content=row.content;
    let contentFormat=row.documentType;
    //const linkSource = `data:${contentFormat};base64,${content}`;

        const base64ImageData = content;

        const contentType = contentFormat;
        const byteCharacters = window.atob(base64ImageData);

        const byteArrays = [];



        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {

            const slice = byteCharacters.slice(offset, offset + 1024);



            const byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++) {

                byteNumbers[i] = slice.charCodeAt(i);

            }



            const byteArray = new Uint8Array(byteNumbers);



            byteArrays.push(byteArray);

        }

        const blob = new Blob(byteArrays, { type: contentType });

        const blobUrl = URL.createObjectURL(blob);

    

        //window.open(blobUrl, '_blank');

        // createSetTimeoutPolyFill(() => {

            window.open(blobUrl, '_blank');

        // }, 100)
  }

  const closeModal = () => {
    setModalShow(false)
    document.getElementById('docUpload').value=''
    document.getElementById('root').style.filter = 'none';
    setdocumentId([])
  }

  const successModal = () => {
    setModalShow(false)
    document.getElementById('root').style.filter = 'none';
    document.getElementById('docUpload').value=''
    if(modalText==fieldList[0].modal.deactivate.text){
      setBusy(true)
      let payload={}
      let documents=[...documentId]
      payload.service="document"
      payload['json']={}
      payload['json'].documents=documents
      deleteDocuments(payload).then((res)=>{
        if(res.message=='data Deleted Successfully'){
          let auditPayload = {"ModuleName":"Account",
                                    "TabName":"Company",
                                    "Activity":documents +"Deleted",
                                    "ActionBy":Storage.getItem('email'),
                                    "Role":JSON.parse(Storage.getItem('userRoles')),
                                    "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                                saveAuditLogData(auditPayload, dispatch)
          setrefresh(refresh+1)
        }else{
          setModalText("Technical error")
          setModalShow(true)
        }
      })
      setdocumentId([])
    }
  }
  const getOperatorFields = (item) => {
    switch(item.component.toUpperCase()) {
      case "INPUT":
        return (
        <div className="bf-upload-doc">
        <label id="uploadDoc" htmlFor='docUpload'><img src={UploadIcon} /> {item.placeholder}</label>
        <input 
            colWidth={item.styles ? item.styles.colWidth : ""} 
            id='docUpload'
            type={item.type} 
            Name={item.name}
            onChange={(e)=>onHandleFileChange(e,item)}
            onBlur={(e)=>onHandleBlur(e,item)}
            />
          </div>)   
     case "BUTTON":
    return (<ButtonComponent       
            Label={item.label} 
            Type={item.type} 
            className={item.styles.className}
            variant={item.variant}
            disabled={restricted}
            handleClick={(e)=>onClickSubmit(e,item)}/>)
     };
}


  return (<>{isBusy?(<Loader/>):(
  <>
  {fieldList &&  <>
    {allowAccess? <div  className={`${fieldList && fieldList[0].addNewDocument ? fieldList[0].addNewDocument.styles.colWidth : ''} bf-absolute bf-upload-docs`}>
      {fieldList && fieldList[0].addNewDocument && selectedCompany ? getOperatorFields(fieldList[0].addNewDocument) : ''}
    </div>: '' }
    <div className='bf-table-container bt-document-table-container'>
      <Button disabled={deleteDisable} className="bf-delete-doc" onClick={(e)=>onClickSubmit(e)}><img src={DeleteIcon} /> {fieldList && fieldList[0].deleteDocument ? fieldList[0].deleteDocument.label : ''}</Button>
      <NewDocTable Data ={rows && rows} 
      searchEnabled={true} 
      heading={fieldList && fieldList[0].headCells} 
      onChecked={onChecked}
      viewFile={viewFile}
      searchBy={["documentName","uploadDate"]}
      loader= {loading}
      hidden={hidden} />
    </div>
    <CustomModal
    show={modalShow}
    onHide={() => successModal()}
    hide={()=>closeModal()}
    close={()=>closeModal()}
    size={modalText===fieldList[0].modal.deactivate.text ? "lg":''}
    modelBodyContent={modalText}
    buttonText={modalText==fieldList[0].modal.deactivate.text? fieldList[0].modal.deactivate.button1:fieldList[0].modal.uploadError.button1}
    secondbutton={modalText== fieldList[0].modal.deactivate.text?fieldList[0].modal.deactivate.button2:""}
  /></>}</>
    )}  </>
  );
}
export default Documents;