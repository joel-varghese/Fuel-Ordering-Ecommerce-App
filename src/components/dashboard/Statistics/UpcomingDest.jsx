import Table from "react-bootstrap/Table";

function createData(tailnumber, gallons, amount, status) {
  return { tailnumber, gallons, amount, status };
}

const rows = [
  createData("10000E", 10000, "$56456.00", "Paid"),
  createData("897654D", 3456, "$16456.00", "Paid"),
  createData("345678", 45678, "$96456.00", "Paid"),
  createData("346790", 2345, "$46456.00", "Pending"),
  createData("346790", 2345, "$46456.00", "Pending"),
  createData("346790", 2345, "$46456.00", "Pending"),
];

export function UpcomingDest(props) {
  return (
    props.status?<Table responsive="sm" className="react-bootstrap-table1" size="sm">
      <thead>
        <tr className="upcoming-dest-head">
          <th>Tail Number</th>
          <th>Gallons Ordered </th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {props && props.data && props.data.map((row) => (
         // rows.map((row) => (
          <tr className="upcoming-dest-head upcoming-dest-body">
            <td>{row.tailnumber}</td>
            <td>{row.gallons}</td>
            <td>{row.amount}</td>
            <td>{row.status}</td>
          </tr>
        ))}
      </tbody>
    </Table>:<Table responsive="sm" className="react-bootstrap-table1" size="sm">
      <thead>
        <tr  className="upcoming-dest-head">
          <th>FBO Name</th>
          <th>Location </th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {props && props.data && props.data.map((row) => (
         // rows.map((row) => (
          <tr className="upcoming-dest-head upcoming-dest-body">
            <td>{row.tailnumber}</td>
            <td>{row.gallons}</td>
            <td>{row.amount}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
