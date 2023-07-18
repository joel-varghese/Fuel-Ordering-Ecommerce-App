import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import AdminSignup from './adminSignup';
import './admin.scss';

const Admin = props => {
    return (
        <div className='admin-container'>
            <AdminSignup />
        </div>
    );
}
export default Admin;