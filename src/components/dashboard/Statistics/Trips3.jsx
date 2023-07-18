import React from 'react';
import Table from "react-bootstrap/Table";
import ReactApexChart from "react-apexcharts";

export class Trips3 extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "series1",
          data: [50, 40, 60, 75, 50, 80, 60],
        },
      ],
      options: {
        chart: {
          type: "area",
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
          //offsetY: 30,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          colors: ["#B17FDB"],
          width: 1,
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
        xaxis: {
          tickAmount: 0,
          tickPlacement: "off",
          labels: {
            show: false,
          },
          title: {
            text: "Decline",
            offsetY: 10,
            offsetX: -5,
            style: {
              fontSize: "11px",
              fontWeight: "normal",
            },
            axisTicks: {
              show: false,
            },
            crosshairs: {
              show: false,
            },
            axisBorder: {
              show: false,
            },
          },
          type: "datetime",
          categories: [
            "2018-09-19T00:00:00.000Z",
            "2018-09-19T01:30:00.000Z",
            "2018-09-19T02:30:00.000Z",
            "2018-09-19T03:30:00.000Z",
            "2018-09-19T04:30:00.000Z",
            "2018-09-19T05:30:00.000Z",
            "2018-09-19T06:30:00.000Z",
          ],
        },
        crosshairs: {
          show: false,
        },
        grid: {
          show: false,
        },
        legend: {
          show: false,
        },
        responsive: [
          {
            breakpoint: 320,
          },
        ],
        fill: {
          colors: ["#F4ECFA"],
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm",
          },
        },
      },
    };
  }
  
  render() {
    return (
      <>
        <ReactApexChart
          options={this.props.options}
          series={this.state.series}
          type="area"
          height={140}
          width={160}
        />
      </>
    );

  }
}

