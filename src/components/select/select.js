import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { lookupService} from '../../services/commonServices'
import { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import iIcon from '../../assets/images/info-icon.png'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Storage, jsonStringify } from '../../controls/Storage';
import { useSelector } from 'react-redux';
import { roleWiseOptionInt, roleWiseOption } from '../../controls/commonConstants';
import Loader from '../loader/loader';

const Select = props => {
	const [optionList, setOptionList] = useState([]);
	const [val, setval] = useState(props.formDataSet);
	const [isLoading, setIsLoading] = useState(true);
	const accountHomeReducer = useSelector((state) => state.accountHomeReducer);
  	const selectedUser = accountHomeReducer && accountHomeReducer.selectedUser && accountHomeReducer.selectedUser;
	useEffect(() => {
		if(props.dynamicSelect === true){
			let depField = props.dependentField;
			let depFieldVal = props.dependentFieldVal;
			let lookupVariable = props.lookupReference.name;
			let requestData = {
				"serviceName" : lookupVariable
			}
			if(depField){
				let headers = {};
				headers[depField] = depFieldVal
				requestData["headers"] = headers;
			}
			lookupApiCall(requestData);
		}
		else {
			setOptionList(props.Options)
			setIsLoading(false)
		}
	}, [props])
	  

	useEffect(() => {
		if(props.formDataSet){
			removeVal(optionList);
			setval(props.formDataSet);
		}
		if(!props.formDataSet) setval("");
	}, [props.formDataSet])

	useEffect(() => {
		if(props.dependentFieldVal){
			let depField = props.dependentField;
			let depFieldVal = props.dependentFieldVal;
			let headers = {};
			headers[depField] = depFieldVal
			let lookupVariable = props.lookupReference.name;
			let requestData = {
			"serviceName" : lookupVariable,
			}
			requestData["headers"] = headers;
			lookupApiCall(requestData);
		}
	}, [props.dependentFieldVal])
	
	const removeVal = (options) => {
		if(props.formDataSet && props.removeFormData && options.length && !options.includes(props.formDataSet)){
			props.removeFormData();
		}
	}
	const lookupApiCall = (requestData) => {
		const getOption = async () => {
			let res = await lookupService(requestData);
			let isAdmin = props.isAdmin;
			let isLocation = (props.lookupReference.name == "location") ? true : false;
			let selectedAccess = selectedUser.user == "internal" ? true :false;
			let filterfuel=props.filterfuel;
			let isAccessLevels = (props.lookupReference.name == "accessLevels" || props.lookupReference.name == "fuelServices") ? true : false;
			let optionData = [];
			if(res && res.body) {
				optionData = JSON.parse(res.body);
			}else {
				optionData = res;
			}
			if(optionData.length && (isAdmin || selectedAccess) && isAccessLevels){
				let index = optionData.findIndex(item => item === "Level 1 (Admin)");
				optionData.splice(index,1);
			}
			if(optionData.length && filterfuel && isAccessLevels){
				optionData = optionData.filter((item)=>item!='100LL')
			}
			if(optionData.length && props.isAdmin && isLocation){
				let filteroptions=[]
				let opt = []
				optionData.forEach((val)=>{
				  if(props.filterLocation.includes(val.value)){
					let comp={};
					opt.push(val.value)
					comp.value=val.value;
					comp.label=val.value;
					filteroptions.push(comp)
				  }
				})
				optionData = filteroptions
			}
			let optionDataupdated = optionData.map(item => item.trim())
			setOptionList(optionDataupdated);
			setIsLoading(false);
			removeVal(optionData);
			
		}
		getOption();
	}

	  const renderTooltip = (tooltipInfo) => (
        <Tooltip id="button-tooltip" {...tooltipInfo}>
          {parse(tooltipInfo.text)}
        </Tooltip>
      );
	 
	  const handleValChange = (e) => {
        setval(e.target.value);
        props.handleChange(e);
    } 
	const getOptionAsRole=(option,data)=>{
			
		if(props.accessLevel && props.accessLevel){
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

    return (<>
        {!props.checked &&
        <Form.Group as={Col} md={props.colWidth} className={`mb-4 ${props.className ? props.className : ''} ${isLoading ? 'bf-relative' : '' }`} controlId="formBasicEmail">
			<div className='d-flex d-flex-row align-items-center justify-content-between'>
            <Form.Label>{props.Label} {props.isRequred ? <span className='bf-required'>*</span> : ''}</Form.Label>
			{props.infoText ?<span className='bf-more-info bf-pointer' onClick={() => props.addinfo()}>{props.infoText}</span> : null}
				{props.tooltip && props.tooltip.text ? 
					<OverlayTrigger
						placement={Storage.getItem('jwtToken')?"left":"right"}
						delay={{ show: 250, hide: 400 }}
						overlay={renderTooltip(props.tooltip)}
						text={"abcd"}
						>
							<img src={iIcon} tabIndex="" alt="Tooltip icon"/>
					</OverlayTrigger> : ""
				}
			</div>
			<Form.Select aria-label="Default select example" name={props.Name} value={props.formDataSet}
				onChange={(e) => handleValChange(e)}
				onBlur={props.handleBlur} 
				disabled={props.disabled}
				className={`${props.errorMessage!=null || props.borderRed ? 'bf-error-border' : ''} ${(val == '' || val == undefined) ? 'placeholder-clr' : ''} ${isLoading ? 'bf-loading-options' : ''}`}
				>
					
					<option key = 'blankChoice' hidden value = ""> {props.formDataSet ? props.formDataSet : props.Placeholder}</option>
					{isLoading ? <option className='bf-loading-options' disabled value=''>Loading Options...</option> : <>
					{ (props.dynamicSelect && optionList &&  optionList.length) ? (optionList
						.map((
							option,
							optionIndex
						) => {
							let dataOption = getOptionAsRole(option);
							return (
								<option
									value={
										option
									}
									className="bf-default-clr"
									key={
										`${props.Name}-option-${optionIndex}`
									}
								>{dataOption}</option>
							);
						})) :
						(optionList && optionList.length && optionList
						.map((
							option,
							optionIndex
						) => {
							return (
								<option
									value={
										option.value
									}
									className="bf-default-clr"
									key={
										`${props.Name}-option-${optionIndex}`
									}
								>{option.title}</option>
							);
						}))
					}</>
				}
            </Form.Select>
			{isLoading ? <div className='bf-select-loading'><Loader height="15px"/></div> : null }

			{
            props.fieldError ? (
                <Form.Text className="bf-error-message">
                    <span>
                        {props.errorMessage}
                    </span>
                </Form.Text>
            )
                : ''
        }
        </Form.Group>}
		</>);
}
export default Select;