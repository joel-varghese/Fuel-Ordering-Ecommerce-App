import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import closeIcon from '../../assets/images/close-icon.svg';
import parse from 'html-react-parser';
import { useEffect } from 'react';

const CustomModal = props => {

    setTimeout(()=>{
      let element = document.getElementsByClassName('modal-dialog-centered')
      element && element.length && element[0]?.removeAttribute('title')
    },10)
    useEffect(()=>{
      if(props.isPrompt && props.isPrompt) {
        document.getElementById('root').style.filter = 'blur(5px)';
      }
    },[props.isPrompt])    
    return (
        <Modal
      {...props}
      size={props.size ? props.size : "lg"}
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      centered
      id={props.modalId ? props.modalId : ''}
    >
      <Modal.Header>
        {props.title ?
        <Modal.Title id="contained-modal-title-vcenter" className='bf-modal-title'>
          {props.title}
        </Modal.Title> : ''}
        <Button className='bf-close-icon' onClick={props.secondbutton ? props.close : props.onHide} ><img src={closeIcon} alt='closeIcon'/></Button>
      </Modal.Header>
      <Modal.Body className={props.title ? '' : 'bf-mrgt20i'}>
        <p className={props.classStyles ? props.classStyles : ''}>
          {props.isHtmlContent ? props.modelBodyContent : parse(props.modelBodyContent)}
        </p>
      </Modal.Body>
      {!props.isHtmlContent &&
        <Modal.Footer className={props.className ? props.className : ''}>
          <Button onClick={props.onHide}>{props.buttonText}</Button>
          {props.secondbutton ? <Button className='bf-btn-secondary' onClick={props.hide}>{props.secondbutton}</Button> : ''}
        </Modal.Footer>
      }
    </Modal>
    );
}
export default CustomModal;