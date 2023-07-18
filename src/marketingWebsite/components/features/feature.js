import { Col, Row } from 'react-bootstrap';
import parse from 'html-react-parser';
import './feature.scss';

const Feature = (props) => {
    return(
        <div className="bf-features">
           {
            props.bfFeatures.features.map((feature) => 
            <Row>
                <Col md="6"> <img src={props.getImageUrl(feature.imageDetails)} /></Col>
                <Col md="6"> 
                    <div className='d-flex d-flex-column'>
                        <div className='bf-feature-heading'>{parse(feature.heading)}</div>
                        <div className='bf-feature-information'>{feature.information}</div>
                    </div> 
                </Col>
            </Row>
            )
           }
        </div>
    )
}

export default Feature;