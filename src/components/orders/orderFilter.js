import { getFormattedYYMMDD } from "../../controls/validations"

export const filterOrderTable=(searchValue,originalRows)=>{
	let filter=[]
    let searchBy=['ordernumber','icao','operatorname','fbo','tailnumber']
      if(searchValue && String(searchValue) !== ""){
        originalRows && originalRows.map((val)=>{
          let searchResult=[]
            Object.keys(val).map((item)=>{
              if(searchBy.includes(item.toLowerCase())){
                searchResult.push(String(val[item]).toLowerCase().includes(searchValue.toLowerCase()))
              }
            })
            Object.keys(val.OrderLegs[0]).map((item)=>{
              if(searchBy.includes(item.toLowerCase())){
                searchResult.push(String(val.OrderLegs[0][item]).toLowerCase().includes(searchValue.toLowerCase()))
              }
            })
          if(searchResult.includes(true)){
            filter.push(val)
          }  
        })
        return filter;
      }else{
        return originalRows;
      }	
}
export const filterOrderTableByDate=(dates,originalRows,isDisputes,userType,tab)=>{
  let fromDate = new Date(dates&&dates?.orderDates?.orderFromDate)
  let toDate =  new Date(dates&&dates?.orderDates?.orderToDate)
  let filterdData=[]
  if( fromDate!='Invalid Date' && toDate !='Invalid Date'){
    let from = getFormattedYYMMDD(new Date(fromDate))!='NaN-NaN-NaN'?getFormattedYYMMDD(new Date(fromDate)):'' 
    let To = getFormattedYYMMDD(new Date(toDate)) !='NaN-NaN-NaN' ?getFormattedYYMMDD(new Date(toDate)):''
    originalRows && originalRows.map((val)=>{
      if(isDisputes){
        let from = getFormattedYYMMDD(new Date(fromDate))!='NaN-NaN-NaN'?getFormattedYYMMDD(new Date(fromDate)):'' 
        let To = getFormattedYYMMDD(new Date(toDate)) !='NaN-NaN-NaN' ?getFormattedYYMMDD(new Date(toDate)):''
        let disputedDate = getFormattedYYMMDD(new Date(val.DateDisputed))!='NaN-NaN-NaN'?getFormattedYYMMDD(new Date(val.DateDisputed)):'' 
        
        if(from ==disputedDate && To == ''){
          filterdData.push(val)
        }else if(To == disputedDate && from == ''){
          filterdData.push(val)
        }else if(disputedDate >= from && disputedDate <= To){
          filterdData.push(val)
        }
      }else{
        if(val?.IsMultiLeg!=='true'){
          val.OrderLegs && Object.keys(val.OrderLegs[0]).map((item)=>{
            if(item==='FuellingDate' && tab!=='completed'){
              let fuelingDate = getFormattedYYMMDD(new Date(val?.OrderLegs[0][item]))!='NaN-NaN-NaN'?getFormattedYYMMDD(new Date(val?.OrderLegs[0][item])):'' 
              if(from ==fuelingDate && To == ''){
                filterdData.push(val)
              }else if(To == fuelingDate && from == ''){
                filterdData.push(val)
              }else if(fuelingDate >= from && fuelingDate <= To){
                filterdData.push(val)
              }
            }else if(item==='Date' &&  tab=='completed'){
              let fuelingDate = getFormattedYYMMDD(new Date(val?.OrderLegs[0][item]))!='NaN-NaN-NaN'?getFormattedYYMMDD(new Date(val?.OrderLegs[0][item])):'' 
              if(from ==fuelingDate && To == ''){
                filterdData.push(val)
              }else if(To == fuelingDate && from == ''){
                filterdData.push(val)
              }else if(fuelingDate >= from && fuelingDate <= To){
                filterdData.push(val)
              }
            }
          })
        }else{
          let legFilter=[]
          val?.OrderLegs?.map((leg)=>{
            Object.keys(leg)?.map((item)=>{
              if(item==='FuellingDate' && tab!=='completed'){
                let fuelingDate = getFormattedYYMMDD(new Date(leg[item]))!='NaN-NaN-NaN'?getFormattedYYMMDD(new Date(leg[item])):'' 
                if(fuelingDate >= from && fuelingDate <= To){
                  legFilter.push(leg)
                }
              }else if(item==='Date' && tab=='completed'){
                let fuelingDate = getFormattedYYMMDD(new Date(leg[item]))!='NaN-NaN-NaN'?getFormattedYYMMDD(new Date(leg[item])):''
                if(fuelingDate >= from && fuelingDate <= To){
                  legFilter.push(leg)
                }
              }
            })
          })
          if(legFilter.length){
            val.OrderLegs=legFilter;
            filterdData.push(val);
          }

        }
      }
    })
    return filterdData;
  }else{
    return originalRows;
  }	
}

export const filterDisputeTable=(searchValue,originalRows)=>{
	let filter=[]
    let searchBy=['ordernumber']
      if(searchValue && String(searchValue) !== ""){
        originalRows && originalRows.map((val)=>{
          let searchResult=[]
            Object.keys(val).map((item)=>{
              if(searchBy.includes(item.toLowerCase())){
                searchResult.push(String(val[item]).toLowerCase().includes(searchValue.toLowerCase()))
              }
            })
          if(searchResult.includes(true)){
            filter.push(val)
          }  
        })
        return filter;
      }else{
        return originalRows;
      }	
}

export const sortOrder = (data)=>{
  data && data.length && data.sort((a,b)=>{
    let sorOrderArr1=[]
    let sorOrderArr2=[]
    a.OrderLegs?.map((leg)=>{
      sorOrderArr1.push(leg.SortOrder)
    })
    b.OrderLegs?.map((leg)=>{
      sorOrderArr2.push(leg.SortOrder)
    })
    if(Math.min(...sorOrderArr1)<Math.min(...sorOrderArr2)){
      return -1;
    }
    return 0;
  })
  return data;
}