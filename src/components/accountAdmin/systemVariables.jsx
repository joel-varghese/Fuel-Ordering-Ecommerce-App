import { CompressOutlined, Label } from '@mui/icons-material';
import { getTextFieldUtilityClass } from '@mui/material';
import { data } from 'jquery';
import React, { useEffect, useState } from 'react'
import Input from '../input/input';
import { Row, Nav, Col, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getSystemVariables } from '../../actions/accountAdminAction/adminService'
import { getEditSystemVariables } from '../../actions/accountAdminAction/adminService'
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService'
import ButtonComponent from '../button/button';
import './admin.scss'
import CustomModal from '../customModal/customModal';
import Loader from '../loader/loader';
import { validateField } from '../../controls/validations';

export default function SystemVariables() {
    const [systemVariablesData , setsystemVariablesData] = useState([]);
    const [feildData,setfeildData]=useState([])
    const [systemJson,setSystemJson]=useState()
    const [isloading,setIsloading]=useState(true)
    const [jsonPayload, setJsonPayload] = useState({"blobname":"admin.json"})
    const [formDataSet, setformDataSet] = useState([]);
    const [formErrors, setFormErrors] = useState([]);
    const commonReducer = useSelector((state) => state.commonReducer);
    const loggedInUser = commonReducer?.loggedInUser?.data;
    const [modalShow,setModalShow] = useState(false);
    const [modaledit,setModaledit]=useState(false);
    const params = {"blobname":"admin.json"}
    
    useEffect(() => {
      setIsloading(true)
      bfaJsonService(params).then(response=>{
        setSystemJson(response.data)
      })
      let payload={"Loggedinuser":loggedInUser}
      getSystemVariables(payload).then((res)=>{
        setIsloading(false)
        let data=res?.data
        data =  data[0][0]['JSON_UNQUOTE(@JSONResponse)']
        data=JSON.parse(data)
        setsystemVariablesData(data)
        //setfeildData(data)
        setInitialState(data)
      })
      
    }, [])

    const setInitialState = (data) => {
      let formData = [];
      let formErrors = {}
      formData = data.map((item) => {
        formErrors[item.ID] = getFormErrorRules(item)
        return item
      })
      setFormErrors(formErrors)
      setformDataSet(data)
    }

    const getFormErrorRules = (item) => {
      return {
        name:item.ID,
        isValid: (item.unit != '' ? true : false),
        isTouched: false,
        activeValidator: {},
        validations: [
                        {
                            "validation":"IsMandatory",
                            "errorMessage":""
                        },
                        {
                          "validation":"onlydigit",
                            "errorMessage":""
                        }
                    ],
        isRequired:true
      };
    }

    const handleChange=(e,item,index)=>{
      let target = e.target
      let value = target.value;

      let formData = [...formDataSet]
      let data = [...feildData]
      if (item.unit !== '%') {
        value = value.replace(/\D/g, '');


      }
      else if (item.unit == '%') {
        value = validatepercent(item, value)
      }
      formData[index].value = value
      let fields = {};
      fields[item.ID] = value;
      let flag = false
      let datIndex = 0
      if (data.length === 0) {
        data.push(formData[index])
      } else {
        data.map((item, i) => {
          if (item.ID === formData[index].ID) {
            // item = formData[index]
            flag = true;
            datIndex = i;
          }
        })
        if (flag) {
          data[datIndex] = formData[index]
        } else {
          data.push(formData[index])
        }

      }

      //data.push(formData[index])
      data[index].value = value
      setformDataSet(formData)
      setfeildData(data)


      // validateField(item.ID, e.target.value, fields, true, formErrors)

    }
    const validatepercent = (item,val)=>{
      let length = item.unit == '%' ? [2,2]:[5,2]
      let value = val.replace(/(?!-)[^0-9.]/g, "" )
      value = String(value).split(".")
      let Val = ""
      let amount = value[0]
      let decimal = value[1]
      if(value[0]?.length > length[0]){
      amount = value[0].substring(0, length[0]);
      }
      if(value[1]?.length > length[1]){
      decimal = value[1].substring(0, length[1]);
      }
      if(value.length>1){
      Val = `${amount}.${decimal}`
      }else {
      Val = amount
      }
      return Val
    }
  
    const handleBlur=(item)=>{

     }

    const validateForm = (validationFields) => {
      let formValid = true;
      let fields = validationFields ? validationFields : formErrors;
      const formErrorKeys = Object.keys(fields);
      
      for (let i = 0; i < formErrorKeys.length; i++) {
        const fieldName = formErrorKeys[i];
         if (!formErrors[fieldName].isValid) {
              formValid = false;
              break
            } else {
              formValid = formErrors[fieldName].isValid;
         }
      }
      return formValid;
    }
    const handlesubmit =()=>{
      // setModalShow(true)
      let isValid;
      let formData = [...formDataSet]
      let Validations = {}
      formData.map((item) => {
        let fields = {};
        fields[item.ID] = item.value;
        Validations = validateField(item.ID, item.value, fields, true, formErrors)
      })
      setFormErrors(Validations)
      
      isValid = validateForm(Validations);
      setModaledit(isValid)
      if(isValid) {
        setModalShow(true)
        document.getElementById('root').style.filter = 'blur(5px)';
      } else 
      {
        setModalShow(true)
        document.getElementById('root').style.filter = 'blur(5px)';
      }

    }

    const successModal=()=>{
      let Editpayload=[...feildData];
      setIsloading(true)
      document.getElementById('root').style.filter = 'none';
      setModalShow(false)
      getEditSystemVariables(Editpayload).then((res)=>{
      let payload={"Loggedinuser":loggedInUser}
      getSystemVariables(payload).then((res)=>{
        setIsloading(false)
        let data=res?.data
        data =  data[0][0]['JSON_UNQUOTE(@JSONResponse)']
        data=JSON.parse(data)
        setsystemVariablesData(data)
        setfeildData(data)
        setInitialState(data)
      })
        setfeildData([])
        setIsloading(false)
      })
      
    }

    const closeModal=()=>{
      setModalShow(false)
      document.getElementById('root').style.filter = "none";

    }

    const getInputField = (item, index) => {
      return (
        <Input
          colWidth={item.styles ? item.styles.colWidth : ""}
          Label={item.VariableName}
          data-label={item.label}
          Name={item.name}
          id={item.Id}
          disabled={null}
          Placeholder={null}
          isRequred={item.isRequired}
          maxLength={item.unit !== '%' ? item.maxallowedlength:""}
          minLength={item.minLength}
          handleChange={(e) => handleChange(e,item,index)}
          handleBlur={(e) => handleBlur(e,item,index)}
          styles = {item.styles}
          tooltip={{"text":item.tooltip}}
          unit={item.unit}
          formDataSet={formDataSet ? formDataSet[index].value : ''}
          fieldError={
            formErrors
            && !formErrors[item.ID].isValid
            //&& (
            //    formErrors[item.name].isTouched
            //)
          }
          errorMessage={
              formErrors
              && formErrors[item.ID]
                  .activeValidator
                  .errorMessage
          }
        />
      )
    }

    const getOperatorFields = (item,index) => {
      let value = formDataSet ? formDataSet[index].value : '';
      if(systemVariablesData.length == index + 1) {
        return (
          <>          
          {getInputField(item, index)}
          <ButtonComponent
              Label={systemJson.systemvariables.system.label}
              Type={"button"}
              className={'bf-btn-login bf-btn-imp'}
              variant={'primary'}
              disabled={false}
              handleClick={handlesubmit}
          />
        </>
        )
      }
      return(
        getInputField(item, index)
      )
    }

    
  return (<>
    {systemJson && systemVariablesData && formDataSet && !isloading ?
    <div className='bf-account-companychange bf-system-variables' >
      {formDataSet && systemVariablesData.map((item,index)=>getOperatorFields(item,index))} 

      <CustomModal
        show={modalShow}
        onHide={modaledit ? successModal : closeModal}
        close = {()=>closeModal()}
        hide={()=>closeModal()}
        modelBodyContent={modaledit?systemJson.systemvariables.model.message:systemJson.systemvariables.model.failedmessage}
        buttonText={modaledit?systemJson.systemvariables.model.label1:systemJson.systemvariables.model.failedlabel}
        secondbutton={modaledit?systemJson.systemvariables.model.label2:""}
      />
    </div> : <div className='bf-account-companychange'><Loader/></div>
  }</>
    
  )
}
