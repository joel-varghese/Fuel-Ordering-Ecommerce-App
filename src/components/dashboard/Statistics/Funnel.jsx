import React from 'react';
import ReactApexChart from "react-apexcharts";
import activetrips from "./dates";
import "./statistics.scss";
export class Funnel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: "sparkline1",
          type: "area",
          height: 10,
          offsetX: -10,
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
          foreColor: "#808080",
        },
        dataLabels: {
          enabled: false,
        },
        yaxis: {
          labels: {
            show: false,
          },
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
        stroke: {
          width: 5,
          curve: "smooth",
        },

        tooltip: {
          fixed: {
            enabled: false,
            position: "right",
          },
          x: {
            show: false,
          },
        },
        // title: {
        //   text: "11,345 (+10%)",
        //   style: {
        //     fontSize: "12px",
        //     color: "green",
        //   },
        // },
        xaxis: {
          type: "category",
          categories: ["Jan", "Apr", "Aug", "Dec"],
          labels: {
            colors: ["#FF0000"],
          },
          // type: "datetime",
          // min: new Date("01 Jan 2013").getTime(),
        },

        colors: ["#734CEA"],
      },
      series: [
        {
          name: "Gallons",
          data: [2000, 4000, 3000, 3800],
        },
      ],
      series1: [
        {
          name: "Average Fuel Price",
          data: [5, 3, 8, 10],
        },
      ],
      series2: [
        {
          name: "Total Savings",
          data: [5000, 2000, 9000, 4000],
        },
      ],
      options1: {
        chart: {
          id: "sparkline2",
          type: "area",
          height: 10,
          foreColor: "#808080",
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        yaxis: {
          labels: {
            show: false,
          },
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

        stroke: {
          curve: "smooth",
        },
        markers: {
          size: 0,
        },
        tooltip: {
          fixed: {
            enabled: true,
            position: "right",
          },
          x: {
            show: false,
          },
        },
        // title: {
        //   text: "$4.12(-1%)",
        //   style: {
        //     fontSize: "12px",
        //     color: "red",
        //   },
        //   fill: {
        //     colors: ["#449DD1"],
        //   },
        // },

        colors: ["#F86624"],
        xaxis: {
          type: "category",
          categories: ["Jan", "Apr", "Aug", "Dec"],
          // type: "datetime",
          // min: new Date("01 Jan 2013").getTime(),
        },
      },
      options2: {
        chart: {
          id: "sparkline3",
          type: "area",
          height: 10,
          foreColor: "#808080",
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        yaxis: {
          labels: {
            show: false,
          },
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
        stroke: {
          curve: "smooth",
        },
        markers: {
          size: 0,
        },
        tooltip: {
          fixed: {
            enabled: true,
            position: "right",
          },
          x: {
            show: false,
          },
        },
        // title: {
        //   text: "$6,762 (+12%)",
        //   style: {
        //     fontSize: "12px",
        //     color: "green",
        //   },
        //   fill: {
        //     colors: ["#1464f4"],
        //   },
        // },
        xaxis: {
          type: "category",
          categories: ["Jan", "Apr", "Aug", "Dec"],
          // type: "datetime",
          // min: new Date("01 Jan 2013").getTime(),
        },
      },
    };
    
  }

  render() {
    return (
      <div>
        <div>
          <div className="gallonlabel">11,345</div>
          <div className="gallonsaving">+10%</div>
          <div className="apextop">
            <ReactApexChart
              options={this.state.options}
              series={this.state.series}
              type="area"
              height={125}
              width={125}
            />
          </div>
        </div>
        &nbsp; &nbsp; &nbsp;
        <div>
          <div className="fuellabel">$4.62</div>
          <div className="fuelsaving">-10%</div>
          <div className="apextop">
            <ReactApexChart
              options={this.state.options1}
              series={this.state.series1}
              type="area"
              height={125}
              width={125}
            />
          </div>
        </div>
        &nbsp; &nbsp; &nbsp; &nbsp;
        <div>
          <div className="savingslabel">$5000</div>
          <div className="saving">+10%</div>
          <div className="apextop">
            <ReactApexChart
              options={this.state.options2}
              series={this.state.series2}
              type="area"
              height={125}
              width={125}
            />
          </div>
        </div>
      </div>
    );
  }
}
