import React from 'react';
import ReactApexChart from "react-apexcharts";
import Table from "react-bootstrap/Table";
import activetrips from "./dates";
export class StackkedBarchart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [76],
      options: {
        chart: {
          type: "radialBar",
          
          redrawOnParentResize: true,
          offsetY: -10,
          sparkline: {
            enabled: true,
          },
        },
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              background: "#e7e7e7",
              strokeWidth: "97%",
              margin: 5, // margin is in pixels
              dropShadow: {
                enabled: true,
                top: 2,
                left: 0,
                color: "#999",
                opacity: 1,
                blur: 2,
              },
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                offsetY: -2,
                fontSize: "22px",
              },
            },
          },
        },
        grid: {
          padding: {
            top: -5,
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            shadeIntensity: 0.4,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 53, 91],
          },
        },
        labels: ["Average Results"],
      },
    };
  }

  render() {
    return (
      <div>
        <div id="chart">
          <center>
            <ReactApexChart
              options={this.state.options}
              series={this.state.series}
              type="radialBar"
              width="100%"
            />
          </center>
        </div>
        <br/>
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
}
