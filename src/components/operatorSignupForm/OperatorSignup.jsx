import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import logo from '../../assets/images/barrel_fuel_logo.png'
import './operatorSignupForm.scss';
import OperatorEnrollmentForm from './operatorEnrollmentForm';
import OperatorSignupForm from './operatorSignupForm';

function OperatorSignup() {

    const [noOfAirCrafts, setnoOfAirCrafts] = useState(0);

    const changeAircraftsCount = (event) => {
    setnoOfAirCrafts(event.target.value);
    };

    return (
        <div className='d-flex d-flex-row login-section'>
            <div className="w-70p operator-form d-flex d-flex-column">
                <img src={logo} alt="Barrel Fuel Logo" className='login-logo'/>
                <Form autoComplete='off'>
                    <h1 className='d-flex bf-heading'>Operator Sign Up Form</h1>
                    <Row className="mb-3">
                    <Form.Group as={Col} md={4} className="mb-5" controlId="formBasicEmail">
                        <Form.Label>No.of Aircraft(s)</Form.Label>
                        <Form.Select 
                            aria-label="Default select example" onChange={changeAircraftsCount}>
                            <option>Open this select menu</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </Form.Select>
                    </Form.Group>
                    {noOfAirCrafts >= 5 ? 
                        <OperatorEnrollmentForm /> : 
                        (noOfAirCrafts !== 0 ? <OperatorSignupForm /> : null)}
                    </Row>
                    <div className="d-grid gap-2 mb-5">
                        <Button className="bf-btn-primary" variant="primary" type="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
            </div>
            <div className='d-flex bg-image-container w-30p'>
                <div className='d-flex d-flex-column bf-login-right-sec'>
                    <div className='bf-banner-img-placeholder'>Placeholder Text</div>
                    <ul>
                        <li>Lorem ipsum dolor sit amet</li>
                        <li>Lorem ipsum dolor sit amet</li>
                        <li>Lorem ipsum dolor sit amet</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default OperatorSignup;