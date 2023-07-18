import React from 'react';
import ReactApexChart from "react-apexcharts";
import Table from "react-bootstrap/Table";
import activetrips from "./dates";
export class DisputedTrips extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      series: [76, 67, 61],
      options: {
        chart: {
          height: 200,
          type: "radialBar",
          offsetY: -20
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 5,
              size: "20%",
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                show: false,
              },
            },
          },
        },
        colors: ["#1ab7ea", "#0084ff", "#39539E"],
        labels: ["Escalated", "Open", "Closed"],
        legend: {
          show: true,
          floating: false,
          fontSize: "16px",
          position: "left",
          offsetX: 80,
          offsetY: 15,
          labels: {
            useSeriesColors: true,
          },
          markers: {
            size: 0,
          },
          formatter: function (seriesName, opts) {
            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
          },
          itemMargin: {
            vertical: 1,
          },
        },
        width:(window.screen.width > 1600) ? 350 : 300,
        height:(window.screen.width > 1600) ? 350 : 300,
        responsive: [
          {
            breakpoint: 200,
            options: {
              legend: {
                show: false,
              },
            },
          },
        ],
      },
    };
  }

  render() {
    return (
      <div>
        <div id="chart11">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="radialBar"
            width={330}
            height={360}
          />
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
