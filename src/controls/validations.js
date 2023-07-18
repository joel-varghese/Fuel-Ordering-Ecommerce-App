import { getDiscounts, getFedTaxes } from "../actions/orderPlacementActions/orderPlacementService";
import { fetchFuelResult } from "../actions/searchFuelOrder/searchFuelOrderActions";
import { getFuelLocations } from "../actions/searchFuelOrder/searchFuelOrderService";
import { Storage } from "./Storage";
import { useDispatch, useSelector } from 'react-redux'

export const isValidEmail = (email) => {
    const emailRegex = "([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,4})$";
    var filter = new RegExp(emailRegex);
    return filter.test(email) ? true : false;
}
export const validateRegex = (inputValue, validations) => {
    const regexPattern = validations.validateRule;
    var filter = new RegExp(regexPattern);
    return filter.test(inputValue) ? true : false;
}

export const isMandatory = (fieldValue) => {
    return fieldValue== null || fieldValue === "" ||
    fieldValue ==="NaN/NaN/NaN" ||!fieldValue.length ? (fieldValue && typeof(fieldValue)=='number')? false : true : false;
}

export const getFormErrorRules = (item) => {
    return {
        isValid: item.isRequired ? item.defaultValue ? true : false : true,
        isTouched: false,
        activeValidator: {},
        validations: item.validations,
        isRequired: item.isRequired,
        minLength: item.minLength,
        maxLength: item.maxLength
    };
}


export const validateField = (fieldName, value, fields, isTouched, formErrors,formData,invalidDate) => {
    const fieldValidationErrors = {
        ...formErrors
    };
    let fieldValidationError = null;
    fieldValidationError = fieldValidationErrors[fieldName];

    if (isTouched !== undefined) {

        fieldValidationError.isTouched = isTouched;
    }
    let validationObj = {};
    validationObj = getFieldIsValid(value, fieldValidationError, fieldName,formData,invalidDate);
    fieldValidationErrors[fieldName] = {
        ...validationObj.fieldValidationError
    };
    const errorObj = customValidation(
        fieldName, value, validationObj, formErrors
    );
    return errorObj;
}
export const customValidation = (
    fieldName, value, validationObj, formErrors) => {
    const fieldValidationErrors = {
        ...formErrors
    };
    let errcount = validationObj.errcount;
    if (!errcount) {
        fieldValidationErrors[fieldName].isValid = true;
        fieldValidationErrors[fieldName].activeValidator = {};
    } else {
        fieldValidationErrors[fieldName].isValid = false;
    }
    return fieldValidationErrors;
}

export const getFieldIsValid = (value, fieldValidationError, fieldName,formData,invalidDate) => {
    let validationObj = {
        fieldValidationError: fieldValidationError,
        errcount: 0
    };
    if (fieldValidationError.isRequired === true) {
        validationObj =
            checkValidationByValidationTypes(value, fieldValidationError, fieldName,formData,invalidDate);
    } else {
        if (value) {
            validationObj =
                checkValidationByValidationTypes(value, fieldValidationError, fieldName,formData,invalidDate);
        }
    }
    return validationObj;
}

export const getShowPasswordStatus = () => {

}

