import React, { useState, useEffect,useRef } from 'react';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Nav, Col, Form, Button } from 'react-bootstrap';
import { lookupService } from '../../services/commonServices';
import Loader from '../loader/loader';
import './admin.scss'
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import ButtonComponent from '../button/button';
import { getOperators, userCompanies, mapCompany } from '../../actions/accountAdminAction/adminAction';
import CustomModal from '../customModal/customModal';



export default function CompanyChange() {
    const [companyJson,setCompanyJson] = useState({})
    const [companyList, setCompanyList] = useState([])
    const [companyResult,setCompanyResult] = useState([])
    const [userList,setUserList] = useState([])
    const [userResult,setUserResult] = useState([])
    const [isCompLoad,setIsCompLoad] = useState(false)
    const [isUserLoad,setIsUserLoad] = useState(false)
    const [modalText, setModalText] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [compSelected, setCompSelected] = useState([]);
    const [userSelected, setUserSelected] = useState([]);
    const [updateDisable,setUpdateDisable] = useState(true)
    const typeaheadRef = useRef(null);
    const [isBusy, setBusy] = useState(true)
    const params = {"blobname":"admin.json"}
    const dispatch = useDispatch();
    const loginReducer = useSelector(state => state.loginReducer);
    const loginDetails = loginReducer && loginReducer.loginDetails &&loginReducer.loginDetails.data;
    let loginDetls =  JSON.stringify(loginDetails) === '{}'?{}:JSON.parse(loginDetails);
    let userEmail = loginDetls.loginUserName?loginDetls.loginUserName:'';
    const [formDataSet, setformDataSet] = useState([]);
    const [formErrors, setformErrors] = useState([]);
    const [userDataSet,setUserDataSet] = useState({})
    const [userErrors,setUserErrors] = useState({})
    const [userChange,setUserChange] = useState(0)
    const [refresh,setRefresh] = useState(0)
    const payload = {
      "Loggedinuser":userEmail
    }

    useEffect(() => {
        bfaJsonService(params).then(response=>{
            setCompanyJson(response.data)
            setInitialState(response.data,false)
            setBusy(false)
        })
        let header = {
            "userType": "operator"
          }
          let requestData = {
            "serviceName": "companyName",
            "headers" : header
          }
          
            lookupService(requestData).then(((res)=>{    
              let data = res?.body ? JSON.parse(res.body): ""
              setCompanyList(data) 
              setCompanyResult(data)  
            }))

      getOperators(dispatch,payload).then(res=>{
              let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JsonResult)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JsonResult)']):[];
              getUserList(data)
            })
      },[refresh]);

      useEffect(() => {
        let req = {
          "Loggedinuser": userSelected[0]
        }
        userCompanies(dispatch,req).then(res=>{
          let compSel = [...compSelected]
          let items = []
          let formData = [];
          let details = {};
          let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
          if(data.Companies != null){
            let num = companyJson.CompanyChange.companySection.length - data.Companies.length
            let len = companyJson.CompanyChange.companySection.length - 1
            if(num<0){
              for(var i = 1;i<=num;i++){
                removeCompany(len--)
              }
            }else if(num<0){

            }
          data.Companies.forEach((val,index)=>{
            items.push(val.CompanyName)
            compSel[index] = items
            details["company"] = val.CompanyName
            formData.push(details)
            items = []
            details = []
          })
          }else{
            let num = companyJson.CompanyChange.companySection.length - 1
            let len = companyJson.CompanyChange.companySection.length - 1
            if(num>1){
              for(var i = 1;i<=num;i++){
                removeCompany(len--)
              }
            }
            compSel[0] = []
            formData = [{
              "company":null
            }]
          }
          setCompSelected(compSel)
          setformDataSet(formData)
        })
      },[userChange]);
      const getUserList = (data) => {
        let res = []
        data && data.forEach(item => {
          if(item.TabName != null){
          res.push(item.TabName)
          }
        })
        setUserList(res)
        setUserResult(res)
      }

      const setInitialState = (jsonData,flag) =>{
        let formData = [];
        let userData = {}
        let userError = {};
        let details = {};
        let errors = {}
        let formErrors = [];
        const fieldTypeArr = ['input', 'asynctypeahead'];
        jsonData.CompanyChange.companySection.forEach((item,index)=>{
            item.fields.forEach((val)=>{
                if (fieldTypeArr.includes(val.component.toLowerCase())) {
                    if(flag && formDataSet && formDataSet.length > index){
                      details[val.name] = formDataSet[index][val.name]
                    }else{
                      details[val.name] = val.defaultValue?val.defaultValue:null
                    }
                    errors[val.name] = false
                }
            })
            formData.push(details)
            formErrors.push(errors)
            details = {}
            errors = {}
        })
        jsonData.CompanyChange.fields.forEach((val,index)=>{
                if (fieldTypeArr.includes(val.component.toLowerCase())) {
                    userData[val.name] = flag ? userDataSet && userDataSet[val.name] : val.defaultValue?val.defaultValue:null
                    userError[val.name] = false
                }
        })
        setformDataSet(formData)
        setformErrors(formErrors)
        setUserDataSet(userData)
        setUserErrors(userError)
      }
      const handleFocus = () => {
        // setAddress1Selected(['']);
      }
      const addNewCompany = () => {
        let usedField = companyJson.CompanyChange.companySection; //operatorSignup.sections[0].subSections[0].additionalUser
        const addNewFiled = {}
        const temp = JSON.parse(JSON.stringify(companyJson.CompanyChange.companySection[usedField.length - 1].fields));

        addNewFiled['fields'] = temp
        let list = companyJson
        companyJson.CompanyChange.companySection.push(addNewFiled);
        setCompanyJson(list)
        setInitialState(list,true)
      }
      const removeCompany = (index) => {
        let fieldArr = companyJson;
        fieldArr.CompanyChange.companySection.splice(index, 1);
        setCompanyJson(fieldArr);
        setInitialState(fieldArr,true);
      }
      const searchAPI =(e,item)=>{
        let fields={...formDataSet}
        let fieldName=item.name
        let payload={}
        let searchString = e && e
        if(item.name=='userId'){
          let result = []
          userList.forEach((val)=>{
              if(val.includes(searchString)){
                  result.push(val)
              }
          })
          setUserResult(result)
        }else if(item.name=='company'){
            let result = []
            companyList.forEach((val)=>{
                if(val.includes(searchString)){
                    result.push(val)
                }
            })
            setCompanyResult(result)
        }
        fields[fieldName]=e && e
        // setformDataSet(fields)
      }
      const searchHandler = (items,field,index) => {
        setUpdateDisable(false)
        let fieldName=field.name
        let compSel = [...compSelected]
        try {
        let formData = {...formDataSet};
        let userData = {...userDataSet}
        if(field.name == "userId"){
            setUserSelected(items)
            userData[fieldName]= items && items.length ?items[0] : userData[fieldName]
            if(items && items.length){
              setUserChange(!userChange)
            }
        }else if(field.name == "company"){
            compSel[index] = items
            setCompSelected(compSel)
            formData[index][fieldName] = items && items.length ?items[0] : formData[index][fieldName]
        }
        setUserDataSet(userData)
        setformDataSet(formData)
        } catch( err ) {
            console.error(' unexpected error caught in  search')
        }
    }
    const onSearchBlur = (evt,field) => {
    }
    const onClickSubmit = (e,item,index) =>{
        if(item.name === 'addNew') {
            addNewCompany()
        }else if(item.name == 'remove'){
            removeCompany(index)
        }
        if(item.name == "submit"){
          let isValid = true
          if(userDataSet["userId"] == null){
            isValid = false
          }
          companyJson.CompanyChange.companySection.forEach((item,index)=>{
            if(formDataSet[index]["company"] == null){
              isValid = false
            }
          })
          if(isValid){
            let orgs = []
            companyJson.CompanyChange.companySection.forEach((item,index)=>{
              orgs.push(formDataSet[index]["company"])
            })
            let req = {
              "Organizations":orgs,
              "loggedinuser":userEmail
            }
            mapCompany(dispatch,req).then(res=>{})
            setRefresh(!refresh)
          }else{
            document.getElementById('root').style.filter = 'blur(5px)';
            setModalText(companyJson.modal[0].message)
            setModalShow(true)
          }
        }
    }
    const SuccessModal = () =>{
      setModalText('')
      setModalShow(false)
      document.getElementById('root').style.filter = 'none';
    }
    const closeModal = () =>{
      setModalText('')
      setModalShow(false)
      document.getElementById('root').style.filter = 'none';
    }
    const filterBy = () => true;
      const getOperatorFields = (item, index) => {
        switch (item.component.toUpperCase()) {
            case "ASYNCTYPEAHEAD":
              let num = 0
              let compLabel = ""
              if(item.name == "company"){
                num = index+1
                compLabel = item.label+" "+num
              }
                return(
                    <Form.Group as={Col} md={item.styles.colWidth} className={` mb-4 ${item.name == "userId" ? userErrors[item.name] ? 'bf-error-class' : '' : formErrors[index][item.name] ? 'bf-error-class' : ''}`} controlId={item.name}
                    >
                        <Form.Label>{item.name == "company" ? compLabel : item.label} {item.isRequired ? <span className='bf-required'>*</span> : ''}</Form.Label>
                        <AsyncTypeahead
                        id={item.id}
                        filterBy={filterBy}
                        isLoading={item.name=='userId'?isUserLoad:isCompLoad}
                        disabled={false}
                        minLength={0}
                        defaultInputValue={''}
                        label={item.label}
                        useCache={false}
                        onSearch={(e)=>searchAPI(e,item)}
                        inputProps={{
                            name: item.name,
                            maxLength: item.maxLength
                          }} 
                        ref={typeaheadRef}
                        onChange={(ind) => searchHandler(ind, item, index)}
                        options={item.name=='userId'?userResult:companyResult}
                        placeholder = {item.placeholder}
                        onBlur={(e)=>onSearchBlur(e,item)}
                        selected={item.name=='userId'? userSelected : compSelected[index]}
                        onFocus={handleFocus}
                        renderMenuItemChildren={(option) => (
                            <>
                            <span>{option}</span>
                            </>
                        )}
                        />
                    </Form.Group> 
                )
            case "BUTTON":
                return (<ButtonComponent
                    Label={item.label}
                    Type={item.type}
                    className={item.styles.className}
                    variant={item.variant}
                    disabled={item.name == "submit" ? updateDisable : false}
                    handleClick={(e) => onClickSubmit(e,item,index)}
                     />)
        };
    } 

      return (<>
        {isBusy ? (
          (<Loader/>)
        ) : ( 
          <div className='bf-account-companychange'>
            {companyJson && companyJson.CompanyChange.fields.map((item)=>(
                item.component != "button" ? <>
                {getOperatorFields(item)} </> : '')
            )}

            {companyJson && companyJson.CompanyChange.companySection.map((item,index)=>(
                    <Row className='bf-mrgb-0 bf-admin-company-name'>
                    { 
                      item.fields.map((val)=>{
                        if(val.type != "button")
                        return getOperatorFields(val,index,true)
                      })
                    }
                    <Row className='bf-buttons-section'>{ 
                      item.fields.map((val)=>{
                        if(val.type == "button"){
                          if((companyJson.CompanyChange.companySection && companyJson.CompanyChange.companySection.length==1 && index == 0 && val.name == "remove") ||
                              (companyJson.CompanyChange.companySection && ((companyJson.CompanyChange.companySection.length-1) != index) && val.name == "addNew"))
                          {}
                          else return getOperatorFields(val,index,true)
                        }
                      })
                    }</Row>
                    
                </Row>)
            )}

            {companyJson && companyJson.CompanyChange.fields.map((item)=>(
                item.component == "button" ? <>
                {getOperatorFields(item)} </> : '')
            )}
          {modalShow && <CustomModal
        show={modalShow}
        onHide={() => SuccessModal()}
        close={() => closeModal()}
        hide={() => closeModal()}
        size={''}
        isPrompt={true}
        modelBodyContent={modalText}
        buttonText={companyJson.modal[0].text}
    />}
          </div>
              )}                  
      </>    
    );
}