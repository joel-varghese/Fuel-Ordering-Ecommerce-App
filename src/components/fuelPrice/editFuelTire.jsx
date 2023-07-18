import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import { fuel_Types } from '../../controls/commonConstants';
//import SupportingDocuments from './supportingDocuments';
import logo from '../../assets/images/barrel_fuel_logo.png'
import '../fboSignup/FboSignupForm.scss'

import Input from '../input/input';
import Select from '../select/select';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import Subheading from '../subHeading/subHeading';
import Checkbox from '../checkbox/checkbox';
import CustomModal from '../customModal/customModal';
import Container from 'react-bootstrap/Container';
import $ from 'jquery'; 
import { Storage, jsonStringify } from '../../controls/Storage';
import { saveFuelTirePrice } from '../../actions/fuelPriceHome/fuelPriceHomeActions';
import { useDispatch, useSelector } from 'react-redux';
import { insertFBODefaultFuelPrice} from '../../actions/OperatorFboService/operatorFboService';
import { validateAmount } from '../../controls/validations';
import {saveAuditLogData } from '../../actions/auditLog/auditLogActions';

function EditFuelTire(props) {
    const [operatorSignup, setoperatorSignupForm] = useState({});
    const [formDataSet, setformDataSet] = useState({});
    const [formErrors, setformErrors] = useState({});
    const [isBusy, setBusy] = useState(true);
    const [passwordError , setPasswordError] = useState({});
    const [fuelTireInfo, setFuelTireInfo] = useState([]);
    const [fuelTireInfoReview, setFuelTireInfoReview] = useState([]);
    const [fuelTireError, setFuelTireError] = useState([]);
    const [fuelTypes, setFuelTypes] = React.useState(fuel_Types);
    const [refresh, setRefresh] = useState(false);
    const [validDate,setValidDate] = useState("")
    const dispatch = useDispatch();
    let paylod = { 'blobname': 'AccountCompanyDetails.json' }
        
    useEffect(() => {
        let arrayField = [["",'Select Tiers', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5', 'Tier 6', 'Tier 7']];
        let fuelTireError = [[]]
        setValidDate(getValidDateRange(props.deactivateData.wholeData.FPValidDate))
        props.deactivateData.accordion.map((item, index)=>{
            if(index !==0 && Object.keys(item).length >0){
            let fuelData = []
            let fuelDataError = []
            Object.keys(item).map((data, index)=>{
               let tireData = []
                if(index !==0 && index !==1){
                    if(index ===2){
                        let value = item[data].split('-')
                        fuelData.push(value[0])
                        fuelDataError.push(false)
                        //fuelData.push(value[1])
                    } else {
                    if(item[data]!== null){
                        let value = item[data].split('-')
                        if(value[1] !== 'null'){
                            fuelData.push(parseInt(value[0] -1))
                        } else {
                            fuelData.push(parseInt(value[0]))
                        }
                        fuelDataError.push(false)
                    }
                    }
                } else {
                    fuelData.push(item[data])
                    fuelDataError.push(false)
                }
              
            })
          for(let i=fuelData.length; i < 9 ; i++) {
            fuelData.push(null)
            fuelDataError.push(false)
           }
            arrayField.push(fuelData)
            fuelTireError.push(fuelDataError)
        }
        })
        setFuelTireInfo(arrayField)
        setFuelTireError(fuelTireError)
        setBusy(false);
          
  }, []);

   useEffect(() => {
    //setFuelTireInfo(fuelTireInfo)
  },[refresh]) 

  const getValidDateRange =(validDate) =>{
    let today = null
    if(validDate){
        today = new Date(validDate);
    } else {
        today = new Date();
    }
    
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return mm + '/' + dd + '/' + yyyy;
  }

    const addOrRemoveTires =(event, item)=>{
        let fuelTireData = [...fuelTireInfo];
        let selectedValue = event.target.value; 
        let count = 0
        fuelTireData.map((data, index)=>{
            if(data[0] === item){
                let finalData = []
              //  data.map((internalData, indexes) =>{
                
                selectedValue = parseInt(selectedValue);
                
                let j =0;
                 for(let i=0; i < 9 ; i++) {
                   // if(selectedValue > count){
                        
                        if(i === 0){
                            
                            finalData[i] = data[i]
                        } else if(i === 1) {
                            if(selectedValue > 1){
                                finalData[i] = true
                            } else{
                                finalData[i] = false
                            }
                            
                        } else{
                            if(selectedValue == 1){
                                finalData[i] = null;
                            }else{
                                finalData[i] = j<selectedValue ? fuelTireData[index][i]?fuelTireData[index][i]:0: null;
                            }
                            j++;
                        }
                    //}
              //  }) 
                
               
                    }
                    fuelTireData[index]= finalData 
            }
            count ++;
        })
        
        setFuelTireInfo(fuelTireData)
        setRefresh(!refresh)
    }

    const SelectBasicExample =(item, value) => {
        if(item[0] === "100LL"){
            return (
                <Form.Select value={value} aria-label="Default select example" onChange={(e)=>addOrRemoveTires(e, item[0])}>
                  <option value="1">Flat</option>
                  <option value="2">2 Tiers</option>
                  <option value="3">3 Tiers</option>
                  <option value="4">4 Tiers</option>
                </Form.Select>
              );
        }else {
            return (
                <Form.Select value={value} aria-label="Default select example" onChange={(e)=>addOrRemoveTires(e, item[0])}>
                  <option value="1">Flat</option>
                  <option value="2">2 Tiers</option>
                  <option value="3">3 Tiers</option>
                  <option value="4">4 Tiers</option>
                  <option value="5">5 Tiers</option>
                  <option value="6">6 Tiers</option>
                  <option value="7">7 Tiers</option>
                </Form.Select>
              );
        }
        
      }
      const onBlur = (e, item, index, count) =>{
        let target = e&&e.target
        let fuelTireData = fuelTireInfo;
        let fuelTireErrorData = fuelTireError;
        let tierValue = target.value.replace(/(?!-)[^0-9]/g, "")
        fuelTireData[count][index] = tierValue
        let targetData = tierValue
        let counter = 1
        fuelTireData[count].map((itemdata, index) => {
            if(index > 1 && itemdata !== null){
                counter ++
            }
        })
        if(e.target.value !== ''){
        if(index === 2){
            if(parseInt(targetData) > parseInt(fuelTireData[count][index + 1]) ){
                fuelTireErrorData[count][index] = true
                fuelTireErrorData[count][index +1] = true
            } else{
                fuelTireErrorData[count][index] = false 
                fuelTireErrorData[count][index +1] = false 
            }
        } else if(index === counter){
            if(parseInt(targetData) < parseInt(fuelTireData[count][index - 1]) ){
                fuelTireErrorData[count][index] = true
                fuelTireErrorData[count][index -1] = true
            } else{
                fuelTireErrorData[count][index] = false 
                fuelTireErrorData[count][index -1] = false 
            }
        } else if(parseInt(fuelTireData[count][index-1]) > parseInt(targetData) ){
              fuelTireErrorData[count][index] = true
              fuelTireErrorData[count][index -1] = true
        }else if(parseInt(targetData) > parseInt(fuelTireData[count][index + 1])){
            fuelTireErrorData[count][index] = true
            fuelTireErrorData[count][index +1] = true
            fuelTireErrorData[count][index -1] = false         
        } else {
            fuelTireErrorData[count][index +1] = false
            fuelTireErrorData[count][index] = false
            fuelTireErrorData[count][index -1] = false
        } 
    } else{ 
        fuelTireErrorData[count][index] = true
    }
    
//   }
         setFuelTireInfo(fuelTireData)
         setFuelTireError(fuelTireErrorData)
         setRefresh(!refresh)
      }

      const onChange = (e, item, index, count) =>{
        let target = e&&e.target
        let fuelTireData = fuelTireInfo;
        let fuelTireErrorData = fuelTireError;
        // target.value = target.value.replace(/(?!-)[^0-9.]/g, "" )
        // if(!e.target.value.match(/^[0-9]+$/))
        // {
        //     fuelTireErrorData[count][index] = true
        // } else{
        let tierValue = validateAmount(formDataSet, target.value)
        fuelTireData[count][index] = tierValue
        setFuelTireInfo(fuelTireData)
        setFuelTireError(fuelTireErrorData)
        setRefresh(!refresh)
      }

      const InpurBasicExample =(data, item,index, count, disabled) => {
        return (
            <Form.Control 
            error 
            name="" 
            type="text" 
            placeholder="" 
            //id={data} 
            defaultValue={data} 
            onChange={(e)=>onChange(e, item, index, count)}
            onBlur={(e)=>onBlur(e, item, index, count)}
            disabled={disabled}
            value={data}
            />
        );
      }

      const validateData = () =>{
        let errorCount = []
        fuelTireError && fuelTireError.map((item)=>{
            item.map((data)=>{
                if(data === true){
                    errorCount.push(data) 
                }
            })
        })
        return errorCount;
      }

      const submitData = () =>{
        let isValid = validateData();
        if(isValid.length ===0){
            
            let arrayField = [["",'Tier1', 'Tier2', 'Tier3', 'Tier4', 'Tier5', 'Tier6', 'Tier7']];
            fuelTireInfo.map((item,count)=>{
                let fuelData = []
                if(count !== 0){
                item.map((data,index)=>{
                    if(index !==0 && index !==1){
                        
                        if(index ===2){
                           // let value = item[data].split('-')
                           if(fuelTireInfo[count][index+1] !== undefined && fuelTireInfo[count][index+1] !== null) {
                            fuelData.push(fuelTireInfo[count][index]+" - "+ fuelTireInfo[count][index+1])
                            } else{
                                fuelData.push("")
                            }  
                            //fuelDataError.push(false)
                            //fuelData.push(value[1])
                        } else {
                            //let value = item[data].split('-')
                            if(fuelTireInfo[count][index+1] !== undefined && fuelTireInfo[count][index+1] !== null) {
                                fuelData.push(parseInt(fuelTireInfo[count][index])+1+" - "+ fuelTireInfo[count][index+1])
                            } else{
                                if(fuelTireInfo[count][index] !== undefined && fuelTireInfo[count][index] !== null) {
                                    fuelData.push(fuelTireInfo[count][index]+"+")
                                } else {
                                    fuelData.push(null)
                                }
                                
                            }
                            //fuelDataError.push(false)
                        }
                    } else {
                        fuelData.push(fuelTireInfo[count][index])
                        //fuelDataError.push(false)
                    }
                })
                arrayField.push(fuelData)
            }
                
            }) 
            setFuelTireInfoReview(arrayField)
            setRefresh(!refresh)
        } else {
            console.log("Error")
            props.setValidFieldIssue(true)
            
        }
        
      }
      const modiFyData = () =>{
        setFuelTireInfoReview([])
        props.setValidFieldIssue(false)
        setRefresh(!refresh);
      }

      const createSingleTire = (data, count, PricingType) =>{
        let tireData = null;
    if(PricingType === true){
    let tiredRange = []
    if(data !== null){
       tiredRange = data.split("-")
    }

        if(tiredRange[0] !== "" && tiredRange[1] !== "" && data !== null){
        tireData ={
            "Name": "Tier "+count,
            "MinRange": tiredRange[0] && tiredRange[0].replace("+","").trim(),
            "MaxRange": tiredRange[1] && tiredRange[1].replace("+","").trim(),
        }
          //return tireData
        }
    } else{
        if(count === 1){
        tireData ={
            "Name": "flat",
            "MinRange": 0,
            "MaxRange": 0            
          }
          
        }
        
    }
        return tireData;
      }
      const getName = (data) =>{
        switch(data){
            case 'Jet-A':
            return 'Jet A'
            case '100LL' :
            return '100LL'
            case 'Prist':
            return  'Jet A+ / Prist'
            case 'SAF':
            return  "Sustainable Aviation Fuel (SAF)"          
        }
      }

      const createTireArray = (data) =>{
        let finalFuelTire = {"Name" :"","PricingType":"","Tiers":[]};
        let tireCount = 1;
        let PricingType = null
        let array = ['Jeat A','100LL','Jet A+ / Prist','Sustainable Aviation Fuel (SAF)']
        data.map((item, index)=>{
            if(index === 0){
                finalFuelTire["Name"] = getName(item);
            } else if(index === 1){
                finalFuelTire["PricingType"] = item?"Tiered":"flat";
                PricingType = item
            } else{
                //if(finalFuelTire["PricingType"] === true) {
                        let data = createSingleTire(item, tireCount, PricingType)
                    if(data !== null){
                        finalFuelTire.Tiers.push(data)
                    }
            /* } else {
                finalFuelTire[0].Tiers.push(createSingleTire(item, tireCount, finalFuelTire["PricingType"]))
            } */
                tireCount ++;
            }
        })
         return finalFuelTire;
      }
      const submitFinalData = () =>{
        let finalTiredData = {"FBO" : Storage.getItem('organizationName'),
        "CreatedBy": Storage.getItem('email'),
        "AirportLocation":[{"Location":props.deactivateData.location,"FuelTypes":[]}]}
        fuelTireInfoReview.map((item, count)=>{
            
            if(count !== 0){
               
                finalTiredData['AirportLocation'][0].FuelTypes.push(createTireArray(item))
               
            }
        })
        finalTiredData['AirportLocation'].Location = props.deactivateData.location
        saveFuelTirePrice(finalTiredData, dispatch).then((response)=>{
            let auditPayload = {"ModuleName":"Fuel Price",
                              "TabName":"Location",
                              "Activity":"Fuel Tire Updated For "+props.deactivateData.location,
                              "ActionBy":Storage.getItem('email'),
                              "Role":JSON.parse(Storage.getItem('userRoles')),
                              "Organization":Storage.getItem('organizationName') !=='undefined'?Storage.getItem('organizationName'):"null"}
                saveAuditLogData(auditPayload, dispatch)

            props.hidePopup();
        })
        
      }

      const getParagraph = (label) => {

        return (<>
            <Subheading label={label}
                isEditable={false}
                EnableEdit={false}
                isAccessAble={true}
            /></>

        )
    }

    return (
        <div >
            {isBusy?(<p>Loading</p>):(
             fuelTireInfoReview.length === 0 ?
             
             <Container>{getParagraph(props.labelData[0].EditLable+"-"+props.deactivateData.location)}{fuelTireInfo.map((item, count)=>{
                    let counter = 0;
                    item.map((item, index)=>{
                        if(index > 1 && item !== null){
                            counter ++;
                        }
                    })
                    return(<Row className={`mb-3 bf-tiers-heading ${count == 0 ? 'bf-tiers-heading-row' : ''}`}>{
                    item.map((data, index)=>{
                        
                        if(count === 0){
                            return(<Col className={data == '' ? 'bf-empty-head' : ''}> {data}</Col>)
                        } else{
                            if(index === 0){
                                return(<Col>{data}</Col>)
                            } else if(index === 1){
                                if(data){
                                return(<Col>{SelectBasicExample(item, counter)}</Col>)
                                } else {
                                    if(fuelTypes.indexOf(item[index -1]) !== -1){
                                        return(<Col>{SelectBasicExample(item, 0)}</Col>)
                                    }else{
                                        return(<Col>{InpurBasicExample("Flat", item, index, count, true)}</Col>)
                                    }
                                    
                                }
                            } else{

                                return(<Col className={fuelTireError[count][index]?'bf-error-border':""}>{data !== null ?InpurBasicExample(data, item, index, count, index ===2 ?true:false):InpurBasicExample("-", item, index, count, true)}</Col>)
                            }
                    }
                        
                    })
                }</Row>)
                
             })}
             
             {props.validFieldIssue?<Row className="mb-3" ><Col className='bf-verify-text'>Please verify. A required field is missing information</Col></Row>:null}
             {<Button className="mb-4" as="input" type="submit" value={props.labelData[0].submit} onClick={()=>submitData()} />}
             </Container> :  <Container>
                {getParagraph(props.labelData[0].verifyFuelTiers+"-"+props.deactivateData.location)}{fuelTireInfoReview.map((item, count)=>{
                let fuelType = null;
                    return(<Row className={`mb-3 bf-edit-tiers-view ${count == 0 ? 'bf-tiers-heading-row' : ''}`}>{
                    item.map((data, index)=>{
                        
                        if(count === 0){
                            return(<Col className={data == '' ? 'bf-empty-head' : ''}>{data}</Col>)
                        } else{
                            if(index === 0){
                                return(<Col>{data}</Col>)
                            } else if(index === 1){
                                fuelType = data
                            } else{
                                if(fuelType){
                                    return(<Col className={data !== null ? 'bf-view-edit-tire' : ''}>{data !== null ?data:""}</Col>)
                                } else {
                                    if(index ===2){
                                        return(<Col className={data === '' ? 'bf-view-edit-tire' : ''}>{data === ''?"Flat":""}</Col>)
                                    } else {
                                        return(<Col>{""}</Col>)
                                    }
                                }
                                
                            }
                    }
                        
                    })
                }</Row>)
                
             })}
             {<Row className="mb-3" ><Col className='bf-verify-text'>{`${props.labelData[0].confirmMessage}${validDate}.`}</Col></Row>}
             {<><Button className="mb-4 bf-btn-mrgr5" as="input" type="submit" value={props.labelData[0].confirm} onClick={()=>submitFinalData()} /> <Button className="mb-4 btn-bf-secondary bf-btn-clear" as="input" type="Submit" value={props.labelData[0].modify} onClick={()=>modiFyData()} /></>}
             </Container>
                                       
            
                 
     
                )}

        </div>
      );
}

export default EditFuelTire;