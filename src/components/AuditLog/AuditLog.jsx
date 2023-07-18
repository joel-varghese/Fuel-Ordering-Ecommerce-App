import React, { useState, useEffect, useRef } from 'react';
import './auditLog.scss';
import BFTable from '../table/table';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJSONData } from '../../actions/clientPortal/discountAction';
import { getAuditLogData, getCategoryAndUserData } from '../../actions/auditLog/auditLogActions';
import { lookupService } from '../../services/commonServices';
import { Storage } from '../../controls/Storage';
import { useNavigate } from 'react-router-dom';
import Loader from '../loader/loader';
import Select from '../select/select';
import Container from 'react-bootstrap/Container';
import ReactDatePicker from '../datePicker/reactDatePicker'
import { getFormattedMMDDYY } from '../../controls/validations';
function AuditLog() {

  const [portalHomeData, setPortalHomeData] = useState(null);
  const [fieldList, setFieldList] = useState(null);
  const [formFieldData, setFormFieldData] = useState([]);
  const [rows, setRows] = useState(null);
  const [newRows, setnewRows] = useState([]);
  const [companyList, setCompanyList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [userList, setUserList] = useState([])
  const [loading, setLoading] = useState(false);
  const [formErrors, setformErrors] = useState({});
  const [companySearch, setCompanySearch] = useState(false);
  const [selectedTailNums, setSelectedTailNums] = useState([]);
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [yearRange, setYearRange] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const paylod = { 'blobname': 'auditLog.json' }
  const access = JSON.parse(Storage.getItem('accessLevel'))[0]
  const discountReducer = useSelector(state => state.discountReducer);
  const loginReducer = useSelector(state => state.loginReducer);
  //const jsonData = discountReducer && discountReducer.discountJson && discountReducer.discountJson;
  const discountData = discountReducer && discountReducer.discountData && discountReducer.discountData;
  const loader = false
  const loginDetails = loginReducer && loginReducer.loginDetails && loginReducer.loginDetails.data;
  const selectedCompany = discountReducer && discountReducer.selectedCompany && discountReducer.selectedCompany.company;
  let tailNumbersData = []
  let loginDetls = loginDetails && JSON.stringify(loginDetails) === '{}' ? {} : loginDetails && JSON.parse(loginDetails);

  function createData(tailNumber, location, criteria, value, status, addedBy, buttons) {
    return {
      "validFromA": tailNumber,
      "validTo": tailNumber,
      "company": location,
      "category": criteria,
      "userName": value,
      "actionPerformed": status,
    };
  }
  /* useEffect (()=>{
    setBulkUpload(true)
      return(
        ()=>{
          document.getElementById('root').style.filter = 'none'
        })
  },[]) */

  useEffect(() => {
    fetchJSONData(paylod, dispatch).then((res) => {
      setFieldList(res.data.auditLogData)
    })
    //setResults(tailNumbersData)
    getCompanyDropdown("FBO");
    let payload = {
      "Organization": Storage.getItem('userType') === "Barrel Fuel" ? null : Storage.getItem('organizationName'),
      "role": Storage.getItem('userType') === "Barrel Fuel" ? "BFUser" : Storage.getItem('userType')
    };
    getCategoryAndUserData(payload, dispatch).then(((res) => {
      //let categoryData = res[0][0] && res[0][0].FBOID!== null && res[0][0].FBOID['JSON_UNQUOTE(@JsonResult)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JsonResult)']):[]
      let userData = res[0][0] && res[0][0]['JSON_UNQUOTE(@JSONResponse)'] ? JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']) : []
      let options = [];
      userData && userData.Categories && userData.Categories.map((item) => {
        let comp = {};
        comp.value = item.CategoryName;
        comp.title = item.CategoryName;
        options.push(comp);
      })
      setCategoryList(options)

      options = [];
      userData && userData.Users && userData.Users.map((item) => {
        let comp = {};
        comp.value = item.UserEmail;
        comp.title = item.UserEmail;
        options.push(comp);
      })
      setUserList(options)
    }))

  }, [])


  useEffect(() => {

    setIsLoading(true)
    //let data = jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.auditLogData;
    let userRows = [];

    setInitialState(fieldList && fieldList[0] && fieldList[0].fields)
    let payload = { "Organization": Storage.getItem('userType') === "Barrel Fuel" ? null : Storage.getItem('organizationName') };
    let dataObj = null;

    getAuditLogData(payload, dispatch).then(((res) => {
      let dataForInternal = []
      dataObj = res[0][0] && res[0][0]['JSON_UNQUOTE(@JsonResult)'] ? JSON.parse(res[0][0]['JSON_UNQUOTE(@JsonResult)']) : []
      dataObj && dataObj.map((e, i) => {
        //let isActive = e.Status == 1?'Active':'Inactive';
        userRows.push(createData(getFormattedMMDDYY(e.AddDate), e.Organization, e.ModuleName, e.ActionByEmailid, e.Activity))
      })
      if (Storage.getItem('userType') === "Barrel Fuel") {
        dataObj && dataObj.map((e, index) => {
          if (e.IsInternalUser === 1) {
            dataForInternal.push(createData(getFormattedMMDDYY(e.AddDate), e.Organization, e.ModuleName, e.ActionByEmailid, e.Activity))
          }
        })
      } else {
        dataForInternal = userRows
      }
      //setFieldList(jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.auditLogData)
      setnewRows(userRows)
      setRows(dataForInternal)
      setLoading(loader && loader)
      setPortalHomeData(dataObj)
      setIsLoading(false)
      setYearRange([userRows[0].validFromA, userRows[userRows.length - 1].validFromA])
    }))



  }, [fieldList])

  const getCompanyDropdown = (userType) => {
    let header = {
      "userType": userType
    }
    let requestData = {
      "serviceName": "companyName",
      "headers": header
    }
    if (userType != 'internal') {
      lookupService(requestData).then(((res) => {
        if (res) {
          let data = JSON.parse(res.body)
          let options = [];
          data && data.map((val, index) => {
            let comp = {};
            comp.value = val;
            comp.title = val;
            options.push(comp);
          })
          setCompanyList(options)
        }
      }))
    }
  }

  const onSearchBlur = (e) => {
    if (e.target.parentElement.className != 'bf-sugesstion-dropdown' && e.target.parentElement.className != 'search') {
      setCompanySearch(false);
    }
  }

  useEffect(() => {
    window.addEventListener('click', onSearchBlur);
  }, [companySearch]);



  //const searchData= portalHomeData &&  portalHomeData.search ? portalHomeData.search : null;
  const setInitialState = (discount, isClear) => {
    let details = {};
    let formErrors = {};
    let editJson = {};
    editJson.fields = [];
    let formdetails = {};
    const fieldTypeArr = ['input', 'checkbox', 'select', 'multiselectcheckbox', "creatableSelect", 'asynctypeahead'];
    discount && discount.map((item, index) => {
      details[item.name] = formFieldData && formFieldData.length > index ? formFieldData[item.name] ? formFieldData[item.name] : "" : "";
      formErrors[item.name] = getFormErrorRules(item);

    })
    formdetails = JSON.parse(JSON.stringify(details));
    setformErrors(formErrors);
    setFormFieldData(formdetails);
    //seteditDiscountJson(editJson);
  }



  const getFormErrorRules = (item) => {
    return {
      isValid: item.isRequired ? false : true,
      isTouched: false,
      activeValidator: {},
      validations: item.validations,
      isRequired: item.isRequired,
      maxValue: item.maxValue
    };
  }

  const getSelectOptions = () => {
    let options = [];
    if (selectedTailNums.length > 0) {
      selectedTailNums.map((i) => {
        options.push({ label: i, value: i });
      })
    }
    return options;
  }
  const handleClose = () => {

  }


  const selectedOptions = getSelectOptions();
  const handleChange = (e, item) => {
    let fields = [];
    fields = JSON.parse(JSON.stringify(formFieldData));
    let formData = {}

    if (item.name == "validFromA") {
      let date = getFormattedMMDDYY(new Date(e))
      if (date < getFormattedMMDDYY(new Date(yearRange[1]))) {
        setFromDate(date)
        fields[item.name] = getFormattedMMDDYY(new Date(yearRange[1]));
      } else {
        setFromDate(date)
        fields[item.name] = date;
      }
      //getOrderDates({'orderDates':{orderFromDate:date,orderToDate:toDate}},dispatch)
    } else if (item.name == "validTo") {
      let date = getFormattedMMDDYY(new Date(e))
      if (getFormattedMMDDYY(new Date(yearRange[0])) < date) {
        setToDate(date)
        fields[item.name] = getFormattedMMDDYY(new Date(yearRange[0]));
      } else {
        setToDate(date)
        fields[item.name] = date;
      }
      //getOrderDates({'orderDates':{orderFromDate:fromDate,orderToDate:date}},dispatch)
    } else {


      let fieldName = e.target.name;
      let fieldValue = e.target.value;
      fieldValue = fieldValue.trim()
      fields[fieldName] = fieldValue;

    }


    formData = {
      ...formFieldData,
      ...fields
    };
    setFormFieldData(formData)
    filterTheData(formData)

  }
  const filterTheData = (fields) => {
    let filter = {};
    let rowsData = newRows
    fields && Object.keys(fields).map((item) => {
      if (fields[item] !== "") {
        if (item === "validFromA") {
          filter[item] = getFormattedMMDDYY(fields[item])
        } else if (item === "validTo") {
          filter[item] = getFormattedMMDDYY(fields[item])
        } else {
          filter[item] = fields[item]
        }
      }
    })

    let filterData = [];
    rowsData = rowsData.filter(function (item) {
      let string = true + " && "
      if (filter["category"]) {
        string = string + 'item["category"] == filter["category"] && '
      }
      if (filter["userName"]) {
        string = string + 'item["userName"]  == filter["userName"] && '
      }
      if (filter["company"]) {
        string = string + 'item["company"]  ==  filter["company"] && '
      }
      if (filter["validFromA"]) {
        string = string + 'item["validFromA"]  >= filter["validFromA"] && '
      }
      if (filter["validTo"]) {
        string = string + 'item["validTo"] <= filter["validTo"] && '
      }
      string = string.slice(0, -3);
      console.log("string---------", string)
      if (eval(string)) {
        return true
      }

      return false;
    })
    setRows(rowsData)
  }
  const onChangeDate = (e, item) => {
    let fields = [];
    fields = JSON.parse(JSON.stringify(formFieldData));
    let formData = {}
    if(item.name === "validFromA"){
    let date = getFormattedMMDDYY(new Date(e.target.value))
    setFromDate(e.target.value)
    fields[item.name] = e.target.value;
    } else {
      let date = getFormattedMMDDYY(new Date(e.target.value))
    setToDate(e.target.value)
    fields[item.name] = e.target.value;
    }
    formData = {
      ...formFieldData,
      ...fields
    };

    setFormFieldData(formData)
    filterTheData(formData)
    //getFormattedMMDDYY(e)
  }

  const getOperatorFields2 = (item, index, flag) => {

    switch (item.component.toUpperCase()) {
      //categoryList userList
      case "SELECT":

        return (item.name === "company" && Storage.getItem('userType') === "Barrel Fuel" ? <Select
          colWidth={"1  bf-audit-select"}
          Type={item.type}
          Label={item.label}
          Placeholder={item.placeholder}
          disabled={false}
          dynamicSelect={item.dynamicSelect}
          lookupReference={item.dynamicSelect ? item.lookupReference : null}
          isRequred={item.isRequired}
          Options={item.name === "company" ? companyList : item.name === "category" ? categoryList : userList}
          Name={item.name}
          handleChange={(e) => handleChange(e, item, index, flag)}
          // handleBlur={(e) => handleBlur(e, item, index, flag)}
          dependentField={item.dependentField}
          dependentFieldVal={item.dependentFieldVal}
          fieldError={
            formErrors &&
            formErrors[item.name] && !formErrors[item.name].isValid/* 
                  && (
                      formErrors[item.name].isTouched
                  ) */
          }
          errorMessage={
            formErrors &&
            formErrors[item.name] && formErrors[item.name]
              .activeValidator
              .errorMessage
          }
          formDataSet={formFieldData && formFieldData[item.name] ? formFieldData[item.name] : item.defaultValue ? item.defaultValue : ''}
        /> : item.name === "category" || item.name === "userName" ? <Select
          colWidth={"1   bf-audit-select"}
          Type={item.type}
          Label={item.label}
          Placeholder={item.placeholder}
          disabled={false}
          dynamicSelect={item.dynamicSelect}
          lookupReference={item.dynamicSelect ? item.lookupReference : null}
          isRequred={item.isRequired}
          Options={item.name === "company" ? companyList : item.name === "category" ? categoryList : userList}
          Name={item.name}
          handleChange={(e) => handleChange(e, item, index, flag)}
          //handleBlur={(e) => handleBlur(e, item, index, flag)}
          dependentField={item.dependentField}
          dependentFieldVal={item.dependentFieldVal}
          fieldError={
            formErrors &&
            formErrors[item.name] && !formErrors[item.name].isValid/* 
              && (
                  formErrors[item.name].isTouched
              ) */
          }
          errorMessage={
            formErrors &&
            formErrors[item.name] && formErrors[item.name]
              .activeValidator
              .errorMessage
          }
          formDataSet={formFieldData && formFieldData[item.name] ? formFieldData[item.name] : item.defaultValue ? item.defaultValue : ''}
        /> : null)

      case "DATE":
        return (<>
          <ReactDatePicker
            colWidth={"1 bf-audit-date-select"}
            //  colWidth={item.styles ? item.styles.colWidth : ""}
            styles={item.styles}
            Name={item.name}
            Label={item.label}
            placeholder={item.placeholder}
            handleChange={(e) => handleChange(e, item)}
            value={formFieldData && formFieldData[item.name] ? formFieldData[item.name] : item.defaultValue ? item.defaultValue : ''}
            MinDate={new Date(yearRange[1])}
            MaxDate={new Date(yearRange[0])}
            placeholderText={item.name == 'validTo' ? "To" : "From"}
            yearRange={yearRange}
            onChangeDate={(e) => onChangeDate(e, item)}
          //MaxDate={toDate !=='' && fromDate=='' ? item.name == 'validFromA'? "" : toDate:toDate} 
          /></>

        )

    };
  }
  return (
    <div className='bf-client-portal-home-container bf-auditlogs-containter'>
      <div className='bf-audit-log-heading'>Audit Log</div>
      {fieldList !== null && isLoading ? <div className='table-loader'><Loader height="auto" /></div> : <><div className='d-flex bf-audit-log-input-fields'>

        {fieldList && fieldList.length > 0 && fieldList[0].fields.map((item, jsonIndex) => {
          return (
            <>{getOperatorFields2(item)}</>
          )
        })
        }
      </div>

        <div className='bf-client-portal-home'>
          <div className='tab-details-container'>

            {fieldList && fieldList.length > 0 &&
              <div className='bf-table-container bf-discount-table-container bf-audit-log-table'>
                <BFTable
                  sortEnabled={true}
                  searchEnabled={false}
                  Data={rows && rows}
                  heading={fieldList[0].headCells}
                  searchBy={["validFromA", "company", "category", "userName", "actionPerformed"]}
                  loading={loading}
                  isUserTab={false}
                >
                </BFTable>
              </div>}

          </div>
        </div></>
      }
    </div>
  )
}

export default AuditLog