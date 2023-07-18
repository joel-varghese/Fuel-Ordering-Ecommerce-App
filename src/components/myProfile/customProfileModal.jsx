import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import closeIcon from '../../assets/images/close-icon.svg';
import parse from 'html-react-parser';
const CustomProfileModal = props => {
    return (
        <Modal
      {...props}
      size={props.size ? props.size : "md"}
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      id={props.size ? "bf-profile-user" : "bf-profile-password-reset"}
      centered
      className={props.modalClass ? props.modalClass : ''}
    >
      <Modal.Header>
        {props.title ?
        <Modal.Title id="contained-modal-title-vcenter" className='bf-modal-title'>
          {props.title}
        </Modal.Title> : ''}
        <Button className='bf-close-icon' onClick={props.secondbutton ? props.close : props.onHide} ><img src={closeIcon} alt='closeIcon'/></Button>
      </Modal.Header>
      <Modal.Body className={props.title ? '' : 'bf-mrgt20i'}>
        <p>
        {props.modelBodyContent} 
        </p>
      </Modal.Body>
      {!props.hideFooter &&
      <Modal.Footer className={props.className ? props.className : ''}>
      </Modal.Footer>}
    </Modal>
    );
}
export default CustomProfileModal;