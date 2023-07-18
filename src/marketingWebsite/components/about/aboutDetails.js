import Nav from 'react-bootstrap/Nav';
import parse from 'html-react-parser';
import { Col, Row } from 'react-bootstrap';

const AboutDetails = (props) => {
    const aboutDetails = props.landingScreen;
    
    const getLandingScreenElements = (item) => {
        switch(item.type.toUpperCase()) {
            case 'VIDEO' : 
                return (<video disablePictureInPicture controlsList="nodownload" src={props.getImageUrl(item.imageDetails)} autoPlay loop muted playsInline></video>);
            case 'HEADING' :
                return (<div className="landing-information">{item.itemLabel}</div>);
            case 'IMAGE' :
                return (<div className="bf-landing-image">
                        <img src={props.getImageUrl(item.imageDetails)} alt="About Landing Image"/>
                        <div className="bf-about-heading">{item.text}</div>
                    </div>);
            case 'BUTTON' :
                return (
                    <div className="bf-signup-button-sec">
                        <Nav.Link  className="bf-signup-button" href={item.url}>
                            {item.itemLabel}
                        </Nav.Link>
                    </div>
                );
        }
    }

    const getDetails = item => {
        switch(item.type.toUpperCase()) {
            case 'PARAGRAPH' : 
                return (<div className='bf-text'>{parse(item.text)}</div>);
            case 'HEADING' :
                return (<div className="bf-heading">{item.text}</div>);
        }
    } 

    return (<>
            <div className='bf-about-landing-screen'>
                {
                    aboutDetails.landingScreen.map((item) =>
                        getLandingScreenElements(item)
                    )
                }
            </div>
            <div className='bf-about-heading-section'>About Us</div>
            <div className='bf-about-us-details bf-about-section-details'>
               {
                    aboutDetails.aboutDetails.map((item) =>
                        getDetails(item)
                    )
               } 
            </div>
            <div className='bf-about-us-video'>
                {
                    aboutDetails.videoSection.map((item) =>
                        getLandingScreenElements(item)
                    )
                }
            </div>
            <div className='bf-about-us-details bf-mission'>
               {
                    aboutDetails.missionVision.map((item) =>
                        getDetails(item)
                    )
               } 
            </div>
            <div className='bf-about-more-details'>
               {
                aboutDetails.moreDetails.features.map(feature => 
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
        </>
    )
}

export default AboutDetails;