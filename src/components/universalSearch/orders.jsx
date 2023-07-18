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
function Orders() {
    let {state} = useLocation()
    const [fieldList, setFieldList] = useState(null);
    const [rows, setRows] = useState([]);
    const restrictedFields = ['organizationName', 'userType'];
    const [userDetailsData, setUserDetailsData] = useState(null);
    const [formdata, setformdata] = useState({});
    const [editmodalShow, seteditModalShow] = useState(false);
    const [formErrors, setformErrors] = useState({});
    const [isBtnValidate,setbtnValidate]=useState(false);
    const [modalText, setModalText] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [isEditable, setIsEditable] = useState(false);const [formFieldErrors , setFormFieldErrors] = useState([]);
    const [formData , setFormData] = useState({});
    const [formFieldData , setFormFieldData] = useState([]);
    const [operatorCheck , setoperatorCheck] = useState(false);
    const [refresh,setrefresh]=useState(0);
    const [newRows, setnewRows] = useState([]);
    const [addNew, setaddNew] = useState(false);
    const [disable,setdisable]=useState(false);
    const [name,setname]=useState(0);
    const [restricted,setrestricted]=useState(true);
    const [userId,setuserId]=useState(0);
    const [serviceBusy, setServiceBusy] = useState(false);
    const [useremail, setUserEmail] = useState()
    const [isBusy, setBusy] = useState(true);
    const dispatch = useDispatch()
    const searchHomeReducer = useSelector((state) => state.searchHomeReducer);
    const jsonData = searchHomeReducer && searchHomeReducer.searchHomeJson && searchHomeReducer.searchHomeJson;
    let paylod = { 'blobname': 'searchHome.json' }
    let navigate = useNavigate();
    
    function createData(firstName,lastName, calories, fat, carbs, protein, buttons) {
      return {
        "name":firstName+" "+lastName,
        "email":calories,
        "access":fat,
        "roles":carbs,
        "mobileNumber":phoneValidation(protein.toString())
      };
    }
    
    useEffect(() => {
    //   let companyDetails={'service': 'company','organizationName': state && state.companyValue && state.companyValue,'filter':state && state.searchValue}
    //   fetchCompanyDetails(companyDetails).then((response) => {
    //     let userData = [];
    //     let responseData = response && response.res
    //     responseData  && responseData.map((item,index)=>{
    //       let roleData = [];
    //       item.roles && item.roles.map((item)=>{
    //         roleData.push(item.roleType)
    //       })
    //       let accessLevel = [];
    //       item.accessLevel && item.accessLevel.map((item)=>{
    //         accessLevel.push(item.accessLevels)
    //       })
    //       console.log("roleData----->",roleData.toString())
    //       userData.push(createData(item.firstName,item.lastName, item.email, accessLevel.toString(),roleData.toString(), item.mobileNumber))
          
    //     })
    //     setnewRows(responseData)
    //     setRows(userData)
         setBusy(false);
    // })
  }, []);
  useEffect(()=>{
    setFieldList(jsonData && jsonData.data && jsonData.data.data.headCells)
  },[jsonData])
    
   return (<>{isBusy?(<Loader/>):(
    <> 
  {fieldList && 
    <div className='bf-table-container bf-table-search-results'>
      <BFTable 
      sortEnabled = {true}
      Data ={rows} 
      heading={fieldList.company}
      univeralSearch={true}
      noMatch={true}
      >
      </BFTable>
    </div>
    }
      </>
      )}  </>
    );
  }
export default Orders;