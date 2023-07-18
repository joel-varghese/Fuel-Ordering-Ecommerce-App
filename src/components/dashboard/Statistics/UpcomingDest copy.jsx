import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(tailnumber, gallons, amount, status) {
  return { tailnumber, gallons, amount, status };
}

const rows = [
  createData("10000E", 10000, "$56456.00", "Paid"),
  createData("897654D", 3456, "$16456.00", "Paid"),
  createData("345678", 45678, "$96456.00", "Paid"),
  createData("346790", 2345, "$46456.00", "Pending"),
];

export function UpcomingDest() {
  return (
    <TableContainer component={Paper}>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Tail Number</TableCell>
            <TableCell align="right">Gallons Ordered</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}              
            >
              <TableCell component="th" scope="row">
                {row.tailnumber}
              </TableCell>
              <TableCell align="right">{row.gallons}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
              <TableCell align="right">{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
