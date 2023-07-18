// // import "./styles.css";
// import { Bar } from "react-chartjs-2";
// import * as zoom from "chartjs-plugin-zoom";
// import { useEffect, useState } from "react";
// import { LinearScale } from "chart.js";
// // import { Chart, registerables} from 'chart.js';


// const labels = [0.75, 1.25, 1.75, 2.25];
// const data = [1, 2, 3, 4];
// const options = {
//   pan: {
//     enabled: true,
//     mode: "xy"
//   },
//   zoom: {
//     enabled: true,
//     drag: false,
//     mode: "xy"
//   },
//   scales: {
//     x: {
//       type: "linear",
//       offset: false,
//       gridLines: {
//         offsetGridLines: false
//       },
//       title: {
//         display: true,
//         text: "Arrivals per minute"
//       }
//     }
//   },

//   plugins: {
//     beforeInit: function (chart, args, options) {
//       console.log("called");
//     },
//     afterDatasetDraw: () => {
//       console.log("called");
//     }
//   }
// };

// function Sample() {
//   const [value, setValue] = useState(0);
//   useEffect(() => {
//     // Chart.register(LinearScale);
    
//   }, []);
//   Chart.register(...registerables);
//   return (
//     <div className="App">
//       <Bar
//         data={{
//           labels: labels,
//           datasets: [
//             {
//               borderColor: "blac",
//               lineTension: 0,
//               fill: false,
//               borderJoinStyle: "round",
//               data: data,
//               borderWidth: 0.2,
//               barPercentage: 1,
//               categoryPercentage: 1,
//               hoverBackgroundColor: "darkgray",
//               barThickness: "flex"
//             }
//           ]
//         }}
//         options={options}
//         plugins={[
//           {
//             afterDatasetDraw: () => {
//               console.log("called");
//             }
//           }
//         ]}
//       />

//       <button
//         onClick={() => {
//           setValue(value + 1);
//         }}
//       >
//         Click me
//       </button>
//     </div>
//   );
// }

// export {Sample}