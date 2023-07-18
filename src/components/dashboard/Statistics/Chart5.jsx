import GaugeChart from "react-gauge-chart";
import Table from "react-bootstrap/Table";
export function Chart5() {
  return (
    <div>
      <div>
        <GaugeChart
          id="gauge-chart32"
          nrOfLevels={4}
          percent={0.3}
          colors={["#2d74da", "#1f57a4", "#25467a"]}
          arcWidth={0.15}
          arcPadding={0.02}
          needleColor={"#5392ff"}
          formatTextValue={(value) => value + "Trips"}
          textColor="black"
        />
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>You were active on January</th>
            <th>10 upcoming trips</th>
          </tr>
        </thead>
      </Table>
    </div>
  );
}
