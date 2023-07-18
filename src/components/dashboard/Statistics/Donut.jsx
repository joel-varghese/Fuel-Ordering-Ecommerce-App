import { height } from "@mui/system";
import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["Task", "Hours per Day"],
  ["Active", 11],
  ["Pending", 11],
  ["Dispute", 2],
 
];

export const options = {
  title: "Order Staus",
  pieHole: 0.4,
  pieSliceText:'none',
  is3D: false,
  colors: ["black",  "#63666A"],
  tooltip: {
    text: 'value'
  },
  height: "100%",
  width: "100%"
};

function Donut() {
  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      
    />
  );
}

export {Donut}