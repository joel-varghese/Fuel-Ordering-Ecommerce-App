import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import Button from '@mui/material/Button';
import { IoIosCloseCircleOutline} from 'react-icons/io'
//import Select from '../select/select';
import Select from '../select/select';
import InputAdornment from '@mui/material/InputAdornment';
import './table.scss'
import TextField from '@mui/material/TextField';
import Search from '@mui/icons-material/Search';
import {IoIosSearch} from 'react-icons/io';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Pagination from '@mui/material/Pagination';
import UnfoldLessOutlinedIcon from '@mui/icons-material/UnfoldLessOutlined';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { barrelFuelAccess, getAccessLevel, getSuperAccess } from '../../controls/commanAccessLevel';
import { Storage } from '../../controls/Storage';
import Loader from '../loader/loader';
import { rowsPerPage_FP_Options, rowsPerPage_FP_Table } from '../../controls/commonConstants';
// import Select from '@mui/material/Select';
//import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import FormControlLabel from '@mui/material/FormControlLabel';
import { PaginationItem, Stack } from '@mui/material';
import ButtonComponent from '../button/button';
import Input from '../input/input';
//import Checkbox from '@mui/material/Checkbox';
import parse from 'html-react-parser';
import EditIcon from '../../assets/images/icon_edit.svg';
import DeletIcon from '../../assets/images/icon_delete.svg';
import AddMoreIcon from '../../assets/images/icon-add-more.png';
import CustomProfileModal from '../myProfile/customProfileModal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Subheading from '../subHeading/subHeading';
import { getFormattedMMDDYY } from '../../controls/validations';

