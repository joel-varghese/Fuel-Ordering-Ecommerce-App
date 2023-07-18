import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import chart1 from '../../../assets/images/chart1.png';
import chart2 from '../../../assets/images/chart2.png';
import { bfaJsonService } from '../../../actions/BFAServices/BFAJsonService';
import './statistics.scss';
import { Barchart } from './Barchart'
import { GeoMap } from './GeoMap'
import { Trending } from './Trending'
import Table from "react-bootstrap/Table";
import { TotalAvgGal } from './TotalAvgGal'
import { TotalAvgGalMulti } from './TotalAvgGalMulti'
import { TotalActivity } from './TotalActivity'
import { TopCustomerbyTail } from './TopCustomerbyTail'
import { TreeMap } from './TreeMap';
import { UpcomingDest } from './UpcomingDest';
import CustomCircleChart from './customCircleChart'
import {statisticsDataAction} from './../../../actions/statistics/statisticsActions'
import { useDispatch } from 'react-redux'
import {Storage} from '../../../controls/Storage'; 
import Loader from '../../loader/loader';
import { getIsReorder, getIsSummary} from '../../../actions/orderPlacementActions/orderPlacementActions'
import { getFormattedMMDDYY } from '../../../controls/validations';

function Statistics() {
    const paylod = { 'blobname': process.env.REACT_APP_STATISTICS };
    const [jsonData, setJsonData] = useState({});
    const [staticData,setStaticData]=useState({activeOrder:[],
      tailNumber:[],
      completedRecords:[],
      declineRecords:[],
      disputeRecords:[]
    })
    const [activeOrder, setActiveOrder] = useState([]);
    const [activeOrderDate, setActiveOrderDate] = useState([]);
    const [tailNumber, setTailNumber] = useState([]);
    const [completedRecords, setCompletedRecords] = useState([]);
    const [completedOrderDate, setCompletedOrderDate] = useState([]);
    const [deslinedOrderDate, setDeclinedOrderDate] = useState([]);  
    const [topCustomerByTail, setTopCustomerByTail] = useState([]); 
    const [disputeOrderDate, setDisputeOrderDate] = useState([]);
    const [declineRecords, setDeclineRecords] = useState([]); 
    const [disputeRecords, setDisputeRecords] = useState([]);
    const [totalGallonRecords, setTotalGallonRecords] = useState([]); 
    const [topTransation, setTopTransation] = useState([]); 
    const [topTransationData, setTopTransationData] = useState([]);
    const [topOperatorData, setTopOperatorData] = useState([]);
    /* const [totalAvragePriceRecords, settotAlAvragePriceRecords] = useState([]);
    const [totalOrderRecords, setTotalOrderRecords] = useState([]); */
    const [topDestinationRecords, setTopDestinationRecords] = useState([]);
    const [loader, setLoader] = useState([]);
    const [customerRecords, setCustomerRecords] = useState([]); 
    const [customerRecordsDate, setCustomerRecordsDate] = useState([]);
    const [topPlaneType, setTopPlaneType] = useState([]);
    const [topGallonOrderRecords, setTopGallonOrderRecords] = useState([]);
    const [avragePriceRecords, setAvragePriceRecords] = useState([]);
    const [currentMonth, setCurrentMonth] = useState([]);
   
    const dispatch = useDispatch()
    useEffect(() => {
        getIsReorder(dispatch,false)
		    getIsSummary(dispatch, false)
        bfaJsonService(paylod).then(data => {
        setJsonData(data && data.data);
            

        });
    }, []);


      

    useEffect(()=>{
      setLoader(true)
      statisticsDataAction(dispatch,{"Organisation":Storage.getItem('userType') ==="Barrel Fuel"?"Operator":Storage.getItem('organizationName'),"Role":Storage.getItem('userType') ==="Barrel Fuel"?"BFUser":Storage.getItem('userType'),"Loggedinuser":Storage.getItem('email')}).then((res) => {
        let activeOrder = res[0] && res[0][0] && res[0][0]['JSON_UNQUOTE(@OrdersJSONResponse)'] && res[0][0]['JSON_UNQUOTE(@OrdersJSONResponse)']
        activeOrder = activeOrder !== null && activeOrder?JSON.parse(activeOrder && activeOrder).ActiveOrders:[]
        let activeOrderData = createOrderData(activeOrder.Orders)
        let tailNumber = []
        if(Storage.getItem('userType') !== "Barrel Fuel"){
          tailNumber = res[1] && res[1][0] && res[1][0]['JSON_UNQUOTE(@TailNumberJSONResponse)'] && res[1][0]['JSON_UNQUOTE(@TailNumberJSONResponse)']
          tailNumber = JSON.parse(tailNumber && tailNumber)
          tailNumber = createTailnumberData(tailNumber)
        } else {
          tailNumber = res[11] && res[11][0] && res[11][0]['JSON_UNQUOTE(@FuelPriceExpirationJSONResponse)'] && res[11][0]['JSON_UNQUOTE(@FuelPriceExpirationJSONResponse)']
          tailNumber = JSON.parse(tailNumber && tailNumber)
          tailNumber = createFuelPriceExp(tailNumber)
        }
        let completedRecords = [];
        let completedOrderData = []
        if(Storage.getItem('userType') === "Barrel Fuel"){ 
          completedRecords = res[16] && res[16][0] && res[16][0]['JSON_UNQUOTE(@CompletedOrdersBFJSONResponse)'] && res[16][0]['JSON_UNQUOTE(@CompletedOrdersBFJSONResponse)']
          completedRecords = completedRecords !== null && completedRecords?JSON.parse(completedRecords && completedRecords).CompletedOrders:[]
          completedOrderData = createOrderData(completedRecords.Orders)  
        }else {
        completedRecords = res[2] && res[2][0] && res[2][0]['JSON_UNQUOTE(@CompletedOrdersJSONResponse)'] && res[2][0]['JSON_UNQUOTE(@CompletedOrdersJSONResponse)']
        completedRecords = completedRecords !== null && completedRecords?JSON.parse(completedRecords && completedRecords).CompletedOrders:[]
        completedOrderData = createOrderData(completedRecords.Orders)
      }

        let declineRecords = res[3] && res[3][0] && res[3][0]['JSON_UNQUOTE(@DecOrCancelOrdersJSONResponse)'] && res[3][0]['JSON_UNQUOTE(@DecOrCancelOrdersJSONResponse)']
        declineRecords = declineRecords !== null && declineRecords?JSON.parse(declineRecords && declineRecords).Declined:[]
        let declineOrderData = createOrderData(declineRecords.Orders)

        let disputeRecords = res[4] && res[4][0] && res[4][0]['JSON_UNQUOTE(@DisputedOrdersJSONResponse)'] && res[4][0]['JSON_UNQUOTE(@DisputedOrdersJSONResponse)']
        disputeRecords = disputeRecords !== null && disputeRecords?JSON.parse(disputeRecords && disputeRecords).disputeOrder:[]
        let disputeOrderData = createOrderData(disputeRecords.Orders)

        /*Top destination* */

        let topDestinationRecords = [];
      if(Storage.getItem('userType') === "Barrel Fuel"){
        topDestinationRecords = res[13] && res[13][0] && res[13][0]['JSON_UNQUOTE(@TopDestinationsJSONResponse)'] && res[13][0]['JSON_UNQUOTE(@TopDestinationsJSONResponse)'] 
        
      } else if(Storage.getItem('userType') === "Operator"){
        topDestinationRecords = res[5] && res[5][0] && res[5][0]['JSON_UNQUOTE(@TopDestinationsOpJSONResponse)'] && res[5][0]['JSON_UNQUOTE(@TopDestinationsOpJSONResponse)'] 
      }else {
        topDestinationRecords = res[7] && res[7][0] && res[7][0]['JSON_UNQUOTE(@TopDestinationsFBOJSONResponse)'] && res[7][0]['JSON_UNQUOTE(@TopDestinationsFBOJSONResponse)'] 
      }
      
        topDestinationRecords = topDestinationRecords ?JSON.parse(topDestinationRecords && topDestinationRecords):[];
       /** top destination end */ 
       /** top Operator */
       let topOperatorRecords = [];
       if(Storage.getItem('userType') === "Barrel Fuel"){
        topOperatorRecords = res[14] && res[14][0] && res[14][0]['JSON_UNQUOTE(@TopOperatorsJSONResponse)'] && res[14][0]['JSON_UNQUOTE(@TopOperatorsJSONResponse)'] 
        topOperatorRecords = topOperatorRecords ?JSON.parse(topOperatorRecords && topOperatorRecords):[];
      }
      
      topOperatorRecords = createTopOperatorData(topOperatorRecords)

       /** top operator end */
       let totalGallonRecords = []
       let totalGallonRecordsd = []
       if(Storage.getItem('userType') === "Barrel Fuel"){
        totalGallonRecords = res[12] && res[12][0] && res[12][0]['JSON_UNQUOTE(@TotalGallonsAvgFuelPriceJSONResponse)'] && res[12][0]['JSON_UNQUOTE(@TotalGallonsAvgFuelPriceJSONResponse)'] 
        totalGallonRecordsd = totalGallonRecords!== null && totalGallonRecords ?JSON.parse(totalGallonRecords && totalGallonRecords)[0].gallons:[]
        totalGallonRecordsd = createMonthlyOrderData(totalGallonRecordsd)
          
       } else if(Storage.getItem('userType') === "Operator"){
        totalGallonRecords = res[6] && res[6][0] && res[6][0]['JSON_UNQUOTE(@TotalGallonsAvgFuelPriceOPJSONResponse)'] && res[6][0]['JSON_UNQUOTE(@TotalGallonsAvgFuelPriceOPJSONResponse)'] 
        totalGallonRecordsd = totalGallonRecords!== null && totalGallonRecords ?JSON.parse(totalGallonRecords && totalGallonRecords)[0].gallons:[]
        totalGallonRecordsd = createMonthlyOrderData(totalGallonRecordsd)
       } else {
          totalGallonRecords = res[8] && res[8][0] && res[8][0]['JSON_UNQUOTE(@TotalGallonsAvgFuelPriceFBOJSONResponse)'] && res[8][0]['JSON_UNQUOTE(@TotalGallonsAvgFuelPriceFBOJSONResponse)'] 
          totalGallonRecordsd = totalGallonRecords!== null && totalGallonRecords ?JSON.parse(totalGallonRecords && totalGallonRecords)[0].gallons:[]
          totalGallonRecordsd = createMonthlyOrderData(totalGallonRecordsd)
       }
        
        
        let totalAvgPrice =  totalGallonRecords!== null && totalGallonRecords ?JSON.parse(totalGallonRecords && totalGallonRecords)[0].AvgPrice:[]
        totalAvgPrice = createMonthlyOrderData(totalAvgPrice)

        let totalOrdervalue =  totalGallonRecords!== null && totalGallonRecords ?JSON.parse(totalGallonRecords && totalGallonRecords)[0].ordervalue:[]
        totalOrdervalue = createMonthlyOrderData(totalOrdervalue)
        setTotalGallonRecords([totalGallonRecordsd,totalAvgPrice,totalOrdervalue])

        let topCustomerByTail = res[9] && res[9][0] && res[9][0]['JSON_UNQUOTE(@TopCustomerbyTailJSONResponse)'] && res[9][0]['JSON_UNQUOTE(@TopCustomerbyTailJSONResponse)'] 
        topCustomerByTail = topCustomerByTail ?JSON.parse(topCustomerByTail && topCustomerByTail):[];
        
         topCustomerByTail = createTopCustomerByTailData(topCustomerByTail)
        let topPlaneType = res[10] && res[10][0] && res[10][0]['JSON_UNQUOTE(@TopPlaneTypeJSONResponse)'] && res[10][0]['JSON_UNQUOTE(@TopPlaneTypeJSONResponse)'] 
        topPlaneType = topPlaneType ?JSON.parse(topPlaneType && topPlaneType):[];
        topPlaneType = topPlaneType && topPlaneType.length >0 && {name:topPlaneType[0].PlaneType,
          data: [
            {
              x: topPlaneType[0].PlaneType,
              y: topPlaneType[0].NoOfOrders,
            }]}


        
        let topTransation = res[15] && res[15][0] && res[15][0]['JSON_UNQUOTE(@TopTransactionsJSONResponse)'] && res[15][0]['JSON_UNQUOTE(@TopTransactionsJSONResponse)'] 
        topTransation = topTransation ?JSON.parse(topTransation && topTransation).Transactions:[];
        
       //let topTransationData = createtopTransationData(topTransation.Orders)
       let topTransationData = createOrderData(topTransation.Orders)
            //let total

       let topGallonOrderRecords = [];
       if(Storage.getItem('userType') === "Barrel Fuel"){
        topGallonOrderRecords = res[12] && res[12][0] && res[12][0]['JSON_UNQUOTE(@TotalGallonsAvgFuelPriceJSONResponse)'] && res[12][0]['JSON_UNQUOTE(@TotalGallonsAvgFuelPriceJSONResponse)'] 

        topGallonOrderRecords = topGallonOrderRecords ?JSON.parse(topGallonOrderRecords && topGallonOrderRecords):[];
        topGallonOrderRecords = createTopGallonOrderRecordsData(topGallonOrderRecords)
        
      }
      

      let customerRecords = [];
      let customerRecordData = []
      if(Storage.getItem('userType') === "Barrel Fuel"){ 
        customerRecords = res[17] && res[17][0] && res[17][0]['JSON_UNQUOTE(@CustomersBFJSONResponse)'] && res[17][0]['JSON_UNQUOTE(@CustomersBFJSONResponse)']
        customerRecords = customerRecords !== null && customerRecords?JSON.parse(customerRecords && customerRecords).NewCustomers:[]
        customerRecordData = createOrderData(customerRecords.Customers, true)  
      }
      let avragePriceRecords = [];
      let avragePriceRecordData = []
      //if(Storage.getItem('userType') === "Barrel Fuel"){ 
        avragePriceRecords = res[20] && res[20][0] && res[20][0]['JSON_UNQUOTE(@FuelPriceTrendOPJSONResponse)'] && res[20][0]['JSON_UNQUOTE(@FuelPriceTrendOPJSONResponse)']
        avragePriceRecords = avragePriceRecords !== null && avragePriceRecords?JSON.parse(avragePriceRecords && avragePriceRecords)[0].StateFuelPrice:[]
        //customerRecordData = createOrderData(customerRecords.Customers)  
      //}
       
      const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const d = new Date();
      setCurrentMonth(month[d.getMonth()])

        let displayData = {
          activeOrder:activeOrder ? activeOrder :[],
          tailNumber:tailNumber ? tailNumber:[],
          completedRecords:completedRecords ? completedRecords :[],
          declineRecords:declineRecords ? declineRecords:[],
          disputeRecords:disputeRecords ? disputeRecords:[]
        }
        setStaticData(displayData)
        setActiveOrder(activeOrder)
        setActiveOrderDate(activeOrderData)
        setTailNumber(tailNumber)
        setCompletedRecords(completedRecords)
        setCompletedOrderDate(completedOrderData)
        setDeclineRecords(declineRecords) 
        setDeclinedOrderDate(declineOrderData)
        setDisputeRecords(disputeRecords)
        setDisputeOrderDate(disputeOrderData) 
        setTopDestinationRecords(topDestinationRecords)
        setTopCustomerByTail(topCustomerByTail)
        setTopTransation(topTransation)
        setTopTransationData(topTransationData)
        setTopOperatorData(topOperatorRecords)
        setCustomerRecords(customerRecords) 
        setCustomerRecordsDate(customerRecordData)
        setTopPlaneType(topPlaneType)
        setTopGallonOrderRecords(topGallonOrderRecords)
        setAvragePriceRecords(avragePriceRecords)
        setLoader(false)
      })

    },[jsonData])

    const createOrderData = (data, newCustomers) => {
     
      let order = [];
      let orderDate = [];
      let allData = [];
      if(data !== null){data && data.map((item) =>{
        if(newCustomers && newCustomers){
          order.push(item.Count)
        } else{
         order.push(item.orders)
      }
        orderDate.push(getFormattedMMDDYY(item.date.replace('00:00:00.000000',"")))
      })
    }
      allData.push(order)
      allData.push(orderDate)
      return allData
    }

    const createMonthlyOrderData = (data) => {
      let order = [];
      let monthDate = [];
      let allData = [];
      if(data !== null){data && data.map((item) =>{
        order.push(item.data)
        monthDate.push(item.Month)
      })}
      allData.push(order)
      allData.push(monthDate)
      return allData
    }
    const createTopGallonOrderRecordsData = (data) => {
      let wholeData = []
      let dateData = []
      data[0].gallons.map((item,index)=>{
        let galonDataArray = [];
        let gallonData = { name:item.FuelType,type:"column"}
        item.data.map((itemIn, IndexIn)=>{
          galonDataArray.push(itemIn.data)
          dateData.push(itemIn.Month+"/01/"+itemIn.Year)
        })
        gallonData.data = galonDataArray

        wholeData.push(gallonData)
      })

      let AvgPriceDataArray = [];
      let AvgPrice = { name:"Avrage Gallon Price",type:"line"}
      data[0].AvgPrice.map((item,index)=>{
        
          AvgPriceDataArray.push(item.data)
        }) 
        AvgPrice.data = AvgPriceDataArray

        wholeData.push(AvgPrice)

        let orderValueDataArray = [];
      let orderValue = { name:"Order Value",type:"area"}
      data[0].ordervalue.map((item,index)=>{
        
        orderValueDataArray.push(item.data)
        }) 
        orderValue.data = orderValueDataArray

        wholeData.push(orderValue)
      


      return [wholeData,dateData]

      /* let order = [];
      let monthDate = [];
      let allData = [];
      if(data !== null){data && data.map((item) =>{
        order.push(item.data)
        monthDate.push(item.Month)
      })}
      allData.push(order)
      allData.push(monthDate)
      return allData */
    }

    const createTopCustomerByTailData = (topCustomerByTail) =>{
      let tailNumber = []
      let noOfOgders = []
      let totalOdrderValue = []
      let totalSavingtailNumber = []
      let wholeData = []
      topCustomerByTail && topCustomerByTail.map((item)=>{
      tailNumber.push(item.tailNumber)
      noOfOgders.push(item.NoOfOrders)
      totalOdrderValue.push(item.totalorderedvalue)
      totalSavingtailNumber.push(item.TotalSavings)
      })
      wholeData.push(tailNumber)
      wholeData.push(noOfOgders)
      wholeData.push(totalOdrderValue)
      wholeData.push(totalSavingtailNumber)
      return wholeData;
    }
    const createTopOperatorData = (topOperatorRecords) =>{
      let wholeData = []
      topOperatorRecords && topOperatorRecords.map((item)=>{
        wholeData.push({
          "x": item.OperatorName,
          //"y": "Total Gallon"+item.TotalGallons+"-"+"Total Gallon"+item.TotalOrders,
          "y": item.TotalGallons,
        },)
      })
      return [{"data":wholeData, name:"Top Operators"}];
    }

    const createTailnumberData = (tailNumber) =>{
      let data = []
      tailNumber && tailNumber.map((item)=>{
        data.push(createData(item.tailNumber,item.gallons,item.orderedAmount?"$"+item.orderedAmount:item.orderedAmount,item.status))
      })
      return data;
    }
    const createFuelPriceExp = (tailFuelPriceExp) =>{
      let data = []
      tailFuelPriceExp && tailFuelPriceExp.map((item)=>{
        data.push(createData(item.Organization,item.AirportID,item.Status))
      })
      return data;
    }
    function createData(tailnumber, gallons, amount, status) {
      return { tailnumber, gallons, amount, status };
    }

    let statisticsData = jsonData.staticData && jsonData.staticData && jsonData.staticData[0].statistics;
    
  return (
    <>{loader ? <div className='table-loader'><Loader height="auto"/> </div>:
      <div className={`bf-dashboard-statistics ${Storage.getItem('userType') === "Barrel Fuel"? 'bf-scroll-imp ' : 'bf-operator-fbo-TotalGallons'} `}>
        <div className="bf-trip-card-details">
          <div className="bf-tirp-card">
            <CustomCircleChart label={"Active Orders"} 
            totalCount= {activeOrder && activeOrder.TotalOrders}
            title={"90 Days Trend"}
            trends = {activeOrderDate && activeOrderDate}
            value1 = {activeOrder  && activeOrder.CurrentWeekOrders}
            value2 = {activeOrder  && activeOrder.FutureOrders}
            string1 = {"Orders This Week"}
            string2 = {"Pending Order"}
            options = {"Trips"}
            category = {activeOrder  && activeOrder.Orders &&  activeOrder.Orders.length}
            innerLabel={"Order"}
            optionArray = {{colour:"rgb(214, 220, 229)", 
            titleText:"90 day Trend",
            // titleOffsetY:-50, 
            // titleOffsetX:0,
            chartOffsetY:12,
            chartOffsetX:-6,
            
            strokeColour:"rgb(132, 151, 176)"}}
            width="130%"
            />
          </div>
          
          <div className="bf-tirp-card">

          <CustomCircleChart label={"Completed Orders"} 
            totalCount= {completedRecords.totalCount}
            title={"Completed Orders"}
            trends = {completedOrderDate && completedOrderDate}
            value1 = {Storage.getItem('userType') === "Barrel Fuel"?completedRecords && parseInt(completedRecords.EscalatedOrders):completedRecords && parseInt(completedRecords.monthsOrder)}
            value2 = {Storage.getItem('userType') === "Barrel Fuel"?(completedRecords && ("$"+parseInt(completedRecords.AverageProfit))):completedRecords && (parseInt(completedRecords.savingThisMonth))}
            string1 = {Storage.getItem('userType') ==="Barrel Fuel"?"Total Orders Pending":currentMonth +" Orders"}
            string2 = {Storage.getItem('userType') ==="Barrel Fuel"?"Average Profit":"Savings This Month"}
            options = {"Trips1"}
            innerLabel={"Order"}
            optionArray = {{colour:"#90EE7E", 
            titleText:"YTD Trip",
            // titleOffsetY:-50, 
            // titleOffsetX:0,
            chartOffsetY:12,
            chartOffsetX:-6,
            
            strokeColour:"#548235"}}
            width="130%"
            />
            
          </div>

          <div className="bf-tirp-card">
          <CustomCircleChart label={"Canceled / Declined"} 
             totalCount= {declineRecords.totalCount}
            title={"Decline"}
            /* trends = {activeOrderDate && activeOrderDate}
            value1 = {activeOrder  && activeOrder.CurrentWeekOrders}
            value2 = {activeOrder  && activeOrder.FutureOrders} */
             trends = {deslinedOrderDate && deslinedOrderDate}
            value1 = {declineRecords && declineRecords.CanceledOrder + (Storage.getItem('userType') ==="Barrel Fuel"?"%":null)}
            value2 = {declineRecords && declineRecords.DeclinedOrders + (Storage.getItem('userType') ==="Barrel Fuel"?"%":null)} 
            string1 = {Storage.getItem('userType') ==="Barrel Fuel"?"Cancel Rate":"Canceled Orders"}
            string2 = {Storage.getItem('userType') ==="Barrel Fuel"?"Decline Rate":"Declined Orders"}
            options = {"Trips2"}
            innerLabel={"Order"}
            optionArray = {{colour:"#F4ECFA", 
            titleText:"Decline",
            // titleOffsetY:-50, 
            // titleOffsetX:0,
            chartOffsetY:12,
            chartOffsetX:-6,  
            strokeColour:"#B17FDB"}}
            width="130%"
            />
           </div>         
            
          <div className="bf-tirp-card">
          <CustomCircleChart label={"Disputed Trips"} 
            totalCount= {disputeRecords.totalCount}
            title={"Disputed Trips"}
            trends = {disputeOrderDate && disputeOrderDate}
            value1 = {disputeRecords && parseInt(disputeRecords.monthsDisputes)}
            value2 = {disputeRecords && parseInt(disputeRecords.ResolutionRates)+"%"}
            string1 = {Storage.getItem('userType') ==="Barrel Fuel"?"Total Open Dispute":currentMonth +" Disputes"}
            string2 = {"Resolution Rates"}
            options = {"Trips3"}
            innerLabel={"Order"}
            optionArray = {{colour:"#FBE5D6", 
            titleText:"YTD Dispute",
            // titleOffsetY:-50, 
            // titleOffsetX:0,
            chartOffsetY:12,
            chartOffsetX:-6,
            strokeColour: "#F4B183"}}
            width="130%"
            />
            
           
            
          </div>
        </div>
        <div className="bf-dashboard-graphs-container bf-dashboard-graphs-cantainer-chart">
          <div className="bf-cost-price-container bf-cost-price-container-chart">
            <div className="bf-avg-cost">
              <TreeMap 
                fontColur={"grey"} 
                colour1={"#C5D86D"} 
                colour2={"#449DD1"}  
                title ={Storage.getItem('userType') === "Operator"?"Top Trips":"Top Destination"} 
                topDestinationRecords={topDestinationRecords}   width="80%" />
            </div>
            <div className="bf-avg-price">
              <div className="bf-price-label">Average Price</div>

              <GeoMap avragePriceRecords ={avragePriceRecords} />
            </div>
            <div className="bf-top-gallons bf-top-customers-by-tail">
              <div className="bf-gallons-label">
              {Storage.getItem('userType') ==="Barrel Fuel"?
              "Top Customer by Tail":
              "Total Gallons, Average Fuel Price & Total Savings"}
              </div>{Storage.getItem('userType') ==="Barrel Fuel"?
              <TopCustomerbyTail data={topCustomerByTail && topCustomerByTail} />:
              <TotalAvgGal totalGallonRecords={totalGallonRecords}   />
               }
            </div>
            <div className="bf-upcoming-dests">
              <UpcomingDest status ={Storage.getItem('userType') !== "Barrel Fuel"?true:false} data={tailNumber && tailNumber} />
            </div>
          </div>
          {Storage.getItem('userType') ==="Barrel Fuel"?
          <div className="bf-destination-container">
            <div className="bf-dest-con">
            <CustomCircleChart label={"Customers"} 
            totalCount= {customerRecords && customerRecords.totalfbos+"/"+customerRecords && customerRecords.totaloperators}
            title={"90 Days Trend"}
            trends = {customerRecordsDate && customerRecordsDate}
            value1 = {customerRecords  && customerRecords.PendingOnboarding}
            value2 = {customerRecords  && customerRecords.TimeToOnboardOperator && customerRecords.TimeToOnboardOperator !== null?customerRecords.TimeToOnboardOperator :"0.00"}
            string1 = {Storage.getItem('userType') ==="Barrel Fuel"?"Total Pending":"Orders This Week"}
            string2 = {Storage.getItem('userType') ==="Barrel Fuel"?"Time To Onboard":"Future Orders"}
            options = {"Trips4"}
            innerLabel={"Customers"}
            category = {customerRecords  && customerRecords.Orders &&  customerRecords.Customers.length}
            optionArray = {{colour:"#fbd6dd", 
            titleText:"90 day Trend",
            // titleOffsetY:-65, 
            // titleOffsetX:0,
            chartOffsetY:12,
            chartOffsetX:-6,
            strokeColour:"#c96d7e"}}
            condition ={false}
            width="130%"
            />
            </div>
            <div className="bf-dest-con">
            <CustomCircleChart label={"Transactions"} 
            totalCount= {parseFloat(topTransation && topTransation.OrderTransactions && topTransation.OrderTransactions[0].TotalOrderValue).toFixed(2)}
            title={"90 Days Trend"}
            trends = {topTransationData && topTransationData}
            value1 = {parseFloat(topTransation && topTransation.OrderTransactions && topTransation.OrderTransactions[0].TotalFuelGallona).toFixed(2)}
            value2 = {parseFloat(topTransation && topTransation.OrderTransactions && topTransation.OrderTransactions[0].TotalTransactions).toFixed(2)}
            string1 = {Storage.getItem('userType') ==="Barrel Fuel"?"All Completed Order":"Orders This Week"}
            string2 = {Storage.getItem('userType') ==="Barrel Fuel"?"Total Transactions":"Future Orders"}
            options = {"Trips4"}
            innerLabel={"Transactions"}
            category = {topTransation  && topTransation.Orders &&  topTransation.Orders.length}
            optionArray = {{colour:"#fbfad6", 
            titleText:"90 day Trend",
            // titleOffsetY:-65, 
            // titleOffsetX:0,
            chartOffsetY:12,
            chartOffsetX:-6,
            strokeColour:"#b5b364"}}
            condition ={true}
            width="130%"
            />
           </div>
            
          </div>:   <div className="bf-destination-container">
            <div className="bf-dest-con"><div className="bf-space">
              <div className="bf-adspace">Ad Space</div>
            </div>
              {/* <div className="bf-top-destinations">
                <Barchart />

                <div className="factdtls">Interesting facts</div>
              </div>
              <div className="bf-top-destinations">
                <Barchart />
                <div className="factdtls">Interesting facts</div>
              </div>
              <div className="bf-top-destinations">
                <Barchart />
                <div className="factdtls">Interesting facts</div>
              </div> */}
            </div>
            <div className="bf-dest-con"><div className="bf-space">
              <div className="bf-adspace">Ad Space</div>
            </div></div>
          </div>}
        </div>
        {Storage.getItem('userType') ==="Barrel Fuel"?<><div className="bf-dashboard-graphs-container bf-activity-chart-section">
          <div className="bf-cost-price-container new-internal-table">
            <div className="bf-top-gallons multi-line-graph">
               <TotalActivity totalGallonRecords={totalGallonRecords} />
            </div>
            <div className="bf-upcoming-dests bf-fuel-details-chart-section multi-line-graph">
              <TotalAvgGalMulti data={topGallonOrderRecords && topGallonOrderRecords} />
            </div>
          </div>
         
        </div>
        <div className="bf-dashboard-graphs-container">
          <div className="bf-cost-price-container new-internal-table">
            <div className="bf-top-gallons multi-line-graph">
            <TreeMap fontColur={"#fcfdff"} colour1={"#4b5c99"} colour2={"#7790ed"}   width="90%" title ={"Top Operator"} topDestinationRecords={topOperatorData} />
            </div>
            <div className="bf-upcoming-dests multi-line-graph">
            <TreeMap fontColur={"#fcfdff"} colour1={"#d48928"} colour2={"#99774b"}   width="80%" title ={"Top Plane Type"} topDestinationRecords={[topPlaneType]} />
            </div>
          </div>
         
        </div></>:null}
        
      </div>}
      
    </>
  );
}

export default Statistics