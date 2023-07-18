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
import Select from '../select/select';
import InputAdornment from '@mui/material/InputAdornment';
import './table.scss'
import TextField from '@mui/material/TextField';
import Search from '@mui/icons-material/Search';
import {IoIosSearch, IoIosArrowDropdownCircle, IoIosArrowDropupCircle} from 'react-icons/io';

import Pagination from '@mui/material/Pagination';
import UnfoldLessOutlinedIcon from '@mui/icons-material/UnfoldLessOutlined';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { getAccessLevel, getSuperAccess } from '../../controls/commanAccessLevel';
import { Storage } from '../../controls/Storage';
import Loader from '../loader/loader';
import { rowsPerPage_FP_Options, rowsPerPage_FP_Table } from '../../controls/commonConstants';
// import Select from '@mui/material/Select';
//import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';

import Collapse from '@mui/material/Collapse';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { PaginationItem, Stack } from '@mui/material';
import ButtonComponent from '../button/button';
import Subheading from '../subHeading/subHeading';
function descendingComparator(a, b, orderBy) {
  // if (b[orderBy] < a[orderBy]) {
  //   return -1;
  // }
  // if (b[orderBy] > a[orderBy]) {
  //   return 1;
  // }
  return  a[orderBy]?.toLowerCase().localeCompare(b[orderBy]?.toLowerCase());
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

function RowAccordion(props) {
  
  const { row, rows,index } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <>
    {props.parentProp.customContent? 
      <>
      <TableRow className = {props.parentProp.selectedInd==index ? row['order'] == "Pending" ? "bf-expired-fuel-multi bf-expired-bgcolor" : "bf-row-select" :`${row['order'] == "Pending" ? "bf-expired-fuel-multi":""}`} sx={{ '& > *': { borderBottom: 'unset' } }} onClick={()=>{setOpen(!open) ; props.parentProp.onAccordianRowClick(row,props.index)}}>
        
        {Object.keys(row).map((item, index)=>(
          <>
          {item != "Buttons"?<TableCell className={`${open ? 'expanded' : 'collapsed'}`} align="right">
          {index == 0?<IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <IoIosArrowDropupCircle className='bf-primary-color'/> : <IoIosArrowDropdownCircle className='bf-primary-color'/>}
        </IconButton>:""}
            {row[item]}</TableCell>:""}</>
        ))}
        <TableCell>{row["Buttons"] && row["Buttons"]?.map((button, index) => {
            return (<Button disabled={button.Label === "Delete" || button.Label === "Delete"?getSuperAccess(Storage.getItem('userType'), Storage.getItem('accessLevel'))?false:true:getAccessLevel(Storage.getItem('userType'), 
            Storage.getItem('accessLevel'))?false:true}  onClick={ (e)=>props.parentProp.primaryClick(row)} className={`${button.className}`} variant="contained" size="small">
              {button.Label}
            </Button>)
      })}</TableCell>

      </TableRow>
      <TableRow>
        <TableCell className={`bf-accordion-table-container ${open ? 'bf-accordion-expanded' : 'bf-accordion-collapsed'}`} style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <div>{props.parentProp.accordionContent(row,props.index)}</div>
            </Box>
          </Collapse>
        </TableCell>
        </TableRow>
      </>
           :
            <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} onClick={()=>{setOpen(!open)}}>
        
        
          <TableCell align="right"><IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <IoIosArrowDropupCircle className='bf-primary-color'/> : <IoIosArrowDropdownCircle className='bf-primary-color'/>}
        </IconButton>{row["AirportId"]}</TableCell>
        <TableCell align="right">{row["jetA"]}</TableCell>
        <TableCell align="right">{row["100LL"]}</TableCell>
        <TableCell align="right">{row["jetaPrist"]}</TableCell>
        <TableCell align="right">{row["saf"]}</TableCell>
        <TableCell>{row["Buttons"].map((button, index) => {
            return (<Button disabled={button.Label === "Delete" || button.Label === "Delete"?getSuperAccess(Storage.getItem('userType'), Storage.getItem('accessLevel'))?false:true:getAccessLevel(Storage.getItem('userType'), 
            Storage.getItem('accessLevel'))?false:true}  onClick={ (e)=>props.parentProp.primaryClick(row)} className={`${button.className}`} variant="contained" size="small">
              {button.Label}
            </Button>)
      })}</TableCell>

       

      </TableRow>
            <TableRow>
          <TableCell className="bf-accordion-table-container" style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          {row["jetA"] === '-' || row["jetA"] === "NO"|| row["jetA"]  === "Flat" && (row["100LL"] ==='NO' ||row["100LL"] === '-' ||row["100LL"] === 'Flat') ?null:
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <div size="small" aria-label="purchases">
                <div className='bf-table-accordion-container'>
                  {row.accordion.map((historyRow) => {
                    let i= 0;
                    if(historyRow['labeldata']=== "100LL" || historyRow['labeldata']=== "Jet-A" || historyRow['labeldata']===''){
                    return(<div >
                      
                      {Object.keys(historyRow).map((item)=>{
                        if(item !== "tiresDrop" && historyRow['labeldata'] !== null && historyRow['tiresDrop']){
                          
                            return(<div>
                            {historyRow[item] !== null?historyRow[item].replace('-null','+'):"-"}
                          </div>)}
                     i++ })}
                      </div>)}
                  })}
                </div>
              </div>
            </Box>
          </Collapse>}
          </TableCell>
      </TableRow>
      </>}
        
          </>
    </React.Fragment>
    
  );
}

