import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { multiLegSummaryJsonData } from '../../actions/orderPlacementActions/multiLegSummaryActions';
import { getLegLevel, getLegType } from '../../actions/orderPlacementActions/orderPlacementActions';
import { getFormatedAmount, getFormattedMMDDYY } from '../../controls/validations';
import ButtonComponent from '../button/button';
import FuelPriceTable from '../table/fuelPriceTable';
import BFTable from '../table/table'

import BackIcon from '../../assets/images/collapse_arrow.svg';

export default function MultiLegSummary(props) {
  const [headcells, setHeadcells] = useState([])
  const [mobileHeadCells, setMobileHeadcells] = useState([])
  const [rows, setRows] = useState([])
  const [mobileRows, setMobileRows] = useState([])
  const [orderLegs, setorderLegs] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [selectedInd, setSelectInd] = useState(0)
  const [fields, setFields] = useState(false)
  const navigate = useNavigate()
  const [jsonPayload, setJsonPayload] = useState({ 'blobname': 'multiLegSummary.json'});
  const multiLegSummaryReducer = useSelector(state => state.multiLegSummaryReducer);
  const jsonData = multiLegSummaryReducer?.multiLegSummaryJson?.data?.data;
  const orderPlacementReducer = useSelector((state)=>state.orderPlacementReducer);
  // const legData = orderPlacementReducer?.multiLegData?.data;
  const  legData= orderPlacementReducer?.orderedData?.data?.length && orderPlacementReducer?.orderedData?.data;
  const dispatch = useDispatch()
  
  useEffect(()=>{
    multiLegSummaryJsonData(dispatch,jsonPayload)
  },[])
  useEffect(()=>{
    let multidata = props.viewMulti ? [props.orderRowData] : legData && legData[0] && legData[0][0]['JSON_UNQUOTE(@JSONResponse)'] ? JSON.parse(legData[0][0]['JSON_UNQUOTE(@JSONResponse)']) :{}
    // console.log(multidata)
    let data = jsonData?.multiLegSummaryData && jsonData?.multiLegSummaryData.length && jsonData?.multiLegSummaryData[0]
    let headers = data?.headCells
    let mobileHeaders = data?.mobileHeadCells
    setFields(data)
    let dataRows = []
    let mobileDataRows = []
    setHeadcells(headers)
    setMobileHeadcells(mobileHeaders)
    let legs=multidata && multidata.length && multidata[0]?.OrderLegs
    legs?.length && legs?.sort((a,b)=>{
      return new Date(a?.FuellingDate) - new Date(b?.FuellingDate)
    })
    multidata[0].OrderLegs=legs;
    multidata && multidata.length && multidata[0]?.OrderLegs?.forEach((item,index)=>{
      dataRows.push(createData(index+1, item.OrderNumber, item.FuellingDate, item.ICAO,item.FBO,item.FuelQuantity, item.FinalPrice,item.OrderStatus, data?.Buttons))
      mobileDataRows.push(createMobileData(index+1,item.ICAO,item.OrderStatus));
    })

    setRows(dataRows)
    setMobileRows(mobileDataRows)
    setorderLegs(multidata && multidata.length && multidata[0]?.OrderLegs)
  },[jsonData,legData,props])

  const createData =(legID,orderNumber, date, location,FBO,gallons,price,status, buttons) =>{
    if(legID?.toString().length==1){
      legID=`0${legID}`
    }
    let dataObj = {
      "legID": legID,
      "orderNumber":orderNumber,
      "fuelingDate": getFormattedMMDDYY(date),
      "ICAO": location.toUpperCase(),
      "FBO":(FBO.toLowerCase()),
      "gallons":parseFloat(gallons).toFixed(2),
      "finalPrice": '$'+getFormatedAmount(price),
      "order": status
      // "Buttons": [{ "Label": "Edit", "method": "onEditClick", "className": "btn btn-bf-primary" }, { "Label": "Delete", "method": "onDeactivateClick", "className": "btn-bf-secondary bf-mrgl20", "checkAdminAccess" :true }]
    };
    return dataObj
  }
  const createMobileData =(legID,location,status) =>{
    if(legID?.toString().length==1){
      legID=`0${legID}`
    }
    let dataObj = {
      "legID": legID,
      "ICAO": location.toUpperCase(),
      "order": status
      // "Buttons": [{ "Label": "Edit", "method": "onEditClick", "className": "btn btn-bf-primary" }, { "Label": "Delete", "method": "onDeactivateClick", "className": "btn-bf-secondary bf-mrgl20", "checkAdminAccess" :true }]
    };
    return dataObj
  }
  const clickEdit = (data) => {
    setIsEdit(true)
  }
  const clickDeactivate = (data) => {
    
  }
  const onClickSubmit = (e,item)=>{
    if(item.name == "placeOrder"){
      getLegLevel(dispatch,0)
      getLegType(dispatch,false)
      props.onClickSubmit(e,item)
    }else if (item.name == "addLeg"){
      navigate('/dashboard/fuelorder')
    }

    
  }
  const onAccordianRowClick = (row,index)=>{
    props.onRowClick(row,index)
    setSelectInd(index)
  }
  const getAccordionContent=(data,index)=>{
    let row = orderLegs[index]
    return(
      <div className='bf-multileg-order-placed-summary'>
        <div className='bf-order-details'>
          {fields?.accordionData?.tableContent.map((item)=>(
            <>
              <Row>
                  <Col className='bf-font-600'>{item.label}</Col>
                  <Col>{row[item.key]? row[item.key]:""}</Col>
              </Row>
            </>
          ))}
        </div>
        <div className='bf-order-additional-details'>
        {fields?.accordionData?.boxContent.map((item)=>(
          <div>
            <div className='bf-bold bf-label-services'>{item.label}</div>
              {row[item.nameKey] && !row[item.nameKey].length ? 'No Services Selected.' : 
              <div className='bf-service-text-align'>
                {row[item.nameKey] && row[item.nameKey] ? row[item.nameKey].length && row[item.nameKey].map((data,index)=>(
                  <>{`${data[item.key]}${index<((row[item.nameKey].length)-1 )? "," : ''} `}</> 
                )):""}
            </div>}
          </div>
        ))}
        </div>
      </div>
    )
  }
  
  const getMobileAccordionContent = (data, index) => {
    let row = orderLegs[index]
    console.log(row)
    let labels = jsonData?.multiLegSummaryData[0]?.mobileAccordionLabels
    console.log(labels)
    labels?.map((item) => {
      console.log(item.id)
    })
    return (
      <div className='bf-multileg-mobile-accordion-expand-data'>
        {labels?.map((item) => (
          (item.id !== "Services" ?
            <div className='bf-table-labels-section'>
              <div className='bf-label'>{item.label}</div>
              <div className='bf-value'>{row[item.id]}</div>
          </div> : 
          <div className='bf-table-labels-section'>
            <div className='bf-label'>{item.label}</div>
            <div className='bf-value bf-all-services'>
              {row[item.id] && row[item.id].map((service, index) => (
                <span>{service.ServiceName} {index + 1 < row[item.id].length ? ',' : ''} </span>
              ))}
            </div>
          </div> )
        ))}
      </div>
      
    )
  }

  return (
    <div className="bf-order-summary-container bf-multi-order-summary-container">
      {props.orderPlaced && props.orderPlaced ? 
      <>
        <div className='d-flex justify-content-between bf-multileg-tblhead'>
          <div>
            <span className='bf-tailfont'>{orderLegs?.length && orderLegs[0].TailNumber}  </span>
          </div>
          <span className='bf-tailfont'>Number Of Legs: {orderLegs?.length}</span>
        </div>
      </>
      : props.viewMulti ? 
      <>
        <div className='d-flex justify-content-between bf-multileg-tblhead bf-hide-mobile'>
          <div className='bf-view-order-multi'>
            <span className='bf-tailfont'>{props.tailNumber}  </span>
            <span>  <a className='bf-hyperlink' href='javascript:void(0);' onClick={()=>props.onLink('Cancel All Legs')}>Cancel All Legs</a></span>
          </div>
          <span className='bf-tailfont'>Number Of Legs: {props.totalLegs}</span>
        </div>
        <div className='bf-summary-sub bf-show-mobile'>
            <div>
              <img className='bf-icon-back' onClick={(e)=>props.onClickSubmit(e,{"name":"back"})} src={BackIcon}  alt="Back" />
            </div>
            <div className='bf-heading-sub'>{props.tailNumber} - {props.totalLegs} Legs</div>
        </div>
      </>
      :""}
        <div className='bf-hide-mobile bf-multi-leg-summary-table'>
          <FuelPriceTable
            sortEnabled={false}
            searchEnabled={false}
            heading={headcells}
            primaryClick={clickEdit}
            secondaryClic={clickDeactivate}
            loading={false}
            Data ={rows && rows} 
            accordion = {true}
            customContent = {true}
            noPagination={true}
            accordionContent= {getAccordionContent}
            onAccordianRowClick = {onAccordianRowClick}
            selectedInd={props.viewMulti && !props.viewSummary ? selectedInd : null}
          />
        </div>
        <div className='bf-show-mobile bf-multi-leg-summary-table'>
          <FuelPriceTable
            sortEnabled={false}
            searchEnabled={false}
            heading={mobileHeadCells}
            primaryClick={clickEdit}
            secondaryClic={clickDeactivate}
            loading={false}
            Data ={mobileRows && mobileRows} 
            accordion = {true}
            customContent = {true}
            noPagination={true}
            accordionContent= {getMobileAccordionContent}
            onAccordianRowClick = {onAccordianRowClick}
            selectedInd={props.viewMulti && !props.viewSummary ? selectedInd : null}
          />
        </div>
    </div>
  )
}
