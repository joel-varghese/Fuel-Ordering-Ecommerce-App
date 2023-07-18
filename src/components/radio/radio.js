import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

const Radio = props => {
    return (
        <Form.Group as={Col} md={props.colWidth} className={`${props.className ? props.className : ''} mb-4`} name={props.Name} controlId="formBasicCheckbox">
            {props.options && props.options.map(({ value, label }, index) => (
                <Form.Check inline
                value={value}
                type="radio"
                disabled={props.secondButtonDisable ? index==1? true : false : props.disabled}
                label={label}
                onChange={props.handleChange}
                checked={props.formDataSet == value}
                />))}
      </Form.Group>
           
    );
}
export default Radio;