export default function FuelPriceTable(props) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPage_FP_Table);
  const [rows, setRowsData] = React.useState()
  const [originalRows, setOriginalRows] = React.useState()
  const [loading, setLoading] = useState(false)
  const [accessLevel, setAccessLevel] = useState("Access Level")
  const [accessLevelOptions, setAccessLevelOptions] = useState(["Access Level"])
  const [tableRowLabels, setTableRowLabels] = useState(["Tire","jetA","100ll","prist","saf"])
  const [inactiveUsers, setInactiveUsers] = useState(false)
  const [open, setOpen] = React.useState(false);
  const accountHomeReducer = useSelector((state) => state.accountHomeReducer);
  const selectedTab = accountHomeReducer && accountHomeReducer.selectedTab && accountHomeReducer.selectedTab;
  const selectedUser = accountHomeReducer && accountHomeReducer.selectedUser ? accountHomeReducer.selectedUser.user:Storage.getItem('userType').toLocaleLowerCase();
   useEffect(() => {
      setRowsData(props.Data)
      setOriginalRows(props.Data)
      setLoading(props.loading && props.loading )
      
  },[props.Data,props.loading && props.loading]) 
  
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
 

  const handleClick = (event, name) => {
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
      //setAccessLevel("Access Level")
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
    if(event.target.value !=="Access Level"){
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
      setPage(1);
      setRowsData(searchData)
    } else {
      setRowsData([])
    }
  }else{
    setRowsData(originalRows)
  }
  }
  const getOptions = () =>{
    let accessLevelArray = ["Access Level"];
    return(<Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Access Leval"
            value ={accessLevel}
            onChange={(e)=>handleChange(e,"accessLevel")}
            placeholder ={"Access Level"}
            md={2}
            className="bf-select"
  >
    {originalRows && originalRows.map((item)=>{
      if(accessLevelArray.indexOf(item.accessLevel)==-1 && item.accessLevel !== "") {
        accessLevelArray.push(item.accessLevel)
      }
      
      
    }) }
    {accessLevelArray.map((data)=>{
        return(<MenuItem value={data}>{data}</MenuItem>)
      })}

  </Select>)
   setAccessLevelOptions(accessLevelArray)
  }
  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  //const emptyRows =  page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows && rows.length) : 0;
  const getMultiLineData = (Data,label, row) =>{
    if(Data && Data.length > 0){  
    if(label === 'Tire'){
    return(Data && Data.map((item)=>{
      return(<>
        <div title={item}>{item}</div>
        </>
      )
    }))
  } else {
    return(Data && Data.map((item)=>{
      return(<>
        <div title={item}>{item !== "-"?parseFloat(item).toFixed(2):"-"}</div>
        </>
      )
    }))
  }
} else {
  return(row &&row.Tire.map((item)=>{
    return(<>
      <div>-</div>
      </>
    )
  }))
}
    
  }
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
  const getOperatorFields = (item) => {
    switch(item.component.toUpperCase()) {
        
      case "PARAGRAPH":
        let array = []
        return (<>
            <Subheading label={item.label}
                isEditable={false}
                EnableEdit={false}
                isAccessAble={getAccessLevel(Storage.getItem('userType'),
                    Storage.getItem('accessLevel'))}
            /></>
  
        )
     };
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

  let noOfRows  = props.rowsPerPage?props.rowsPerPage:rowsPerPage;
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {loading ? <Loader height='auto'/> : (
          <>
          
        {props.searchEnabled && props.searchEnabled?
          <><TextField
          id="filled-search"
          type="search"
          variant="standard"
          placeholder={'Search'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" className='search-component'>
                <IoIosSearch className='search-icon'/>
              </InputAdornment>
            ),
          }}
          onChange={(e) => SearchInTable(e)}
        />
        <></></>: <>{props.pragraph?<div className='bf-edit-fuel-pricing bf-fuel-tiers-head row'>{getOperatorFields(props.pragraph)}</div>:""}</>}
        
        <TableContainer>
          {props.accordion && props.accordion?
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
              headCells={props.heading}
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
                  return(<RowAccordion key={row.name} row={row} parentProp ={props} rows={rows} index={index}  />)
                }
                )}

            </TableBody>
            </> :  <div className='bf-no-records d-flex align-items-center justify-content-center'>No records found</div>} 
          </Table>: <Table
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
              headCells={props.heading}
              sortEnabled = {props.sortEnabled}
              searchEnabled = {props.searchEnabled}
              onChange = {SearchInColumn}
            />
             {rows && rows.length > 0 ?
        <>
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                 
              {stableSort(props.searchEnabled ? rows:props.Data, getComparator(order, orderBy))
                .slice(((page * noOfRows)-noOfRows), page * noOfRows)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                  <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name+index}
                      selected={isItemSelected}
                      className = {`bf-row-font-color ${row['hrDiff'] === 0?"bf-expired-fuel":""}`}
                      
                    >
                      
                      {Object.keys(row).map((item, index) => {
                        
                        if (item === "Buttons") {
                          return (<TableCell component="th"
                          
                          scope="row"
                          padding="none"   className='action-buttons'>
                            {row[item].map((button, index) => {
                              return (<Button disabled={button.Label === "Delete" || button.Label === "Delete"?getSuperAccess(Storage.getItem('userType'), Storage.getItem('accessLevel'))?false:true:getAccessLevel(Storage.getItem('userType'), 
                              Storage.getItem('accessLevel'))?false:true} onClick={button.Label === "Edit" || button.Label ==="Duplicate" ?(e) => props.primaryClick(row):(button.Label === "Deactive" || button.Label === "Deactivate")?(e) => props.secondaryClic(row):button.Label === "Delete"?(e) => props.secondaryClic(row):(e) =>props.onClick(row,button.payload)} className={`${button.className}`} variant="contained" size="small">
                                {button.Label}
                              </Button>)
                            })}
                          </TableCell>)
                        } else {
                          return ( item !== "wholeData" && item !== "hrDiff"?<TableCell
                            onClick={(e) => props.rowClick(row["Buttons"][0].payload)}
                            component="th"
                            scope="row"
                            padding="none"
                            //title={row[item]}
                            className={'bf-'+item}
                            
                          >
                            {row["hrDiff"] ===201 && index ===0 ?<span title='Expiring soon!!' className="bf-expired-soon">!! </span>:null}{tableRowLabels.includes(item)?getMultiLineData(row[item],item,row):row[item]}
                          </TableCell>:null) 

                        }})}
                    
                      
                    </TableRow>
                    
                  );}
                )}
 
            </TableBody>
            </> :  <div className='bf-no-records d-flex align-items-center justify-content-center'>No records found</div>} 
          </Table>}
         
        </TableContainer>

        
        {props.buttonsRequired? <div className='bf-paginarion-seciton table-buttons'>{getTableButtons()}</div>:
        <>
        {props.noPagination ?"":
        <div className='bf-paginarion-seciton'> <Select
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
        />
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
       />
        <div className="bf-table-footer">{props.searchEnabled?"*All Values are in USD":""}</div>     </div>}</>}
                 
           </>)}
      </Paper> 
    </Box>
  );
}
