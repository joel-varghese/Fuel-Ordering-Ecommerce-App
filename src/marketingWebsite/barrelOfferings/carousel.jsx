import Carousel from 'react-bootstrap/Carousel';

function OfferingCarousel(props) {
  return (
    <Carousel variant="dark">
        {
            props.slides.map((item,i) => 
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={props.getImageUrl(item.imageDetails)}
                        // src={PilotImage}
                        alt="slide"
                    />
                    <Carousel.Caption>
                        <h5>{item.heading}</h5>
                        <p>{item.information}</p>
                    </Carousel.Caption>
                </Carousel.Item>
            )
        }
    </Carousel>
  );
}

export default OfferingCarousel;