function descendingComparator(a, b, orderBy) {
  let previousData;
  let currentData;
  if(orderBy=='estfuel'){
    previousData = a[orderBy] && parseFloat(JSON.stringify(a[orderBy]).trim())
    currentData = b[orderBy] && parseFloat(JSON.stringify(b[orderBy]).trim())
  }else{
    previousData = a[orderBy] && JSON.stringify(a[orderBy]).trim()?.toLowerCase()
    currentData = b[orderBy] && JSON.stringify(b[orderBy]).trim()?.toLowerCase()
  }
  // if (b[orderBy] < a[orderBy]) {
  //   return -1;
  // }
  // if (b[orderBy] > a[orderBy]) {
  //   return 1;
  // }
  if(orderBy=='estfuel'){
    if(previousData>currentData){
      return true
    }else{
      return false
    }
  }else{
    return previousData?.localeCompare(currentData);
  }  
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {

  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells, sortEnabled } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (<>
    <TableHead>
      <TableRow>

        {headCells && headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            colSpan={headCell.id === 'Actions' ? 2 : null}
            className={`${headCell.id === 'Actions' ? 'bf-actions-header' : 'bf-'+headCell.id}`}>
            {headCell.sortable && headCell.sortable ? <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              IconComponent={''}
              disabled={headCell.sortable && !headCell.sortable}
            >
              {headCell.label}<MdKeyboardArrowDown className={orderBy === headCell.id ? order : 'asc'}/>

            </TableSortLabel>: headCell.label}
          </TableCell> ))}
      </TableRow>
    </TableHead></>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function BFTable(props) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPage_FP_Table);
  const [rows, setRowsData] = React.useState()
  const [originalRows, setOriginalRows] = React.useState()
  const [tableHead,setTableHead] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState([])
  const [rowIndex, setRowIndex] = useState()
  const [accessLevel, setAccessLevel] = useState()
  const [accessLevelOptions, setAccessLevelOptions] = useState([])
  const [inactiveUsers, setInactiveUsers] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState(false)
  const accountHomeReducer = useSelector((state) => state.accountHomeReducer);
  const selectedTab = accountHomeReducer && accountHomeReducer.selectedTab && accountHomeReducer.selectedTab;
  const selectedUser = accountHomeReducer && accountHomeReducer.selectedUser ? accountHomeReducer.selectedUser.user:Storage.getItem('userType').toLocaleLowerCase();
   useEffect(() => {
      setTableHead(props.heading)
      setRowsData(props.Data)
      setOriginalRows(props.Data)
      setLoading(props.loading )
      setPage(1)
  },[props.Data,  props.loading, props.heading]) 

  useEffect(() => {
    setFormData(props.formDataSetRow)
},[props.formDataSetRow]) 
  
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
 

  const handleClick = (event, name,row) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };
  const SearchInTable = (event) => { 
    let searchData = []


    if (String(event.target.value) !== "") {

      originalRows.map((data, index) => {
        let searchResult = []
        Object.keys(data).map((item) => {
          if(props.searchBy && props.searchBy.length > 0){
            if(props.searchBy.indexOf(item) !== -1){
              searchResult.push(String(data[item]).toLowerCase().includes(event.target.value.toLowerCase()))
            } 
          } else {
            searchResult.push(String(data[item]).toLowerCase().includes(event.target.value.toLowerCase()))
          }
          
        })
        if (searchResult.includes(true))
          searchData.push(data)
      })

      if (searchData.length > 0) {
        setPage(1);
        setRowsData(searchData)
      } else {
        setRowsData([])
      }

    }
    else {
      setPage(1);
      setRowsData(originalRows)
      setAccessLevel("")
    }
  }
  const SearchInColumn = (event) => { 
    let searchData = []

    if (String(event.target.value) !== "") {

      originalRows.map((data, index) => {
        let searchResult = []
        if (data["category"] == event.target.value){
            searchData.push(data)
        }
      })

      if (searchData.length > 0) {
        setPage(1);
        setRowsData(searchData)
      } else {
        setRowsData([])
      }

    }
    else {
      setPage(1);
      setRowsData(originalRows)
    }
  }
  const handleChange = (event, selectLabel) =>{
    setAccessLevel(event.target.value)
    setPage(1)
    if(event.target.value !=="All"){
    let searchData = []
    originalRows.map((data, index) => {
      let searchResult = []
      Object.keys(data).map((item) => {
        
            searchResult.push(String(data[selectLabel]).toLowerCase() === event.target.value.toLowerCase())
                  
      })
      if (searchResult.includes(true))
        searchData.push(data)
    })

    if (searchData.length > 0) {
      setRowsData(searchData)
    } else {
      setRowsData([])
    }
  }else{
    setRowsData(originalRows)
  }
  }
  const getOpts = ()=>{
    let accessLevelArray = []
    let opts = []
    originalRows && originalRows.map((item)=>{
      if(item.accessLevel && accessLevelArray.indexOf(item.accessLevel)==-1 && item.accessLevel !== "") {
        accessLevelArray.push(item.accessLevel)
      }
    })
    accessLevelArray.sort((a,b)=>a.localeCompare(b)).map((data,index)=>{
      opts.push({
        title:data,
        value:data
      })
      })
    setAccessLevelOptions(opts)
    }
  const getRowsOptions = ()=>{
    let opts = rowsPerPage_FP_Options
    let optsArray = []
    opts.forEach((op)=>{
      optsArray.push({
        title:op,
      value:op
      })
    })
    return optsArray
  }
  const getOptions = () =>{
    let accessLevelArray = []
    let opts = []
   
    originalRows && originalRows.map((item)=>{
      if(item.accessLevel && accessLevelArray.indexOf(item.accessLevel)==-1 && item.accessLevel !== "") {
        accessLevelArray.push(item.accessLevel)
      }
    })
    accessLevelArray.sort((a,b)=>a.localeCompare(b)).map((data,index)=>{
        opts.push({
          title:data,
          value:data
        })
    })
    opts.push({
      title:"All",
      value:"All"
    })

    return(
      <Select
      colWidth={"2 bf-select"} 
      Type={"select"} 
      Placeholder={"Access Level"}
      isRequred={false}
      disabled = {false}
      Options={opts}
      Name={"accessLevel"}
      handleChange={(e)=>{handleChange(e,"accessLevel")}}
      formDataSet={accessLevel}
      />
    )
  //   return(<Select
  //           labelId="demo-simple-select-label"
  //           id="demo-simple-select"
  //           label="Access Leval"
  //           value ={accessLevel}
  //           onChange={(e)=>handleChange(e,"accessLevel")}
  //           placeholder ={"Access Level"}
  //           md={2}
  //           className="bf-select"
  // >
    // {originalRows && originalRows.map((item)=>{
    //   if(item.accessLevel && accessLevelArray.indexOf(item.accessLevel)==-1 && item.accessLevel !== "") {
    //     accessLevelArray.push(item.accessLevel)
    //   }
      
      
    // })
    //  }
    // {accessLevelArray.sort((a,b)=>a.localeCompare(b)).map((data,index)=>{
      // if(index == 0){
      //   setAccessLevel(data)
      // } 
      //   return(<MenuItem value={data}>{data}</MenuItem>)
      // })}

  // </Select>)
  }
  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  //const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows && rows.length) : 0;
  const checkInactiveUser = (event) => {
    if(inactiveUsers === false){
      setInactiveUsers(true)
      props.getActiveInactiveUsers(true)
    } else {
      setInactiveUsers(false)
      props.getActiveInactiveUsers(false)
    }
    
  }
 const getTableButtons = () =>{
    return props.buttons&&props.buttons.length>0&&props.buttons.map((item,index)=>{
      return (<ButtonComponent 
        Label={item.label} 
        Type={item.type} 
        Name={item.name}
        className={item.styles.className}
        handleClick={(e)=>props.onHandleClick(e,item)} />
        )
     })
  }

  const getMultiline = (data) => {
    let multiLineData = ''
    data&&data.forEach((ele) => {
      multiLineData +=  `<div title=${ele}>${ele}</div>`
    })
    return <div>{parse(multiLineData)}</div>
  }
  const getTableCells =(items)=>{
    let rowName = '';
    if(items.name){
      let name = items.name?items.name:""
      let noOfNames = items.listOfNames&&items.listOfNames.length>0?items.listOfNames.length:""
      let tooltipInfo = ""
      items.listOfNames&&items.listOfNames.length>0&&items.listOfNames.forEach((e)=>{
        tooltipInfo = tooltipInfo.concat(e+'\n')
      })
      if(name != ""){
        rowName = (<span className='name-tooltip'>{name}
                          <span title={tooltipInfo}>{noOfNames!=""?`+`+noOfNames:""}</span>
                  </span>)
           }
    }
    return rowName
  }
  const getDisputeCell =(item)=>{
    let num = item.length-1
    let val = num > 0 ? item[0]+', +'+num.toString() : item[0]
    return val
  }

  const showMobileView = () => {
    let row = props.viewData[rowIndex]
    // let viewFormTitle = <Subheading label={props.viewLabel} />
    let viewFormData = props.viewLabels.map((labelItem) => {
      return (
        <>
          {labelItem.id.toUpperCase() != 'ACTIONS' ?
          <Form.Group as={Col} md={'4 md-3'}>
            <div className={`d-flex d-flex-row align-items-center justify-content-between`}>
              <Form.Label>{labelItem.label}</Form.Label>
            </div>
            {
              labelItem.id.toUpperCase()=='ACTUALFUEL' ?
              <Input
                colWidth={"10"}
                className={""}
                Type={"text"}
                disabled={row[labelItem.id] ? true : false}
                Label={""}
                isRequred={false}
                borderRed={(row['escalated'] || getFormattedMMDDYY(new Date(row['date'])) == getFormattedMMDDYY(new Date())) ? true : false}
                Name={labelItem.id}
                handleChange={(e) => props.onHandleChangeRow(e,labelItem.id,getRowIndex(row))}
                errorMessage={formData && formData.length && formData[getRowIndex(row)]['errorMessage'] ? true:null}
                // handleBlur={(e) => props.onHandleBlur(e, item, index)} 
                formDataSet={formData && formData.length && formData[getRowIndex(row)][labelItem.id] ? formData[getRowIndex(row)][labelItem.id] : ''}
              /> :
              <InputGroup className={`mb-3`}>
              <Form.Control
                name={labelItem.Name}
                id={labelItem.Name}
                disabled
                value={Array.isArray(row[labelItem.id]) ? getDisputeCell(row[labelItem.id]) :row[labelItem.id]}
              />
            </InputGroup>
            }
            
          </Form.Group> :<>
          {props.modalCustomText ? <div className='bf-required d-flex justify-content-center'>{props.modalCustomText}</div> : null}
           <div className={`bf-popup-view-buttons ${(row['MobileButtons'] && row['MobileButtons'].length == 0) || (row['Buttons'] && row['Buttons'].length == 1) ? 'bf-popup-single-button' : ''}`}>
          {row['MobileButtons'] && row['MobileButtons'].length ?
          row['MobileButtons'].map((button) => 
          (
           <Button disabled={props.level2 && button.Label !== "Activate" ? button.disable : button.Label === "Activate"&& props.passwordIdArray.length && props.passwordIdArray.includes(row.taxID)?true:props.userLevelId && (button.Label === "Deactive" || button.Label === "Deactivate") && row.taxID == props.userLevelId ? true :button.Label === "Edit & Close" || button.Label === "Close" || button.name === "view"  ? button.disable :(button.Label === "Delete" || button.Label === "Delete"?button.checkAdminAccess && button.checkAdminAccess?getAccessLevel(Storage.getItem('userType'), 
               Storage.getItem('accessLevel'))?false:true:getSuperAccess(Storage.getItem('userType'), Storage.getItem('accessLevel'))?false:true:getAccessLevel(Storage.getItem('userType'), 
               Storage.getItem('accessLevel'))?false:true)||(selectedUser=="internal" && barrelFuelAccess(Storage.getItem('userType'), Storage.getItem('accessLevel'))?true:false)}
                 onClick={button.Label === "Edit"?(e) => {closeModal();props.primaryClick(row,rowIndex)}:(button.Label === "Activate")?(e) => {closeModal();props.primaryClick(row,rowIndex)}:(button.Label === "Deactive" || button.Label === "Deactivate")?(e) => {closeModal();props.secondaryClic(row,rowIndex)}:button.Label === "Delete"?(e) => {closeModal();props.secondaryClic(row,rowIndex)}:(e) =>{closeModal(row,labelItem,button);props.onClick(row,button?.payload,button,true)}} className={`${button.className}`} variant="contained" size="small">
                 {button.Label} {button.Label == 'Edit' ? <img src={EditIcon} className="bf-multi-edit-icon" />:<img src={DeletIcon} className="bf-multi-delete-icon"/> }
           </Button>
          )
          ) :
          row['Buttons'].map((button) => 
             (
              <Button disabled={props.level2 && button.Label !== "Activate" ? button.disable : button.Label === "Activate"&& props.passwordIdArray.length && props.passwordIdArray.includes(row.taxID)?true:props.userLevelId && (button.Label === "Deactive" || button.Label === "Deactivate") && row.taxID == props.userLevelId ? true :button.Label === "Edit & Close" || button.Label === "Close" || button.name === "view"  ? button.disable :(button.Label === "Delete" || button.Label === "Delete"?button.checkAdminAccess && button.checkAdminAccess?getAccessLevel(Storage.getItem('userType'), 
                  Storage.getItem('accessLevel'))?false:true:getSuperAccess(Storage.getItem('userType'), Storage.getItem('accessLevel'))?false:true:getAccessLevel(Storage.getItem('userType'), 
                  Storage.getItem('accessLevel'))?false:true)||(selectedUser=="internal" && barrelFuelAccess(Storage.getItem('userType'), Storage.getItem('accessLevel'))?true:false)}
                    onClick={button.Label === "Edit"?(e) => {closeModal();props.primaryClick(row,rowIndex)}:(button.Label === "Activate")?(e) => {closeModal();props.primaryClick(row,rowIndex)}:(button.Label === "Deactive" || button.Label === "Deactivate")?(e) => {closeModal();props.secondaryClic(row,rowIndex)}:button.Label === "Delete"?(e) => {closeModal();props.secondaryClic(row,rowIndex)}:(e) =>{closeModal(row,labelItem,button);props.onClick(row,button?.payload,button,true)}} className={`${button.className}`} variant="contained" size="small">
                    {button.Label} {button.Label == 'Edit' ? <img src={EditIcon} className="bf-multi-edit-icon" />:<img src={DeletIcon} className="bf-multi-delete-icon"/> }
              </Button>
             )
          )}
          </div></>}
        </>
      )
    })
    // let viewFormTitle = () => {
      return (
        <>
          <Subheading label={props.viewLabel} />
          <>{viewFormData}</>
        </>

      )
    // }

    // document.getElementById('root').style.filter = 'blur(5px)';
    // setModalContent(viewFormTitle())
    // setShowModal(true);
    // return viewFormTitle()
    // props.viewData.filter((e) => {
    //   //e.taxID == row.taxID 

    // })
  }
  const showMobilePopUp = (row,ind)=>{
    setRowIndex(ind)
    setShowModal(true)
    document.getElementById('root').style.filter = 'blur(5px)';
  }
  const getRowIndex = (row)=>{
    let i=0;
    if(props.admin){
      props.formDataSetRow?.map((val,ind)=>{
        if(row?.company==val?.company){
          i= ind
        }
      })
    }else{
    props.formDataSetRow?.map((val,ind)=>{
      if(row?.orderid==val?.orderid){
        i= ind
      }
    })
  }
    return i;
  }
  const closeModal = (row,labelItem,button) => {
    if(button?.Label=='Close'){
      if(props.formDataSetRow && props.formDataSetRow.length && props.formDataSetRow[getRowIndex(row)]['actualfuel']){
        setModalContent(null)
        setShowModal(false);
        document.getElementById('root').style.filter = 'none';
      }
    }else{
      if(props.closeMobile){
        props.closeMobile()
      }
      setModalContent(null)
      setShowModal(false);
      document.getElementById('root').style.filter = 'none';
    }
  }

  const setLocationTitle = (row) => {
    let title = '';
    if(row){
      let titleArray = row.split(',');
      titleArray.map((val,index) => {
        title = title + val + (index == titleArray.length - 1 ? '' : ',') + ((index+1) % 10 == 0 ? '\n' : '')
      })
    }

    return title
  }

  let noOfRows  = props.rowsPerPage?props.rowsPerPage:rowsPerPage;
  
  return (
    <>
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {loading ? <Loader height='auto'/> : (
          <>
        {props.tableTitle&&<div className={'table-subheading'}>{props.tableTitle?props.tableTitle:""}</div>}
        {props.searchEnabled && props.searchEnabled?
          <>{ props.isUserTab && !props.isUserMobileTab ?getOptions(rows): null}<TextField
          id="filled-search"
          type="search"
          variant="standard"
          className={props.isUserTab ? 'bf-user-tab-search' : ''}
          placeholder={props.isUserTab ?"User Name":'Search'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" className='search-component'>
                <IoIosSearch className='search-icon'/>
              </InputAdornment>
            ),
          }}
          onChange={(e) => SearchInTable(e)}
        />

        <>{(props.isUserTab && !props.isUserMobileTab)?<FormControlLabel onClick={(e)=>checkInactiveUser(e)} className={'bf-mrgl120'} control={<Checkbox checked={inactiveUsers} name='addInactiveUsers' />} label="Include Inactive Users" />:null}</></>: null}
        {(rows && rows.length) || (!props.noMatch) ?<>
        <TableContainer>
          <Table
            stickyHeader
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows && rows.length}
              headCells={tableHead}
              sortEnabled = {props.sortEnabled}
              searchEnabled = {props.searchEnabled}
              onChange = {SearchInColumn}
            />
             {rows && rows.length ?
        <>
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                
              {stableSort(props.searchEnabled ? rows:props.Data, getComparator(order, orderBy))
                .slice(((page * noOfRows)-noOfRows), page * noOfRows)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  {return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name,row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name+index}
                      selected={isItemSelected}
                      className = {`${row['pending'] || row['escalated'] ?"bf-expired-fuel":""}`}
                    >
                      
                      {Object.keys(row).map((item, i) => {
                        if (item === "Buttons") {
                          return (<TableCell align="right" className={`action-buttons ${props.isMulti ? 'bf-multi-table' :''}`}>
                            {row[item].map((button, j) => {
                              if(button.Label == ""){return(<p></p>)}
                              else if(button.Label == "Reopen"){return(<a onClick={(e)=>{props.onClick(row,button.payload,button)}} className='bf-order-link'>{button.Label}</a>)}
                              else{return (<Button disabled={props.level2 && button.Label !== "Activate" ? button.disable :button.Label === "Activate"&& props?.passwordIdArray?.length && props?.passwordIdArray?.includes(row.taxID)?true:props.userLevelId && (button.Label === "Deactive" || button.Label === "Deactivate") && row.taxID == props.userLevelId ? true :button.Label === "Edit & Close" || button.Label === "Close" || button.name === "view" || button.name === "cancel"  ? button.disable :(button.Label === "Delete" || button.Label === "Delete"?button.checkAdminAccess && button.checkAdminAccess?getAccessLevel(Storage.getItem('userType'), 
                              Storage.getItem('accessLevel'))?false:true:getSuperAccess(Storage.getItem('userType'), Storage.getItem('accessLevel'))?false:true:getAccessLevel(Storage.getItem('userType'), 
                              Storage.getItem('accessLevel'))?false:true)||(selectedUser=="internal" && barrelFuelAccess(Storage.getItem('userType'), Storage.getItem('accessLevel'))?true:false)}
                               onClick={button.Label === "Edit"?(e) => props.primaryClick(row,index):(button.Label === "Activate") ?(e) => props.primaryClick(row,index,button):(button.Label === "Deactive" || button.Label === "Deactivate")?(e) => props.secondaryClic(row,index,button):button.Label === "Delete"?(e) => props.secondaryClic(row,index):(e) =>props.onClick(row,button?.payload,button)} className={`${button.className}`} variant="contained" size="small">
                                {button.Label == 'Dismiss' ? <span className='bf-dismiss-cross'><IoIosCloseCircleOutline className='notification-dismiss-btn'/></span> : ''}<span className='bf-buttons'>{button.Label} {button.Label == 'Edit' ? <img src={EditIcon} className="bf-multi-edit-icon" />:<img src={DeletIcon} className="bf-multi-delete-icon"/> }</span>
                              </Button>)}
                            })}
                          </TableCell>)
                        }else if(item == "actualfuel" || item == "reasonDeactive"){
                          return (<TableCell className={'bf-'+item} > <Input
                            colWidth={"10"}
                            className={""}
                            Type={"text"}
                            Label={""}
                            disabled={item=="actualfuel" ? row[item] : false}
                            isRequred={false}
                            Name={item}
                            borderRed={item=="actualfuel" && (row['escalated'] || getFormattedMMDDYY(new Date(row['date'])) == getFormattedMMDDYY(new Date())) ? true : false}
                            handleChange={(e) => props.onHandleChangeRow(e,item,getRowIndex(row))}
                            errorMessage={props.formDataSetRow && props.formDataSetRow.length && props.formDataSetRow[getRowIndex(row)]['errorMessage'] ? true:null}
                            // handleBlur={(e) => props.onHandleBlur(e, item, index)} 
                            formDataSet={props.formDataSetRow && props.formDataSetRow.length && props.formDataSetRow[getRowIndex(row)][item] ? props.formDataSetRow[getRowIndex(row)][item] : ''}
                              /></TableCell>)
                        }else if(item == "mobileButton"){
                            return (props.isMobileTable && <TableCell align="right" className="">
                              <img src={AddMoreIcon} onClick={(e)=>showMobilePopUp(row,index)}/>
                            </TableCell>)
                        } else {
                          return (item !== "airportId"? item !== 'taxUnit' ? item !== "taxID" && item!== "pending" && item!== "escalated" && item!== "validFromA" && item!== "MobileButtons" ?  <TableCell
                            onClick={(e) => props.rowClick && props.rowClick(row["Buttons"].length && row["Buttons"][0].payload,row)}
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            title={Array.isArray(row[item]) ? row[item][0] == 'MultiLine' ? null : row[item]: item=='location'? setLocationTitle(row[item]): row[item]}
                            className={'bf-'+item}
                          >
                            {item=='totprice' && row['pending'] ? props.hoverFunction(row) : null}
                            
                            {(item == 'taxAmount' || item == 'feesAmount'&& !Array.isArray(row[item]) ? row['taxUnit'] == '$' ? '$' : null : null)} 

                            {Array.isArray(row[item]) ? row[item][0] == 'MultiLine' ? getMultiline(row[item][1]):props.isBulkUpload == true?getTableCells(row[item]): getDisputeCell(row[item]) :item=='fuelingDate' ? parse(row[item]) :row[item]}
                            
                            {(item == 'taxAmount' || item == 'feesAmount' && !Array.isArray(row[item]) ? row['taxUnit'] == "%" ? '%' : null : null)}
                            
                            {item == "message" ? <div className="bf-more-info">{row["Buttons"][0].time}</div> : ""}
                          </TableCell>: null : null : null) 

                        }
                        
                        })}

                    
                      {/* <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{row.accessL}</TableCell>
                      <TableCell align="right">{row.carbs}</TableCell>
                      <TableCell align="right">{row.protein}</TableCell>
                      <TableCell align="right">
                        <Button className="btn btn-bf-primary" variant="contained" size="small">
                          Edit
                        </Button>
                        <Button className="btn-bf-secondary bf-mrgl20" variant="contained" size="small">
                          Deactivate
                        </Button>
                      </TableCell> */}
                    </TableRow>
                  );}
                })}

            </TableBody>
            </> :  <div className='bf-no-records d-flex align-items-center justify-content-center'>No records found</div>} 
          </Table>
         
        </TableContainer>

        {props.buttonsRequired? <div className='bf-paginarion-seciton table-buttons'>{getTableButtons()}</div>:
        <>
        {props.noPagination ?"":
        <div className='bf-paginarion-seciton'> {!props.isUserMobileTab ? 
        <Select
        //  md={2}
        //  value={props.rowsPerPage?props.rowsPerPage:rowsPerPage}
         className="bf-pagination-dropdown"
        //   onChange={(e) => handleChangeRowsPerPage(e)}
          colWidth={"2 bf-select"} 
        Type={"select"} 
        Placeholder={"Rows"}
        Options={getRowsOptions()}
        Name={"Pagination"}
        handleChange={(e)=>{handleChangeRowsPerPage(e)}}
        formDataSet={props.rowsPerPage?props.rowsPerPage:rowsPerPage}
        />: null }
        <Pagination
          count={Math.ceil(rows && rows.length/rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          defaultPage={1}
          showFirstButton
          showLastButton
          renderItem={(item) => (
            <PaginationItem
              components={{ first: KeyboardDoubleArrowLeftIcon, last: KeyboardDoubleArrowRightIcon }}
              {...item}
            />
          )}
        /><div className="bf-table-footer">{props.pricePending? props.pricePendingText:""}</div>
              </div>}
              </>}
          </>: <div className='bf-no-match d-flex'>No Matches Found!</div>}      </>)}
      </Paper> 
    </Box>
    {showModal ? <CustomProfileModal 
        show={showModal}
        onHide={() => closeModal()}
        hide={() => closeModal()}
        title={''}
        size={"md"}
        hideFooter = {true}
        modelBodyContent={showMobileView()}
        className="bf-mobile-view-modal"
      />: null}
    </>
  );
}
