
import { Row, Col, Nav } from 'react-bootstrap';

import './barrelOfferings.scss';
import OfferingCarousel from './carousel';

const BarrelOfferings = props => {
    const getOfferingContent = (item,i) => {
        switch(item.type.toUpperCase()) {
            case 'QUESTION' :
                return (<div className="bf-section-sub-head mb-4">{item.itemLabel}</div>);
            case 'HEADING' :
                return (<div className="bf-section-head mb-4">{item.itemLabel}</div>);
            case 'PARAGRAPH' :
                return (<div className="bf-section-text mb-4">{item.itemLabel}</div>);
            case 'LISTIMAGE' :
                return (<ul className='bf-offerint-list'>
                    {item.listData.map((list,index) => 
                        <li key={`offering-list-${index}`}><span><img src={props.getImageUrl(item.imageDetails)} className="bf-bullet-image"/></span><span>{list}</span></li>
                    )}
                </ul>);
            case 'IMAGESTORE' :
                return (<img src={props.getImageUrl(item.imageDetails)} />);
        }
    }
    return (
        <>
            <div className='bf-offerings'>
                <div className='bf-show-mobile'>
                {
                    props.offerings.offeringContent[0].itemLabel
                }
                </div>
                <div className='bf-row'>
                    <div className=''>
                        <img className='bf-graph' src={props.getImageUrl(props.offerings.graph.imageDetails)} alt="graph" />
                    </div>
                    <div className='bf-offerings-content'>
                        {
                            props.offerings.offeringContent.map((item,i) => 
                                item.type.toUpperCase() !== 'IMAGESTORE' ? 
                                    getOfferingContent(item,i)
                                    : null
                            )
                        }
                        <div className='bf-store-list'>
                        {
                            props.offerings.offeringContent.map((item,i) => 
                                item.type.toUpperCase() === 'IMAGESTORE' ? 
                                    getOfferingContent(item,i)
                                    : null
                            )
                        }
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className='bf-deals'>
                {props.offerings.bfMobileDeals &&
                <OfferingCarousel slides={props.offerings.bfMobileDeals} getImageUrl={props.getImageUrl}/>}
                <Row>
                    {
                        props.offerings.bfDeals.map((item,i) => 
                            <Col md={4}>
                                <div style={{"backgroundImage": "url("+props.getImageUrl(item.imageDetails)+")"}}>
                                    <div className='bf-deals-heading'>{item.heading}</div>
                                    <div className='bf-deals-info'>{item.information}</div>
                                </div>
                                
                            </Col>
                        )
                    }
                    
                </Row>
            </div>
            <div className='bf-savings'>
                <Row style={{"backgroundImage": "url("+props.getImageUrl(props.offerings.bfSaving.imageDetails)+")"}}>
                    <img src={props.getImageUrl(props.offerings.bfSaving.mobileImage.imageDetails)} className="bf-mobile-mountain" />
                    <div className="bf-section-head mb-3">{props.offerings.bfSaving.heading}</div>
                    <div className='bf-savings-buttons'>
                        {
                            props.offerings.bfSaving.buttons.map((btn) => 
                                <Nav.Link href={btn.url}>{btn.label}</Nav.Link>
                            )
                        }
                    </div>
                </Row>
            </div>
        </>
    )
}

export default BarrelOfferings;