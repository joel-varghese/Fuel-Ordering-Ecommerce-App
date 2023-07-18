import React, { useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import './multiCreatableSelect.scss';

const MultiCreatableSelect = (props) => {
    return(
    <div className={props.checked?'#bf-createSelect':'hide'}>
        <Form.Group as={Col} md={props.colWidth} className={ `${props.styles ? props.styles.className : ''} mb-4`} >
        <Form.Label className={ props.className?props.className:"form-label"}>{props.Label} {props.isRequred ? <span className='bf-required'>*</span> : ''}</Form.Label>
        <CreatableSelect
           components={props.components}
           inputValue={props.inputValue} 
           isClearable={props.isClearable?props.isClearable:false}
           isMulti={props.isMulti?props.isMulti:true}
           menuIsOpen={false}
           onChange={(newValue) => props.onCreateChange(newValue)?props.onCreateChange(newValue):{}}
           onInputChange={(newValue) => props.onCreateInputChange(newValue)?props.onCreateInputChange(newValue):{}}
           onKeyDown={props.handleKeyDown}
           placeholder={props.placeHolder}
           value={props.value?props.value:''}
           isDisabled ={props.checked?false:true}
        />
       </Form.Group>
    </div>
    )
}
export default MultiCreatableSelect;
  