import Table from "react-bootstrap/Table";

function createData(trends) {
  return { trends };
}

const rows = [
  createData("We have an exciting offer for 10% on any purchase"),
  createData("Do visit our expo in Los Angeles "),
  createData("Get free refuel on desired ranges / FBO's"),
  createData("Well - time pass"),
  createData("Enjoy New York Best bars with offers"),
  createData("Let us party wherever possible"),
  createData("Get a free ride !"),
];

export function Trending() {
  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Upcoming Deals</th>     
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr>
            <td>
              {row.trends}
            </td>           
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
