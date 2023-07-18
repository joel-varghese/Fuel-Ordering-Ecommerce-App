import ReactSelect, { components } from "react-select";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { lookupService } from '../../services/commonServices'
import { useState, useEffect } from 'react';
import './multiSelectCheckbox.scss';
import makeAnimated from "react-select/animated";
import { getAllLocationTax } from '../../actions/taxFees/taxFeesHomeActions';
import { useDispatch} from 'react-redux';
import { Loader } from "react-bootstrap-typeahead";



const allOption = {
  label: "Select all",
  value: "*"
};

const ValueContainer = ({ children, ...props }) => {
  const currentValues = props.getValue();
  let toBeRendered = children;
  if (currentValues.some(val => val.value === allOption.value)) {
    toBeRendered = [[children[0][0]], children[1]];
  }

  return (
    <components.ValueContainer {...props}>
      {toBeRendered}
    </components.ValueContainer>
  );
};

const MultiValue = props => {
  let labelToBeDisplayed = `${props.data.label}, `;
  if (props.data.value === allOption.value) {
    labelToBeDisplayed = "All is selected";
  }
  return (
    <components.MultiValue {...props}>
      <span>{labelToBeDisplayed}</span>
    </components.MultiValue>
  );
};
const animatedComponents = makeAnimated();

