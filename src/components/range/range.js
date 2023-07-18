import * as React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import RangeSlider from 'react-bootstrap-range-slider';
import Slider from '@mui/material/Slider';
import './range.scss';
import { getFormatedAmount } from '../../controls/validations';

export default function Range(props) {
    return (
      <Form.Group as={Col} md={props.colWidth} className={`${props.styles ? props.styles.className : ''} mb-4`} controlId={props.Name}>
        <Form.Label className='bf-range-label'>{props.Label}</Form.Label>
        <div className='bf-range-slider'>
        <Slider 
          aria-label="Volume" 
          value={props.value} 
          min={props.minRange}
          max={props.maxRange}
          step={props.step}
          onChange={props.handleChange} />
          {/* <RangeSlider
          value={props.value}
          min={props.minRange}
          max={props.maxRange}
          step={props.step}
          onChange={props.handleChange}
          onAfterChange={props.onAfterChange}
          className="custom-range"
          varient="primary"
          tooltip='off'/> */}
        </div>
        
        <Form.Label className='bf-range-value'>{props.rangeUnit}{props.minRange.toFixed(2)} - {props.rangeUnit}{getFormatedAmount(props.value)}</Form.Label>
      </Form.Group>
    );
  }