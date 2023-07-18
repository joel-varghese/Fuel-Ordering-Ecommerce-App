import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import iIcon from '../../assets/images/info-icon.png'
import hideIcon from '../../assets/images/icon-hide.png';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import React, { useState } from 'react';
import showIcon from '../../assets/images/icon-show.png';
import './input.scss';
import uploadIcon from '../../assets/images/icon-file-upload.png';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';


const AsyncType = props => {
    const [passwordIcon, setpasswordIcon] = useState(props.Type);
    const [showPassword, setShowPassword] = useState(true);
    const [inputType, setInputType] = useState(props.Type);
    const toggleInputType = (dataType, name) => {
        let type = dataType;
        switch (dataType) {
            case 'password':
                if (name === 'password' || name === 'newPassword' ) {
                    if (showPassword) {
                        setInputType('text')
                    } else {
                        setInputType(dataType);
                    }
                }
                if (name === 'confirmPassword' || name === 'confirmNewPassword') {
                    if (showPassword) {
                        setInputType('text')
                    } else {
                        setInputType(dataType)
                    }
                }
                return type;
                break;
            default:
                return type;
        }
    };


    const [fileValue, setfileValue] = useState();
    const renderTooltip = (tooltipInfo) => (
        <Tooltip id="button-tooltip" {...tooltipInfo}>
            {tooltipInfo.text}
        </Tooltip>
      );
    const handleFileChange = (e) => {
        setfileValue(e.target.files[0].name);
        props.handleChange();
    }   
    return (<>
        <Form.Group as={Col} md={props.colWidth} className="mb-4" controlId="formBasicEmail">
            <div className='d-flex d-flex-row align-items-center justify-content-between'>
                <Form.Label>{props.Label} {props.isRequred ? <span className='bf-required'>*</span> : ''}</Form.Label>
                {props.tooltip && props.tooltip.text ? 
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip(props.tooltip)}
                        text={"abcd"}
                        >
                            <img src={iIcon} tabIndex="0" alt="Tooltip icon"/>
                    </OverlayTrigger> : ""
                }
            </div>


<AsyncTypeahead
filterBy={props.filterBy}
id="async-example"
isLoading={props.isLoading}
labelKey="login"
minLength={3}
onSearch={props.handleSearch}
options={props.options}
onChange={props.handleChange}
placeholder="Search for a address..."
renderMenuItemChildren={() => (
<>

<span>{ props.Item}</span>
</>
)}
/> 

        </Form.Group>
    </>
    );
}
export default AsyncType;