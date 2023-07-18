import { style } from "@mui/system";
import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ['Element', 'Density', { role: 'style' }],
  ['Copper', 8.94, '#b87333'],            // RGB value
  ['Silver', 10.49, 'silver'],            // English color name
  ['Gold', 19.30, 'gold'],
  ['Platinum', 21.45, 'color: #e5e4e2' ], // CSS-style declaration
]

const options = {
  bar: {groupWidth: "95%"},
 
  // colors :[ style],
  chart: {
    title: "Company Performance",
    subtitle: "Sales, Expenses, and Profit",
    
  }
};

function Chart5() {
  return (
    <Chart
      chartType="Bar"
      width="100%"
      height="100px"
      data={data}
      options={options}
    />
  );
}

export {Chart5}
