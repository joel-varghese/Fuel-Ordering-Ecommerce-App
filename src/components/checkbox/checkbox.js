import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

const Checkbox = props => {
    const {handleChange} = props;
    return (
        <Form.Group as={Col} md={props.colWidth} className={`${props.className ? props.className.className : ''} ${props.styles ? props.styles : ''} mb-4`} controlId="formBasicCheckbox">
            <Form.Check type={props.type} label={props.Label} onChange={props.onClick} checked={props.ischeck}
				onBlur={props.handleBlur} name={props.Name} id={props.id} disabled={props.disabled}/>    
        </Form.Group>
    );
}
export default Checkbox;