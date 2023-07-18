import React, { useEffect, useState } from 'react'
import { getFieldIsValid, phoneValidation } from '../../controls/validations';
import EditIcon from '../../assets/images/edit-icon.png';
import Input from '../input/input';
import { Row } from 'react-bootstrap';
import Subheading from '../subHeading/subHeading';


function AccountDetails(props) {
    const [fieldList, setFieldList] = useState([]);
    const [formFieldData, setFormFieldData] = useState({})
    useEffect(() => {
        setFieldList(props.fieldList)
        let profileData = props.profileData
        let formData= {
            emailAddress: profileData && profileData.username,
            mobileNumber: profileData && phoneValidation(profileData.mobileNumber),
            password: "password@1234567"
        }
        setFormFieldData(formData)

    }, [props])

    const fieldEdit = (name)=>{
        props.editModal(name)
    }
    
    
    const getFields = (item) => {
        switch (item.component.toUpperCase()) {
            case "INPUT":
            return (
                <Input
                    colWidth={item.styles ? item.styles.colWidth : ""}
                    Type={item.type}
                    isEditable={item.editModal}
                    EnableEdit={fieldEdit}
                    Label={item.label}
                    data-label={item.label}
                    Name={item.name}
                    // id={item.id}
                    disabled={item.disabled}
                    Placeholder={item.placeholder}
                    isRequred={item.isRequired}
                    maxLength={item.maxLength}
                    minLength={item.minLength}
                    // handleChange={(e) => handleChange(e, item)}
                // handleBlur={(e) => handleBlur(e, item, index, flag)}
                // fieldError={
                //     formErrors &&
                //     formErrors[item.name] && !formErrors[item.name].isValid
                //     && (
                //         formErrors[item.name].isTouched
                //     )
                // }
                // errorMessage={
                //     formErrors
                //     && formErrors[item.name]
                //         .activeValidator
                //         .errorMessage
                // }
                formDataSet={formFieldData ? formFieldData[item.name] : ''}
                />
            )
            break;
            case "PARAGRAPH":
                return(
                    <><Subheading label={item.label} isEditable={false}/></>
                )
                break;
            default:
                break;
        }
    }
    return (
        <div>
            {fieldList && fieldList.length ?
            <div className=" login-form d-flex d-flex-column">
                {fieldList[0].sections && fieldList[0].sections.subSections.map((flds) => (<Row className='bf-mrgb-0'>
                        {flds.name === "personalFieldsArray" && flds.personalFieldsArray && flds.personalFieldsArray.map((item, index) => (<Row className='bf-mrgb-0'>
                            {item.fields.map((val) => {
                                return getFields(val, index, true)
                            })}
                        </Row>))}
                    </Row>
                    ))
                }
            </div>
            : ""}
        </div>
    )
}

export default AccountDetails