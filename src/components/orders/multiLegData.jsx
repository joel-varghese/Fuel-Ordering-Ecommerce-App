import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MOBILE_HEADER_TEXT } from '../../actions/actionTypes';
import { getMobileHeaderText } from '../../actions/commonActions/commonActions';
import { getEditLegData, getIsEdit, multiLegJsonData } from '../../actions/orderPlacementActions/multiLegActions';
import { getIsPricePending, getIsSummary, getLegData, getLegLevel, getLegType, getMultipleLeg ,clearAll, getMultiLegPricePending, getIsMultiSummary} from '../../actions/orderPlacementActions/orderPlacementActions';
import { getFormatedAmount, getFormattedMMDDYY } from '../../controls/validations';
import ButtonComponent from '../button/button';
import CustomModal from '../customModal/customModal';
import BFTable from '../table/table'

export default function MultiLegData(props) {
  const [headcells, setHeadcells] = useState([])
  const [rows, setRows] = useState([])
  const [orderLegs, setorderLegs] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [fields, setFields] = useState(false)
  const [updatedRows, setUpdatedRows] = useState([])
  const [update, setUpdate] = useState(false)
  const [deleteShow, setDeleteShow] = useState(false);
  const [updatedLegData, setUpdatedLegData] = useState([])
  const [delecteModelText,setDeleteModelText] = useState('')
  const navigate = useNavigate()
  const [jsonPayload, setJsonPayload] = useState({ 'blobname': 'multiLeg.json' });
  const multiLegReducer = useSelector(state => state.multiLegReducer);
  const jsonData = multiLegReducer?.multiLegJson?.data?.data;
  const orderPlacementReducer = useSelector((state)=>state.orderPlacementReducer);
  const legData = orderPlacementReducer?.multiLegData?.data;
  const isMultiLedPricePending = orderPlacementReducer?.isMultiLedPricePending?.data;
  const isMultiSummary = orderPlacementReducer?.isMultiSummary?.data;
  const dispatch = useDispatch()
  
  useEffect(()=>{
    multiLegJsonData(dispatch,jsonPayload)
  },[])
  useEffect(()=>{
    getMobileHeaderText(dispatch,"New Fuel Order")
  },[isMultiSummary])
  
  useEffect(()=>{
    let data = jsonData?.multiLegData && jsonData?.multiLegData.length && jsonData?.multiLegData[0]
    let headers = data?.headCells
    setFields(data)
    let dataRows = []
    setHeadcells(headers)
    legData && legData?.OrderLegs?.forEach((item)=>{
      dataRows.push(createData(item.LegID, item.FuellingDate, item.ICAO, item.FinalPrice, data?.Buttons,item.PricePending))
      if(item.PricePending){
        getMultiLegPricePending(dispatch,true)
      }
    })
    setRows(dataRows)
    setorderLegs(legData?.OrderLegs)
  },[jsonData,legData,update])

  const createData =(legID, date, location, price, buttons,PricePending) =>{
    if(legID?.toString().length==1){
      legID=`0${legID}`
    }
    let dataObj = {
      "legID": legID,
      "fuelingDate":PricePending ? `<span className="bf-required bf-hide-hover">!!</span> ${getFormattedMMDDYY(date,true)}` :getFormattedMMDDYY(date,true),
      "ICAO": location.toUpperCase(),
      "finalPrice": '$'+getFormatedAmount(price),
      "Buttons": [{ "Label": "Edit", "method": "onEditClick", "className": "btn btn-bf-primary" }, { "Label": "Delete", "method": "onDeactivateClick", "className": "btn-bf-secondary bf-mrgl20", "checkAdminAccess" :true }]
    };
    return dataObj
  }
  const clickEdit = (data) => {
    setIsEdit(true)
    setUpdatedLegData(data);
    if(isMultiSummary){
      setDeleteShow(true)
      setDeleteModelText(jsonData?.multiLegData[0]?.modal?.editConfirm?.text)
      document.getElementById('root').style.filter = 'blur(5px)';
    }else{
      edited(data)
    }

  }
  const edited =(data)=>{
    let multiLegData = legData
    let newData = multiLegData.OrderLegs.filter((row,index)=>row.LegID == parseFloat(data.legID))
    newData[0]['FuellingDate'] = getFormattedMMDDYY(newData[0]['FuellingDate'])
    let editLegData = newData[0]
    getLegLevel(dispatch,editLegData.LegID-1)
    getEditLegData(dispatch,editLegData)
    getMultipleLeg(dispatch, false)
    getIsEdit(dispatch,true)
  }

  const confirmEdit = () =>{
    edited(updatedLegData)
    getIsMultiSummary(dispatch,false)
    document.getElementById('root').style.filter = 'none';
  }
  const DeleteData = () => {
    let multiLegData = legData
    let newData = multiLegData.OrderLegs.filter((row)=>row.LegID != parseFloat(updatedLegData.legID));
    newData.sort((a, b) => {
      return a.FuellingDateEpoch - b.FuellingDateEpoch;
    });
    newData.forEach((leg,index)=>{
      leg['LegID'] = index + 1;
      leg['Name'] = index + 1;
    })
    multiLegData['OrderLegs'] = newData;
    setUpdatedRows(newData)
    getLegData(dispatch,multiLegData)
    setUpdate(!update)
    setDeleteShow(false)
    getLegLevel(dispatch,multiLegData?.OrderLegs.length)
    document.getElementById('root').style.filter = 'none';
    if(isMultiSummary){
      getIsMultiSummary(dispatch,false)
    }
    if(!newData.length){
      getMultipleLeg(dispatch, false)
      getIsSummary(dispatch, false)
      getIsPricePending(dispatch,false)
      getMultiLegPricePending(dispatch,false)
      getLegData(dispatch,{})
      getLegType(dispatch, false)
      getLegLevel(dispatch,0)
      navigate('/dashboard/fuelorder')
    }
  }
  const clickDeactivate = (data,index) => {
    setUpdatedLegData(data);
    setDeleteShow(true)
    if(isMultiSummary){
      setDeleteModelText(jsonData?.multiLegData[0]?.modal?.editConfirm?.text)
    }else{
      setDeleteModelText(jsonData?.multiLegData[0].modal.delete.text+parseFloat(data.legID)+'?')
    }
    document.getElementById('root').style.filter = 'blur(5px)';
  }

  const closeModal = () => {
    setIsEdit(false)
    setDeleteShow(false)
    document.getElementById('root').style.filter = 'none';
  }

  const onRowClick = (button,data) => {
    let multiLegData = legData
    let newData = multiLegData.OrderLegs.filter((row,index)=>row.LegID == parseFloat(data.legID))
    newData[0]['FuellingDate'] = getFormattedMMDDYY(newData[0]['FuellingDate'])
    let editLegData = newData[0]
    getLegLevel(dispatch,editLegData.LegID)
    getIsEdit(dispatch,true)
    getEditLegData(dispatch,editLegData)
  }
  const onClickSubmit = (e,item)=>{
    if(item.name == "placeOrder"){
      // getLegType(dispatch,false)
      props.onClickSubmit(e,item,true)
      getIsPricePending(dispatch,false)
      getMultiLegPricePending(dispatch,false)
    }else if (item.name == "addLeg"){
      props.updateClearAll(false)
      setTimeout(()=>{
        getLegLevel(dispatch,legData?.OrderLegs?.length)
        navigate('/dashboard/fuelorder')
        clearAll(dispatch,true)
        getMultipleLeg(dispatch, false)
        getIsEdit(dispatch,false)
        getIsSummary(dispatch, false)
      },1000)
    }else if(item.name == "cancel"){
      if(isMultiSummary){
        props.updateClearAll(false)
        setTimeout(()=>{
          getLegLevel(dispatch,legData?.OrderLegs?.length)
          navigate('/dashboard/fuelorder')
          clearAll(dispatch,true)
          getMultipleLeg(dispatch, false)
          getIsEdit(dispatch,false)
          getIsSummary(dispatch, false)
        },1000)
      }else{
        navigate('/dashboard/fuelorder')
      }
    }

    
  }
  return (
    <div className="bf-multileg-left-summary">
      <div className={isMultiLedPricePending?'bf-multi-table-info':'bf-multi-table'}>
        <div className='bf-show-mobile bf-multi-leg-heading'>Order Summary Multi-Leg</div>
        <BFTable
          sortEnabled={false}
          searchEnabled={false}
          Data={rows&&rows}
          heading={headcells}
          // searchBy={["taxname", "location"]}
          primaryClick={clickEdit}
          secondaryClic={clickDeactivate}
          loading={false}
          noPagination={true}
          rowClick={onRowClick}
          isMulti={true}
        />
        <div>
          {!isMultiSummary && legData?.OrderLegs?.length<=15 && fields?.addLegButton?.map((item)=>(
            <button 
              disabled={props.disable? props.disable : false} 
              className={item.className}
              onClick={(e)=>onClickSubmit(e,item)}>
              <span>+</span> {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className='bf-multi-order-buttons'>
        {fields?.legButtons?.map((item)=>(
          <ButtonComponent       
          Label={item.name=='cancel' && isMultiSummary ? item.labelBack : item.label} 
          Type={item.type} 
          className={item.className}
          variant={item.variant}
          disabled={props.disable? props.disable : false}
          handleClick={(e)=>onClickSubmit(e,item)}/>
        ))}
      </div>
      <div className={isMultiLedPricePending? `bf-info-text`:'display-none'}>
      <span className='bf-required'>!! </span>{fields?.pricePendingText?.text}</div>
      {deleteShow ?<CustomModal
                show={deleteShow}
                onHide={isEdit ? () => confirmEdit() :() => DeleteData()}
                close={()=>closeModal()}
                modelBodyContent={delecteModelText}
                hide={()=>closeModal()}
               // modelBodyContent={jsonData?.multiLegData[0].modal.delete.text}
                buttonText={jsonData?.multiLegData[0].modal.delete.button1}
                secondbutton={jsonData?.multiLegData[0].modal.delete.button2}
            />:""}
    </div>
  )
}
