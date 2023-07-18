import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import solidGauge from "highcharts/modules/solid-gauge";
import highchartsMore from "highcharts/highcharts-more";


const options = {
  chart: {
    type: "gauge",
  },

  pane: {
    startAngle: -150,
    endAngle: 150,
  },

  yAxis: {
    min: 0,
    max: 100,
  },

  plotOptions: {
    gauge: {
      dial: {
        radius: "70%",
        backgroundColor: "gray",
        baseWidth: 20,
        topWidth: 1,
        baseLength: "3%", // of radius
        rearLength: "0%",
      },
      pivot: {
        radius: 10,
        backgroundColor: "gray",
      },
    },
  },

  series: [
    {
      data: [80],
    },
  ],
};

function Trips()
{
  highchartsMore(Highcharts);
  solidGauge(Highcharts);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );

}

export { Trips };