import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import ButtonComponent from '../button/button';
import Subheading from '../subHeading/subHeading';
import Checkbox from '../checkbox/checkbox';
import logo from '../../assets/images/barrel_fuel_logo.png'
import './editModel.scss';
import Input from '../input/input';
import Select from '../select/select';
import MultiSelectCheckbox from '../multiSelect/multiSelectCheckbox';
import Loader from '../loader/loader';
import { Storage } from '../../controls/Storage';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import closeIcon from '../../assets/images/close-icon.svg';
import CreatableSelect from '../creatableSelect/multiCreatableSelect';
import DatePicker from '../datePicker/datePicker';
import TextArea from '../textArea/textArea';
import { roleWiseOption, roleWiseOptionInt } from '../../controls/commonConstants';
import { useSelector } from 'react-redux';

const EditFormModal = props => {
    const {formdata,formErrors,formdataset,formerrorset}= props
    
    let [resetvalue,setResetValue] = useState(); 
    const accountHomeReducer = useSelector((state) => state.accountHomeReducer);
  	const selectedUser = accountHomeReducer && accountHomeReducer.selectedUser && accountHomeReducer.selectedUser;
    useEffect(() => { 
      if(props.show)  
        document.getElementById('root').style.filter = 'blur(5px)';
    },[])
    const getOptionAsRole=(option,accessLevel)=>{
			
      if(accessLevel && accessLevel){
      let returnData = null
       if(selectedUser.user == "internal"){
        for(var i=0; i<roleWiseOptionInt.length; i++){
          if(roleWiseOptionInt[i].title == option){
            returnData = roleWiseOptionInt[i].value
          }
        }
      } else if(selectedUser.user === "operator" || selectedUser.user === "fbo") {
        
        for(var i=0; i<roleWiseOption.length; i++){
          if(roleWiseOption[i].title == option){
            returnData = roleWiseOption[i].value
          }
        }
      } else {
        returnData = option;
      } 
      return returnData
     } else{
      return option
    } 
  
      
    }

    const checkFromDate = (fromDate, toDate) =>{
      let today = new Date();
      today.setHours(0, 0, 0, 0)
      let toDateNew = new Date(toDate);
      toDateNew.setHours(0, 0, 0, 0)
      let fromDateNew = new Date(fromDate);
      fromDateNew.getHours(0, 0, 0, 0)
      if (toDate !== "NaN/NaN/NaN" && toDate !== null) {
        if (fromDateNew > toDateNew) {
          if (today > fromDateNew) {
            return today
          } else {
            return fromDate
          }

        } else if (fromDateNew < toDateNew) {

          if (today > toDateNew) {
            return today
          } else {
            return toDate
          }
        }
        else {
          new Date();
        }
      } else {
        if (fromDateNew > toDateNew) {
          if (today > fromDateNew) {
            return today
          } else {
            return fromDate
          }

        }
      }
    }
    const getOperatorFields = (item,index,flag) => {
      let taxdisable = false
      if(item.name == "taxname"||item.name == "feeName" ||item.name =="servicetype"){
        taxdisable = true
      } 
        switch(item?.component?.toUpperCase()) {
            case "PARAGRAPH":
                return (<Row className='mb-3'> 
               
                <div><b> {item.label} {props.cancelAll ? props.orderNumber :props.leg ? `Leg ${props.leg}`: ""}</b></div>
                </Row>)
            case "MODALHEAD":
                if(props.isEditSingle)
                return (<Row className={item.styles ? item.styles.className : ''}>{item.name=='placeOrder' ? props.editPopText : item.label2}</Row>)
                else if(props.isOrderClose)
                return (<Row className={item.styles ? item.styles.className : ''}>{item.label3}</Row>)
                else
                return (<Row className={item.styles ? item.styles.className : ''}>{item.label}</Row>)

            case "HEADER":
                if(props.addNew) 
                return (<Subheading label={item.labelAdd} styles={item.styles}/>)
                else
                return (<Subheading label={item.label}/>)
                case "CHECKBOX":
        return (<Checkbox Label={item.label} id={item.id} onClick={(e)=>props.handleCheck(e,item)} colWidth={item.styles ? item.styles.colWidth : ''} disabled={props.disabled} ischeck={props.checked}/>)
        case 'LINK':
          if(props?.linkIndex?.includes(index))
          return (<div className={`bf-download-sample-xl ${props.addReason ? 'bf-add-notes' : ''}`}>
            <a className={`col-md-${item.styles.colWidth}`} name={item.label2} href={props.template} download="file" onClick={(e)=>props.onLinkClick(e,item,index)}>{item.label2}</a>
            </div> )
          else
          return (<div className={`bf-download-sample-xl ${props.addReason ? 'bf-add-notes' : ''}`}>
            <a className={`col-md-${item.styles.colWidth}`} name={item.label} href={props.template} download="file" onClick={(e)=>props.onLinkClick(e,item,index)}>{item.label}</a>
            </div> )  
        case "BUTTON":
        return (<div className='bf-relative'>
                {props.showError && !props.addReason &&
                  <div className='bf-required bf-mrgb20i'>{props.showError}</div>
                }
                {!props.submittedForm ?
                  <ButtonComponent       
                  Label={item.label} 
                  Type={item.type} 
                  className={item.styles.className}
                  variant={item.variant}
                  disabled={props.disable? props.disable : false}
                  handleClick={(e)=>props.onClickSubmit(e,item,index)}/>
                  :
                  <Loader height='auto'/>
                }
                </div>)
        case "INPUT":
            return (<Input 
                disabled = {item.name=='taxname' && props.addServdis ? props.addServdis : item.name=='RetailPrice' ? props.retailDisable :taxdisable ? props.editDisable : (props.taildisable && item.name == 'aircraftTailNumber' ? props.taildisable : item.disable)}
                colWidth={item.styles ? item.styles.colWidth : ""} 
                Type={item.type} 
                Label={item.label}
                data-label={item.label}
                value={item.label}
                onkeyDown={true}
                styles={item.styles}
                Accept={props.Accept?props.Accept:null}
                Placeholder={item.placeholder}
                isRequred={item.isRequired}
                Name={item.name}
                uploadStatus={item.type=='file' && props?.uploadDocumentMsg && props?.uploadDocumentMsg.length ? props?.uploadDocumentMsg[index] : null}
                handleChange={(e)=>props.onHandleChange(e,item,index,flag)}
                handleBlur={(e)=>props.onHandleBlur(e,item,index,flag)}
                formDataSet={props.addReason && formdata.length ? formdata[index][item.name] : formdata ? formdata[item.name] : ""}
                fieldError={props.addReason ?
                   formErrors && formErrors.length &&
                  formErrors[index][item.name] && !formErrors[index][item.name].isValid :
                    formErrors
                    && !formErrors[item.name].isValid
                    //&& (
                    //    formErrors[item.name].isTouched
                    //)
                }
                errorMessage={props.addReason ?
                   formErrors  && formErrors.length &&
                  formErrors[index][item.name] && formErrors[index][item.name]
                      .activeValidator
                      .errorMessage :
                    formErrors
                    && formErrors[item.name]
                        .activeValidator
                        .errorMessage
                }
                />)
        case "SELECT": 
        if(flag){
          return (<Select 
            colWidth={item.styles ? item.styles.colWidth : ""} 
            Type={item.type} 
            Label={item.label}
            isAdmin = {item.name=='accessLevel'?props.isAdmin:null}
            Placeholder={item.placeholder}
            isRequred={item.name ==="taxTemplate" ? (props.disabled ? !props.disabled : true) : item.isRequired}
            disabled = {item.name ==="taxTemplate" || (item.name ==="unit" && props.addServdis) ? props.disabled : false}
            dynamicSelect={item.dynamicSelect}
            lookupReference={item.dynamicSelect ? item.lookupReference : null}
            Options={props.tempOptions && item.name==="taxTemplate" ? props.tempOptions : (props.customOptions && item.name==="requestedBy" ? props.userOptions : (props.customOptions && item.name==="operatorName" ?props.companyOptions :item.options))}
            tooltip={item.tooltip?item.tooltip:""}
            Name={item.name}
            dependentField = {item.dependentField}
            dependentFieldVal = { item.userRole ? (props.userType ? props.userType : ''):item.dependentFieldVal?item.dependentFieldVal:'' }
            handleChange={(e)=>props.onHandleChange(e,item,index,flag)}
            handleBlur={(e)=>props.onHandleBlur(e,item)}
            formDataSet={formdata.length ? formdata[index][item.name] : ""}
            accessLevel ={item.accessLevel}
            fieldError={
              formErrors && formErrors.length &&
             formErrors[index][item.name] && !formErrors[index][item.name].isValid 
            }
            errorMessage={
              formErrors  && formErrors.length &&
             formErrors[index][item.name] && formErrors[index][item.name]
                 .activeValidator
                 .errorMessage 
            }
            />)
        }else{
          return (<Select 
            colWidth={item.styles ? item.styles.colWidth : ""} 
            Type={item.type} 
            Label={item.label}
            isAdmin = {item.name=='accessLevel'?props.isAdmin:null}
            Placeholder={item.placeholder}
            isRequred={item.name ==="taxTemplate" ? (props.disabled ? !props.disabled : true) : item.isRequired}
            disabled = {item.name ==="taxTemplate" || (item.name ==="unit" && props.addServdis) ? props.disabled : false}
            dynamicSelect={item.dynamicSelect}
            lookupReference={item.dynamicSelect ? item.lookupReference : null}
            Options={props.addReason && item.name=='requestedBy'? props.requestedBy :props.tempOptions && item.name==="taxTemplate" ? props.tempOptions : (props.customOptions && item.name==="requestedBy" ? props.userOptions : (props.customOptions && item.name==="operatorName" ?props.companyOptions :item.options))}
            tooltip={item.tooltip?item.tooltip:""}
            Name={item.name}
            dependentField = {item.dependentField}
            dependentFieldVal = { item.userRole ? (props.userType ? props.userType : ''):item.dependentFieldVal?item.dependentFieldVal:'' }
            handleChange={(e)=>props.onHandleChange(e,item,index,flag)}
            handleBlur={(e)=>props.onHandleBlur(e,item)}
            accessLevel ={item.accessLevel}
            formDataSet={props.addReason? formdataset && formdataset[item.name]: formdata ?getOptionAsRole(formdata[item.name], item.accessLevel) : ""}
            fieldError={props.addReason ? 
              formerrorset && formerrorset[item.name] 
                && !formerrorset[item.name].isValid
               && (
                formerrorset[item.name].isTouched
                ):
                formErrors && formErrors[item.name] 
                && !formErrors[item.name].isValid
               && (
                   formErrors[item.name].isTouched
                )
            }
            errorMessage={
              item.name ==="taxTemplate" ? props.disabled ? null : (
                formErrors && formErrors[item.name] 
                && formErrors[item.name]
                    .activeValidator
                    .errorMessage
              ):props.addReason?
              (formerrorset && formerrorset[item.name] 
                && formerrorset[item.name]
                    .activeValidator
                    .errorMessage):
                    (formErrors && formErrors[item.name] 
                && formErrors[item.name]
                    .activeValidator
                    .errorMessage)
            }
            />)
        }
            
                case "ASYNCTYPEAHEAD":
                        return (
                          <Form.Group as={Col} md={item.styles.colWidth} className={`bf-text-left ${ formErrors &&
                            formErrors[item.name] && formErrors[item.name]
                                .activeValidator
                                .errorMessage != null ? 'bf-error-class' : ''
                        } mb-4`} controlId={item.name}
                        >
                                <Form.Label>{item.label} {item.isRequired ? <span className='bf-required'>*</span> : ''}</Form.Label>
                                <AsyncTypeahead
                                    filterBy={props.filterBy}
                                    isLoading={props.isAddress1Loading}
                                    minLength={props.minLength?props.minLength:3}
                                   // minLength={3}
                                    id={item.id}
                                    label={item.label}
                                    name={item.name}
                                    //disabled={item.disabled && props.disable ? true : false}
                                    inputProps={props.inputProps?props.inputProps:{
                                        name: item.name
                                    }}
                                    onSearch={props.searchAPI}
                                    onChange={(items) => props.searchHandler(items)}
                                    options={props.results}
                                    useCache={false}
                                    placeholder={item.placeholder}
                                    onBlur={props.onAddressSearchBlur}
                                    ref={props.typeaheadRef}
                                    selected={props.address1Selected}
                                    onFocus={props.handleFocus}
                                    defaultInputValue={formdata && formdata[item.name] ? formdata[item.name] : ''}
                                    {...formErrors &&
                                      formErrors[item.name] && !formErrors[item.name].isValid &&
                                          <div className='d-flex justify-content-end '>
                                              <small class="bf-error-message form-text"><span>
                                              {formErrors[item.name]
                                                  .activeValidator
                                                  .errorMessage}
                                                  </span></small>
                                              </div>
                                      }
                                />
                            </Form.Group>
                        )
                case "MULTISELECTCHECKBOX":
                if(formdata[item.name] && (formdata[item.name] !== null) && (formdata[item.name] !== "" && formdata[item.name].length > 0)){
                  if(Array.isArray(formdata[item.name])){
                    formdata[item.name] = formdata[item.name]
                  } else {
                    formdata[item.name] = formdata[item.name].split(',')
                  }
                }
                  return (<MultiSelectCheckbox 
                      Label={item.label?item.label:''} 
                      Name={item.name?item.name:''}
                      disabled = {props.locDisable ? true : item.disable&&props.disable}
                      isRequred={item.isRequired}
                      colWidth={item.styles ? item.styles.colWidth : ''}
                      dynamicSelect={item.dynamicSelect}
                      placeholder={item.placeholder}
                      Options = {props.addReason ? props.multiSelectOptions[item.name] : item.options}
                      filterLocation={props.filterLocation}
                      isAdmin = {props.isAdmin} 
                      //disabled={disable}
                      lookupReference={item.dynamicSelect ? item.lookupReference : null}
                      handleChange={(e)=>props.onHandleChange(e,item,index,flag)}
                      //checked={item.name==='location'?true:true}
                      handleBlur={(e)=>props.onHandleBlur(e,item)}
                      dependentField = {item.dependentField}
                      dependentFieldVal = {props.companyName?props.companyName:''}
                      removeFormData = {props.removeFormData?()=>props.removeFormData(item,true):''}
                      styles={item.styles}
                      selectAll ={props.selectAll}
                      fieldError={props.addReason ?
                        formErrors && formErrors.length &&
                       formErrors[index][item.name] && !formErrors[index][item.name].isValid :
                        formErrors
                        && !formErrors[item.name].isValid
                       // && (
                       //     formErrors[item.name].isTouched
                        //)
                    }
                    errorMessage={props.addReason ?
                      formErrors  && formErrors.length &&
                     formErrors[index][item.name] && formErrors[index][item.name]
                         .activeValidator
                         .errorMessage :
                        formErrors && formErrors[item.name] 
                        && formErrors[item.name]
                            .activeValidator
                            .errorMessage
                    }
                      formDataSet={props.addReason && formdata.length ? formdata[index][item.name] : formdata ? formdata[item.name] : ""}
                      />)
                case 'INFO':
                  return (<div className="bf-popup-info">{item.label}</div> )
                
                case "CREATABLESELECT" :
                  return( 
                  <CreatableSelect
                    Name={item.name?item.name:''}
                    Label={item.label?item.label:''}
                    colWidth={item.styles ? item.styles.colWidth : ""} 
                    Type={item.type} 
                    Placeholder={item.placeholder}
                    isRequred={item.isRequired}
                    components={item.components}
                    inputValue={props.inputValue?props.inputValue:""}
                    isClearable={props.isClearable}
                    isMulti={props.isMulti?props.isMulti:true}
                    menuIsOpen={item.menuIsOpen}
                    onCreateChange={(newValue)=>props.onCreateChange(newValue)}
                    onCreateInputChange={(newValue) => props.onCreateInputChange(newValue)}
                    onKeyDown={props.handleKeyDown}
                    value={props.selectedOptions}
                    checked={props.checked}
                  />
                  )
                case "DATE":
                  return (<>
                  <DatePicker
                  colWidth={item.styles ? item.styles.colWidth : ""}
                  styles = {item.styles}
                  Name={item.name}
                  Label={item.label}
                  handleChange = {(e)=>props.onHandleChange(e,item,index,flag)}
                  handleBlur = {(e)=>props.onHandleBlur(e,item,index,flag)}
                  isRequired={item.isRequired}
                  //currentValue = {new Date()}
                  disabled = {item.name == 'startDate' && props.editDisable?props.editDisable:false}
                  MinDate = {props.disputeDate && props.disputeDate && item.name == 'ActualFuelDate'? new Date().setDate(new Date().getDate() - 7) : item.name == 'endDate' ? formdata['startDate']? new Date(formdata['startDate'])>new Date()?formdata['startDate']: new Date(): new Date(): new Date()}

                  MaxDate = {props.disputeDate && props.disputeDate && item.name == 'ActualFuelDate'? new Date().setDate(new Date().getDate() + 6) : null}

                  fieldError={props.addReason ?
                    formErrors && formErrors.length &&
                   formErrors[index][item.name] && !formErrors[index][item.name].isValid :
                      formErrors &&
                      formErrors[item.name] && !formErrors[item.name].isValid
                      // && (
                      //     formErrors[item.name].isTouched
                      // )
                  }
                  errorMessage={props.addReason ?
                    formErrors  && formErrors.length &&
                   formErrors[index][item.name] && formErrors[index][item.name]
                       .activeValidator
                       .errorMessage :
                      formErrors
                      && formErrors[item.name]
                          .activeValidator
                          .errorMessage
                  }
                  value={props.addReason && formdata.length ? formdata[index][item.name] :formdata[item.name]}
                  /></>
                      
                      )

              case "TEXTAREA" :
                return( 
                <TextArea
                  Name={item.name?item.name:''}
                  Label={item.label?item.label:''}
                  colWidth={item.styles ? item.styles.colWidth : ""} 
                  Type={item.type} 
                  Placeholder={item.placeholder}
                  textLength={formdata[item.name]? formdata[item.name].length : "0"}
                  maxLength={item.maxLength}
                  isRequred={item.isRequired}
                  onChange={(e)=>props.onHandleChange(e,item)}
                  Rows={item.rows ? item.rows : 3}
                  restriction={item.lengthRestriction}
                  errorMessage = {props.dispute && props.formErrors[item.name] ? '' : null}
                  value={formdata[item.name]? formdata[item.name] : ""}
                />
                )      
         };

    }
    return (
        <Modal
      {...props}
      size={props.modalWidth? props.modalWidth : "lg"}
      aria-labelledby="contained-modal-title-vcenter"
      backdrop='static'
      centered
      id="bf-edit-modal"
      className={`${props.modalClassName ? props.modalClassName : ''}`}
    >
      <Modal.Header 
      className={props.className ? props.className : ''}>
        {props.title ?
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title> : ''}
        <Button className='bf-close-icon' onClick={props.onHide} ><img src={closeIcon} alt='closeIcon'/></Button>
      </Modal.Header>
      <Modal.Body 
      className={props.className ? props.className : ''}>
            <Form>
              {props.addReason?(<Row className='mb-3'>
              {props?.json?.map((sec)=>(
                <Row className='mb-3'>
                  {sec?.fields?.map((item,index)=>(
                    getOperatorFields(item)
                  ))}

                  {sec?.fieldsArray?.map((item,index) => (
                    <Row className='bf-mrgb-0'>
                    { 
                      item.fields.map((val)=>{
                        if(val.type != "button")
                        return getOperatorFields(val,index,true)
                      })
                    }
                    <Row className='bf-buttons-section'>{ 
                      item.fields.map((val)=>{
                        if(val.type == "button"){
                          if((sec.fieldsArray && sec.fieldsArray.length==1 && index == 0 && val.name == "remove") ||
                              (sec.fieldsArray && ((sec.fieldsArray.length-1) != index) && val.name == "addNew"))
                          {}
                          else return getOperatorFields(val,index,true)
                        }
                      })
                    }</Row>
                    
                </Row>
                   ))}
              </Row>))
              }
              </Row>):
              (
              <Row className='mb-3'>
                {props.json && props.json?.fields?.map((item) => getOperatorFields(item))} 
              </Row>)} 
            </Form>
      </Modal.Body>
      {props.showError && props.buttonText ? <div className='bf-required d-flex justify-content-center'>{props.showError}</div> : null}
      {props.buttonText && <Modal.Footer>
        <Button onClick={props.onHide}>{props.buttonText}</Button>
        {props.secondbutton ? <Button className='bf-btn-secondary' onClick={props.hide}>{props.secondbutton}</Button> : ''}
      </Modal.Footer>}
      {(props.showError || props.warningMessage) && props.customButtons ? <div className='bf-required d-flex justify-content-center'>{props.warningMessage ? props.warningMessage : ""}{props.showError}</div> : null}
      {props.customButtons ? !props.submittedForms? <Modal.Footer>
        <Button onClick={()=>props.onClickSubmit(props.primaryButtonText)}>{props.primaryButtonText}</Button>
        {props.secondbutton ? <Button className='bf-btn-secondary' onClick={()=>props.onHide(props.secondbutton)}>{props.secondbutton}</Button> : ''}
      </Modal.Footer>:<Loader height='auto'/>:""}
      </Modal>
    );
}
export default EditFormModal;