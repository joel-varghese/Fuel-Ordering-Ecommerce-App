import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import chart1 from '../../../assets/images/chart1.png';
import chart2 from '../../../assets/images/chart2.png';
import { bfaJsonService } from '../../../actions/BFAServices/BFAJsonService';
import './statistics.scss';
import { getIsReorder, getIsSummary} from '../../../actions/orderPlacementActions/orderPlacementActions'
import { useDispatch, useSelector } from 'react-redux';
function Statistics() {
    const paylod = { 'blobname': process.env.REACT_APP_STATISTICS };
    const [jsonData, setJsonData] = useState({});
    const dispatch = useDispatch()
    useEffect(() => {
        getIsReorder(dispatch,false)
		getIsSummary(dispatch, false)
        bfaJsonService(paylod).then(data => {
            setJsonData(data && data.data);
        });
    }, []);

    let statisticsData = jsonData.staticData && jsonData.staticData && jsonData.staticData[0].statistics;

  return (
    <div className='statistics-container'>
      <div className='statistics'>
        <div className='bf-statustics-list d-flex align-items-center justify-content-between'>
            {statisticsData ? (statisticsData.map((item, i) => (
            <div className='statistic-card'>
                <span className='icon'>
                    {/* {item.iconname} */}
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1.1" viewBox={item.viewbox} height="28" width="28" xmlns="http://www.w3.org/2000/svg"><path d={item.path}></path></svg>
                </span>
                <span>{item.name}</span>
            </div>))): null}
          </div>
          <Row className='d-flex justify-content-between bf-mrgt2p bf-graph'>
                <div className='statistic-card d-flex d-flex-column'>
                    <div>Statistics 5</div>
                    <img src={chart1} width='550' />
                </div>
                <div className='statistic-card'>
                    <span>Statistics 6</span>
                </div>
            </Row>
            <Row className='d-flex justify-content-between bf-mrgt2p bf-chart'>
                <div className='statistic-card d-flex d-flex-column'>
                    <div>Statistics 7</div>
                    <img src={chart2} width='450' />
                </div>
                <div className='statistic-card bf-add-banner'>
                    <span>Add Banner</span>
                </div>
            </Row>
        </div>
    </div>)
}

export default Statistics