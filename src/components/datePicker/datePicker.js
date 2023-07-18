import * as React from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import './datePicker.scss';
import FormControl from '@mui/material/FormControl';
export default function DatePicker(props) {
//  const [value, setValue] = React.useState(dayjs('2014-08-18T21:11:54'));
  const handleChange = (newValue) => {
//    setValue(newValue);
    props.handleChange(newValue)
    
  };
  const handleBlur = (e)=>{
    props.handleBlur(e)
  }
  return (
    <Form.Group as={Col} md={props.colWidth} className={`${props.errorMessage != null || props.borderRed ? 'bf-error-date-border' : ''}  ${props.styles ? props.styles.className : ''} mb-4 bf-date-picker ${props.disabled ? 'bf-date-picker-disabled' : ''}`} controlId={props.Name}>
    <label className='bf-date-label'>{props.Label} {props.isRequired ?<span className='bf-required'>*</span> : ''}</label>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={1}>
        <DesktopDatePicker
          inputFormat="MM/DD/YYYY"
          value={props.value ? props.value : null}
          onChange={handleChange}
          
          disabled={props.disabled}
          renderInput={(params) => <TextField {...params} onBlur= {handleBlur}/>}
          className = {""}
          inputProps={{
            placeholder: props.placeholder?props.placeholder:"MM/DD/YYYY",
            disabled: props.disabled ? props.disabled : false,
            
          }}
          minDate={props.MinDate !=null ? props.MinDate : new Date()}
          maxDate={props.MaxDate ? props.MaxDate : ''}
          disableFuture = {props.disableFuture}
          PopperProps = {{placement:'top'}}
        />
      </Stack>
    </LocalizationProvider>
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
}
