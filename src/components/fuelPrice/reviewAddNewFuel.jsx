import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import ButtonComponent from '../button/button';
//import SupportingDocuments from './supportingDocuments';
import logo from '../../assets/images/barrel_fuel_logo.png'
import '../fboSignup/FboSignupForm.scss'

import Input from '../input/input';
import Select from '../select/select';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import Subheading from '../subHeading/subHeading';
import Checkbox from '../checkbox/checkbox';
import CustomModal from '../customModal/customModal';
import { useDispatch, useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import { ButtonGroup } from 'react-bootstrap';
function ReviewAddNewFuel(props) {

    const [operatorSignup, setoperatorSignupForm] = useState({});
    const [formDataSet, setformDataSet] = useState({});
    const [formErrors, setformErrors] = useState({});
    const [isBusy, setBusy] = useState(true);
    const [passwordError , setPasswordError] = useState({});
    const [flightInfo, setflightInfo] = useState({});
    const [modalShow, setModalShow] = useState(false);
    const fuelPriceHomeReducer = useSelector((state) => state.fuelPriceHomeReducer);
    const jsonData = fuelPriceHomeReducer && fuelPriceHomeReducer.adNewFuelJson && fuelPriceHomeReducer.adNewFuelJson;
    const [fieldList, setFieldList] = useState([jsonData && jsonData.data && jsonData.data.data && jsonData.data.data.addNewFuel]);
    const handleClick =(e,item) =>{
        
           props.submitData(item.name); 
        

    }
    useEffect(() => {
        //fetchJSONData(paylod, dispatch)
        //setBusy(true);
    }, []);
    
    const getName = (data) =>{
        switch(data){
            case 'Jet A':
                return 'Jet-A'
            case '100LL' :
                return '100LL'
            case 'Jet A+ / Prist':
                return  'Prist'
            case 'Sustainable Aviation Fuel (SAF)':
                return  "SAF"          
        }
     }
    
    const getTiredData = (item) =>{
        let name = item.Name?item.Name:''
        let count = 0;
        let  array = [];
        for(let i=0; i< 7; i++){
             if(item.Tiers[i]){
            array.push(item.Tiers[i].PreTaxPrice)
            } else {
                array.push("-")
            } 
        }
        return(
            <Row className="bf-tirs-list">
                <Col>{getName(name)}</Col>


                {   array.map((data)=>{
                    return(<Col className={`${data != '-' ? 'bf-tirs-value' : ''}`}>{data !== '-'?parseFloat(data).toFixed(2):""}</Col>)
                        count ++
                    })
                
                }
                                
            </Row>
        )
    }
    const getOperatorFields2 = (item, index, flag) => { 
        switch (item.component.toUpperCase()) {
            
            case "INPUT":

                return (<Input
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    Label={item.label}
                    data-label={item.label}
                    Name={item.name}
                    id={item.id}
                    disabled={true}
                    Placeholder={item.placeholder}
                    isRequred={false}
                                      
                    styles={item.styles}
                    tooltip={item.tooltip}
                    
                />)
           

            case "BUTTON":
                    return (<ButtonComponent
                        Label={item.label}
                        Type={item.type}
                        Name={item.name}
                        className={item.styles.className}
                        disabled={false}
                        handleClick={(e) => handleClick(e, item, index)} />)
                

            case "PARAGRAPH":
                let array = []
                return (<>
                    <Subheading label={item.label +props.location}
                        isEditable={false}
                        EnableEdit={false}
                        isAccessAble={true}
                    /></>

                )
            
        };
    }
    return ( 
        <div >
            {false?(<p>Loading</p>):(
            
             props.addNewUser ?
             <div className='bf-review-tirs-section' >{ 
                <>
                    {getOperatorFields2(fieldList[0][0].sections.subSections[3].reviewFinalPrice[0])
                    }
                    <div className='bf-review-tirs-container'>
                        {
                            <Row className='bf-review-tirs-label'>
                                <Col></Col>
                                <Col>Tier 1</Col>
                                <Col>Tier 2</Col>
                                <Col>Tier 3</Col>
                                <Col>Tier 4</Col>
                                <Col>Tier 5</Col>
                                <Col>Tier 6</Col>
                                <Col>Tier 7</Col>
                            </Row>
                            
                        }
                        
                        {props.DataForReview.AirportLocation[0].FuelTypes.map((item)=>{
                            return(getTiredData(item))
                        })}
                    </div>
                    {<Row className="mb-3" ><Col className='bf-verify-text'>{fieldList[0][0].sections.subSections[3].reviewFinalPrice[2].Lable}</Col></Row>}
                    <div className='bf-verify-tire-buttons'>
                        {fieldList[0][0].sections.subSections[3].reviewFinalPrice[1].buttons.map((item)=>{
                            return(<ButtonGroup>
                                {getOperatorFields2(item)}
                            </ButtonGroup>)
                            })
                        }
                    </div>
                </>}


                <> </>
                </div> :
                <div className="bf-review-fuel-price">
                    {<Row className="mb-3" ><Col className='bf-verify-text'>{fieldList[0][0].sections.subSections[5].editReview[1].lable}</Col></Row>}
                    {fieldList[0][0].sections.subSections[5].editReview[0].buttons.map((item)=>{
                     return(<ButtonGroup>
                        {getOperatorFields2(item)}
                    </ButtonGroup>)
                    })
                    
                }
                
                </div>
                                       
            
                 
     
                )}

        </div>
      );
}
export default ReviewAddNewFuel;