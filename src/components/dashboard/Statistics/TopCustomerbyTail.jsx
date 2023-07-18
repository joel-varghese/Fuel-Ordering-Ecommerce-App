import React from 'react';
import ReactApexChart from "react-apexcharts";
import activetrips from "./dates";
import "./statistics.scss";
export class TopCustomerbyTail extends React.Component {
  

    constructor(props) {
      super(props);

      this.state = {
      
        series: [{
          name: 'No. Orders',
          //data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
          data:  props.data[1],
        }, {
          name: 'Total Order Value',
          //data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
          data:  props.data[2],
        }, {
          name: 'Total Saving',
          //data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
          data:  props.data[3],
        }],
        options: {
          chart: {
            // height:200,
            type: 'bar'/*,
            style: {
              height: "30%",
              width: "90%",
              fontSize: "1px",
              fontWeight: "normal",
            }*/
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              endingShape: 'rounded'
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 1,
            colors: ['transparent']
          },
          xaxis: {
            //categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            categories: props.data[0],
            show: false/*,
            labels: {style:{
              fontSize: "8px",
              fontWeight: "normal",
            }
          }*/
          },
          yaxis: {
            title: {
              text: '$ (thousands)'
            },
            show: false,
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return "$ " + val + " thousands"
              }
            }
          }
        },
      
      
      };
    }
   

  render() {
    return (
    <div id="chart">
      <ReactApexChart
       
        options={this.state.options} 
        series={this.state.series} 
        width="100%"
        type="bar"      />
    </div>
    );
  }
}

