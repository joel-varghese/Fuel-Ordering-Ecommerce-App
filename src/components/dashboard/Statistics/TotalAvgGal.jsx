import React from 'react';
import ReactApexChart from "react-apexcharts";
import activetrips from "./dates";
import "./statistics.scss";
export class TotalAvgGal extends React.Component {
  constructor(props) {

    super(props);
    //let monthArray = this.makeMonthArray(props.totalGallonRecords[0][1])
    let monthArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    this.state = {
      series: [
        {
          name: "Gallons(In Thousands)",
          type: "column",
          //data: [23, 11, 22, 27, 23, 11, 22, 27, 23, 11, 22, 27],
          data: props.totalGallonRecords[0][0],
        },
        {
          name: "Order Value(In Thousands)",
          type: "area",
          //data: [44, 55, 41, 67, 44, 55, 41, 67, 44, 55, 41, 67],
          data: props.totalGallonRecords[1][0],
        },
        {
          name: "Average Price / Gallon",
          type: "line",
          //data: [30, 25, 36, 30, 30, 25, 36, 30, 30, 25, 36, 30],
          data: props.totalGallonRecords[2][0],
        },
      ],
      options: {
        chart: {
          height: 350,
          type: "line",
          stacked: false,
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        grid: {
          show: false,
        },
        legend: {
          show: true,
        },
        stroke: {
          width: [0, 2, 5],
          curve: "smooth",
        },
        plotOptions: {
          bar: {
            columnWidth: "50%",
          },
        },

        fill: {
          opacity: [0.85, 0.25, 1],
          gradient: {
            inverseColors: false,
            shade: "light",
            type: "vertical",
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100],
          },
        },
        labels: monthArray,
        markers: {
          size: 0,
          shape: "circle",
          hover: {
            size: 6,
            sizeOffset: 6,
          },
        },
        xaxis: {
          type: "category",
          show: true,
          category: monthArray,
        },
        yaxis: {
          title: {
            text: "Points",
          },
          show: false,
          min: 0,
        },
        tooltip: {
          shared: true,
          intersect: false,
          items: {
            display: "flex",
          },
          x: {
            show: false,
          },
          y: {
            formatter: function (
              y,
              { series, seriesIndex, dataPointIndex, w }
            ) {
              if (typeof y !== "undefined") {
                console.log(w);
                return y.toFixed(0);
              }
              return y;
            },
            title: {
              text:"Total Gallons, Average Fuel Price & Total Savings",
              formatter: (seriesName) => seriesName,
            },
          },
        },
      },
    };
    
  }

  makeMonthArray(monthData){
    let category = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    let monthArray = [];
    monthData && monthData.map((item)=>{
      monthArray.push(category[item])
    })
    return monthArray;
  }
  

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          // width="80%"
        />
      </div>
    );
  }
}

