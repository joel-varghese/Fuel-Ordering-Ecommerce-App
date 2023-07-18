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
import Select from '../select/select';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import './table.scss'
import TextField from '@mui/material/TextField';
import Search from '@mui/icons-material/Search';
import {IoIosSearch} from 'react-icons/io';
import Pagination from '@mui/material/Pagination';
import UnfoldLessOutlinedIcon from '@mui/icons-material/UnfoldLessOutlined';
import Loader from '../loader/loader';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { rowsPerPage_FP_Options, rowsPerPage_FP_Table } from '../../controls/commonConstants';
// import Select from '@mui/material/Select';
import { PaginationItem } from '@mui/material';
function createData(name, calories, fat, carbs, protein) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}



function descendingComparator(a, b, orderBy) {
  // if (b[orderBy] < a[orderBy]) {
  //   return -1;
  // }
  // if (b[orderBy] > a[orderBy]) {
  //   return 1;
  // }
  return  a[orderBy]?.toLowerCase().localeCompare(b[orderBy]?.toLowerCase());
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

        {headCells && headCells.map((headCell) => {
          if(headCell.id == 'category'){
              return                // <Select 
                // colWidth={headCell.styles ? headCell.styles.colWidth : ""} 
                // Type={headCell.fieldType}
                // Options={headCell.options ? headCell.options : null}
                // Placeholder={headCell.placeHolder}
                // />
              
          }else{ return(
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            colSpan={headCell.id === 'Actions' ? 2 : null}
            className={headCell.id === 'Actions' ? 'bf-actions-header' : 'bf-'+headCell.id}
          >
            {sortEnabled ?<TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              IconComponent={UnfoldLessOutlinedIcon}
              disabled={sortEnabled}
            >
              {headCell.label}

            </TableSortLabel>: headCell.label}
          </TableCell>)
            }
        })}
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

export default function FilterTable(props) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPage_FP_Table);
  const [rows, setRowsData] = React.useState(props.Data)
  const [originalRows, setOriginalRows] = React.useState(props.Data)
  // const len = props.Data.length
  useEffect(() => {
      setRowsData(props.Data)
      setOriginalRows(props.Data)
      setPage(1)
  },[props.Data])
  
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
              searchResult.push(String(data[item]).includes(event.target.value))
            } 
          } else {
            searchResult.push(String(data[item]).includes(event.target.value))
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
    }
  }
  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows && rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      {rows && rows.length ? 
      <Paper sx={{ width: '100%', mb: 2 }}>

        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
        {props.searchEnabled && props.searchEnabled?<TextField
          id="filled-search"
          type="search"
          variant="standard"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" className='search-component'>
                <IoIosSearch className='search-icon'/>
              </InputAdornment>
            ),
          }}
          onChange={(e) => SearchInTable(e)}
        /> : null}
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
              // rowCount={len}
              headCells={props.heading}
              sortEnabled = {props.sortEnabled}
              searchEnabled = {props.searchEnabled}
            />
            {rows && rows.length ?
            <>
            <TableBody>
              
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              { // stableSort(props.Data, getComparator(order, orderBy))
                rows && rows.slice(((page * rowsPerPage)-rowsPerPage), page * rowsPerPage)
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
                      // key={row.name}
                      selected={isItemSelected}
                    >
                      
                      {row.map((item, index) => {
                        if (Array.isArray(item)) {
                          return (<TableCell align="right" className='d-flex d-flex-row action-buttons'>
                            {item.map((button, index) => {
                              if(button.Label == ""){return(<p> </p>)}
                              else{return (<Button onClick={(e) => props.onClick(button.row,button.payload)} className={`${button.className}`} variant="contained" size="small">
                                {button.Label}
                              </Button>)}
                            })}
                          </TableCell>)
                        } else {
                          return (<TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            className={'bf-'+item}
                            title={item}
                          >
                            {item}
                          </TableCell>)

                        }})}
                    
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
                  );
                })}

            </TableBody>
            </> :  <div className='bf-no-records d-flex align-items-center justify-content-center'>No records found</div>} 
          </Table>
        </TableContainer>
        {<div className='bf-paginarion-seciton'> 
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
        </div>}
      </Paper> : <Loader/>}

    </Box>
  );
}
