import React, { useEffect, useState } from 'react'
import { SendMailToUsers } from '../../services/commonServices'
import logo from '../../assets/images/Order_invoice_lobo.png';
import ServicesIocn from '../../assets/images/Invoice-services.png';
import TaxesIcon from '../../assets/images/Invoice-Tax-Fee.png';    
import { getFormatedAmount, getFormatedDateforDisplay, getFormattedDDMMYY, getFormattedMMDDYY, phoneValidation } from '../../controls/validations';
import './invoice.scss';


export default function Invoice(props) {
    const [inVoiceData, setInVoiceData] = useState({})
    const [orderLeg, setOrderLeg] = useState([])
    const [taxesandFees, setTaxesandFees] = useState([])
    useEffect(() => {
        if(props.invoiceData){
            let Data = props?.invoiceData
            let orderLegs = Data?.OrderLegs && Data?.OrderLegs.length && Data?.OrderLegs[0]
            let fees=orderLegs?.Fees ? orderLegs?.Fees :[]
            let taxes=orderLegs?.Taxes ? orderLegs?.Taxes : []
            setInVoiceData(orderLegs)
            setOrderLeg(Data)
            let allTaxesAndFees=[...taxes, ...fees]
            setTaxesandFees(allTaxesAndFees)
        }
    }, [props])
    const phoneNumber = 5637628382

  return (
    <div style={{"height":"100%","width":"100%"}} className="bf-invoice" id="invoicePDFContainer">
        <div className='bf-invoice-left'>
            <div className='bf-invoice-logo'>
                <img src={logo} alt="bf-logo" className=''/>
            </div>
            <div className='bf-order-date-details'>
                <div>Order Number: <span>{inVoiceData?.OrderNumber}</span></div>
                <div>Fueling Date: <span>{getFormatedDateforDisplay(inVoiceData?.FuellingDate)}</span></div>
            </div>
            <div className='bf-bill-to'>
                <div className='bf-invoice-heading'>Bill To</div>
                <div>{`${orderLeg?.OperatorName} `}</div>
                <div>Phone Number: <span>{phoneValidation(orderLeg?.Operator_ContactNumber ? orderLeg?.Operator_ContactNumber?.toString():"")}</span></div>
                <div>{orderLeg?.Operator_Address ? orderLeg?.Operator_Address :""}</div>
            </div>
            <div className='bf-fueling-location-detils'>
                <div className='bf-invoice-heading'>Fueling Location</div>
                <div>{`${inVoiceData?.FBO} `}</div>
                <div>{`Phone Number: ${phoneValidation(inVoiceData?.FBO_ContactNumber && inVoiceData.FBO_ContactNumber.toString())}`}</div>
                <div>{inVoiceData?.Address}</div>
            </div>
            <div className='bf-flight-details'>
                <div className='bf-invoice-heading'>Flight Details</div>
                <div>Tail Number: <span>{inVoiceData?.TailNumber}</span></div>
                <div>Flight Type: <span>{inVoiceData?.FlightType}</span></div>
                <div>Aircraft: <span>{inVoiceData?.AircraftType ? inVoiceData?.AircraftType :inVoiceData?.TailNumber}</span></div>
                <div>Arriving From: <span>{inVoiceData?.ArrivingFrom}</span></div>
                <div>Departing To: <span>{inVoiceData?.ICAO}</span></div>
                <div>Date Of Order: <span>{getFormattedMMDDYY(orderLeg?.OrderDate)}</span></div>
            </div>
            <div className='bf-payment-method'>
                <div className='bf-invoice-heading'>Payment Method</div>
                <div>Type: <span>{"American Express"} </span></div>
                <div>Card/Account No: <span>{"XX 3489"}</span></div>
            </div>
        </div>
        <div className='bf-invoice-right'>
            <h1>{props.isInvoice ? "Invoice" : "Order Confirmation"}</h1>
            <div className='bf-invoice-table-header'>
                <div>Items</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Total</div>
            </div>
            <div className='bf-fuel-details'>
                <div>{`Fuel - ${inVoiceData?.FuelType}`}</div>
                <div>
                    <span>{`$${getFormatedAmount(inVoiceData?.BasePrice)}`}</span>
                    <span className='bf-gal-text'>/ Gal</span>
                </div>
                <div>{`${getFormatedAmount(inVoiceData?.FuelQuantity)}`}</div>
                <div>{`$${getFormatedAmount(parseFloat(inVoiceData?.BasePrice)*parseFloat(inVoiceData?.FuelQuantity))}`}</div>
            </div>
            <div className='bf-invoice-services'>
                <div className='bf-rotate-heading'><img src={ServicesIocn} alt="Services" /></div>
                {inVoiceData?.Services?.length && inVoiceData?.Services.map((serv,index)=>(
                    <div className='bf-invoice-row-item'>
                        <div>{serv.ServiceName}</div>
                        <div>{`$${getFormatedAmount(parseFloat(serv?.Amount).toFixed(2))}`}</div>
                        <div>1</div>
                        <div>{`$${getFormatedAmount(parseFloat(serv?.Amount).toFixed(2))}`}</div>
                    </div>
                ))}
            </div>
            <div className='bf-invoice-taxfees'>
                <div className='bf-rotate-heading'>
                    <img src={TaxesIcon} alt="Taxes and Fees" />
                </div>
                {taxesandFees?.length && taxesandFees.map((item,index)=>(
                    <div className='bf-invoice-row-item'>
                        <div>{item?.TaxName?item.TaxName:item?.FeeName}</div>
                        <div>{`$${getFormatedAmount(parseFloat(item?.Amount)/parseFloat(inVoiceData?.FuelQuantity),6)}`}</div>
                        <div>{`${getFormatedAmount(inVoiceData?.FuelQuantity)}USG`}</div>
                        <div>{`$${getFormatedAmount(item?.Amount)}`}</div>
                    </div>
                ))}
            </div>
            <div className='bf-total-details bf-subtotal'>
                <div></div>
                <div>
                    Sub Total
                </div>
                <div>
                    {`$${getFormatedAmount(inVoiceData?.FinalPrice)}`}
                </div>
            </div>
            <div className='bf-total-details'>
                <div>

                </div>
                <div>
                   {`Card Fee - ${3}%`}
                </div>
                <div>
                    {`$${getFormatedAmount(inVoiceData?.CardFee)}`}
                </div>
            </div>
            <div className='bf-total-details bf-total-paid'>
                <div></div>
                <div>
                    Total Paid
                </div>
                <div>
                    {`$ ${getFormatedAmount(inVoiceData?.FinalPrice)}`}
                </div>
            </div>
            <div className='bf-total-details bf-you-saved'>
                <div></div>
                <div>
                    You Saved
                </div>
                <div>
                    {`$ ${getFormatedAmount(inVoiceData?.FuelQuantity)}`}
                </div>
            </div>
            <div className='bf-invoice-comments'>
                Comments:
            </div>
            <div className='bf-invoice-text-lic'>
                This invoice is subject to Barrel Fuel Technologies, LLC's General Terms and Conditions (a Copy of which is available for review at http://www.barrelfuel.com), which customer
                acknowledges read and accepted. Any and all claims and disputes must be made within 10 days of receipt of invoice to info@barrelfuel.com otherwise it is deemed accepted.
                Customer specifically agrees to the extraterritorial application of Texas Property Code §70.301 notwithstanding that the fueling may take place outside of Texas. PAYMENT 
                DISCLAIMER: To maintain security in your transactions with Barrel Fuel, and to ensure your successful payment of this invoice, please NEVER accept any changes to banking 
                detail instructions, or payment remit information via email, without first contacting your Barrel Fuel representative to verbally confirm any changes to this information. Please 
                immediately report any suspicious emails you receive from Barrel Fuel asking you to change bank details of payment remittance. REMIT USD WIRE TO: Barrel Fuel bank N.A.
            </div>
            <div className='bf-invoice-text-lic'>
                ACCT: Barrel Fuel Technologies LLC. ACCT #: Account, ABA: 043000096, SWIFT: PNCCUS33. REMIT CHECK TO: Barrel Fuel Address
            </div>
            
        </div>
    </div>
  )
}
