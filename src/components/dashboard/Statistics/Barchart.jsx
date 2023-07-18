import React from 'react';
import ReactApexChart from "react-apexcharts";
export class Barchart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Gallons",
          data: [200, 450, 900, 450, 100, 200, 450],
        },
      ],
      options: {
        chart: {
          type: "bar",
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },

        plotOptions: {
          bar: {
            borderRadius: 10,
            borderRadiusApplication: "around",
            backgroundBarRadius: 10,
            columnWidth: "50%",
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: [
          function ({ value, seriesIndex, w }) {
            if (value < 201) {
              return "#7E36AF";
            } else if (value >= 101 && value <= 499) {
              return "#13D8AA";
            } else if (value > 499) {
              return "#F86624";
            } else {
              return "#D9534F";
            }
          },
        ],

        yaxis: {
          labels: {
            show: false,
          },
        },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          position: "top",
          labels: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          crosshairs: {
            show: false,
          },

          legend: {
            show: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        grid: {
          show: false,
        },
        yaxis: {
          show: false,
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
          },
        },
        title: {
          text: "Gallons",
          offsetY: 30,
        },
        crosshairs: {
          show: false,
        },
      },
    };
  }

  render() {
    return (
      <>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height={160}
            />
           
      </>
    );
  }
}