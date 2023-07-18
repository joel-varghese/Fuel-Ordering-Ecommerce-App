import Nav from 'react-bootstrap/Nav';
import './videoScreen.scss';

const VideoScreen = props => {
    const getUrlDetails = (item) => {
        let videoDetails =  props.getImageUrl(item.imageDetails, item.type)
        return <video disablePictureInPicture controlsList="nodownload" autoPlay loop muted playsInline>
                <source src={videoDetails.mp4} type="video/mp4" />
                <source src={videoDetails.webm} type="video/webm" />
            </video>
    }

    const getLandingScreenElements = (item) => {
        switch(item.type.toUpperCase()) {
            case 'VIDEO' : 
            return (getUrlDetails(item));
            case 'HEADING' :
                return (<div className="landing-information">{item.itemLabel}</div>);
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
    return (
        <div className={`landing-screen ${props.className}`}>{
            props.content.map((item) =>
                getLandingScreenElements(item)
            )
        }
{/*             
            <div class="landing-information">
                {props}
            </div> */}
        </div>
    )
}

export default VideoScreen;