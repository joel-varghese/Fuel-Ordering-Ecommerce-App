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
import InputAdornment from '@mui/material/InputAdornment';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import './table.scss'
import TextField from '@mui/material/TextField';
import Search from '@mui/icons-material/Search';
import {IoIosSearch} from 'react-icons/io';
import Pagination from '@mui/material/Pagination';
import UnfoldLessOutlinedIcon from '@mui/icons-material/UnfoldLessOutlined';
import FolderIcon from '../../assets/images/folder_icon.svg';
import Loader from '../loader/loader';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { rowsPerPage_Table } from '../../controls/commonConstants';
import { PaginationItem } from '@mui/material';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array && array.map((el, index) => [el, index]);
  stabilizedThis && stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis && stabilizedThis.map((el) => el[0]);
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

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            colSpan={headCell.id === 'Actions' ? 2 : null}
            className={`${headCell.id === 'Actions' ? 'bf-actions-header' : 'bf-'+headCell.id}`}>
            {sortEnabled ?<TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              IconComponent={UnfoldLessOutlinedIcon}
              disabled={sortEnabled}
            >
              {headCell.label}

            </TableSortLabel>: headCell.label}
          </TableCell>
        ))}
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

export default function NewDocTable(props) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPage_Table);
  const [rows, setRowsData] = React.useState(props.Data && props.Data)
  const [originalRows, setOriginalRows] = React.useState(props.Data && props.Data)
  const [loading, setLoading] = useState(false)

  console.log("props.Data", props.Data)
   useEffect(() => {
      setRowsData(props.Data)
      setOriginalRows(props.Data)
      setLoading(props.loader)
  },[props.Data, props.loader]) 
  
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
  /*const handleChange = (event, value) => {
    alert("value", value)
    setPage(value);
  };*/

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
         props.searchBy.map((item) => {
          if(props.searchBy && props.searchBy.length > 0){
            // if(props.searchBy.indexOf(item) !== -1){
              searchResult.push(String(data[item]).toLowerCase().includes(event.target.value.toLowerCase()))
            // } 
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
    }
  }
  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows && rows.length) : 0;

  const getUploadedDate = (d) => {
    var date = new Date(d);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day  = ("0" + (date.getDate())).slice(-2);
    var year = date.getFullYear();
    var hour =  ("0" + (date.getHours())).slice(-2);
    var min =  ("0" + (date.getMinutes())).slice(-2);
    var seg = ("0" + (date.getSeconds())).slice(-2);
    return month + "/" + day + "/" + year
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {loading ? <Loader height="auto"/> :(
          <>
          
        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
        {props.searchEnabled && props.searchEnabled?<TextField
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
        /> : null}
        <TableContainer>
          <Table
            stickyHeader
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            {/* <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={props.heading}
              sortEnabled = {props.sortEnabled}
              searchEnabled = {props.searchEnabled}
            /> */}
            {rows && rows.length ?
        <>
            <TableBody>
              {console.log("rowdatain table", rows)}
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                 
              {stableSort(props.searchEnabled ? rows:props.Data ? props.Data: [] , getComparator(order, orderBy))
                .slice(((page * rowsPerPage)-rowsPerPage), page * rowsPerPage)
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
                      key={row.name}
                      selected={isItemSelected}
                    >
                      
                      {/* {Object.keys(row).map((item, index) => { */}
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            className={'bf-'}
                          >
                          <div><img onClick={(e)=>props.viewFile(e,row)} src={FolderIcon}/>
                            {!props.hidden?(<Checkbox className='bf-delete-image-cb'
                            onChange={(e)=>props.onChecked(e,row)}
                          color="primary"
                          id={row["documentid"]}
                        //   checked={isItemSelected}
                        //   inputProps={{
                        //     'aria-labelledby': labelId,
                        //   }}
                        />):""}
                        </div>
                        <div className='bf-doc-name'>
                          <span title={row["documentName"]}>
                            {row["documentName"]}
                          </span>
                          <span>
                            {getUploadedDate(row["uploadDate"])}
                          </span>
                        </div>
                          </TableCell>

                    </TableRow>
                  );
                })}

            </TableBody>
            </>:  <div className='bf-no-records d-flex align-items-center justify-content-center'>No records found</div>} 
          </Table>
        </TableContainer>
        {<div className='bf-paginarion-seciton'> <Select
         md={2}
         value={rowsPerPage}
         className="bf-pagination-dropdown"
          onChange={(e) => handleChangeRowsPerPage(e)}
         >
            <MenuItem value= "10">10</MenuItem>
            <MenuItem value="15">15</MenuItem>
            <MenuItem value="25">25</MenuItem>
        </Select>
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
            
            </>)}
      </Paper>

    </Box>
  );
}
