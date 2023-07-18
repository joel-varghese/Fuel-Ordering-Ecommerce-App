
import React from 'react'
import ReactApexChart from "react-apexcharts";
import {Storage} from '../../../controls/Storage'; 
export class TreeMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
       
     
      series:props.topDestinationRecords,
      options: {
        legend: {
          show: false,
        },
        chart: {
          style: {
            width:400,
            height:400,
            // minHeight:"400px"
/*            height: "10%",
            width: "10%",
*/            
          },
          type: "treemap",
          // height: 180,
          shadeDensity: 0.75,
          toolbar: {
            show: false,
          },
          offsetX: 20,
          offsetY: -20,
        },
        dataLabels: {
          style: {
            colors: [props.fontColur],
          },
        },

        title: {
          text: props.title,
          align: "center",
          offsetY: 20,
          style: {
            fontSize: "14px",
            fontWeight: "bold",
            fontFamily: "Open Sans"
          },
        },

        //colors: ["#C5D86D", "#449DD1"],
        colors: [props.colour1, props.colour2],
      },
    };
  }

  render() {
    return (
      this.state.series?<div id="chart1">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="treemap"         
          width={this.props.width}
          height={this.props.height}
        //  minHeight={this.props.minHeight}
        />
      </div>:<div>No record found</div>
    );
  }
}