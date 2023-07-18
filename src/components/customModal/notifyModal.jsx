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
//import './FboSignupForm.scss';
import Input from '../input/input';
import Select from '../select/select';
const NotifyModal = props => {
    const getOperatorFields = (item) => {
        switch(item.name.toUpperCase()) {
          case "HEADER":
                return (<Row className='mb-3'> <div className='d-flex bf-heading bf-subheading bf-notify-subheading'><span>{item.label}</span><span>{item.field}</span></div> </Row>)
          case "BUTTON":
                return (<ButtonComponent       
                Label={item.label} 
                Type={item.type} 
                className={item.label == 'Decline' ? item.styles.className + ' bf-btn-secondary bf-btn-left bf-btn-decline bf-btn-imp' : item.styles.className}
                variant={item.variant}
                disabled={false}
                handleClick={item.label == 'Dismiss' ? (e)=>props.onClickSubmit(item) : (e)=>props.onActionClick(item)}/>)
          case "MESSAGE":
            return (<Row className='bf-notification-msg mb-3 d-flex align-items-center justify-content-center'>
                {item.field}
              </Row>
            )
          default :
          case "PARAGRAPH":
                return (
                  <div className={`bf-row-text col-md-${item.name == 'access' ? '2' : (item.name == 'mobile' ? '4' : '6')}`}><span>{item.label}</span> : <span title={item.field}>{item.field}</span></div>
                )
         };
    }
    return (
        <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop='static'
      centered
      id="bf-notification-modal"
    >
      <Modal.Header className='bf-modal-notify' closeButton>
        {props.title ?
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title> : ''}
      </Modal.Header>
      <Modal.Body>
            <Form>
                <div>
                          {props.json.map((item) => (
                                  item.name.toUpperCase() ==  "HEADER" ? 
                                 getOperatorFields(item) : null
                         )) } 
                </div> 
                <div className='row bf-mrgb20i'>
                      {props.json.map((item) => (
                              item.name.toUpperCase() !=  "HEADER" && item.name.toUpperCase() !=  "BUTTON" && item.name.toUpperCase() !=  "MESSAGE" ? 
                              getOperatorFields(item) : null
                      )) } 
                </div> 
                
                <div className='bf-mrgb20i'>
                          {props.json.map((item) => (
                                  item.name.toUpperCase() ==  "MESSAGE" ? 
                                 getOperatorFields(item) : null
                         )) } 
                </div>

                <div className='bf-mrgb20i'>
                          {props.json.map((item) => (
                                  item.name.toUpperCase() ==  "BUTTON" ? 
                                 getOperatorFields(item) : null
                         )) } 
                </div>
          
            </Form>
      </Modal.Body>
      {props.buttonText && <Modal.Footer>
        <Button onClick={props.onHide}>{props.buttonText}</Button>
        {props.secondbutton ? <Button className='bf-btn-secondary' onClick={props.hide}>{props.secondbutton}</Button> : ''}
      </Modal.Footer>}
      </Modal>
    );
}
export default NotifyModal;