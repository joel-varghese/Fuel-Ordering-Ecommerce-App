import profilePhoto from '../../../assets/images/login_bg.png';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import "./profile.scss";
import { BiChevronDown } from "react-icons/bi";
import Dropdown from 'react-bootstrap/Dropdown';


const Profile = () => {
	return (
			// <OverlayTrigger
			// 	trigger='click'
			// 	placement='bottom'
			// 	overlay={
			// 		<Popover id='popover-positioned-bottom' className='profile-popover'>
			// 			<Popover.Header as='h3' />
			// 			<Popover.Body>
			// 				<div>My Profile</div>
            //   				<div>Log Out</div>
			// 			</Popover.Body>
			// 		</Popover>
			// 	}
			// >
			// 	<div className="d-flex align-items-center mx-4">
			// 		<img src={profilePhoto} width='30' height='30' className='rounded-circle' />
			// 		<div className='mx-2'>
			// 			<span className='fs-md'>{`Hi, <First Name>`}</span>
			// 			<div className='fs-sm'>Super</div>
			// 		</div>
			// 		<BiChevronDown />
			// 	</div>
			// </OverlayTrigger>
			<div>Hello</div>
	);
};
export default Profile;
