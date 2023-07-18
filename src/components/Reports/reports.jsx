import React, { useState, useEffect,useRef } from 'react';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { useDispatch,useSelector } from 'react-redux';
import Loader from '../loader/loader';
import FilterReport from './filterReport';
import ReportTable from './reportTable';
import './report.scss'
import { fetchBFTrans, fetchBFUser, fetchFboTrans, fetchFboUser, fetchOPTrans, fetchOPUser } from '../../actions/reportAction/reportAction';
import { getFormattedMMDDYY, getFormattedYYMMDD } from '../../controls/validations';


export default function Reports(props) {
    const [reportJson , setReportJson] = useState(null)
    const params = {"blobname":"reports.json"}
    const [isBusy, setBusy] = useState(true)
    const [reportType,setReportType] = useState("user")
    const [formDataSet, setformDataSet] = useState({});
    const [userHead, setUserHead] = useState(null);
    const [transHead, setTransHead] = useState(null);
    const [originalUserRows, setoriginalUserRows] = useState([]);
    const [originalTransRows, setoriginalTransRows] = useState([]);
    const [mainUser,setMainUser] = useState([])
    const [mainTran,setMainTran] = useState([])
    const [FROMDate, setFromDate] = useState('')
    const [TODate, setToDate] = useState(new Date())
    const [selectAll,setSelectAll] = useState(true)
    const [totaltax,setTotalTax] = useState(0)
    const [totalfee,setTotalFee] = useState(0)
    const [userRow,setUserRow] = useState({})
    const [transRow,setTransRow] = useState({})
    const dispatch = useDispatch();
    const loginReducer = useSelector(state => state.loginReducer);
    const loginDetails = loginReducer && loginReducer.loginDetails &&loginReducer.loginDetails.data;
    let loginDetls =  JSON.stringify(loginDetails) === '{}'?{}:JSON.parse(loginDetails);
    let userType = loginDetls.userType?loginDetls.userType:'';
    let userEmail = loginDetls.loginUserName?loginDetls.loginUserName:'';
    const orgName = loginDetls.organizationName?loginDetls.organizationName:'';

    useEffect(()=>{
            bfaJsonService(params).then(response=>{
                setReportJson(response.data.reports)
                getheadcells(response.data.reports)
            
            if(userType == "Barrel Fuel"){
              const payload1 = {"Loggedinuser":userEmail}
              fetchBFUser(dispatch,payload1).then(res=>{
                let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JsonResult)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JsonResult)']):[];
                setInitialState(response.data.reports,"user",data)
                setoriginalUserRows(data)
                setMainUser(data)
                //getRowData("user",data)
              })
              fetchBFTrans(dispatch,payload1).then(res=>{
                let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
                setInitialState(response.data.reports,"trans",data)
                setoriginalTransRows(data)
                setMainTran(data)
                findColumns(data)
                
                //getRowData("trans",data)
              })
            }else if(userType == "FBO"){
              const payload1 = {"FBO":orgName,"Loggedinuser":userEmail}
              fetchFboUser(dispatch,payload1).then(res=>{
                let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JsonResult)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JsonResult)']):[];
                setInitialState(response.data.reports,"user",data)
                setoriginalUserRows(data)
                setMainUser(data)
                //getRowData("user",data)
              })
              fetchFboTrans(dispatch,payload1).then(res=>{
                let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
                setInitialState(response.data.reports,"trans",data)
                setoriginalTransRows(data)
                setMainTran(data)
                findColumns(data)
                //getRowData("trans",data)
              })
            }else{
              const payload1 = {"Operator":orgName,"Loggedinuser":userEmail}
              fetchOPUser(dispatch,payload1).then(res=>{
                let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JsonResult)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JsonResult)']):[];
                setInitialState(response.data.reports,"user",data)
                setoriginalUserRows(data)
                setMainUser(data)
                //getRowData("user",data)
              })
              fetchOPTrans(dispatch,payload1).then(res=>{
                let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
                setInitialState(response.data.reports,"trans",data)
                setoriginalTransRows(data)
                setMainTran(data)
                findColumns(data)
                //getRowData("trans",data)
              })
            } 
            let formData = formDataSet
              formData = {"todate":new Date()}
              setformDataSet(formData)
            setBusy(false) 
          })     
    },[]);
    const generateReport=()=>{
      if(reportType == "user"){
        let filter=filterReportTable(reportType,mainUser)
        setoriginalUserRows(filter)
      }else{
        let filter=filterTransactTable(reportType,mainTran)
        setoriginalTransRows(filter)
        findColumns(filter)
      }
    }
    const findColumns=(data)=>{
      let taxnum = 0;
      let feenum = 0;
      data && data.forEach((item)=>{
        item.OrderLegs && item.OrderLegs.forEach(order=>{
        if(order.Taxes && order.Taxes.length > taxnum){
          taxnum = order.Taxes.length
        }
        if(order.Fees && order.Fees.length > feenum){
          feenum = order.Fees.length
        }
      })
      })
      setTotalTax(taxnum)
      setTotalFee(feenum)
    }
    const setInitialState = (jsonData,type,data)=>{
      let companies = {}
      let tails = {}
      let fbos = {}
      let operators = {}
      let locations = {}
      let companyOption = []
      let tailOption = []
      let fboOption = []
      let opOption = []
      let fuelLocateOption = []
      if(type == "user" && userType == "Barrel Fuel"){
        data && data.forEach((item,index)=>{
          companies[item.Organization] = true
        })
        Object.keys(companies).forEach(val=>{
          let obj = {}
          obj.title = val
          obj.value = val
          companyOption.push(obj)
        })     
      }
      if(type == "trans"){
        data && data.forEach((item,index)=>{
          operators[item.OperatorName] = true
          item.OrderLegs && item.OrderLegs.forEach(order=>{
          if(order.TailNumber){
            if(tails[order.TailNumber.toUpperCase() == true]){

            }else{
            tails[order.TailNumber.toUpperCase()] = true
            }
          }
          if(order.FBO){fbos[order.FBO] = true}
          if(order.ICAO){locations[order.ICAO] = true}
        })
        })

        let op = {}
        op.value = "All the Above"
        op.label = "All the Above"
        tailOption.push(op)
        Object.keys(tails).forEach(val=>{
          let obj = {}
          obj.value = val
          obj.label = val
          tailOption.push(obj)
        })
        Object.keys(fbos).forEach(val=>{
          let obj = {}
          obj.title = val
          obj.value = val
          fboOption.push(obj)
        }) 
        Object.keys(operators).forEach(val=>{
          let obj = {}
          obj.title = val
          obj.value = val
          opOption.push(obj)
        }) 
        Object.keys(locations).forEach(val=>{
          let obj = {}
          obj.title = val
          obj.value = val
          fuelLocateOption.push(obj)
        }) 
      }
      if(type == "user"){
        jsonData.ReportCriteriaFields.map((val,index)=>{
          if(val.name == "company"){
            jsonData.ReportCriteriaFields[index].options = companyOption
          }
        })
      }else{
        jsonData.ReportCriteriaFields.map((val,index)=>{
          if(val.name == "tailNumber"){
            jsonData.ReportCriteriaFields[index].options = tailOption
          }
          if(val.name == "operator"){
            jsonData.ReportCriteriaFields[index].options = opOption
          }
          if(val.name == "location"){
            jsonData.ReportCriteriaFields[index].options = fuelLocateOption
          }
          if(val.name == "fboName"){
            jsonData.ReportCriteriaFields[index].options = fboOption
          }
        })
      }
    }
    const filterTransactTable = (type,originalRows)=>{
      let fromDate = FROMDate
      let toDate =  TODate
      let finalFilter = []
      let filterdData=[]
      let filter2=[]
      // let filter3=[]
      // let filter4=[]
      // let filter5=[]
      if( fromDate!="" && toDate !=""){
        let from = getFormattedYYMMDD(new Date(fromDate))!='NaN-NaN-NaN'?getFormattedYYMMDD(new Date(fromDate))+' 00:00:00.000000':'' 
        let To = getFormattedYYMMDD(new Date(toDate)) !='NaN-NaN-NaN' ?getFormattedYYMMDD(new Date(toDate))+' 00:00:00.000000':''
        originalRows && originalRows.forEach((val)=>{
          if(val.OrderLegs){
            let present = false
            val.OrderLegs.forEach(order=>{
            let from = getFormattedYYMMDD(new Date(fromDate))!='NaN-NaN-NaN'?getFormattedYYMMDD(new Date(fromDate)):'' 
            let To = getFormattedYYMMDD(new Date(toDate)) !='NaN-NaN-NaN' ?getFormattedYYMMDD(new Date(toDate)):''
            let tableDate = getFormattedYYMMDD(new Date(order.FuellingDate))!='NaN-NaN-NaN'?getFormattedYYMMDD(new Date(order.FuellingDate)):'' 
            
            if(from ==tableDate && To == ''){
              present = true
            }else if(To == tableDate && from == ''){
              present = true
            }else if(tableDate >= from && tableDate <= To){
              present = true
            }
            })
            if(present){filterdData.push(val)}
          }
        })
        if(!filterdData.length){
          return filterdData
        }
      }else{
        filterdData = originalRows
      }

      if(formDataSet["fboName"] != null){
        filterdData && filterdData.forEach((val)=>{
          if(val.OrderLegs){
            let present = false
            val.OrderLegs.forEach(order=>{
          if(order.FBO == formDataSet["fboName"]){
            present = true
          }
          })
          if(present){filter2.push(val)}
          }
        })
        if(!filter2.length){
          return filter2
        }else{
          filterdData = filter2
          filter2 = []
        }
      }else if(!filterdData.length){
        filterdData = originalRows
      }

      if(formDataSet["operator"] != null){
        filterdData && filterdData.forEach((val)=>{
          if(val.OperatorName == formDataSet["operator"]){
            filter2.push(val)
          }
        })
        if(!filter2.length){
          return filter2
        }else{
          filterdData = filter2
          filter2 = []
        }
      }else if(!filterdData.length){
        filterdData = originalRows
      }

      if(formDataSet["fuelType"] != null){
        filterdData && filterdData.forEach((val)=>{
          if(val.OrderLegs){
            let present = false
            val.OrderLegs.forEach(order=>{
            if(order.FuelType == formDataSet["fuelType"]){
              present = true
            }
          })
          if(present){filter2.push(val)}
          }
        })
        if(!filter2.length){
          return filter2
        }else{
          filterdData = filter2
          filter2 = []
        }
      }else if(!filterdData.length){
        filterdData = originalRows
      }

      if(formDataSet["tailNumber"] != null){
        filterdData && filterdData.forEach((val)=>{
          if(val.OrderLegs){
            let present = false
            val.OrderLegs.forEach(order=>{
            if(formDataSet["tailNumber"].includes(order.TailNumber.toUpperCase())){
              present = true
            }
          })
          if(present){filter2.push(val)}
          }
        })
        if(!filter2.length){
          return filter2
        }else{
          filterdData = filter2
          filter2 = []
        }
      }else if(!filterdData.length){
        filterdData = originalRows
      }

      if(formDataSet["location"] != null){
        filterdData && filterdData.forEach((val)=>{
          if(val.OrderLegs){
            let present = false
            val.OrderLegs.forEach(order=>{
            if(val.OrderLegs[0].ICAO == formDataSet["location"]){
              present = true
            }
          })
          if(present){filter2.push(val)}
          }
        })
        if(!filter2.length){
          return filter2
        }else{
          filterdData = filter2
          filter2 = []
        }
      }else if(!filterdData.length){
        filterdData = originalRows
      }

      return filterdData
    }
    const filterReportTable = (type,originalRows)=>{
      let fromDate = FROMDate
      let toDate =  TODate
      let finalFilter = []
      let filterdData=[]
      let filter2 = []
      if( fromDate!="" && toDate !=""){
        let from = getFormattedYYMMDD(new Date(fromDate))!='NaN-NaN-NaN'?getFormattedYYMMDD(new Date(fromDate))+' 00:00:00.000000':'' 
        let To = getFormattedYYMMDD(new Date(toDate)) !='NaN-NaN-NaN' ?getFormattedYYMMDD(new Date(toDate))+' 00:00:00.000000':''
        originalRows && originalRows.forEach((val)=>{
            let from = getFormattedYYMMDD(new Date(fromDate))!='NaN-NaN-NaN'?getFormattedYYMMDD(new Date(fromDate)):'' 
            let To = getFormattedYYMMDD(new Date(toDate)) !='NaN-NaN-NaN' ?getFormattedYYMMDD(new Date(toDate)):''
            let tableDate = getFormattedYYMMDD(new Date(val.createddate))!='NaN-NaN-NaN'?getFormattedYYMMDD(new Date(val.createddate)):'' 
            
            if(from ==tableDate && To == ''){
              filterdData.push(val)
            }else if(To == tableDate && from == ''){
              filterdData.push(val)
            }else if(tableDate >= from && tableDate <= To){
              filterdData.push(val)
            }
        })
        if(!filterdData.length){
          return filterdData
        }
      }else{
        filterdData = originalRows
      }

      if(formDataSet["company"] != null){
        filterdData && filterdData.forEach((val)=>{
          if(val.Organization == formDataSet["company"]){
            filter2.push(val)
          }
        })
        if(!filter2.length){
          return filter2
        }else{
          filterdData = filter2
          filter2 = []
        }
      }else if(!filterdData.length){
        filterdData = originalRows
      }

      if(formDataSet["userLevel"] != null){
        filterdData && filterdData.forEach((val)=>{
          if(val.AccessLevel == formDataSet["userLevel"]){
            filter2.push(val)
          }
        })
        if(!filter2.length){
          return filter2
        }else{
          filterdData = filter2
          filter2 = []
        }
      }else if(!filterdData.length){
        filterdData = originalRows
      }

      if(formDataSet["userstatus"] != null){
        filterdData && filterdData.forEach((val)=>{
          if(val.UserStatus.toLowerCase() == formDataSet["userstatus"].toLowerCase()){
            filter2.push(val)
          }
        })
        if(!filter2.length){
          return filter2
        }else{
          filterdData = filter2
          filter2 = []
        }
      }else if(!filterdData.length){
        filterdData = originalRows
      }

      return filterdData
    }

    const getheadcells = (data) =>{
      let headuser = []
      let headtran = []
      let ind = 0
        data && data.content.usersHeaders.Users.map((item,index)=>{
            headuser[index] = item
      })

      data && data.content.TransactionHeaders.Transaction.map((item)=>{
        if(item.id == "operator" && userType == "Operator"){

        }else if(item.id == "fbo" && userType == "FBO"){

        }else{
            headtran[ind++] = item
        }
      })
      
      setUserHead(headuser)
      setTransHead(headtran)

  }
  const onClickSubmit = (e,item) =>{
    generateReport()
  }


    const handleChange = (e,field)=>{
        let fields={...formDataSet}
        let fieldValue=e?.target?.value
        let fieldName=field.name
        fields[fieldName]=fieldValue
        if(field.name == "reporttype"){
            if(fieldValue == "Number of Users"){
                setReportType("user")
                fields["fromdate"] = ""
                fields["todate"] = ""
            }else if(fieldValue == "Transaction Summary"){
                setReportType("trans")
                fields["fromdate"] = ""
                fields["todate"] = ""
            }
        }
        if(field.name=="fromdate"){
          let from = new Date(getFormattedMMDDYY(e&&e.$d&&e.$d))
          setFromDate(from)
            let date = e?.$d
            fields[fieldName] = date
        }else if(field.name=="todate"){
          let to = new Date(getFormattedMMDDYY(e&&e.$d&&e.$d))
          setToDate(to)
            let date = e?.$d
            fields[fieldName] = date
        }
        if (field.type == "multiSelectCheckbox") {
          fieldValue = e.length ? e.map(i => i.value) : '';
          fields[fieldName] = fieldValue;
          setSelectAll(false)
      }
        setformDataSet(fields)    
      }
    
      const handleBlur = ()=>{
        
      }

    return (<>
        {isBusy || mainUser.length == 0 || userHead.length==0 ? (
          (<Loader/>)
        ) : (
        <div className='bf-account-home-container w100i bf-report-container'>
          {reportJson && <div className='bf-account-home'>
            <div className='bf-home-company-name bf-search-result-name'>Report</div>
            <div className='d-flex d-flex-row w100 bf-report-filter-section '>
            <FilterReport
                handleChange={handleChange}
                handleBlur={handleBlur}
                onClickSubmit={onClickSubmit}
                jsonData={reportJson}
                formDataSet={formDataSet}
                report={reportType}
                selectAll={selectAll}
            />
            <ReportTable
                jsonData={reportJson}
                report={reportType}
                userCells={reportType=="user" ? userHead && userHead : []}
                tranCells={reportType=="trans" ? transHead && transHead : []}
                data={reportType=="user" ? originalUserRows && originalUserRows : originalTransRows && originalTransRows}
                taxnum={totaltax}
                feenum={totalfee}
            />
            </div>
          </div> }
        </div>
      )}
    </>)
}