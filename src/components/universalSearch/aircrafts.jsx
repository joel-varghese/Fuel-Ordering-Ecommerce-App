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
import { fetchAircraftData } from '../../actions/universalSearch/searchHome/searchHomeActions';
function Aircrafts() {
    let {state} = useLocation()
    const [fieldList, setFieldList] = useState(null);
    const [rows, setRows] = useState(null);
    const [isBusy, setBusy] = useState(true);
    const dispatch = useDispatch()
    const searchHomeReducer = useSelector((state) => state.searchHomeReducer);
    const commonReducer = useSelector(state => state.commonReducer);
    const loggedInUserType = commonReducer && commonReducer.loggedInUserType && commonReducer.loggedInUserType.data;
    const loggedInCompany = commonReducer && commonReducer.loggedInCompany && commonReducer.loggedInCompany.data;
    const loader = searchHomeReducer && searchHomeReducer.loading && searchHomeReducer.loading;
    const jsonData = searchHomeReducer && searchHomeReducer.searchHomeJson && searchHomeReducer.searchHomeJson;
    const aircraftResponse = searchHomeReducer && searchHomeReducer.searchAircraftData && searchHomeReducer.searchAircraftData;
    const searchValue = searchHomeReducer && searchHomeReducer.searchValue && searchHomeReducer.searchValue?.tab;
    let paylod = { 'blobname': 'searchHome.json' }
    let navigate = useNavigate();
    
    function createData(name, calories, fat, carbs, protein, buttons) {
      return {
        "aircraftTailNumber":name,
        "serialNumber":calories,
        "manufacturerName":fat,
        "aircraftType":carbs,
        "homeBaseAirport":protein? protein:'',
      };
    }
    
    useEffect(() => {
    //   let accLevel=JSON.parse(Storage.getItem('accessLevel'))
    //   accLevel=accLevel.map((level)=>{
    //     level=level.toLowerCase()
    //     return level
    //   })
      let userType=loggedInUserType;
      let companyValue=loggedInCompany;
      
      let companyDetails={'service': 'aircraft','organizationName': companyValue,'filter':searchValue}
      if(userType.toLowerCase()!='fbo'&& userType.toLowerCase()!='operator'){
        companyDetails.service='allaircrafts'
      }else if(userType.toLowerCase()=='fbo'){
        companyDetails.service='allaircraftsinfo'
      }
      // bfaJsonService(paylod).then(data => {
      //     setFieldList(data.data.headCells)
      fetchAircraftData(companyDetails,dispatch)
          
      // });
  }, [searchValue]);

  useEffect(()=>{
    setFieldList(jsonData && jsonData.data && jsonData.data.data.headCells)
  },[jsonData])

  useEffect(()=>{
    let aircraftData = [];
    if(loggedInUserType=='FBO'){
      let responseData = aircraftResponse && aircraftResponse?.data?.length && aircraftResponse.data
            responseData && responseData.map((item,index)=>{
              aircraftData.push(createData(item.tailNumber, item.serialNumber, item.manufacturer,item.aircraftType))
              
            })
    }else{
      let responseData = aircraftResponse && aircraftResponse.data && aircraftResponse?.data?.res
            responseData && responseData.map((item,index)=>{
              aircraftData.push(createData(item.tailNumber, item.serialNumber, item.manufacturerName,item.aircraftType, item.homeBaseAirport))
              
            })
    }
            
            setRows(aircraftData)
            setBusy(false);
  },[aircraftResponse && aircraftResponse.data && aircraftResponse.data])
    
   return (<> 
  {fieldList && 
    <div className='bf-table-container bf-table-search-results bf-aricraft-table-container'>
      <BFTable 
      sortEnabled = {true}
      Data ={rows} 
      heading={fieldList.aircraft}
      univeralSearch={true}
      loading={loader && loader}
      noMatch={true}
      >
      </BFTable>
    </div>
    }  
    </>
    );
  }
export default Aircrafts;