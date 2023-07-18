import React, { useState,useEffect } from 'react';
import Loader from '../loader/loader';
import { Storage} from '../../controls/Storage';
import './userTypeCheck.scss';
import AdminAddUser from "../admin/adminAddUser";
import  AdminSignupForm from "../admin/adminSignupForm";

function UserTypeCheck(){
    const [isBusy, setBusy] = useState(true)
    const [adminAddUserJson, setadminAddUserJson] = useState(true)
    const [adminSignupJson,setadminSignupJson] = useState(true)
    const [isShown , setShown]= useState(false)
    const [isinternal , setInternal] = useState(false)

    useEffect(() => {
       let userType=Storage.getItem('userType')
      //let userType='Internal';
        if(userType.toLowerCase()=='operator'||userType.toLowerCase()=='fbo'){
         setShown(true);
        setInternal(false);
        setBusy(false)
      //   if(Storage.getItem('adminAddUserJson') != null){
      //       setadminAddUserJson(JSON.parse(Storage.getItem('adminAddUserJson')))
      //       setBusy(false)
      //   }
      //   if(Storage.getItem('adminSignupJson') != null){
      //       setadminSignupJson(JSON.parse(Storage.getItem('adminSignupJson')))
      //       setBusy(false)
      //   }
        }
       if (userType.toLowerCase()=='internal')
       {
         setInternal(true);
         setShown(false);
         if(Storage.getItem('adminSignupJson') != null){
            setadminSignupJson(JSON.parse(Storage.getItem('adminSignupJson')))
            setBusy(false);
        }
      }
       
       console.log(isShown);
    },[])
    return(<>
        {isBusy ? (
      (<Loader/>)
    ) : (<>{isShown?(
  <div className="bf-dashboard-operatorsignupform">
     <AdminAddUser></AdminAddUser>
    </div>):(
  <div className="bf-dashboard-operatorsignupform">
     <AdminSignupForm></AdminSignupForm>
    </div>)}
     </>)}
     </>);
}
export default UserTypeCheck;