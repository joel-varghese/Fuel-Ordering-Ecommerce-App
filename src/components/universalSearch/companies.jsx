import React, { useState,useEffect } from 'react';
/* import Input from '../input/input';
import Select from '../select/select';
import Radio from '../radio/radio'; */
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
/* import ButtonComponent from '../button/button';
import MultiSelectCheckbox from '../multiSelect/multiSelectCheckbox'; */
//import * as xlsx from "xlsx";
import { useLocation, useNavigate } from 'react-router-dom';
import { Storage, jsonStringify } from '../../controls/Storage';
import { accountCompanyEditService, accountUserDeactivateService,deleteAircraft, fetchCompanyDetails } from '../../actions/accountServices/accountCompanyService';
import BFTable from '../table/table'
import Loader from '../loader/loader';
import CustomModal from '../customModal/customModal';
import ButtonComponent from '../button/button';
import EditFormModal from '../customModal/editModal';
import { getFieldIsValid, phoneValidation } from '../../controls/validations';
import { adminAddUserSave } from "../../actions/adminAddUserService/adminAddUserService";
import {AdminAddUser} from "../admin/adminAddUser";
import  {AdminSignupForm} from "../admin/adminSignupForm";
import { getAccessLevel } from '../../controls/commanAccessLevel';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanyData } from '../../actions/universalSearch/searchHome/searchHomeActions';
function Companies() {
    let {state} = useLocation()
    const [fieldList, setFieldList] = useState(null);
    const [rows, setRows] = useState([]);
    const [isBusy, setBusy] = useState(true);
    const dispatch = useDispatch()
    const userType=Storage.getItem('userType')
    const searchHomeReducer = useSelector((state) => state.searchHomeReducer);
    const commonReducer = useSelector(state => state.commonReducer);
    const loggedInUserType = commonReducer && commonReducer.loggedInUserType && commonReducer.loggedInUserType.data;
    const loggedInCompany = commonReducer && commonReducer.loggedInCompany && commonReducer.loggedInCompany.data;
    const loader = searchHomeReducer && searchHomeReducer.loading && searchHomeReducer.loading;
    const jsonData = searchHomeReducer && searchHomeReducer.searchHomeJson && searchHomeReducer.searchHomeJson;
    const companyResponse = searchHomeReducer && searchHomeReducer.searchCompanyData && searchHomeReducer.searchCompanyData;
    const searchValue = searchHomeReducer && searchHomeReducer.searchValue && searchHomeReducer.searchValue?.tab;
    const cells = jsonData && jsonData.data.data.headCells && jsonData.data.data.headCells.company.filter((m)=>
		  m?.users?.includes(userType.toLowerCase()))
    let paylod = { 'blobname': 'searchHome.json' }
    let navigate = useNavigate();
    
    function createData(firstName,location,email, fboMembership, phoneNumber) {
      var obj={
          "organizationName":firstName,
          "primaryLocation":location,
          "email":email
      }
      if(userType.toLowerCase()=='fbo'){
          obj.phoneNumber=phoneNumber && phoneValidation(phoneNumber.toString())
          obj.noOfAircraft=fboMembership && fboMembership
      }else if(userType.toLowerCase()=='operator'){
        obj.phoneNumber=phoneNumber && phoneValidation(phoneNumber.toString())
          obj.fuelService=fboMembership && fboMembership 
      }else{
        obj.membership=fboMembership && fboMembership 
        obj.phoneNumber=phoneNumber && phoneValidation(phoneNumber.toString())
      }
      return obj;
      
    }
    
    useEffect(() => {
      let companyDetails={'service': 'company','organizationName': loggedInCompany,'filter':searchValue}
      if(userType.toLowerCase()!='fbo'&& userType.toLowerCase()!='operator'){
        companyDetails.service='allcompany'
        fetchCompanyData(companyDetails,dispatch)
      }else if(userType.toLowerCase()=='operator'){
        companyDetails.service='allfborg'
        fetchCompanyData(companyDetails,dispatch)
      }
      else{
        setBusy(false);
        setRows([])
      }   
  }, [searchValue]);

  useEffect(()=>{
    setFieldList(jsonData && jsonData.data && jsonData.data.data.headCells)
  },[jsonData])

  useEffect(()=>{
    let userData = [];
          let responseData = companyResponse && companyResponse.data && companyResponse.data.res
          responseData && responseData.map((item)=>{
            userData.push(createData(item.organizationName,item.primaryLocation,item.email,userType.toLocaleLowerCase()=='operator'?item.fuelservice && item.fuelservice.toString(','): item.fboMembership, item.phoneNumber))
          })
            setRows(userData)
            setBusy(false);
  },[companyResponse && companyResponse.data && companyResponse.data.res])
    
   return (<>
  {fieldList && 
    <div className='bf-table-container bf-table-search-results bf-search-company-table-container'>
      <BFTable 
      sortEnabled = {true}
      Data ={rows} 
      heading={cells && cells}
      univeralSearch={true}
      loading={loader && loader}
      noMatch={true}
      >
      </BFTable>
    </div>
    }  </>
    );
  }
export default Companies;