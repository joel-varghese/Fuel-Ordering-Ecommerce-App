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
import EditIcon from '../../assets/images/edit_icon.svg';
import './input.scss';
import uploadIcon from '../../assets/images/icon-file-upload.png';
import Popover from 'react-bootstrap/Popover';
import List from '../../components/operatorSignupForm/ListItems'
import parse from 'html-react-parser';


const Input = props => {
    const [passwordIcon, setpasswordIcon] = useState(props.Type);
    const [showPassword, setShowPassword] = useState(true);
    const [inputType, setInputType] = useState(props.Type);
    const [results, setresults] = useState({});
    const [fileValue, setfileValue] = useState();
    const [fboData, setFboData] = useState({});
   
    const toggleInputType = (dataType, name) => {
        let type = dataType;
        switch (dataType) {
            case 'password':
                if (name === 'password' || name === 'newPassword') {
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

    const renderTooltip = (tooltipInfo) => (
        <Tooltip id="button-tooltip" {...tooltipInfo}>
            {parse(tooltipInfo.text)}
        </Tooltip>
    );
    const selectedValue = (field, index) => {
        props.onselect(field, index);
        //    props.callback = false;


    }
    const handleFileChange = (e) => {
        setfileValue(e.target.files[0].name);
        props.handleChange(e);
    }

    const handleSelect = (e) => {

        props.onselect();
        //     props.callback = false;
    }

    const handleKeyPress = (e) => {
        if(e.keyCode === 13){
            e.target.blur();
            if(props.isEnter){
                props.clickEnter()
            }
          }
    }
    //     props.handleChange(e);
    // }   
    return (<>
        <Form.Group as={Col} md={props.colWidth} className={`${props.styles ? props.styles.className : ''} mb-4`} controlId={props.Name}>
            {!props.hideLabel ? 
            <div className={`d-flex d-flex-row align-items-center justify-content-between ${ props.isEditable && props.isEditable ? 'bf-relative' : ""}`}>
                <Form.Label>{parse(props.Label)} {props.isRequred ? <span className='bf-required'>*</span> : ''}</Form.Label>
                {props.addinfo ? <>
                 <div className={`bf-more-info bf-moreinfo-mrg ${props.mobileInfoText ? 'bf-hide-mobile' : ''}`}>
                    <span>{props.infoText}</span>
                    {props.fuelTiers ? props.fuelTiers() : null}
                 </div>
                 {props.mobileInfoText ?
                 <div className={`bf-more-info bf-moreinfo-mrg ${props.mobileInfoText ? 'bf-show-mobile' : ''}`}>
                    <span className='edit_icons' onClick={() => props.mobileFuelPopup()}>{props.mobileInfoText}</span>
                 </div> : null }
                 </>: ''}

                {props.tooltip && props.tooltip.text ?
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip(props.tooltip)}
                        text={"abcd"}
                    >
                        <img src={iIcon} tabIndex="" alt="Tooltip icon" />
                    </OverlayTrigger> : ""
                }
                {props.isEditable ?
                    <span tabIndex="0" 
                        className='edit_icon'
                        onClick={()=>{props.EnableEdit(props.Name)}}>
                            <span>Edit</span> 
                            <img src={EditIcon} alt="Edit Icon" />
                    </span>
                    : null
                }
            </div> : null
            }
            <InputGroup className={`${props.errorMessage != null || props.borderRed ? 'bf-error-border' : ''} mb-3 ${props.Type == 'file' ? 'bf-file-input' : ''}`}>
                {props.Type == 'file' ?
                    <div className='bf-file-component d-flex align-items-center justify-content-between'>
                        <div className={`${props.multiple ? 'bf-hideen' : ''} ${props.clear != 'Clear' && fileValue != undefined && fileValue != '' ? '' : 'placeholder-clr'}`}>{props.clear != 'Clear' && fileValue != undefined && fileValue != '' ? fileValue : props.Placeholder}</div>
                        <img src={uploadIcon} alt='upload icon' />
                    </div> : ''}
                <Form.Control
                    maxLength={props.maxLength}
                    minLength={props.minLength}
                    name={props.Name}
                    id={props.Name}
                    disabled={props.disabled}
                    placeholder={props.Placeholder}
                    onChange={props.Type !== 'file' ? props.handleChange : (e) => { handleFileChange(e) }}
                    onselect={props.Type !== 'file' ? props.onselect : (e, index) => { handleSelect(e, index) }}
                    onBlur={props.handleBlur}
                    value={props.val ? props.val : props.formDataSet}
                    type={inputType}
                    results={props.results}
                    callback={props.callback}
                    accept={props.Accept}
                    onKeyDown={props.onkeyDown?(e) => handleKeyPress(e):null}
                    onPaste = { props.onPaste }
                    onCopy = { props.onPaste }
                    title = {props.showTitle ? props.formDataSet : props.Type == 'file' && props.multiple ? (props.formPlaceholder ? props.formPlaceholder : (fileValue ? fileValue : 'No file chosen')): props.Type == 'file' ? "No file chosen" : ''}

                />
                {props.unit ?
                <div className='system-variables-units'>{props.unit}</div> :""}
                {props.multiple ? 
                <label className='bf-uploadfile' title={props.formPlaceholder ? props.formPlaceholder : 'No file chosen'}>
                    <div className={`${props.clear != 'Clear' && props.formPlaceholder != undefined && props.formPlaceholder != '' ? '' : 'placeholder-clr'}`}>{props.clear != 'Clear' && props.formPlaceholder != undefined && props.formPlaceholder != '' ? props.formPlaceholder : props.Placeholder}</div>
                </label> : null}
                {props.showIcon ?
                    <Button variant="link" className='password-icon' onClick={() => { setShowPassword(!showPassword); toggleInputType(props.Type, props.Name) }}>
                        <img src={showPassword ? hideIcon : showIcon} />
                    </Button> : ''
                }
                {
                    props.callback ? (

                        <>       {<List items={props.result} onSelect={(i, j) => { selectedValue(i, j) }} />}

                        </>) : ''
                }
            </InputGroup>
            <div className={`d-flex ${props.ShowToolTip != null || props.ShowToolTip != undefined ? 'justify-content-between flex-row-reverse' : 'justify-content-end'} `}>
                {props.ShowToolTip && props.passTooltip && props.passTooltip.text ?
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={
                            <Tooltip placement="top"  id={`popover-positioned-top`}>
                                {`${props.passTooltip.text}`}
                            </Tooltip>
                        }
                        text={"abcd"}
                    >
                        <span className='bf-help'>{props.passTooltip.fieldLabel}</span>
                    </OverlayTrigger> : ""}
                {
                    props.fieldError ? (
                        <Form.Text className="bf-error-message">
                            <span>
                                {props.errorMessage}
                            </span>
                        </Form.Text>
                    )
                        : (<Form.Text className="bf-success-message">
                        <span>
                            { props.Name === "DocumentUpload" || props.Name==="Document" ?props.uploadStatus: ""}
                        </span>
                    </Form.Text>)
                }
            </div>
        </Form.Group>
    </>
    );
}
export default Input;