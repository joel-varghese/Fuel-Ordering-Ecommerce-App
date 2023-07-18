import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import AddMoreIcon from '../../assets/images/icon-add-more.png';
import RemoveIcon from '../../assets/images/icon-remove.png';

import './button.scss';

const ButtonComponent = props => {
    const [iconState, setIconState] = useState('');
    const [addRemoveClass, setAddRemoveClass] = useState(props.className == 'add-more' || props.className == 'remove' ? 'bf-btn-left' : ''); 

    useEffect(() => {
        let text = props.className;
        let result
        if(text.match("add-more")) {
            result = text.match("add-more");
        } else if(text.match("remove")) {
            result = text.match("remove");
        }
        if(result && result.length) {
            let res;
            if(Array.isArray(result)){
                res=result[0];
            }else{
                res=result;
            }
            setIconState(res);
        }
      },[props]);

    return (
        <Button className={`${props.className ? props.className : ''} ${iconState == 'add-more' || iconState=="remove" ? addRemoveClass : ''} bf-btn-login`} variant={props.variant} type={props.Type} id={props.id?props.id:''} 
        onClick={props.handleClick} disabled={props.disabled?props.disabled:false}>
            {iconState == 'add-more' ? <img src={AddMoreIcon} alt="Add More" /> : (iconState == 'remove' ? <img src={RemoveIcon} alt="Remove" /> : '')} {props.Label}
        </Button>
    );
}
export default ButtonComponent;