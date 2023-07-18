import React,{useState,useEffect,useRef} from 'react';
import './bulkUpload.scss';
import {useLocation,useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBulkUploadJSONData ,getTailNumbersList} from '../../actions/clientPortal/discountAction';
import EditFormModal from '../customModal/editModal';
import CustomModal from '../customModal/customModal';
import BFTable from '../table/table';
import {addDiscount} from '../../actions/clientPortal/discountService';

function BulkUpload() {
    const {state} = useLocation()
    const [fieldList, setFieldList] = useState(null);
    const [isLoading,setIsLoading] = useState(false);
    const [rows, setRows] = useState(null);
    const [newRows, setnewRows] = useState([]);
    const [editmodalShow, seteditModalShow] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [modalText, setModalText] = useState("");
    const [deactivateData, setDeactivateData] = useState([]);
    const [reset, setReset] = useState(null);
    const [formErrors, setformErrors] = useState({});
    const [bulkUploadData, setBulkUploadData] = useState({});
    const [isBtnValidate, setbtnValidate] = useState(false);
    const [modalTextForEdit, setModalTextForEdit] = useState("");
    const [disable , setdisable] = useState(true);
    const [operatorVal,setOperatorVal] = useState('');
    const [tailNum,setTailNum] = useState('');
    const [results, setResults] = useState({});
    const [selectedIndex,setSelectedIndex] = useState("");
    const paylod = { 'blobname': 'discountBulkUpload.json' }
    const [showDeactivate, setShowDeactivate] = useState(false);
    const [searchLength,setSearchLength]=useState(3);
    const [noOfRecords,setNoOfRecords] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const typeaheadRef = useRef(null);
    const discountReducer = useSelector(state => state.discountReducer);
    const loader = discountReducer && discountReducer.loading && discountReducer.loading;
    const jsonData = discountReducer && discountReducer.bulkUploadJson && discountReducer.bulkUploadJson;
    let userEmail = state&&state.user?state.user:'';
    let tailNumbersData = []
    let count = state.count?state.count:0;
 
    useEffect (()=>{
      fetchBulkUploadJSONData(paylod,dispatch)
      setResults(tailNumbersData)
    },[])

    useEffect (()=>{
      setNoOfRecords(count);
    },[count])
  
    useEffect(() => {
        let data = jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.bulkUploadData;
        let userRows = [];
        setInitialState(data && data[0].discountInformation)
        let response = state && state.xlData 
        let homeData = response&&response.forEach((element,i)=>{
            let operators = getOperatorsList(element);
            let tailObj = element.TailNumbers&&element.TailNumbers[0]?element.TailNumbers[0]:{}
            let discountAmount = element.Unit === "$"?element.Unit+element.Amount:element.Amount+element.Unit
            let location = element.FBOLocations&&element.FBOLocations[0]&&element.FBOLocations[0].Location?element.FBOLocations[0].Location:""
            let tailNumber = tailObj&&tailObj.TailNumber!=null?tailObj.TailNumber:""
            userRows.push(createData(tailNumber,operators,location, element.Criteria,discountAmount,userEmail, data && data[0].Buttons))
        })
        setFieldList(data)
        setnewRows(homeData)
        setRows(userRows)
        setIsLoading(loader&& loader)
    },[jsonData,loader,state,reset])
   
    const getOperatorsList =(item)=>{
      let operators =[]
      item.TailNumbers&&item.TailNumbers.map((element)=>{
        if(element.Operator!=null)
        operators.push(element.Operator);           
      })
      let operatorName = operators.length>0?operators[0]:""
      let operator =[];
      if(operatorName!=""){
        const index = operators.indexOf(operatorName);
        if (index > -1) { 
          operators.splice(index, 1); 
        }
      }
      operator["name"] = operatorName
      operator["listOfNames"] = operators
       return operator
    }

    function createData(tailNumber,operator,location, criteria, value,  addedBy, buttons) {
        return {
          "tailNumber":tailNumber,
          "operator":operator,
          "location":location,
          "criteria":criteria,
          "value":value,
          "addedBy":addedBy,
          "Buttons":buttons
        };
      }
      const onHandleChange = (e, field) => {
        let target = e.target
        let formdataset = {}
        let fields = {};
        let fieldName
        let fieldValueData;
        if (field.type == "multiselectcheckbox") {
          fieldName = field.name;
          let fieldValue = e.length ? e.map(i => i.value) : null;
          fields[field.name] = fieldValue;
          fieldValueData = fieldValue
        }else if(field.name == "amount"){
            let result  = validateAmount(target.value,bulkUploadData.unit)
            if(result){
              fieldName = target.name;
              fields[fieldName] = target.value;
              fieldValueData = target.value;
            }else if(target.value == ""){
              fieldName = target.name;
              fields[fieldName] = target.value;
              fieldValueData = target.value;
            }
         }else if(field.name == "unit"){
              fieldName = target.name;
              fieldValueData = target.value;
              fields[fieldName] = e.target.value;
              let result  = false
              if(bulkUploadData.amount !=""){
                result =  validateAmount(bulkUploadData.amount,target.value)
                if(result){
                  bulkUploadData.amount=bulkUploadData.amount
                  }else{
                    bulkUploadData.amount =""
                  }
                }
        }else if(field.name == 'operator'){
          setOperatorVal(target.value?target.value:'');
          fieldName = target.name;
          fields[fieldName] = e.target.value;
          fieldValueData = target.value;
          searchAPI(e,false)
        }else {
           fieldName = target.name;
           fieldValueData = target.value;
           fields[fieldName] = e.target.value;
    
        }
        if (isBtnValidate) {
          if(target){
            validateField(target.name, target.value, fields, true);
          }else if(target==undefined && field.type == "multiselectcheckbox"){
            let fieldValue = e.length ? e.map(i => i.value) : null;
            validateField(field.name, fieldValue, fields, true);
          }
        }
        formdataset = {
          ...bulkUploadData,
          ...fields
        }
        setBulkUploadData(formdataset)
        let isValid = validateForm();
        if (isValid) {
          setModalText('');
        }
      }
      const onHandleBlur = (e, field) => {
        let formdataset = { ...bulkUploadData }
        if(e.target.value<0.01){
          formdataset[field.name] = ''
        }else
        formdataset[field.name] = e.target.value;
        setBulkUploadData(formdataset)
    }
      const validateAmount = (value,unit) =>{
        let result = false
        let dolorRegex = /^(?=.*\d)\d{0,4}(?:\.\d{0,2})?$/
        let percentileRegex = /^(?=.*\d)\d{0,2}(?:\.\d{0,2})?$/
          if(unit== '%'){
                result = percentileRegex.test(value)
            }else{
                result = dolorRegex.test(value)
          }
          return result
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
        return formValid;
    }
    const getFieldIsValid = (value, fieldValidationError, fieldName) => {
      let validationObj = {
        fieldValidationError: fieldValidationError,
        errcount: 0
      };
      if (fieldValidationError.isRequired === true) {
        validationObj =
          checkValidationByValidationTypes(value, fieldValidationError, fieldName);
      }else {
        if (value) {
          validationObj =
            checkValidationByValidationTypes(value, fieldValidationError, fieldName);
        }
      }
      return validationObj;
  }
    const checkValidationByValidationTypes = (value, fieldValidationError, fieldName) => {
        const validationTypes = ['IsMandatory','amount'];
        let errcount = 0;
        let activeValidator = null;
        validationTypes.forEach(validationType => {
            activeValidator = fieldValidationError.validations && fieldValidationError.validations.filter
                (validate => validate.type === validationType);
            if (activeValidator && activeValidator.length) {
                if (validationType === 'IsMandatory') {
                    if (!value) {
                        errcount++;
                        fieldValidationError
                            .activeValidator = activeValidator[0];
                    }
                }else if(validationType === "amount"){
                  if(value>100 &&bulkUploadData.unit === '%'){
                    errcount++;
                    fieldValidationError.activeValidator = fieldValidationError.validations[1];
                  }
                }
            }
        });
        return {
            fieldValidationError: fieldValidationError,
            errcount: errcount
        };
    }
    const validateField = (fieldName, value, fields, isTouched) => {
      const fieldValidationErrors = {
        ...formErrors
      };
      let fieldValidationError = null;
      fieldValidationError = fieldValidationErrors[fieldName];
      if (isTouched !== undefined) {
        fieldValidationError.isTouched = isTouched;
      }
      let validationObj = {};
      validationObj = getFieldIsValid(value, fieldValidationError, fieldName);
      let errcount = validationObj.errcount;
      if (!errcount) {
        fieldValidationErrors[fieldName].isValid = true;
        fieldValidationErrors[fieldName].activeValidator = {};
      } else {
        fieldValidationErrors[fieldName].isValid = false;
        fieldValidationErrors[fieldName].activeValidator = validationObj.fieldValidationError.activeValidator;
      }
      return fieldValidationErrors
    }
      const setInitialState = (discount) => {
        const allFormData = {};
        let formErrors = {};
        const fieldTypeArr = ['input', 'checkbox', 'select', 'multiselectcheckbox','asynctypeahead'];
        discount&&discount.forEach((items) => {
          items&&items.fields&&items.fields.forEach((ele,index)=>{ 
            if (fieldTypeArr.includes(ele.component.toLowerCase())) {
                    allFormData[ele.name] = bulkUploadData && bulkUploadData[ele.name] && bulkUploadData[ele.name] !== 'null' ? bulkUploadData[ele.name] : "";
                    formErrors[ele.name] = getFormErrorRules(ele);
              }
           })
        })
        setformErrors(formErrors);
        setBulkUploadData(allFormData);
    }

    const getFormErrorRules = (item) => {
      return {
          isValid: item.isRequired ? false : true,
          isTouched: false,
          activeValidator: {},
          validations: item.validations,
          isRequired: item.isRequired
      };
   }
  
    const clickEdit = (data,index) =>{
         seteditModalShow(true)
         setSelectedIndex(index)
         let editedDataArray =[]
         let response = state && state.xlData;
         if(response[index]){
            editedDataArray.push(response[index])
         }
        let EditedData = {
            addedBy: userEmail,
            criteria:editedDataArray[0].Criteria,
            location:editedDataArray[0].FBOLocations[0]&&editedDataArray[0].FBOLocations[0].Location?editedDataArray[0].FBOLocations[0].Location:"",
            status:1,
            amount:editedDataArray[0].Amount,
            unit:editedDataArray[0].Unit,
            tailNumbers:editedDataArray[0].TailNumbers[0]&&editedDataArray[0].TailNumbers[0].TailNumber?editedDataArray[0].TailNumbers[0].TailNumber:"",
            operator:editedDataArray[0].TailNumbers[0]&&editedDataArray[0].TailNumbers[0].Operator?editedDataArray[0].TailNumbers[0].Operator:""
        }
         let tailNums =[];
         tailNums.push(editedDataArray[0].TailNumbers[0].TailNumber)
         setDeactivateData(data);
         let allFormData = {}
         Object.keys(bulkUploadData).forEach((item, index) => {
           allFormData[item] = EditedData && EditedData[item] && EditedData[item] !== 'null' ? EditedData[item] : "";
         })
         setBulkUploadData(allFormData);
         setModalText("")
   
    }
    const clickDeactivate = (data,index) =>{
        setModalText(fieldList[0].modal.deactivate.text)
        setShowDeactivate(true);
        setSelectedIndex(index)
        document.getElementById('root').style.filter = 'blur(5px)';
        let response = state && state.xlData 
        if(response[index]){
          setDeactivateData(response[index]);
        }
    }
    const onHandleClick =(e,item) =>{
        if(item.name == 'save'){
          let uploadData = formSubmitData();
          addDiscount(uploadData).then(res => {
            let resMsg = res&&res[0]&&res[0][0].Msg?res[0][0].Msg:'';
            let errorMsg = res&&res[0]&&res[0][0].error?res[0][0].error:'server error';
            if(resMsg.length>0) {
               navigate('/dashboard/client-portal')
               document.getElementById('root').style.filter = 'none';
            }
            else {
              setModalShow(true)
              document.getElementById('root').style.filter = 'blur(5px)';
              setModalText(errorMsg);
            }
          })
        }else if(item.name='remove'){
            navigate('/dashboard/client-portal')
        }
    }
    const closeEditModal = () => {
         setInitialState(fieldList[0].discountInformation)
         document.getElementById('root').style.filter = 'none';
        let allFormData = {}
        Object.keys(bulkUploadData).forEach((item) => {
          allFormData[item] = "";
        })
        setBulkUploadData(allFormData);
        seteditModalShow(false);
        setModalText("");
        setModalTextForEdit("");
        setShowDeactivate(false)
        setSearchLength(searchLength==0?3:0)
        setModalShow(false)
    }
    const successModal = () => {
        setShowDeactivate(false)
        setModalText("")
        document.getElementById('root').style.filter = 'none';
        if(modalText==fieldList[0].modal.deactivate.text){
          let dataObj = state.xlData&&state.xlData[selectedIndex]?state.xlData[selectedIndex]:{}
          if(Object.keys(dataObj).length>0){
            state.xlData.splice(selectedIndex, 1);
            setReset(Math.random())
            setNoOfRecords(count-1)
          }
      }
    }
    const closeModal = (e) => {
        setModalShow(false)
        setDeactivateData([])
        setShowDeactivate(false)
        setInitialState(fieldList[0].discountInformation)
        document.getElementById('root').style.filter = 'none';
        setModalText("");
    }
    const onClickSubmit = (e,item,index) => {
      setbtnValidate(true)
      const fieldValidationErrors = {
        ...formErrors
      };
      
      Object.keys(fieldValidationErrors).forEach((fieldName, index) => {
        validateField(
          fieldName,
          bulkUploadData[fieldName],
          { [fieldName]: bulkUploadData[fieldName] }
          );
        });
      let isValid = validateForm();
        if (isValid) {
          setModalText("");
          formSaveData(index)
          setdisable(true)
          setDeactivateData([])
          seteditModalShow(false)
          setReset(Math.random())
          setModalShow(false)
          setShowDeactivate(false)
          setModalTextForEdit("")
          let allFormData = []
          document.getElementById('root').style.filter = 'none';
          Object.keys(bulkUploadData).forEach((item, index) => {
            allFormData[item] =  "";
          })
          setBulkUploadData(allFormData)
         } else {
          setModalTextForEdit(fieldList[0].modal.validate.text)
         }
  }
 
  const searchAPI =(e,isSearch)=>{
    let payload ={}
    if(isSearch){
      payload={
        "Operator" : operatorVal?operatorVal:'' ,
        "TailNumber" :e?e:''
      }
    }else{
      payload={
        "Operator" :  e&&e.target&&e.target.value?e.target.value:operatorVal ,
        "TailNumber" : tailNum?tailNum:''
      }
      setSearchLength(0)
    }
     getTailNumbers(payload);
  }

  const getTailNumbers=(payload)=>{
    getTailNumbersList(payload,dispatch).then((res)=>{
      let tailNumbersList = [];
      let data = res && res.length>0 && res[0]&& res[0].length>0&&res[0][0]&&res[0][0]['@JSONResponse']?JSON.parse(res[0][0]['@JSONResponse']):[];
      if(data.length>0){
        data.map((i) =>{
          let tailNumbr = Array.isArray(payload.TailNumber)?payload.TailNumber[0]:payload.TailNumber
          if(tailNumbr !="" && tailNumbr !=undefined && i.TailNumbers != tailNumbr){
            tailNumbersList.push(tailNumbr)
          }
          tailNumbersList.push(i.TailNumbers);
        })
      }else{
        let tailNumbr = Array.isArray(payload.TailNumber)?payload.TailNumber[0]:payload.TailNumber
        if(tailNumbr.length>0)
        tailNumbersList.push(tailNumbr);
      }
      let arr = tailNumbersList&&tailNumbersList.filter((item,index) => tailNumbersList.indexOf(item) === index)
      setResults(arr);
      })
  }
  const handleFocus = () => {
    let formData = { ...bulkUploadData };
    formData['tailNumbers'] = ''
    setBulkUploadData(formData)
    setTailNum([]);
  }
  const searchHandler =(items)=>{
    let formData = { ...bulkUploadData };
    let errorData = { ...formErrors };
      try {
        if(items.length>0){
          setTailNum(items);
        }
        formData["tailNumbers"] = items;
        let fields = ['location', 'criteria', 'amount', 'unit', 'tailNumbers'];
        fields.forEach(item => {
            errorData[item].isTouched = true;
            errorData[item].isValid = true;
            validateField(item, formData[item], 
                { [item]: formData[item] })
        })
        setformErrors(errorData);
        setBulkUploadData(formData);
      } catch(err) {
        console.error('Caught error in search')
      }
  }
  const formSaveData = () => {
  
    let tailNums = Array.isArray(bulkUploadData.tailNumbers)?bulkUploadData.tailNumbers[0]:bulkUploadData.tailNumbers
    let dataOBJ =   {
            "Amount" : bulkUploadData.amount,
            "Criteria" :bulkUploadData.criteria,
            "Unit":bulkUploadData.unit,
            "Operator":bulkUploadData.operator,
            "FBOLocations":[{"Location":bulkUploadData.location[0]}],
            "IsActive":"true",
            "TailNumbers":[{"Operator":bulkUploadData.operator,"TailNumber":tailNums}]
           }
            state.xlData[selectedIndex] = dataOBJ
            setReset(Math.random())
          
 }

const formSubmitData = () => {
    let fieldData = state.xlData&&state.xlData
    return {
      "FBO":state.FBO,
      "Data":fieldData,
      "CreatedBy": userEmail,
      "ModifiedBy": userEmail
    }
  }
  const renderModal = (modal) => {
    let modalData = modalText;
    return (
        <CustomModal
            show={modalShow}
            onHide={handleClose}
            modelBodyContent={modalData}
            buttonText={fieldList[0].modal.submit.button?fieldList[0].modal.submit.button:''}
        />
    );
    };

  const handleClose = () => {
    setModalShow(false);
    document.getElementById('root').style.filter = 'none';
  }

  const renderDeactivateModal = (modal) => {
    let modalData = modalText;
    return (
        <CustomModal
            show={showDeactivate}
            close ={(e) => closeModal(e)}
            hide={(e) => closeModal(e)}
            onHide={(e) => successModal(e)}
            modelBodyContent={modalData}
            buttonText={modalText==fieldList[0].modal.deactivate.text? fieldList[0].modal.deactivate.button1:fieldList[0].modal.validate.button1}
            secondbutton={modalText==fieldList[0].modal.deactivate.text?fieldList[0].modal.deactivate.button2:""}
        />
    );
  };
  const filterBy = () => true;

  const removeFormData = (item,flag) => {
     let fields;
      if(flag){
          fields = {...bulkUploadData};
          let fieldName = item.name;
          fields[fieldName] = "";
          setBulkUploadData(fields);
      }
  }
  
  const searchOnKeyDown = (evt) => {
    if(evt.target.name !="amount")
     evt.target.value=evt.target.value.replace(/[^a-zA-Z0-9]+/,"")
   }
   
    return(
      <div className="bf-bulk-upload-container">
         {fieldList &&  fieldList.length ?
            <div className={'form-section'}>
               <h1 className='d-flex bf-heading'>{fieldList[0].pageName}</h1>
              <div className='tab-details-container'>
                <div className='bf-table-container bf-table-bulk-upload'>
                  <BFTable 
                    Data ={rows && rows} 
                    heading={fieldList[0].headCells} 
                    primaryClick = {clickEdit}
                    secondaryClic = {clickDeactivate}
                    loading = {isLoading}
                    isUserTab={false}
                    buttonsRequired={true}
                    buttons={fieldList[0].formButtons}
                    onHandleClick={onHandleClick}
                    isBulkUpload={true}
                    rowsPerPage={noOfRecords}
                    tableTitle={noOfRecords>0 && noOfRecords<=1?noOfRecords+" item have been found":noOfRecords+" items have been found"}
                  > 
                  </BFTable>
                </div>
              </div>
                {editmodalShow?<EditFormModal
                  onHide={() => closeEditModal()}
                  formErrors={formErrors}
                  formdata={bulkUploadData}
                  show={editmodalShow}
                  json={fieldList[0].discountInformation[0]}
                  onHandleChange={onHandleChange}
                  onClickSubmit={onClickSubmit}
                  onHandleBlur={onHandleBlur}
                  searchAPI={(e)=>searchAPI(e,true)}
                  showError={modalTextForEdit}
                  searchHandler={(items)=>searchHandler(items)}
                  results={results}
                  filterBy={filterBy}
                  typeaheadRef={typeaheadRef}
                  companyName={state.FBO?state.FBO:""}
                  handleFocus={handleFocus}
                  selected={searchLength == 0?results:tailNum}
                  removeFormData = {removeFormData}
                  inputProps={{ 'maxLength': 6}}
                  minLength={searchLength}
                  onKeyDown={(evt) => searchOnKeyDown(evt)}
                />:""}
                {modalShow ? renderModal() : null}
                {showDeactivate?renderDeactivateModal():null}
            </div>
         :""}
      </div>
    )
}
export default BulkUpload