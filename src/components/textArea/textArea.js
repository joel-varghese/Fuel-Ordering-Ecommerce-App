import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

export default function TextArea(props) {
  const [refresh, setrefresh] = useState(0);
  useEffect(() => {
    setrefresh(refresh+1)
  },[props.errorMessage]);

    return (
      <Form.Group as={Col} md={props.colWidth} className={`${props.errorMessage != null ? 'bf-error-class' : ''} mb-4`} controlId={props.Name}>
        <Form.Label>{props.Label} {props.isRequred ? <span className='bf-required'>*</span> : ''}</Form.Label>
        <div className='bf-textarea'>
            <Form.Control 
                as="textarea" 
                rows={props.Rows} 
                placeholder={props.Placeholder} 
                disabled={props.disabled}
                value={props.value}
                name={props.Name}
                onChange={props.onChange} />
        </div>
        {props.restriction &&
            <span className="bf-text-count">{props.textLength}/{props.maxLength}</span>
        } 
      </Form.Group>
    );
  }