import React from 'react';
import ReactApexChart from "react-apexcharts";
import activetrips from "./dates";
export class AverageCost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Order Value",
          type: "column",
          data: [
            900000, 100000, 600000, 540333, 200001, 305200,
            752000, 320000, 250700, 160000, 150000, 200000,
          ],
        },
        {
          name: "Average Gallons",
          type: "line",
          data: [
             5000, 6000, 9000, 5000, 9000, 4000, 3000, 9765, 12346,
            16000, 5600, 6000,
          ],
        },
      ],
      options: {
        chart: {
          height: 350,
          type: "line",
        },
        stroke: {
          width: [0, 4],
        },
        title: {
          text: "Average Cost",
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1],
        },
        labels: [
          
          "Jan 2022",
          "Feb 2022",
          "Mar 2022",
          "Apr 2022",
          "May 2022",
          "Jun 2022",
          "July 2022",
          "Aug 2022",
          "Sep 2022",
          "Oct 2022",
          "Nov 2022",
          "Dec 2022",
        ],
        xaxis: {
          type: "datetime",
        },
        yaxis: [
          {
            title: {
              text: "Order Value",
            },
          },
          {
            opposite: true,
            title: {
              text: "Average Gallons",
            },
          },
        ],
      },
    };
  }

  render() {
    return (
      <div>
        <div id="chart">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="line"
            width="100%"
          />
        </div>
        
      </div>
    );
  }
}
