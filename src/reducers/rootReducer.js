import { combineReducers } from 'redux';
import dashboardReducer from './dashboardReducer/dashboardReducer';
import accountHomeReducer from './accountHomeReducer/accountHomeReducer';
import profileReducer from './profileReducer/profileReducer';
import accountCompanyReducer from './accountCompanyReducer/accountCompanyReducer';
import accountLocationReducer from './accountLocationReducer/accountLocationReducer';
import userReducer from './userReducer/userReducer';
import landingReducer from './landingPageReducer/landingPageReducer';
import aboutReducer from './aboutReducer/aboutReducer';
import manubarReducer from './menubarReducer/menubarReducer';
import footerReducer from './footerReducer/footerReducer';
import demoReducer from './demoReducer/demoReducer';
import contactReducer from './contactReducer/contactReducer';
import notificationReducer from './notificationReducer/notificationReducer';
import aircraftReducer from './accountAircraftReducer/accountAircraftReducer';
import documentReducer from './accountDocumentReducer/accountDocumentReducer';
import paymentReducer from './accountPaymentReducer/accountPaymentReducer';
import loginReducer  from './loginReducer/loginReducer';
import searchHomeReducer from './universalSearchReducer/searchHomeReducer';
import taxFeesHomeReducer from './taxFeesHomeReducer/taxFeesHomeReducer';
import taxHomeReducer from './taxFeesHomeReducer/taxHomeReducer';
import feeHomeReducer from './taxFeesHomeReducer/feeHomeReducer';
import additionalServiceHomeReducer from './taxFeesHomeReducer/additionalServiceHomeReducer';
import fuelPriceHomeReducer from './fuelPriceHomeReducer/fuelPriceHomeReducer'
import discountReducer from './discountReducer/discountReducer';
import commonReducer from './commonReducer/commonReducer';
import searchFuelOrderReducer from './searchFuelOrderReducer/searchFuelOrderReducer';
import orderPlacementReducer from './orderPlacementReducer/orderPlacementReducer';
import orderPlacementDataReducer from './orderPlacementReducer/orderPlacementDataReducer';
import orderPlacementSummaryReducer from './orderPlacementReducer/orderPlacementSummaryReducer';
import orderViewDataReducer from './orderPlacementReducer/orderViewReducer';
import orderViewHomeReducer from './orderPlacementReducer/orderViewHomeReducer';
import multiLegReducer from './orderPlacementReducer/multiLegReducer';
import multiLegSummaryReducer from './orderPlacementReducer/multiLegReducerReducer';
import disputeReducer from './orderReducer/disputeReducer';
import orderCompletedReducer from './orderReducer/orderCompletedReducer';
import orderActiveReducer from './orderReducer/orderActiveReducer';
import activeOrderReducer from './orderReducer/activeOrderReducer';
import auditLogReducer from './auditLogReducer/auditLog';
import statisticsReducer from './statisticsReducer/statisticsReducer';
import enrollmentReducer from './enrollmentReducer/enrollmentReducer';
import AdminReducer from './accountAdminReducer/adminReducer';

export default  combineReducers({
    dashboardReducer,
    accountHomeReducer,
    profileReducer,
    accountCompanyReducer,
    accountLocationReducer,
    userReducer,
    landingReducer,
    aboutReducer,
    demoReducer,
    contactReducer,
    manubarReducer,
    footerReducer,
    notificationReducer,
    aircraftReducer,
    documentReducer,
    paymentReducer,
    searchHomeReducer,
    taxFeesHomeReducer,
    taxHomeReducer,
    feeHomeReducer,
    additionalServiceHomeReducer,
    loginReducer,
    fuelPriceHomeReducer,
    discountReducer,
    commonReducer,
    searchFuelOrderReducer,
    orderPlacementReducer,
    orderPlacementDataReducer,
    orderPlacementSummaryReducer,
    orderViewDataReducer,
    orderViewHomeReducer,
    multiLegReducer,
    multiLegSummaryReducer,
    disputeReducer,
    orderCompletedReducer,
    orderActiveReducer,
    activeOrderReducer,
    auditLogReducer,
    statisticsReducer,
    enrollmentReducer,
    AdminReducer
})