export const checkValidationByValidationTypes = (value, fieldValidationError, fieldName,formData,invalidDate) => {
    const validationTypes = ['IsMandatory', 'email', 'password', 'CheckRegex','passwordMatch','CheckUSPhone', "CheckZIP", 'onlyspecial', 'onlydigit','CheckBFDomain','date','amount','fileSize', 'fileType', 'dateGreThirty',"dateLessActive","invalidDate"];
    let errcount = 0;
    let activeValidator = null;
    validationTypes.forEach(validationType => {

        activeValidator = fieldValidationError.validations && fieldValidationError.validations.filter
            (validate => validate.validation === validationType);
        if (activeValidator && activeValidator.length) {
            if (validationType === 'IsMandatory') {
                if (isMandatory(value)) {
                    errcount++;
                    fieldValidationError
                        .activeValidator = activeValidator[0];
                }
            } else if (validationType === 'CheckRegex'|| validationType === 'email') {
                let check = false;
                if (!new RegExp(activeValidator[0].validateRule).test(value)) {
                    check = true;
                }
                if (fieldName == "emailaddress" || fieldName == "emailId") {
                    let splitVal = value.split('@');
                    // let replacedVal = splitVal[0].replaceAll('_', '').replaceAll('.', '')
                    let replacedVal =  !new RegExp('.*[^a-zA-Z0-9._+].*').test(splitVal[0]);
                    if (replacedVal) { }
                    else {
                        check = true
                    }
                }
                if (check) {
                    errcount++;
                    fieldValidationError.activeValidator = activeValidator[0];
                }
            }else if(validationType === 'CheckBFDomain'){
                if(Storage.getItem('userType') == 'Barrel Fuel'){
                    if(new RegExp(activeValidator[0].validateRule).test(value)){
                        let eSplit = value.split('@');
                        if(eSplit.length && eSplit[1]){
                            let convertToLower = eSplit[1].toLowerCase();
                            if(convertToLower == "barrelfuel.com"){
                            
                            }
                            else {
                            errcount++;
                            fieldValidationError.activeValidator = activeValidator[0];
                            }
                        }
                    }
                }
              }
            if (!errcount) {
                if (validationType === 'CheckZIP') {
                    if (!(value.length === 10 || value.length === 5)) {
                        errcount++;
                        fieldValidationError
                            .activeValidator = activeValidator[0];
                    }
                }
            }
            
            if (!errcount) {
                if (validationType === 'onlyspecial') {
                    if (!new RegExp(activeValidator[0].validateRule)
                        .test(value)) {
                        errcount++;
                        fieldValidationError
                            .activeValidator = activeValidator[0];
                    }
                }
            }
            if (!errcount) {
                if (validationType === 'onlydigit') {
                    if (!new RegExp(activeValidator[0].validateRule)
                        .test(value)) {
                        errcount++;
                        fieldValidationError
                            .activeValidator = activeValidator[0];
                    }
                }
            }
            if (!errcount) {
                if (validationType === 'amount' && formData.unit === '%') {
                    if(value>100){
                        errcount++;
                        fieldValidationError.activeValidator = fieldValidationError.validations[1];
                    }
                }
            }
            if (!errcount) {
                if (validationType === 'fileSize') {
                    if (value == "InvalidSize") {
                        errcount++;
                        fieldValidationError
                            .activeValidator = activeValidator[0];
                    }
                }
            }

            if (!errcount) {
                if (validationType === 'fileType') {
                    if (value == "InvalidType") {
                        errcount++;
                        fieldValidationError
                            .activeValidator = activeValidator[0];
                    }
                }
            }
          //if (!errcount) {
                if (validationType === 'date') {
                    if ( invalidDate == true) {
                        errcount++;
                        fieldValidationError.activeValidator = activeValidator[0];
                    }
                }
                if (validationType === 'dateLessActive') {
                    if ( invalidDate == "dateLessActive") {
                        errcount++;
                        fieldValidationError.activeValidator = activeValidator[0];
                    }
                }
                if (validationType === 'dateGreThirty') {
                    if ( invalidDate == 'dateGreThirty') {
                        errcount++;
                        fieldValidationError.activeValidator = activeValidator[0];
                    }
                }
                if (validationType === 'invalidDate') {
                    if ( invalidDate == 'invalidDate') {
                        errcount++;
                        fieldValidationError.activeValidator = activeValidator[0];
                    }
                }
            //}

            if (!errcount) {
                if (validationType === 'CheckUSPhone') {
                    if (value && ((value.match(/\d/g) || []).length !== 10)){
                        errcount++;
                        fieldValidationError
                            .activeValidator = activeValidator[0];
                    }
                }else if (validationType === 'integer') {
                    if (!new RegExp(activeValidator[0].validateRule)
                        .test(value)) {
                        errcount++;
                        fieldValidationError
                            .activeValidator = activeValidator[0];
                    } else if (fieldValidationError.minValue &&
                        +value <=
                        fieldValidationError.minValue) {
                        errcount++;
                        fieldValidationError
                            .activeValidator = activeValidator[0];
                    }
                } else if(validationType === 'passwordMatch'){
                    if(formData['newPassword'] !== value){
                        errcount++;
                        fieldValidationError
                            .activeValidator = activeValidator[0];
                    }
                } else {

                    if (!new RegExp(activeValidator[0].validateRule)
                        .test(value)) {
                        errcount++;
                        fieldValidationError
                            .activeValidator = activeValidator[0];
                    }
                }
            }
        }
    });
    return {
        fieldValidationError: fieldValidationError,
        errcount: errcount
    };
}
export const validateForm = (formErrors) => {
    let formValid = true;
    const formErrorKeys = Object.keys(formErrors);
    for (let i = 0; i < formErrorKeys.length; i++) {
        const fieldName = formErrorKeys[i];
        //skiping state validation as it has default value
        if (!formErrors[fieldName].isValid) {
            formValid = formErrors[fieldName].isValid;
            return formValid;
        }
    }
    return formValid;
    /* this.setState({
        formValid: formValid
    }); */
}

