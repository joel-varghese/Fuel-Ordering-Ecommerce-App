import OperatorSignupForm from "../operatorSignupForm/operatorSignupForm";
import React, { useState,useEffect } from 'react';
import Loader from '../loader/loader';
import { Storage} from '../../controls/Storage';
import './operatorOnboarding.scss'

function OperatorOnboarding(){

    const [isBusy, setBusy] = useState(true)
    const [operatorRow, setoperatorRow] = useState(true)
    const [operatorJson, setoperatorJson] = useState(true)
    useEffect(() => {
        if(Storage.getItem('operatorRow') != null){
            setoperatorRow(JSON.parse(Storage.getItem('operatorRow')))
        }
        if(Storage.getItem('operatorJson') != null){
            setoperatorJson(JSON.parse(Storage.getItem('operatorJson')))
            setBusy(false)
        }
    },[])

    return(<>
          {isBusy ? (
        (<Loader/>)
      ) : (
    <div className="bf-dashboard-operatorsignupform">
        <OperatorSignupForm rowdata={operatorRow} jsonData={operatorJson}></OperatorSignupForm>
    </div>
      )}
    </>
);
}

export default OperatorOnboarding;