import React, { useState, useEffect,useRef } from 'react';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { useDispatch,useSelector } from 'react-redux';
import ButtonComponent from '../button/button';
import BFTable from '../table/table';
import Loader from '../loader/loader';
import Subheading from '../subHeading/subHeading';


export default function ReportTable(props) {
    const [isBusy, setBusy] = useState(true)
    const [rows,setRows] = useState([])
    const [finalHead,setFinalHead] = useState([])
    const loginReducer = useSelector(state => state.loginReducer);
    const loginDetails = loginReducer && loginReducer.loginDetails &&loginReducer.loginDetails.data;
    let loginDetls =  JSON.stringify(loginDetails) === '{}'?{}:JSON.parse(loginDetails);
    let userType = loginDetls.userType?loginDetls.userType:'';
    let userEmail = loginDetls.loginUserName?loginDetls.loginUserName:'';
    let headers = JSON.parse(JSON.stringify(props.tranCells))

    useEffect(() => {
      setBusy(true)
        setFinalHead([])
        getHeaders()
        getRowData(props.report,props.data)
    },[props.data]);

    const downloadFile = ({ data, fileName, fileType }) => {
      const blob = new Blob([data], { type: fileType })
      const a = document.createElement('a')
      a.download = fileName
      a.href = window.URL.createObjectURL(blob)
      const clickEvt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      })
      a.dispatchEvent(clickEvt)
      a.remove()
    }
    const getHeaders = () =>{
      let head = []
      let head2 = []
      let ind1 = 0
      let ind2 = 0
      let finalhead = []
      if(props.report == "trans"){
        for(var i=1;i<props.taxnum;i++){
          let number = i+1
          let obj = {}
          obj.id = "tax"+i
          obj.label = "Tax "+ number + " Name"
          head.push(obj)
          let obj1 = {}
          obj1.id = "tax_val"+i
          obj1.label = "Tax "+ number + " Value"
          head.push(obj1)
        }
        for(var i=1;i<props.feenum;i++){
          let number = i+1
          let obj = {}
          obj.id = "fee"+i
          obj.label = "Fee "+ number + " Name"
          head2.push(obj)
          let obj1 = {}
          obj1.id = "fee_val"+i
          obj1.label = "Fee "+ number + " Value"
          head2.push(obj1)
        }
        props.tranCells && props.tranCells.forEach((item,index)=>{
          if(item.id == "tax_val"){
            ind1 = index
          }
          if(item.id == "fee_val"){
            ind2 = index
          }
        })
        finalhead = [...props.tranCells.slice(0,ind1+1),
                      ...head,
                    ...props.tranCells.slice(ind1+1,ind2+1),
                      ...head2,
                    ...props.tranCells.slice(ind2+1)]
        console.log(finalHead)
        setFinalHead(finalhead)
      }else{
        setFinalHead(props.userCells)
      }
      setBusy(false)
    }
    const exportToCsv = (e) => {
      e.preventDefault()
    
      // Headers for each column
      let headers = []
      let head = ""
      if(props.report == "user"){
      props.userCells.forEach((val,index)=>{
        if(index == props.userCells.length-1){
          head = head+val.label
        }else{
        head = head+val.label+","
        }
      })
      }else{
        finalHead.forEach((val,index)=>{
          if(index == finalHead.length-1){
            head = head+val.label
          }else{
          head = head+val.label+","
          }
        })
      }
      headers.push(head)
      let csvData = []
      // Convert users data to a csv
      if(props.report == "user"){
      csvData = rows.reduce((acc, user) => {
        let rowVal = []
        Object.values(user).forEach((val)=>{
          rowVal.push(val)
        })
        acc.push(rowVal.join(','))
        return acc
      }, [])
      }else{
        csvData = rows.reduce((acc, trans) => {
          let rowVal = []
          Object.values(trans).forEach((val)=>{
            rowVal.push(val)
          })
          acc.push(rowVal.join(','))
          return acc
        }, [])
      }
      downloadFile({
        data: [...headers, ...csvData].join('\n'),
        fileName: 'Report.csv',
        fileType: 'text/csv',
      })
    }

    const getRowData=(type,data)=>{
      let i1=0
      let rowdata = []
      if(type == "user"){
      data &&data.length&& data.forEach((item)=>{
        rowdata[i1] = getUserRows(item)
        i1++
      })
      }else if(type == "trans"){
        data &&data.length&& data.forEach((item)=>{
          if(item.OrderLegs){
            item.OrderLegs.forEach(order=>{
              rowdata[i1] = getTransRows(order,item.OperatorName,item.OrderNumber,item.OrderDate,item.saving)
              i1++
            })
          }else{
            rowdata[i1] = getTransRows(null,item.OperatorName,item.OrderNumber,item.OrderDate,item.saving)
            i1++
          }
        })
      }
      setRows(rowdata)
      setBusy(false)
    }

    const getUserRows = (data) => {
      
        return{
          "first":data.firstname,
          "middle":data.middlename,
          "last":data.lastname,
          "access":data.AccessLevel,
          "role":data.RoleType,
          "email":data.TabName,
          "company":data.Organization,
          "report_location":data.Locations && data.Locations.length && data.Locations[0],
          "status":data.UserStatus,
          "phone":data.MobileNumber
        }
     }

     const getTransRows = (data,operator,orderid,date,saving) => {
      let taxes = {}
      let fees = {}
      let company = {}
      if(userType == "Operator"){
        company = {
          "fbo": data ? data.FBO : "-"
        }
      }else if(userType == "FBO"){
        company = {
          "operator":operator
        }
      }else{
        company = {
          "fbo": data ? data.FBO : "-",
          "operator":operator
        }
      }
      for(var i=0;i<props.taxnum;i++){
        taxes[`tax${i}`] = data && data.Taxes && data.Taxes[i] && data.Taxes[i].TaxName ? data.Taxes[i].TaxName: "-"
        taxes[`tax_val${i}`] = data && data.Taxes && data.Taxes[i] && data.Taxes[i].Amount ? data.Taxes[i].Amount: "-"
      }
      for(var i=0;i<props.feenum;i++){
        taxes[`fee${i}`] = data && data.Fees && data.Fees[i] && data.Fees[i].FeeName ? data.Fees[i].FeeName: "-"
        taxes[`fee_val${i}`] = data && data.Fees && data.Fees[i] && data.Fees[i].Amount ? data.Fees[i].Amount: "-"
      }
      return{
        "orderid":data ? data.OrderNumber : orderid,
        ...company,
        "tail":data ? data.TailNumber : "-",
        "flight":data ? data.FlightType : "-",
        "fuelDate":data ? new Date(data.FuellingDate).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' }) : "-",
        "orderDate":new Date(date).toLocaleDateString('en-US',{ year: 'numeric', month: '2-digit', day: '2-digit' }),
        "arriving":data ? data.ArrivingFrom : "-",
        "fuelQuantity":data ? data.FuelQuantity : "-",
        "paymentName":"-",
        "paymentMode":"-",
        "cardAccount":"-",
        ...taxes,
        ...fees,
        "addService":data && data.Services ? data.Services[0].ServiceName : "-",
        "Service":data && data.Services ? "$ "+data.Services[0].Amount : "-",
        "addTax":"-",
        "taxVal":"-",
        "addFee":"-",
        "feeVal":"-",
        "product":data ? data.FuelType : "-",
        "basePrice":data ? data.BasePrice : "-",
        "finalPrice":data ? data.FinalPrice : "-",
        "savings":saving,
      }
   }
   const onClickSubmit = (e) =>{
    exportToCsv(e)
  }
   const getOperatorFields = (item, index) => {
    switch (item.component.toUpperCase()) {    
        case "BUTTON":
            if(!item.shouldNotRender){
            return (<ButtonComponent
                Label={item.label}
                Type={item.type}
                className={item.styles.className}
                variant={item.variant}
                disabled={false}
                handleClick={(e) => onClickSubmit(e,item)}
                 />)
            }
    };
} 

  return (<>
    {isBusy ? (
      (<Loader/>)
    ) : (<> 
<div className='bf-table-container bf-report-table-container'>
<Subheading label={props.report == "user" ? props.jsonData.content.TableFields[0].label1 : props.jsonData.content.TableFields[0].label2} />  
  <BFTable
    sortEnabled={false}
    searchEnabled={false}
    Data={rows && rows}
    heading={props.report == "user" ? props.userCells : finalHead}
    searchBy={[""]}
  >
  </BFTable>
  <div className='bf-btn-section'>
  { props.jsonData.content.TableFields.map((item, sectionIndex) => (<>
        {getOperatorFields(item)}
  </>)
  )}
  </div>
  </div>
  </>)}
  </>);
}