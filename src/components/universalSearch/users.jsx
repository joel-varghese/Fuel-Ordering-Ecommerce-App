import React, { useState,useEffect,useRef } from 'react';
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
import { fetchUserData } from '../../actions/universalSearch/searchHome/searchHomeActions';
function Users() {
    let {state} = useLocation()
    const [fieldList, setFieldList] = useState(null);
    const [rows, setRows] = useState([]);
    const [useremail, setUserEmail] = useState()
    const [isBusy, setBusy] = useState(true);
    const dispatch = useDispatch()
    const searchHomeReducer = useSelector((state) => state.searchHomeReducer);
    const commonReducer = useSelector(state => state.commonReducer);
    const loggedInUserType = commonReducer && commonReducer.loggedInUserType && commonReducer.loggedInUserType.data;
    const loggedInCompany = commonReducer && commonReducer.loggedInCompany && commonReducer.loggedInCompany.data;
    const loader = searchHomeReducer && searchHomeReducer.loading && searchHomeReducer.loading;
    const jsonData = searchHomeReducer && searchHomeReducer.searchHomeJson && searchHomeReducer.searchHomeJson;
    const userResponse = searchHomeReducer && searchHomeReducer.searchUserData && searchHomeReducer.searchUserData;
    const searchValue = searchHomeReducer && searchHomeReducer.searchValue && searchHomeReducer.searchValue?.tab;
    let paylod = { 'blobname': 'searchHome.json' }
    let navigate = useNavigate();
    
    function createData(firstName,lastName, calories, fat, carbs, protein, buttons) {
      return {
        "name":firstName+" "+lastName,
        "email":calories,
        "accessLevel":fat,
        "roles":carbs,
        "mobileNumber":protein && phoneValidation(protein.toString())
      };
    }
    
    useEffect(() => {
      let userType=loggedInUserType;
      let companyDetails={'service': 'user','organizationName': loggedInCompany,'filter':searchValue}
      if(userType.toLowerCase()!='fbo'&&userType.toLowerCase()!='operator'){
        companyDetails.service='allusers'
      }
      fetchUserData(companyDetails,dispatch)
      // bfaJsonService(paylod).then(data => {
      //     setFieldList(data.data.headCells) 
      // });
  }, [searchValue]);
  useEffect(()=>{
    setFieldList(jsonData && jsonData.data && jsonData.data.data.headCells) 
  },[jsonData])

  useEffect(()=>{
      let userData = [];
        let responseData = userResponse && userResponse.data &&userResponse.data.res
        responseData  && responseData.map((item,index)=>{
          userData.push(createData(item.firstName,item.lastName, item.email, item.accessLevel,item.roles, item.mobileNumber))
          
        })
        setRows(userData)  
  },[userResponse && userResponse.data && userResponse.data.res])
    
   return (<>
  {fieldList && 
    <div className='bf-table-container bf-table-search-results bf-user-table-container'>
      <BFTable 
      sortEnabled = {true}
      Data ={rows} 
      heading={fieldList?.users}
      univeralSearch={true}
      loading={loader && loader}
      noMatch={true}
      >
      </BFTable>
    </div>
    }
    </>);
  }
export default Users;