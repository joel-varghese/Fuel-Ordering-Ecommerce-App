import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import logo from '../../assets/images/barrel_fuel_logo.png'
import Row from 'react-bootstrap/Row';
import Input from '../input/input';
import Select from '../select/select';
import Checkbox from '../checkbox/checkbox';
import ButtonComponent from '../button/button';
import { ButtonGroup } from 'react-bootstrap';
import './admin.scss';

function AdminFboSignup() {

    const fboSignupList = [
        {
            sections:[{
                subSections:[
                    {
                        fields :[
                            {
                                component: "paragraph",
                                type:"subheading",
                                label:"Super Admin Details"
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"First name",
                                placeholder: "First Name",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Last Name",
                                placeholder: "Last Name",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Email Address",
                                placeholder: "Email Address",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "select",
                                type:"select",
                                label:"Role",
                                placeholder: "Role",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Custom Role",
                                placeholder: "Custom Role",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Mobile Number",
                                placeholder: "Mobile Number",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            }
                        ]
                    },
                    {
                        fields :[
                            {
                                component: "paragraph",
                                type:"subheading",
                                label:"Company Details"
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Name",
                                placeholder: "Company Name",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Primar Location",
                                placeholder: "Company Primary Location",
                                isRequired: false,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Number",
                                placeholder: "Company Number",
                                isRequired: false,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Mailling Address Line 1",
                                placeholder: "Company Address Line 1",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Mailling Address Line 2",
                                placeholder: "Company Address Line 2",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Country",
                                placeholder: "Company Country",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"City",
                                placeholder: "Company City",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"State",
                                placeholder: "Company State",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Zip",
                                placeholder: "Company Zip",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"EIN",
                                placeholder: "Company EIN",
                                isRequired: false,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"State Incorporation",
                                placeholder: "State Incorporation",
                                isRequired: false,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Federal Tax Exempt ID",
                                placeholder: "Federal Tax Exempt ID",
                                isRequired: false,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"VAT Exempt ID",
                                placeholder: "VAT Exempt ID",
                                isRequired: false,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            }
                        ]
                    },
                    {
                        fields :[
                            {
                                component: "paragraph",
                                type:"subheading",
                                label:"Airport Location Information"
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Airport ID",
                                placeholder: "Airport ID",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Airport Name",
                                placeholder: "Airport Name",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "select",
                                type:"select",
                                label:"Fuel Service Offered",
                                placeholder: "Role",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Address Line 1",
                                placeholder: "Airport Address Line 1",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Address Line 2",
                                placeholder: "Airport Address Line 2",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Country",
                                placeholder: "Airport Counyry",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"City",
                                placeholder: "Airport City",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"State",
                                placeholder: "Aieport State",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Zip",
                                placeholder: "Aieport Zip",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "button",
                                type:"button",
                                label:"Add New",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: "add-new-button"
                                }
                            }
                        ]
                    },
                    {
                        fields :[
                            {
                                component: "paragraph",
                                type:"subheading",
                                label:"Banking Information"
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Account Holder",
                                placeholder: "Account Holder Name",
                                isRequired: false,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Bank Name",
                                placeholder: "Bank Name",
                                isRequired: false,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "select",
                                type:"select",
                                label:"Account Type",
                                placeholder: "Account Type",
                                isRequired: false,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Account Number",
                                placeholder: "Account Number",
                                isRequired: false,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Routing Number",
                                placeholder: "Routing Number",
                                isRequired: false,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "button",
                                type:"button",
                                label:"Add New",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: "add-new-button"
                                }
                            }
                        ]
                    },
                    {
                        fields :[
                            {
                                component: "paragraph",
                                type:"subheading",
                                label:"FBO Memership"
                            },
                            {
                                component: "checkbox",
                                type:"checkbox",
                                label:"Premium - At least one special character",
                                isRequired: true,
                                styles: {
                                    colWidth: "12",
                                    className: ""
                                }
                            }
                        ]
                    },{
                        fields :[
                            {
                                component: "paragraph",
                                type:"subheading",
                                label:"Payment Information"
                            },
                            {
                                component: "select",
                                type:"select",
                                label:"Payment Mode",
                                placeholder: "Document Type",
                                isRequired: false,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Card Holder",
                                placeholder: "Card Holder Name",
                                isRequired: false,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Credit/Debit Card Number",
                                placeholder: "Credit/Debit Card Number",
                                isRequired: false,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "select",
                                type:"select",
                                label:"Expiration Date",
                                placeholder: "Credit/Debit Card Number",
                                isRequired: false,
                                styles: {
                                    colWidth: "2",
                                    className: ""
                                }
                            },
                            {
                                component: "select",
                                type:"select",
                                label:"",
                                placeholder: "Credit/Debit Card Number",
                                isRequired: false,
                                styles: {
                                    colWidth: "2",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Security Code",
                                placeholder: "Security Code",
                                isRequired: false,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Nick Name",
                                placeholder: "Nick Name(optional)",
                                isRequired: false,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "button",
                                type:"button",
                                label:"Add New",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: "add-new-button"
                                }
                            }
                        ]
                    },
                    {
                        fields :[
                            {
                                component: "checkbox",
                                type:"checkbox",
                                label:"Same as Company Address",
                                isRequired: true,
                                styles: {
                                    colWidth: "12",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Address Line 1",
                                placeholder: "Address Line 1",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Address Line 2",
                                placeholder: "Address Line 2",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Country",
                                placeholder: "Country",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"City",
                                placeholder: "City",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"State",
                                placeholder: "State",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "input",
                                type:"input",
                                label:"Zip",
                                placeholder: "Zip",
                                isRequired: true,
                                styles: {
                                    colWidth: "4",
                                    className: ""
                                }
                            },
                            {
                                component: "checkbox",
                                type:"checkbox",
                                label:"Accept Terms and Conditions",
                                isRequired: true,
                                styles: {
                                    colWidth: "12",
                                    className: ""
                                }
                            }
                        ]
                    }
                ]
            }]
        }
    ]

    const getOperatorFields = (item) => {
        switch(item.component.toUpperCase()) {
        case "INPUT":
            return (<Input 
                colWidth={item.styles ? item.styles.colWidth : ""} 
                Type={item.type} 
                Label={item.label}
                Placeholder={item.placeholder}
                isRequred={item.isRequired}/>)
        case "SELECT":
            return (<Select 
                colWidth={item.styles ? item.styles.colWidth : ""} 
                Type={item.type} 
                Label={item.label}
                Placeholder={item.placeholder}
                isRequred={item.isRequired}/>)
        case "CHECKBOX":
            return (<Checkbox Label={item.label} colWidth={item.styles ? item.styles.colWidth : ''}/>)
        case "BUTTON":
            return (<ButtonComponent 
                    Label={item.label} 
                    Type={item.type} 
                    className={item.styles.className} />)
        case "PARAGRAPH":
            return (<div>{item.label}</div> )
        };
    }
  return (
    <div className='d-flex d-flex-row login-section signup-section'>
        <div className="w-70p login-form d-flex d-flex-column">
            <img src={logo} alt="Barrel Fuel Logo" className='login-logo'/>
            <Form autoComplete='off'>
                <h1 className='d-flex bf-heading'>FBO Sign Up Form</h1>
                {fboSignupList[0].sections.map((section, sectionIndex)=> {
                    return (
                        section.subSections.map((item) => (<Row className='mb-3'>
                            {item.fields.map((field) => (
                                getOperatorFields(field)
                            ))}
                            </Row>
                        ))
                    )
                }
                )}
                <div className="d-grid gap-2 mb-5">
                    <ButtonGroup>
                        <Button className="bf-btn-login" variant="primary" type="submit">
                            Create User
                        </Button>
                        <Button className="bf-btn-login" variant="primary" type="submit">
                            Clear
                        </Button>
                    </ButtonGroup>
                </div>
            </Form>
        </div>
        <div className='d-flex bg-image-container w-30p'>
            <div className='d-flex bf-login-right-sec'>

            </div>
        </div>
    </div>
  );
}

export default AdminFboSignup;