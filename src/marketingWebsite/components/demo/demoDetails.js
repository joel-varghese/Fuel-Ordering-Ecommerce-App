import Nav from 'react-bootstrap/Nav';
import parse from 'html-react-parser';
import { Col, Row } from 'react-bootstrap';

const DemoDetails = (props) => {
    const demoDetails = props.landingScreen;
    console.log(demoDetails)
    console.log(props)
    const getLandingScreenElements = (item) => {
        switch(item.type.toUpperCase()) {
            case 'VIDEO' : 
                return (<video disablePictureInPicture controlsList="nodownload" src={props.getImageUrl(item.imageDetails)} autoPlay loop muted></video>);
            case 'PARAGRAPH' :
                return (<div className="landing-information">
                    <div className='bf-heading'>
                        {item.heading}
                    </div>
                    <div className='bf-text bf-fule-process'>
                        <div>{item.text}</div>
                        <ol>
                        {item.list.map((listItem) => {
                            return <li>{listItem}</li>
                        })}
                    </ol>
                    </div>
                </div>);
            case 'IMAGE' :
                return (<div className="bf-demo-landing-image">
                        <img src={props.getImageUrl(item.imageDetails)} alt="Demo Landing Image"/>
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
            case 'BUTTON' :
                return (
                    <div className='bf-signup-button'>
                        <Nav.Link  className="bf-signup-button" href={item.url}>
                            {item.text}
                        </Nav.Link>
                    </div>
                );
        }
    } 

    return (<>
            <div className='bf-about-landing-screen'>
                <Row>
                    {
                        demoDetails.landingScreen.map((item) =>
                            <Col md="6">
                                {getLandingScreenElements(item)}
                            </Col>
                        )
                    }
                </Row>
            </div>
            <div className='bf-more-details'>
                {
                    demoDetails.demoDetails.map((item) =>
                        getDetails(item)
                    )
                }
            </div>
        </>
    )
}

export default DemoDetails;