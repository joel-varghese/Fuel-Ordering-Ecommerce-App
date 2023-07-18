import React, { useState, useEffect,useRef } from 'react';
import { fetchCompanies, inactiveStatus, isDeactivate, updateCompanies } from '../../actions/accountAdminAction/adminAction';
import { bfaJsonService } from '../../actions/BFAServices/BFAJsonService';
import { useDispatch,useSelector } from 'react-redux';
import Loader from '../loader/loader';
import BFTable from '../table/table'
import { Navigate, useNavigate } from 'react-router-dom';
import './admin.scss'
import { getCompany } from '../../actions/accountHome/accountHomeActions';
import CustomModal from '../customModal/customModal';


export default function Deactivate() {
    const [isBusy, setBusy] = useState(true)
    const [headCells, setheadCells] = useState(null);
    const [deactiveJson,setDeactiveJson] = useState({})
    const [rows,setRows] = useState(null)
    const [originalRows, setoriginalRows] = useState([]);
    const [modalText, setModalText] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [formDataSetRow,setFormDataSetRow] = useState([])
    const params = {"blobname":"admin.json"}
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginReducer = useSelector(state => state.loginReducer);
    const loginDetails = loginReducer && loginReducer.loginDetails &&loginReducer.loginDetails.data;
    let loginDetls =  JSON.stringify(loginDetails) === '{}'?{}:JSON.parse(loginDetails);
    let userType = loginDetls.userType?loginDetls.userType:'';
    let userEmail = loginDetls.loginUserName?loginDetls.loginUserName:'';
    const payload = {
        "Loggedinuser": userEmail,
        "Role": userType
    }

    useEffect(() => {
        bfaJsonService(params).then(response=>{
            setDeactiveJson(response.data)
            getheadcells(response.data.Deactivate)

        })
        fetchCompanies(dispatch,payload).then(res=>{
            setBusy(false)
            let data = res && res.length && res[0].length && res[0][0]['JSON_UNQUOTE(@JSONResponse)']?JSON.parse(res[0][0]['JSON_UNQUOTE(@JSONResponse)']):[];
            getRowData(data)
            setoriginalRows(data)  
          })
    },[])
    const deactiveClick = (row,data,button) =>{
      if(button.Label == "Deactivate"){
        let i=0;
        let isValid=true;
        let reasonVal=JSON.parse(JSON.stringify(formDataSetRow))
        reasonVal?.map((val,ind)=>{
          if(row?.company==val?.company){
            i= ind
          }
        })
        if(reasonVal[i]['reasonDeactive']==''){
          reasonVal[i]['errorMessage']=true
          isValid=false;
          setFormDataSetRow(reasonVal)
        }
        if(isValid){
        let request = {
          "Loggedinuser": userEmail,
          "Organization":row.company,
          "DeactivateReason": reasonVal[i]['reasonDeactive'],
          "TransType":"Deactivate"
        }
        updateCompanies(dispatch,request).then(res=>{

        })

        }else{
          document.getElementById('root').style.filter = 'blur(5px)';
          setModalText(deactiveJson.modal[0].message)
          setModalShow(true)
        }
      }else if(button.Label == "Activate"){
        getCompany(row.company,dispatch)
        isDeactivate(true,dispatch)
        inactiveStatus(true,dispatch)
        navigate('/dashboard/activate/company')
      }else if(button.Label == "Cancel"){
        let request = {
          "Loggedinuser": userEmail,
          "Organization":row.company,
          "DeactivateReason": "",
          "TransType":"Cancel"
        }
          updateCompanies(dispatch,request).then(res=>{

          })
      }
    }
    const onRowClick= (data,row) =>{
        getCompany(row.company,dispatch)
        isDeactivate(true,dispatch)
        if(row.Buttons[0].Label == "Deactivate"){
          inactiveStatus(false,dispatch)
        }else{
          inactiveStatus(false,dispatch)
        }
        navigate('/dashboard/activate/company')
    }
    const onHandleChangeRow=(e,item,index)=>{
      let reason=[...formDataSetRow]
      reason[index][item]=e.target.value;
      if(e.target.value==''){
        reason[index]['errorMessage']=true
      }else{
        reason[index]['errorMessage']=null
      }
      setFormDataSetRow(reason)
    }
    const SuccessModal = () =>{
      setModalText('')
      setModalShow(false)
      document.getElementById('root').style.filter = 'none';
    }
    const closeModal = () =>{
      setModalText('')
      setModalShow(false)
      document.getElementById('root').style.filter = 'none';
    }
    const getheadcells = (data) =>{
        let head = []
        data && data.headers.Deactivate.map((item,index)=>{
            head[index] = item
        })
        setheadCells(head)
    }
    const getReasonData=(rowData)=>{
      const formDataSet = [];
      let fds={}
      rowData?.map((val,index)=>{
        fds['reasonDeactive'] = formDataSetRow && formDataSetRow.length>index && formDataSetRow[index]['reasonDeactive']? formDataSetRow[index]['reasonDeactive']: "";
        fds['company'] = val?.company;
        fds['errorMessage'] = null;
        formDataSet.push(JSON.parse(JSON.stringify(fds)))
      })
      setFormDataSetRow(formDataSet)
    }
    const getRowData=(data)=>{
        let i1=0
        let rowdata = []
        data &&data.length&& data.forEach((item)=>{
          rowdata[i1] = getRows(item)
          i1++
        })
        setRows(rowdata)
        getReasonData(rowdata)
      }
      const getRows = (data) => {
        return{
            "company":data?.organization_name,
            "email":data?.Email,
            "phone":data?.contact_number,
            "requeston":data?.RequestedOn, 
            "reasonDeactive":"",
            "Buttons":
                [data.Status == 'Deactivated'?{"name":"button1","Label":"Activate","method":"","className":"btn btn-bf-primary"}:{"name":"button1","Label":"Deactivate","method":"","className":"btn btn-bf-primary"},{"name":"button2","Label":"Cancel","method":"","className":"btn-bf-secondary bf-mrgl20"}]
          }
      }
    return (<>
        {isBusy ? (
          (<div className='bf-account-companychange'><Loader/></div>)
        ) : ( 
          <div className='bf-table-container bf-tax-table-container bf-admin-deactivate-table-container'>
          <BFTable
            sortEnabled={true}
            searchEnabled={true}
            Data={rows && rows}
            heading={headCells}
            searchBy={["company","email","phone"]}
            secondaryClic={deactiveClick}
            primaryClick={deactiveClick}
            rowClick={onRowClick}
            loading={isBusy}
            onHandleChangeRow={onHandleChangeRow}
            formDataSetRow={formDataSetRow}
            admin={true}
          >
          </BFTable>
          {modalShow && <CustomModal
        show={modalShow}
        onHide={() => SuccessModal()}
        close={() => closeModal()}
        hide={() => closeModal()}
        size={''}
        isPrompt={true}
        modelBodyContent={modalText}
        buttonText={deactiveJson.modal[0].text}
    />}
          </div>
              )}                  
      </>    
    );

}