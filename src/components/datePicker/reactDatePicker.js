import { PromptState } from "msal/lib-commonjs/utils/Constants";
import React, {forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import { getMonth, getYear } from 'date-fns';
import range from "lodash/range";
import "react-datepicker/dist/react-datepicker.css";
import arrowDownIcon from '../../assets/images/arrow-down_icon.svg';
import "./reactDatePicker.scss"
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
export default function ReactDatePicker (props){
  const [startDate, setStartDate] = useState(props.value && props.value!=="" && props.value!=="Invalid Date" ? new Date(props.value) : null);
  let value = props.fieldError ? "" :props.value
  const ref = React.createRef();
  const onChange = (e) => {
    console.log("dsfasd")
  }
  const ExampleCustomInput = forwardRef(({value,onClick, onChange }, ref) => {
   return(<input
      value={value}
      className="example-custom-input"
      onClick={onClick}
      onChange={(e) => props.handleChange(e)}
      ref={ref}
    ></input>)
});
let diffDate = parseInt(getYear(new Date(props.yearRange[0]))) - parseInt(getYear(new Date(props.yearRange[1])))
  diffDate = diffDate ===0?1:diffDate;
  const years = range(getYear(new Date(props.yearRange[1])), getYear(new Date(props.yearRange[0]))+diffDate, 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    
    <Form.Group as={Col} md={props.colWidth} className={`${props.errorMessage != null ? 'bf-error-date-border' : ''}  ${props.styles ? props.styles.className : ''} mb-4 bf-date-picker ${props.disabled ? 'bf-date-picker-disabled' : ''}`} controlId={props.Name}>
    <label className='bf-date-label'>{props.Label} {props.isRequired ?<span className='bf-required'>*</span> : ''}</label>
    {props.monthShow ==2?<DatePicker
    showIcon ={true}
    selected={props.value && props.value!=="" && props.value!=="Invalid Date" ? props.value : null}
    value={props.value && props.value!=="" && props.value!=="Invalid Date" ? new Date(props.value) : null}
    onChange={(e) => props.handleChange(e)}
    onKeyDown = {onChange}
    monthsShown={props.monthShow}
    maxDate={props.MaxDate}
    minDate={props.MinDate}
    name={props.Name}
    //customInput={<ExampleCustomInput ref={ref} onChange={(date) => props.handleChange(date)} />}
    className="example-custom-input"
    dateFormat="MM/dd/yyyy"
    />:
    <DatePicker
    showIcon ={true}
    //selected={props.formDataSet}
    selected={props.value && props.value!=="" && props.value!=="Invalid Date" && props.value!=="NaN/NaN/NaN" ? new Date(props.value) : null}
    value={props.value && props.value!=="" && props.value!=="Invalid Date" && props.value!=="NaN/NaN/NaN" ? props.value : null}
    onChange={(e) => props.handleChange(e)}
    monthsShown={props.monthShow}
    maxDate={props.MaxDate}
    minDate={props.MinDate}
    name={props.Name}
    dateFormat="MM/dd/yyyy"
    placeholderText = {props.placeholderText}
    
     customInput={<input
      value={value}
      className="example-custom-input"
      maxLength={10}
      //onChange={(e) => props.handleChange(e)}
      onKeyDown={(e) => props.onChangeDate(e)}
    ></input>} 
    //className="example-custom-input"
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled       
      }) => (
        <div
          style={{
            margin: 10,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
          <img src={arrowDownIcon} className='bf-down-arrow bf-auditlog-calendar-leftarrow' />
          </button>
         
          <select
            value={months[getMonth(date)]}
            onChange={({ target: { value } }) =>
              changeMonth(months.indexOf(value))
            }
          >
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={getYear(date)}
            onChange={({ target: { value } }) => changeYear(value)}
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>


          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
          <img src={arrowDownIcon} className='bf-down-arrow bf-auditlog-calendar-rightarrow' />
          </button>
        </div>
      )}
    />}
    { props.fieldError ? (
                <Form.Text className="bf-error-message error">
                    <span>
                        {props.errorMessage}
                    </span>
                </Form.Text>
            )
                : ''
  }
    </Form.Group>
  );
};