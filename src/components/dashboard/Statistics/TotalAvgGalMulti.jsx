import React from 'react';
import ReactApexChart from "react-apexcharts";
import activetrips from "./dates";
import "./statistics.scss";
export class TotalAvgGalMulti extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
         
      series: props.data[0],
      options: {
        chart: {
          height: 180,
          type: 'line',
          stacked: false,
          stroke:1
        },
        stroke: {
          width: [0, 2, 5],
          curve: 'smooth'
        },
        plotOptions: {
          bar: {
            columnWidth: '50%'
          }
        },
        title: {
          text: 'Total Gallons, Total Order Value, Average per gallon Fuel cost',
          align: 'center'
        },
        
        fill: {
          opacity: [0.85, 0.25, 1],
          gradient: {
            inverseColors: false,
            shade: 'light',
            type: "vertical",
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
          }
        },
        /* labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003',
          '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'
        ], */
        labels: props.data[1],
        markers: {
          size: 0
        },
        xaxis: {
          type: 'datetime',
          
        },
        yaxis: {
          title: {
            text: 'Points',
          },
          show:false,
          min: 0
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: function (y) {
              if (typeof y !== "undefined") {
                return y.toFixed(0) + " points";
              }
              return y;
        
            }
          }
        }
      },
    
    
    };
  }

    

  render() {
    return (
      
      <div id="chart">
  <ReactApexChart options={this.state.options} series={this.state.series} type="line"  width="80%"  />
</div>
    
    );
  }
}

