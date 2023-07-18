import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import EditFuelTire from '../fuelPrice/editFuelTire';
import closeIcon from '../../assets/images/close-icon.svg';
import  ReviewAddNewFuel  from '../fuelPrice/reviewAddNewFuel';
const CustomFormModal = props => {
    return (
        <Modal
      {...props}
      size={props.size ? props.size : "md"}
      id="fuelprice-custom-form"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header onClick={props.secondbutton}>
        {props.title ?
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title> : ''}
        <Button className='bf-close-icon' onClick={props.secondbutton ? props.close : props.onHide} ><img src={closeIcon} alt='closeIcon'/></Button>
      </Modal.Header>
      <Modal.Body>
        { props.componentName === "ReviewAddNewFuel"? 
          <ReviewAddNewFuel DataForReview ={props.DataForReview} hidePopup={props.hidePopup} submitData={props.submitData} addNewUser ={props.addNewUser} location={props.location}/>
        :
          <EditFuelTire deactivateData ={props.deactivateData} hidePopup={props.hidePopup} labelData={props.labelData} validFieldIssue={props.validFieldIssue} setValidFieldIssue={props.setValidFieldIssue}/>
        }
      </Modal.Body>
      </Modal>
    );
}
export default CustomFormModal;