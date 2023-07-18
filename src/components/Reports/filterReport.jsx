import React, { useState, useEffect,useRef } from 'react';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { useDispatch,useSelector } from 'react-redux';
import Select from '../select/select';
import Input from '../input/input';
import ButtonComponent from '../button/button';
import DatePicker from '../datePicker/datePicker';
import Subheading from '../subHeading/subHeading';
import MultiSelectCheckbox from '../multiSelect/multiSelectCheckbox';




export default function FilterReport(props) {
    const [isBusy, setBusy] = useState(true)
    const [formDataSet, setFormDataSet] = useState(props.formDataSet);
    const loginReducer = useSelector(state => state.loginReducer);
    const loginDetails = loginReducer && loginReducer.loginDetails &&loginReducer.loginDetails.data;
    let loginDetls =  JSON.stringify(loginDetails) === '{}'?{}:JSON.parse(loginDetails);
    let userType = loginDetls.userType?loginDetls.userType:'';
    let userEmail = loginDetls.loginUserName?loginDetls.loginUserName:'';
    useEffect(() => {
      setFormDataSet(props.formDataSet)
    }, [props.formDataSet])
    
    const getOperatorFields = (item, index) => {
        switch (item.component.toUpperCase()) {
            case "INPUT":
                return (<Input
                   
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    data-label={item.label}
                    disabled={item.disable}
                    Placeholder={item.placeholder}
                    callback={item.callback}
                    // onselect={(index, item) => onHandleSelect(index, item)}
                    isRequred={item.isRequired}
                    Name={item.name}
                    handleChange={(e) => props.handleChange(e, item)}
                    handleBlur={(e) => props.handleBlur(e, item, index)} 
                    formDataSet={formDataSet && formDataSet[item.name] ? formDataSet[item.name] : item.defaultValue ? item.defaultValue : ''}
                      />)        
            case "DATE":
                return (<>
                <DatePicker
                colWidth={item.styles ? item.styles.colWidth : ""}
                styles = {item.styles}
                handleChange={(e) => props.handleChange(e, item)}
                MinDate = {item.name == "todate" ? formDataSet["fromdate"]? formDataSet["fromdate"] : "": '' }
                MaxDate = {props.report == "trans" && item.name == "todate" ? "" : new Date()}
                value = {formDataSet[item.name]}
                Name={item.name}
                Label={item.label}
                placeholder={item.placeholder}
                isRequred={item.isRequired}
                errorMessage={null}
                fieldError={props.invalidDate ? true : false}
                /></>)
            case "SELECT":
                if(((item.name == "company"||item.name == "operator"||item.name == "fboName") && userType == "Barrel Fuel") || (item.name == "operator" && userType == "FBO") || (item.name == "fboName" && userType == "Operator")){
                  if(item.reportType == "both" || (item.reportType == "trans" && props.report == "trans") || (item.reportType == "user" && props.report == "user")){
                    return (<Select
                        colWidth={item.styles ? item.styles.colWidth : ""}
                        Type={item.type}
                        Label={item.label}
                        Placeholder={item.placeholder}
                        dynamicSelect={item.dynamicSelect}
                        disabled={item.disable}
                        lookupReference={item.dynamicSelect ? item.lookupReference : null}
                        isRequred={item.isRequired}
                        Options={item.options}
                        Name={item.name}
                        handleChange={(e) => props.handleChange(e, item)}
                        handleBlur={(e) => props.handleBlur(e, item)}
                        formDataSet={formDataSet && formDataSet[item.name] ? formDataSet[item.name] :item.defaultValue ? item.defaultValue : ''} 
                        />)
                    }else{
                        return('')
                    }
                }else if(item.name != "company" && item.name != "operator" && item.name != "fboName"){
                if(item.reportType == "both" || (item.reportType == "trans" && props.report == "trans") || (item.reportType == "user" && props.report == "user")){
                return (<Select
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    Placeholder={item.placeholder}
                    dynamicSelect={item.dynamicSelect}
                    disabled={item.disable}
                    lookupReference={item.dynamicSelect ? item.lookupReference : null}
                    isRequred={item.isRequired}
                    Options={item.options}
                    Name={item.name}
                    handleChange={(e) => props.handleChange(e, item)}
                    handleBlur={(e) => props.handleBlur(e, item)}
                    formDataSet={formDataSet && formDataSet[item.name] ? formDataSet[item.name] :item.defaultValue ? item.defaultValue : ''} 
                    />)
                }else{
                    return('')
                }
              }else{
                return('')
            }
            case "PARAGRAPH":
              return (<Subheading label={item.label} />) 
            case "SPAN":
              if(item.reportType == "both" || (item.reportType == "trans" && props.report == "trans") || (item.reportType == "user" && props.report == "user")){
              return (<p>{item.label}</p>) 
              }else{
                return('')
              }  
            case "LINK":
              return(
                <a href='javascript:void(0);' className='bf-clear-filters' onClick={()=>props.clearAll()}>{item.label}</a>
              ) 
              case "MULTISELECTCHECKBOX":
                if(item.reportType == "both" || (item.reportType == "trans" && props.report == "trans") || (item.reportType == "user" && props.report == "user")){
                  return (<MultiSelectCheckbox
                      Label={item.label?item.label:''} 
                      Name={item.name?item.name:''}
                      disabled = {item.disable}
                      isRequred={item.isRequired}
                      colWidth={item.styles ? item.styles.colWidth : ''}
                      dynamicSelect={item.dynamicSelect}
                      placeholder={item.placeholder}
                      Options = {item.options}
                      lookupReference={item.dynamicSelect ? item.lookupReference : null}
                      handleChange={(e)=>props.handleChange(e,item)}
                      //checked={item.name==='location'?true:true}
                      handleBlur={(e)=>props.handleBlur(e,item)}
                      dependentField = {item.dependentField}
                      dependentFieldVal = {props.companyName?props.companyName:''}
                      removeFormData = {props.removeFormData?()=>props.removeFormData(item,true):''}
                      styles={item.styles}
                      selectAll ={props.selectAll}
                      formDataSet={formDataSet && formDataSet[item.name] ? formDataSet[item.name] :item.defaultValue ? item.defaultValue : ''}
                      />)   
                }else{
                      return('')
                }
            case "BUTTON":
                if(!item.shouldNotRender){
                return (<ButtonComponent
                    Label={item.label}
                    Type={item.type}
                    className={item.styles.className}
                    variant={item.variant}
                    disabled={false}
                    handleClick={(e) => props.onClickSubmit(e,item)}
                     />)
                }
        };
    } 

    return (
        <div className='bf-report-filter-container'>
          {props.jsonData && 
            <div className='row'>
                    { props.jsonData.ReportCriteriaFields.map((item, sectionIndex) => (<>
                                    {
                                      item.component != "button" ? getOperatorFields(item) : ''
                                    }
                                    </>)
                    )}
                    <div className='bf-btn-section'>
                    { props.jsonData.ReportCriteriaFields.map((item, sectionIndex) => (<>
                                    {
                                      item.component == "button" ? getOperatorFields(item) : ''
                                    }
                                    </>)
                    )}
                    </div>
            </div>
                  }
        </div>
      )

}