// const colourOptions = [
//     { value: "ocean1", label: "Ocean" },
//     { value: "blue", label: "Blue" },
//     { value: "purple", label: "Purple" },
//     { value: "red", label: "Red" },
//     { value: "orange", label: "Orange" },
//     { value: "yellow", label: "Yellow" },
//     { value: "green", label: "Green" },
//     { value: "forest", label: "Forest" },
//     { value: "slate", label: "Slate" },
//     { value: "silver", label: "Silver" }
//   ];
const MultiSelectCheckbox = props => {
  const [optionList, setOptionList] = useState([]);
  const [resOptions, setResOptions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedArray, setSelectedArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  let dispatch = useDispatch()
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
		else {setOptionList(props.Options)
      setIsLoading(false);
      let selectOptions = props.Options.map(value => value.value);
      
          setResOptions(selectOptions)
    }
	  }, [props.Options])

    useEffect(() => {
      removeVal(resOptions);
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
      if(props.formDataSet && props.removeFormData && options.length){
        let data = props.formDataSet;
        let check = true;
        let selected=[]
        let dataArr = data && data.length && data.map( item => {
          selected.push(item)
          return item.toLowerCase();
        })
        let optArr = options && options.length && options.map( item => {
          return item.toLowerCase();
        })
        dataArr && dataArr.forEach(item => {
          if(!optArr.includes(item)){
             check = false;
             return props.removeFormData();
          }
        })
        if(check){
          getFinalVal()
        }
      setSelectedArray(selected)
        
      }
    }

    const lookupApiCall = (requestData) => {
      const getOption = async () => {
        let isLocation = (props.lookupReference.name == "location") ? true : false;
				let res = await lookupService(requestData);
        let options=[];
				if(res && res.body){
          let body=JSON.parse(res.body);
          if(props.selectAll  && body.length && body.length != 1){
              body.push("All the Above")
            }
          setResOptions(body);
          body.map((val,index)=>{
            let comp={};
            comp.value=val;
            comp.label=val;
            options.push(comp);
          })
          if(options.length && props.isAdmin && isLocation){
            let filteroptions=[]
            let opt = []
            options.forEach((val)=>{
              if(props.filterLocation.includes(val.value)){
                let comp={};
                opt.push(val.value)
                comp.value=val.value;
                comp.label=val.value;
                filteroptions.push(comp)
              }
            })
            if(props.selectAll && filteroptions.length && filteroptions.length != 1){
              let comp={};
              comp.value="All the Above";
              comp.label="All the Above";
              filteroptions.push(comp)
              opt.push("All the Above")
            }
            setOptionList(filteroptions)
            setIsLoading(false);
            setResOptions(opt);
          }else{
            setOptionList(options);
            setIsLoading(false);
            removeVal(body)
          }
        }
			}
			getOption();
    }

    const handleChange = (e) =>{
      if(props.selectAll){
      let newArr = [];
        let allTheAbove = e.filter(x => x.value == 'All the Above')
        let selected = e.filter(x => x.value != 'All the Above')
        let selectedArr = []
        if(selected && resOptions && resOptions .length && selected.length && selected.length == resOptions?.length-1){
          if(!selectAll){
            selected.forEach((item)=>{
              selectedArr.push(item.value)
              newArr.push({value:item.value,label:item.label})
            })
            selectedArr.push('All the Above')
            newArr.push({value:"All the Above",label:"All the Above"})
            setSelectAll(true)
          }else if (selectAll && allTheAbove && !allTheAbove.length ){
            newArr= []
            selectedArr=[]
            setSelectAll(false)
          }
        }
        else if (selected && resOptions && resOptions.length && selected.length && selected.length < resOptions?.length-1){
          if(allTheAbove && allTheAbove.length && !selectAll){
            resOptions.forEach((item)=>{
              selectedArr.push(item)
              newArr.push({value:item,label:item})
            })
            setSelectAll(true)
          }else{
            selected.forEach((item)=>{
              selectedArr.push(item.value)
              newArr.push({value:item.value,label:item.label})
            })
            setSelectAll(false)
          }
        }else if(!selected.length && allTheAbove && allTheAbove.length ){
          resOptions.forEach((item)=>{
            selectedArr.push(item)
              newArr.push({value:item,label:item})
          })
          setSelectAll(true)
        }
        else{
          newArr = e
        }
        setSelectedArray(selectedArr)
        let filteredArray = newArr.filter(x => x.value !== 'All the Above')

       props.handleChange(newArr)
     }else
      props.handleChange(e)
    }
    const Option = (props) => {
      return (
        
        isLoading ?   <Loader  height="auto" /> : 
        <div>
          <components.Option {...props} className="bf-multiselect">
            <input
              type="checkbox"
              checked={props.selectAll ? selectedArray.length && selectedArray.includes(props.label) :props.isSelected}
              onChange={() => null}
            />{" "}
            <label className="multi-select-label" title={props.label}>{props.label}</label>
          </components.Option>
        </div>
      );
    };
    const getFinalVal = () => {
      let currentOpt = props.formDataSet;
      let selected = []
      let lowerCurrOpt = currentOpt && currentOpt.length && currentOpt.map( item => {
        return item.toLowerCase();
      })
      let dummyArr = [];
      resOptions && resOptions.length && resOptions.forEach( item => {
        let itemLower = item.toLowerCase();
        let dummyObj = {}
        if(lowerCurrOpt && lowerCurrOpt.length && lowerCurrOpt.includes(itemLower)){
          dummyObj.value=item;
          dummyObj.label=item;
          selected.push(item)
          dummyArr.push(dummyObj);
        }
      })
      return dummyArr;
    }
    
    return(<>{!props.checked &&
        <Form.Group as={Col} md={props.colWidth} className={`${props.styles ? props.styles.className : ''} mb-4 bf-mc-mtn2`} controlId="formBasicEmail">
            <Form.Label>{props.Label} {props.isRequred ? <span className='bf-required'>*</span> : ''}</Form.Label>
    <ReactSelect
        options={optionList}
        isClearable={false}
        isMulti ={true}
        placeholder={props.placeholder}
        closeMenuOnSelect={false}
        closeMenuOnScroll={e => {
          if (e.target.className === "bf-report-filter-container") {
            return true
          } else {
            return false
          }
        }}
        isDisabled={props.disabled}
        hideSelectedOptions={false}
        components={{
          Option
        }}
        isLoading = {isLoading}
        styles={{
          valueContainer: (provided, state) => ({
            ...provided,
            maxWidth: "100%",
            maxHeight:"36px",
            overflowY: "scroll"
          }),
          option: (styles, {isFocused, isSelected}) => ({
            ...styles,
            color : isFocused
            ? '#051B2E'
            : isSelected
                ? '#051B2E'
                : undefined,
            background: isFocused
                ? '#fff'
                : isSelected
                    ? '#fff'
                    : undefined,
            zIndex: 1
        }),
          menuPortal: provided => ({ ...provided, zIndex: 9999999 }),
          menu: provided => ({ ...provided, zIndex: 9999999 }),
        }}
        menuPortalTarget={document.body}
        menuPosition={'fixed'}
        onChange={(e)=>handleChange(e)}
        allowSelectAll={true}
        name={props.Name}
        value={getFinalVal(props.formDataSet)}
        className={`${props.errorMessage!=null ? 'bf-multiselect-error' : ''} ${props.formDataSet && props.formDataSet.length && props.formDataSet.includes("All the Above")? 'bf-multiselect-hide-all' : ''} bf-multi-select-checkbox`}
    />
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
    </Form.Group>}</>)
}
export default MultiSelectCheckbox;
  