export const matchPassword = (fieldName, value, formData, formErrors) => {
    let fieldValidationErrors = {
        ...formErrors
    };
    let activeValidator =
        fieldValidationErrors[fieldName]
            .validations
            .filter(validation =>
                validation.validation === 'passwordMatch');

    if (formData.newPassword && value && formData.newPassword !== value) {

        fieldValidationErrors[fieldName].activeValidator = activeValidator[0];

    }
    return fieldValidationErrors;
}

export const getPasswordStrength = (fieldName, value, fields, isTouched, formErrors, passwordStrength) => {
    let errorObj = {};
    formErrors[fieldName].validations.map((validation) => {
        if (validation.validation == 'IsMandatory') {
            errorObj = validateField(fieldName, value, fields, isTouched, formErrors)
        } else if (validation.validationRule && !new RegExp(validation.validationRule).test(value)) {
            passwordStrength[validation.validation] = false;
        } else {
            passwordStrength[validation.validation] = true;
        }
    });
    //this.setState(fields);
    return { errorObj, passwordStrength };
}

export const phoneValidation = (value) => {
    let usPhoneVal = '';
        if (value) {					
          usPhoneVal = value.replace(/\D/g, '')
          .replace(/^(\(\d{3})/, '$1-')
          .replace(/(\d{3})(\d{1,5})/, '($1) $2')
          .replace(/(\d{3})(\d{1,5})/, '$1-$2')
          .replace(/(-\d{4})\d+?$/, '$1'); 
        }
    return usPhoneVal;
}

export const einValidation = (value) => {
    let ein = '';
        if (value) {					
          ein = value.replace(/\D/g, '')
          .replace(/^(\d{3})/, '$1-')
          .replace(/-(\d{2})/, '-$1-')
          .replace(/(\d)-(\d{4}).*/, '$1-$2'); 
          if(ein[ein.length-1] === '-'){
            ein = ein.slice(0, -1);
          } 
        }
    return ein;
}

export const zipValidation = (value) => {
    let zip = '';
        if (value) {					
          zip = value.replace(/\D/g, '')
          .replace(/^(\d{5})/, '$1-')
		  .replace(/(\d)-(\d{4}).*/, '$1-$2');
        }
    return zip;
}

export const isValidDate = (dateString) =>
{
    // First check for the pattern
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

export const getFormattedMMDDYY = (fulldate,noYear) => {
    let newDate;
    let date = new Date(fulldate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();
    if(noYear){
        newDate = (month <= 9 ? "0" + month : month)+ "/" + (dt <= 9 ? "0" + dt : dt); 
    }else{
        newDate = (month <= 9 ? "0" + month : month)+ "/" + (dt <= 9 ? "0" + dt : dt) + "/" + year; 
    }
    return newDate;
  }
  export const getFormattedYYMMDD = (fulldate) => {
    let newDate;
    let date = new Date(fulldate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();
    newDate = year + "-" +(month <= 9 ? "0" + month : month)+ "-" + (dt <= 9 ? "0" + dt : dt)  ; 
    return newDate;
  }
  export const getFormatedDateforDisplay = (fulldate)=>{
    let date = new Date(fulldate);
   return ("0"+(date.getMonth()+1)).slice(-2) 
             + "/" + ("0" + date.getDate()).slice(-2)
             + "/" + ("0" + date.getFullYear()).slice(-2);
  }
export const validateAmount = (formdata, fldvalue,isunitValidationReqrd)=>{
    let length = !isunitValidationReqrd&&formdata?.unit && formdata.unit == "%" ? [2,2]:[4,2]
    let value = fldvalue.replace(/(?!-)[^0-9.]/g, "" )
    value = String(value).split(".")
    let Val = ""
    let amount = value[0]
    let decimal = value[1]
    if(value[0]?.length > length[0]){
    amount = value[0].substring(0, length[0]);
    }
    if(value[1]?.length > length[1]){
    decimal = value[1].substring(0, length[1]);
    }
    if(value.length>1){
    Val = `${amount}.${decimal}`
    }else {
    Val = amount
    }
    return Val
}
export const validateOnlyDecimals = (fldvalue) =>{
    let length = [2,2]
    let value = fldvalue.replace(/[^0-9.]/g, "" )
    value = String(value).split(".")
    let Val = ""
    let amount = value[0]
    let decimal = value[1]
    if(value[0]?.length > length[0]){
    amount = value[0].substring(0, length[0]);
    }
    if(value[1]?.length > length[1]){
    decimal = value[1].substring(0, length[1]);
    }
    if(value.length>1){
    Val = `${amount}.${decimal}`
    }else {
    Val = amount
    }
    return Val

}
export const validateUnitAmount = (formdata, fldvalue,actualamount)=>{
    let formData = {...formdata}
    let isActualAmount = actualamount?actualamount:"amount"
    let length = fldvalue == "%" ? [2,2]:[4,2]
    let value = formdata[isActualAmount]
    let amount = formdata[isActualAmount]
    value = String(value).split(".")
    if(value[0]?.length > length[0]){
        amount = ""
    }
    return amount
}
  export const getFormattedDDMMYY = (fulldate) => {
    let newDate;
    let date = new Date(fulldate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();
    newDate =  year +"/" +(month <= 9 ? "0" + month : month)+ "/" +(dt <= 9 ? "0" + dt : dt); 
    return newDate;
  }
  
  export const getFormatedAmount = (amount,decimal) => {
    var opts = { minimumFractionDigits: 2 };
    let result = amount && Intl.NumberFormat("en-US",opts).format(parseFloat(amount).toFixed(decimal? decimal:2))
    return result
  }
  function currencyFormat(num) {
    return '$' + num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
 }
  export const disputeAmount = (fldvalue)=>{
    let length = [5,2]
    let value = fldvalue.toString().replace(/(?!-)[^0-9.]/g, "" )
    //value = Intl.NumberFormat("en-US").format(value)
    value = String(value).split(".")
    let Val = ""
    let amount = value[0]
    let decimal = value[1]
    if(value[0]?.length > length[0]){
    amount = value[0].substring(0, length[0]);
    }
    if(value[1]?.length > length[1]){
    decimal = value[1].substring(0, length[1]);
    }
    if(value.length>1){
        Val = `${amount}.${decimal}`
    }else {
        Val = amount
    }
    Val = currencyFormat(Val)
    // if(value.length>1){
    // Val = '$'+`${amount}.${decimal}`
    // }else if(value == "$"){
    //     Val=""
    // }else{
    // Val = '$'+amount
    // }
    return Val
}
const getAmount = (data,type,gallonValue,fuelPrice,serv)=>{
    let amount = 0
    if(type == "tax"){
         amount = data.Amount
        if(data.Unit == "%"){
            if(data?.Tax=='Sales Tax - Additional Services'){
                amount = parseFloat(((parseFloat(serv)*(parseFloat(data.Amount))/100)))
            }else{
                amount = parseFloat(((parseFloat(gallonValue*fuelPrice)*(parseFloat(data.Amount))/100)))
            } 
        }
        else{
            amount = parseFloat(data.Amount)
        }
    }
    else if(type == "fees"){
        if(data.pricingType == "Tiered"){
            data.FeeTiers.forEach((fee)=>{
                if(gallonValue>=fee.MinRange && (fee.MaxRange ? gallonValue<=fee.MaxRange : true)){
                    if(fee.unit == "%"){
                        amount = parseFloat(((parseFloat(gallonValue*fuelPrice)*(parseFloat(fee.TierValue))/100)))
                    }
                    else{
                        amount = parseFloat(fee.TierValue)
                    }
                }
            })
        }else{
            let fee = data.FeeTiers[0]
            if(fee.unit == "%"){
                amount = parseFloat(((parseFloat(gallonValue*fuelPrice)*(parseFloat(fee.TierValue))/100)))
            }
            else{
                amount = parseFloat(fee.TierValue)
            }
        }
    }
    return parseFloat(amount)
}
const getTaxAndFeesPayload = (items,type)=>{
    let updatedPayload = []
   items &&  items.length && items.map((data)=>{
        if(data.type == "tax" && type=="tax"){
            updatedPayload.push({
                "TaxName": data.name,
                "Amount": parseFloat(data.amount),
                "Unit": data.unit,
                "TaxType": data.taxType
            })
        }else if (data.type == "fees" && type=="fees"){
            updatedPayload.push({
                "FeeName": data.name,
                "Amount":parseFloat(data.amount),
                "Unit": data.unit
            })
        }else if (type=="services"){
            updatedPayload.push({
                "ServiceName":data.name ,
                "Amount": parseFloat(data.amount)
            })
        }

    })
    return updatedPayload

}
export const updateData = (quantity,price,orderVal,tail,userEmail)=>{
    let disputedOrder = orderVal
    let orderDetails = disputedOrder
    let servs = []
    let tailNumber = tail? tail:orderDetails.OrderLegs[0].TailNumber
    let payload={"SearchString":orderDetails.OrderLegs[0].ICAO,
              "SearchType":"ICAO",
              "LoggedinUser":userEmail
            }
    let orderData = {}
    let fedTaxes = []
    getFedTaxes().then((res)=>{
        if(res&& res.length){
            let fedTaxData = res[0] && res[0][0] && res[0][0]['JSON_UNQUOTE(@JSONResponse)'] && res[0][0]['JSON_UNQUOTE(@JSONResponse)']
            fedTaxData = JSON.parse(fedTaxData && fedTaxData).Taxes
            fedTaxes = fedTaxData
        }
    })
    getFuelLocations(payload).then((res)=>{
    const adminReducer = useSelector((state) => state.AdminReducer)
    const systemVariables = adminReducer && adminReducer.systemVariables && adminReducer.systemVariables.data 
        if(res && res.length && res[0]){
            let data = JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)'])
            let item = (data.filter((item)=>item.FBOName == orderDetails.OrderLegs[0].FBO ))
            orderData = item&& item.length ? item[0]:{}
            let netCost = 0
     let taxesAndFeesValue = 0
     console.log(orderData.AiportLocations[0])
     let servicesValue = 0
    let allServices = orderData?.AiportLocations[0].Services ? orderData.AiportLocations[0].Services :[]
     let fuelTypes = orderData.AiportLocations[0].FuelTypes ? orderData.AiportLocations[0].FuelTypes :[]
     let taxdata = orderData.AiportLocations[0].Taxes ? orderData.AiportLocations[0].Taxes :[]
     let allFees = orderData.AiportLocations[0].Fees ? orderData.AiportLocations[0].Fees :[]
     let allTaxes = orderData? [...fedTaxes, ...taxdata, ...allFees] :[]
     let totalService = 0
     let taxes =  []
     let costPlusValue = 0
     let selectedQuantity = quantity
     let basePrice = 0 
     fuelTypes && fuelTypes.length && fuelTypes.forEach((type)=>{
        if(type.Name == orderDetails?.OrderLegs[0].FuelType){
            type.Tiers.map((tier)=>{
                if(selectedQuantity>= tier.MinRange && ((tier.MaxRange ? selectedQuantity<= tier.MaxRange : true))){
                    basePrice = tier.Baseprice + tier.costplus 
                    costPlusValue = tier.costplus
                }
            })
        }
    })
    orderDetails.OrderLegs[0].Services?.forEach((serv)=>{
        allServices?.length&& allServices.forEach((ser)=>{
            if(ser.Service == serv.ServiceName){
                let servAmount = getAmount(ser,"services",selectedQuantity,basePrice)
                totalService += parseFloat(servAmount)
                servs.push({
                    // "name":serv.ServiceName,
                    // "amount":parseFloat(servAmount).toFixed(2),
                    "ServiceName":serv.ServiceName,
                    "Amount":parseFloat(servAmount.toFixed(2))
                })
            }
        })
       })
    orderDetails.OrderLegs[0].Services = servs
     servicesValue= totalService
     let totalDiscountValue = 0
     let totalAmount = 0
     allTaxes && allTaxes.length && allTaxes.forEach((tax)=>{
         let taxValue = getAmount(tax,tax.Fees?"fees":"tax",selectedQuantity,basePrice,servicesValue)
         let Tdata = {
             "name": tax.Fees? tax.Fees : tax.Tax,
             "amount" : taxValue.toFixed(2),
             "unit": tax.Fees?tax.FeeTiers[0].unit :tax.Unit,
             "type": tax.Fees?"fees":"tax",
             "taxType": tax.Tax?( tax.TaxType?"Federal/State Tax" :"Custom Tax"):"",
         }
        totalAmount+= taxValue
        if(tax?.Tax=='Sales Tax - Additional Services' && !servs.length){

        }else{
            taxes.push(Tdata)
        }
     })
    taxesAndFeesValue = totalAmount 
    orderDetails.OrderLegs[0].Taxes = getTaxAndFeesPayload(taxes, 'tax')
     if(tailNumber){
         let payload = {"FBO":orderDetails.OrderLegs[0].FBO,"TailNumber":tailNumber,"Location":orderDetails.OrderLegs[0].ICAO}
         let discountValue = 0
         let selectedDiscounts = []
         getDiscounts(payload).then((res)=>{
             let discountData = res && res.length && res[0] && res[0][0] && res[0][0]['JSON_UNQUOTE(@JSONResponse)'] && res[0][0]['JSON_UNQUOTE(@JSONResponse)']
             discountData = discountData && JSON.parse(discountData)
             let discAmount = 0
             discountData&& discountData.forEach((item,index)=>{
                 if(item.Criteria == "Per Order" ||item.Criteria == "Per Gallon" ){
                     if(item.discountunit == "%"){
                         discountValue += ((selectedQuantity*basePrice)*item.discountvalue/100)
                         discAmount = ((selectedQuantity*basePrice)*item.discountvalue/100)
                     }
                     else{
                         discountValue += item.discountvalue
                         discAmount = item.discountvalue
                     }
                 }else if(item.Criteria == "Cost Plus"){
                     if(item.discountunit == "%"){
                         discountValue += (((costPlusValue)*item.discountvalue/100)*selectedQuantity)
                         discAmount = (((costPlusValue)*item.discountvalue/100)*selectedQuantity)

                     }
                     else{
                         discountValue += item.discountvalue
                         discAmount = item.discountvalue

                     }
                 }

                     
                 selectedDiscounts.push(
                     {
                         "DiscountID": item.DiscountID,
                         "Amount": discAmount,
                         "Unit": item.discountunit,
                         "Criteria": item.Criteria
                       }
                 )
            })
            orderDetails.OrderLegs[0].Discounts = selectedDiscounts
            totalDiscountValue = discountValue
            netCost = (((selectedQuantity*basePrice)+ taxesAndFeesValue + servicesValue)-totalDiscountValue).toFixed(2)
            orderDetails.OrderLegs[0].FinalPrice = netCost
        })
    }
    orderDetails.OrderLegs[0].TailNumber = tailNumber
    orderDetails.OrderLegs[0].BasePrice = basePrice
    orderDetails.OrderLegs[0].FuelQuantity = quantity
    netCost = (((selectedQuantity*basePrice)+ taxesAndFeesValue + servicesValue)-totalDiscountValue).toFixed(2)
    let feeAndPayout = (parseFloat(systemVariables.Charge_Fee) + parseFloat(systemVariables.Payout_Fee)).toFixed(2)
    let cardFee = parseFloat(netCost)*(feeAndPayout)//
    orderDetails.OrderLegs[0].FinalPrice = parseFloat(netCost)+parseFloat(cardFee)
    disputedOrder = orderDetails
    console.log(disputedOrder)
    // setdisputeVal(disputedOrder)
        }
    })
     
    return disputedOrder

 }

 export const validateAmountForFive = (formdata, fldvalue,isunitValidationReqrd)=>{
    let length = !isunitValidationReqrd&&formdata?.unit && formdata.unit == "%" ? [2,2]:[5,2]
    let value = fldvalue.replace(/(?!-)[^0-9.]/g, "" )
    value = String(value).split(".")
    let Val = ""
    let amount = value[0]
    let decimal = value[1]
    if(value[0]?.length > length[0]){
    amount = value[0].substring(0, length[0]);
    }
    if(value[1]?.length > length[1]){
    decimal = value[1].substring(0, length[1]);
    }
    if(value.length>1){
    Val = `${amount}.${decimal}`
    }else {
    Val = amount
    }
    return Val
}

export const camelize = (str) => {
    if(str !== undefined && str!== null){
    let string = str.toLowerCase();
    const arr = string.split(" ");
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  
  }
    return arr.join(" ");
  }
}

export const sortFbo = (val,data,quant)=>{
    let arr=data
    let fuelQuatity=quant
    if(val=='Name(A-Z)'){
        arr.sort((a,b) =>{
            if(a?.fboName?.toLowerCase() < b?.fboName?.toLowerCase()){
                return -1
            }else if(a?.FBOName?.toLowerCase() < b?.FBOName?.toLowerCase()){
                return -1
            }
            return 0
        });
    }else if(val=='Name(Z-A)'){
        arr.sort((a,b) => {
            if(a?.fboName?.toLowerCase() > b?.fboName?.toLowerCase()){
                return -1
            }else if(a?.FBOName?.toLowerCase() > b?.FBOName?.toLowerCase()){
                return -1
            }
            return 0
        });
    }else if(val=='BF Partner'){
        let a1=arr.filter((a)=>a.IsPartner)
        let a2=arr.filter((a)=>!a.IsPartner)
        arr=[...a1,...a2]
    }else if(val=='Lowest Price'){
        arr.sort((a,b) => {
            let min=[]
            let min2=[]
            let val1,val2;
            a.tiers && a.tiers.map((tier)=>{
                if(fuelQuatity && fuelQuatity!=""){
                    if(tier.MaxRange){
                        if(fuelQuatity>=tier.MinRange && fuelQuatity<=tier.MaxRange ){
                            val1=tier.Baseprice+tier.costplus;
                        }
                    }else{
                        if(fuelQuatity>tier.MinRange){
                            val1=tier.Baseprice+tier.costplus;
                        }
                    }
                    
                }else{
                    min.push(parseFloat(tier.Baseprice+tier.costplus))
                }
                
            })
            b.tiers && b.tiers.map((tier)=>{
                if(fuelQuatity && fuelQuatity!=""){
                    if(tier.MaxRange){
                        if(fuelQuatity>=tier.MinRange && fuelQuatity<=tier.MaxRange ){
                            val2=tier.Baseprice+tier.costplus;
                        }
                    }else{
                        if(fuelQuatity>tier.MinRange){
                            val2=tier.Baseprice+tier.costplus;
                        }
                    }
                }else{
                    min2.push(parseFloat(tier.Baseprice+tier.costplus))
                }
            })
            if(fuelQuatity!=""){
                if(val1 < val2){
                    return -1
                }
            }else{
                if(Math.min(...min) < Math.min(...min2)){
                    return -1
                }
            }
            return 0
        });
    }else if(val=='Highest Price'){
        arr.sort((a,b) => {
            let min=[]
            let min2=[]
            let val1,val2;
            a.tiers && a.tiers.map((tier)=>{
                if(fuelQuatity && fuelQuatity!=""){
                    if(tier.MaxRange){
                        if(fuelQuatity>=tier.MinRange && fuelQuatity<=tier.MaxRange ){
                            val1=tier.Baseprice+tier.costplus;
                        }
                    }else{
                        if(fuelQuatity>tier.MinRange){
                            val1=tier.Baseprice+tier.costplus;
                        }
                    }
                }else{
                    min.push(parseFloat(tier.Baseprice+tier.costplus))
                }
                
            })
            b.tiers && b.tiers.map((tier)=>{
                if(fuelQuatity && fuelQuatity!=""){
                    if(tier.MaxRange){
                        if(fuelQuatity>=tier.MinRange && fuelQuatity<=tier.MaxRange ){
                            val2=tier.Baseprice+tier.costplus;
                        }
                    }else{
                        if(fuelQuatity>tier.MinRange){
                            val2=tier.Baseprice+tier.costplus;
                        }
                    }
                }else{
                    min2.push(parseFloat(tier.Baseprice+tier.costplus))
                }
            })
            if(fuelQuatity && fuelQuatity!=""){
                if(val1 > val2){
                    return -1
                }
            }else{
                if(Math.max(...min) > Math.max(...min2)){
                    return -1
                }
            }
            return 0
        });
    }
    return arr;
}
  