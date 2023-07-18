import './subHeading.scss';
import EditIcon from '../../assets/images/edit-icon.png';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import iIcon from '../../assets/images/info-icon.png';

const Subheading = props => {
    const renderTooltip = (tooltipInfo) => (
        <Tooltip id="button-tooltip" {...tooltipInfo}>
            {tooltipInfo.text}
        </Tooltip>
    );
    return (<>
            <div  className={`${props.styles ? props.styles.className : ''} d-flex bf-heading bf-subheading`}>
                <span>{props.label} {props.isRequired ? <span className='bf-required'>*</span> : ''} 
                {props.tooltip && props.tooltip.text ?
                    <OverlayTrigger 
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip(props.tooltip)}
                        text={"abcd"}
                    >
                        <img src={iIcon} tabIndex="" alt="Tooltip icon" />
                    </OverlayTrigger> : ""
                }</span>
                {props.isEditable ?
                    <span tabIndex="0" //disabled = {props.isAccessAble?false:true}
                        className='edit_icon'
                        onClick={props.isAccessAble?props.EnableEdit:null}><span>Edit</span> <img src={EditIcon} alt="Edit Icon" /></span>
                    : props.isClear && props.isClear?
                    <span tabIndex="0" //disabled = {props.isAccessAble?false:true}
                    className='edit_icon'><span className='bf-clear-all' onClick={props.setRetailPrice}>{props?.item?.labelRetailPrice}| </span><span className='bf-clear-all' onClick={props.clearData}>{props?.item?.labelClearAll}</span></span>:null
                }
            </div>
        </>
    );
}
export default Subheading;