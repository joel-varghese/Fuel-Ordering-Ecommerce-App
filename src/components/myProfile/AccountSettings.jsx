import React, { useEffect, useState } from 'react'
import { Form, Row } from 'react-bootstrap'
import Input from '../input/input'
import Subheading from '../subHeading/subHeading'

function AccountSettings(props) {
    const [fieldList, setFieldList] = useState()
    const [formData, setFormData] = useState({})
    const [update, setUpdate] = useState(false)
    

    useEffect(() => {
      setFieldList(props.fieldList)
      setFormData(props.profileData)
      
    }, [props.profileData])
    
    const handleChange =(e,item)=>{
       let target = e.target;
       let formDataset = formData;
       formDataset[item.name] = target.checked
       if(item.name == 'localTime'){
        formDataset["utc"] = false
       }
       if(item.name == 'utc'){
        formDataset["localTime"] = false
       }
       setFormData(formDataset)
       props.enableSave()
       props.getProfileDetails(formDataset)
       setUpdate(!update)

    }
    const getFields = (item) => {
        switch (item.component.toUpperCase()) {
            case "CHECKBOX":
            return (
                // <Form>
                //     <div key={`reverse-${item.type}`} className="mb-3">
                //         <Form.Switch
                //             reverse={true}
                //             inline={true}
                //             className={item.styles ? item.styles.colWidth : ""} 
                //             type={item.type}
                //             id={item.id}
                //             name = {item.name}
                //             label={item.label}
                //         />
                //         </div>
                // </Form>
                <div class="col-md-3 form-check form-check-inline form-switch">
                    <label className="form-check-label" for={`${item.id}${item.name}`}>
                        {item.label}
                    </label>
                    <input className={`${item.styles ? item.styles.colWidth : ""} form-check-input form-control`} onChange={(e)=>{handleChange(e,item)}} type={item.type} checked={formData[item.name]} name={item.name} id={`${item.id}${item.name}`} role={item.role} />
                    
                </div>
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
            <div className=" login-form d-flex d-flex-column bf-profile-settings">
                {fieldList[0].sections && fieldList[0].sections.subSections.map((flds) => (<Row className='bf-mrgb-0'>
                        {flds.name === "settingsFieldsArray" && flds.settingsFieldsArray && flds.settingsFieldsArray.map((item, index) => (<Row className='bf-mrgb-0'>
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

export default AccountSettings