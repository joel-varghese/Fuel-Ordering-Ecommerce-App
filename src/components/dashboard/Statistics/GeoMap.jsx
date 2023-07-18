//import { Chart } from "react-chartjs-2";
import * as ChartGeo from "chartjs-chart-geo";
import React, { useEffect, useState } from "react";
import { geoMercator, geoPath, geoAlbersUsa } from "d3-geo";
import { select } from "d3-selection";
import * as d3 from "d3";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
export  function GeoMap(props) {
  const [counties, setCounties] = useState({});
  const [states, setStates] = useState({});
  const [nation, setNation] = useState({});
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [availablecounties, setAvailableCounties] = useState([]);
  const [newState, setNewState] = useState({});
  const [county, setCounty] = useState({});
  const [scale, setScale] = useState(400);
  const [ProjectionData, setProjection] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [label, setLabel] = useState("");
  const [x, setX] = useState(20);
  const [y, setY] = useState(4);

  const [sacleDetails, SetSacleDetails] = useState({ scale:" " ,translate:" " })

  const[projectionwidth,setProjectionWidth]=useState({
    width:"",
    height:"",
    scale:"",
    X:"",
    Y:""
  })
  const[projection1width,setProjection1Width]=useState({
    width:"",
    height:""
   
  })
  const [stateId, setStateID] =useState([
    {
      countryId:"01",
      countryName:"Alabama",
      data:[{
        x:-480,
        y:-400,
        scale:1800
      }]
    },
    {
      countryId:"02",
      countryName:"Alaska",
      data:[{
        x:1020,
        y:-580,
        scale:1500
      }]
    },
    {
      countryId:"04",
      countryName:"Arizona",
      data:[{
        x:750,
        y:-220,
        scale:1450
      }]
    },
    {
      countryId:"05",
      countryName:"Arkansas",
      data:[{
        x:-300,
        y:-330,
        scale:2200   
      }]
    },
    {
      countryId:"06",
      countryName:"California",
      data:[{
        x:670,
        y:-10,
        scale:850            
      }]
    },
    {
      countryId:"08",
      countryName:"Colorado",
      data:[{
        x:550,
        y:10,
        scale:2000
      }]
    },
    {
      countryId:"09",
      countryName:"Connecticut",
      data:[{
        x:-1500,
        y:400,
        scale:2600    
      }]
    },
    {
      countryId:"10",
      countryName:"Delaware",
      data:[{
        x:-1400,
        y:150,
        scale:2600    
      }]
    },
    {
      countryId:"12",
      countryName:"Florida",
      data:[{
        x:-530,
        y:-520,
        scale:1400
      }]
    },
    {
      countryId:"13",
      countryName:"Georgia",
      data:[{
        x:-750,
        y:-400,
        scale:2000
      }]
    },
    {
      countryId:"15",
      countryName:"Hawaii",
      data:[{
        x:850,
        y:-930,
        scale:2200 
      }]
    },
    {
      countryId:"16",
      countryName:"Idaho",
      data:[{
        x:620,
        y:290,
        scale:1200
      }]
    },
    {
      countryId:"17",
      countryName:"Illinois",
      data:[{
        x:-250,
        y:30,
        scale:1550
      }]
    },
    {
      countryId:"18",
      countryName:"Indiana",
      data:[{
        x:-500,
        y:70,
        scale:2100
      }]
    },
    {
      countryId:"19",
      countryName:"Iowa",
      data:[{
        x:-100,
        y:260,
        scale:2600
      }]
    },
    {
      countryId:"20",
      countryName:"Kansas",
      data:[{
        x:150,
        y:-50,
        scale:2600   
      }]
    },
    {
      countryId:"21",
      countryName:"Kentucky",
      data:[{
        x:-800,
        y:-70,
        scale:2600      
      }]
    },
    {
      countryId:"22",
      countryName:"Louisiana",
      data:[{
        x:-300,
        y:-580,
        scale:2100
      }]
    },
    {
      countryId:"23",
      countryName:"Maine",
      data:[{
        x:-1070,
        y:520,
        scale:1800
      }]
    },
    {
      countryId:"24",
      countryName:"Maryland",
      data:[{
        x:-1300,
        y:100,
        scale:2600
      }]
    },
    {
      countryId:"25",
      countryName:"Massachusetts",
      data:[{
        x:-1500,
        y:470,
        scale:2600
      }]
    },
    {
      countryId:"26",
      countryName:"Michigan",
      data:[{
        x:-270,
        y:290,
        scale:1450
      }]
    },
    {
      countryId:"27",
      countryName:"Minnesota",
      data:[{
        x:10,
        y:360,
        scale:1500
      }]
    },
    {
      countryId:"28",
      countryName:"Feature",
      data:[{
        x:-350,
        y:-430,
        scale:1900
      }]
    },
    {
      countryId:"29",
      countryName:"Missouri",
      data:[{
        x:-200,
        y:-60,
        scale:2000
      }]
    },
    {
      countryId:"30",
      countryName:"Montana",
      data:[{
        x:650,
        y:520,
        scale:1800
      }]
    },
    {
      countryId:"31",
      countryName:"Nebraska",
      data:[{
        x:250,
        y:220,
        scale:2600
      }]
    },
    {
      countryId:"32",
      countryName:"Nevada",
      data:[{
        x:750,
        y:25,
        scale:1200     
      }]
    },
    {
      countryId:"33",
      countryName:"New Hampshire",
      data:[{
        x:-1500,
        y:650,
        scale:2600
      }]
    },
    {
      countryId:"34",
      countryName:"New Jersey",
      data:[{
        x:-1390,
        y:250,
        scale:2600
      }]
    },
    {
      countryId:"35",
      countryName:"New Mexico",
      data:[{
        x:520,
        y:-260,
        scale:1600
      }]
    },
    {
      countryId:"36",
      countryName:"New York",
      data:[{
        x:-850,
        y:330,
        scale:1800
      }]
    },
    {
      countryId:"37",
      countryName:"North Carolina",
      data:[{
        x:-1200,
        y:-200,
        scale:2400
      }]
    },
    {
      countryId:"38",
      countryName:"North Dakota",
      data:[{
        x:350,
        y:550,
        scale:1900
      }]
    },
    {
      countryId:"39",
      countryName:"Ohio",
      data:[{
        x:-770,
        y:150,
        scale:2400
      }]
    },
    {
      countryId:"40",
      countryName:"Oklahoma",
      data:[{
        x:150,
        y:-340,
        scale:2600
      }]
    },
    {
      countryId:"41",
      countryName:"Oregon",
      data:[{
        x:1150,
        y:410,
        scale:1700
      }]
    },
    {
      countryId:"42",
      countryName:"Pennsylvania",
      data:[{
        x:-1190,
        y:280,
        scale:2600
      }]
    },
    {
      countryId:"45",
      countryName:"South Carolina",
      data:[{
        x:-1050,
        y:-370,
        scale:2400
      }]
    },
    {
      countryId:"46",
      countryName:"South Dakota",
      data:[{
        x:320,
        y:450,
        scale:2500
      }]
    },
    {
      countryId:"47",
      countryName:"Tennessee",
      data:[{
        x:-800,
        y:-250,
        scale:2600
      }]
    },
    {
      countryId:"48",
      countryName:"Texas",
      data:[{
        x:150,
        y:-260,
        scale:850
      }]
    },
    {
      countryId:"49",
      countryName:"Utah",
      data:[{
        x:750,
        y:60,
        scale:1600
      }]
    },
    {
      countryId:"50",
      countryName:"Vermont",
      data:[{
        x:-1400,
        y:620,
        scale:2600
      }]
    },
    {
      countryId:"51",
      countryName:"Virginia",
      data:[{
        x:-1100,
        y:-10,
        scale:2400
      }]
    },
    {
      countryId:"53",
      countryName:"Washington",
      data:[{
        x:1450,
        y:830,
        scale:2300
      }]
    }, 
    {
      countryId:"54",
      countryName:"West Virginia",
      data:[{
        x:-1000,
        y:50,
        scale:2400
      }]
    },
    {
      countryId:"55",
      countryName:"Wisconsin",
      data:[{
        x:-250,
        y:390,
        scale:2000
      }]
    },
    {
      countryId:"56",
      countryName:"Wyoming",
      data:[{
        x:650,
        y:300,
        scale:2000
      }]
    } 
    ])

    
    useEffect(()=> {
  function handleResize() {
    let windowWidth = window.innerWidth
    if(windowWidth >= 1366 && windowWidth < 1517) {
      setProjectionWidth({
        width:450,
        height:225,
        scale:330,
        X:10,
        Y:-25
    })
    setProjection1Width({
       width:500,
       height:255
    })
    SetSacleDetails({
      scale:"1 0.95" ,
      translate:"-47px 11px"
    })
    }   
    else if(windowWidth >=1242  && windowWidth <1366 ) {
      setProjectionWidth({
        width:450,
        height:225,
        scale:350,
        X:35,
        Y:-27
      })
      setProjection1Width({
        width:500,
        height:255
     })
     SetSacleDetails({
       scale:"1 1" ,
       translate:"-17px 14px"
     })
    } 
    else if(windowWidth >=1093  && windowWidth <1242 ) {
      setProjectionWidth({
        width:450,
        height:225,
        scale:350,
        X:-10,
        Y:-42
      })
      setProjection1Width({
        width:500,
        height:255
     })
     SetSacleDetails({
       scale:"1 1" ,
       translate:"-33px 1px"
     })
    } 
    else if(windowWidth >=911  && windowWidth <1093 ) {
      setProjectionWidth({
        width:450,
        height:225,
        scale:300,
        X:-100,
        Y:-60
      })
      setProjection1Width({
        width:500,
        height:255
     })
     SetSacleDetails({
       scale:"1 1" ,
       translate:"-75px 6px"
     })
      
    } 
    else if(windowWidth >=780  && windowWidth <911 ) {
      setProjectionWidth({
        width:450,
        height:225,
        scale:270,
        X:-170,
        Y:-70
      })
      setProjection1Width({
        width:500,
        height:255
     })
     SetSacleDetails({
       scale:"1 1" ,
       translate:"-97px 1px"
     })
      
    } 
    else if(windowWidth >=1517  && windowWidth <1707 ) {
      setProjectionWidth({width:600,
        height:300,
        scale:370,
        X:-110,
        Y:-80

      })
      setProjection1Width({
        width:500,
        height:300
     })
      SetSacleDetails({
      scale: "1.2 1.07 ",
      translate: "-147px -25px"
    })
    } 
    else if(windowWidth >=1707  && windowWidth <1821 ) {
      setProjectionWidth({width:600,
        height:300,
        scale:400,
        X:-35,
        Y:-50

      })
      SetSacleDetails({
      scale: "1.4 1.18",
      translate: "-186px -32px"
      })
      setProjection1Width({
        width:500,
        height:300
     })
      
    } 
    else if(windowWidth >=1821  && windowWidth <2049 ) {
      setProjectionWidth({width:600,
        height:300,
        scale:450,
        X:-25,
        Y:-50

      })
      SetSacleDetails({
        scale: "1.7 1.3",
        translate: "-260px -40px"
        })
        setProjection1Width({
          width:500,
          height:300
       })
      
    } 
    else if(windowWidth >= 2049 && windowWidth <2732 ) {
      setProjectionWidth({width:600,
        height:300,
        scale:500,
        X:80,
        Y:-40

      })
      SetSacleDetails({
        scale:"1.9 1.45",
        translate: "-291px -25px"
        })
        setProjection1Width({
          width:600,
          height:300
       })
      
    }
    else if(windowWidth >=2732 && windowWidth <4098) {
      setProjectionWidth({width:1000,
        height:700,
        scale:650,
        X:-80,
        Y:-320

      })
      SetSacleDetails({
        scale: "2.8 2.1",
        translate:" -1009px -426px"
        })
        setProjection1Width({
          width:800,
          height:500
       })
      
    }
    else if(windowWidth >=4098 && windowWidth <5464 ) {
      setProjectionWidth({width:1150,
        height:700,
        scale:1050,
        X:400,
        Y:-150

      })
      SetSacleDetails({
        scale: "3.5 3.2",
        translate: "-1386px -664px",
        })
        setProjection1Width({
          width:1400,
          height:600
       })
      
    }
    else if(windowWidth >=5464 && windowWidth <5500) {
      setProjectionWidth({width:1500,
        height:1000,
        scale:1350,
        X:500,
        Y:-300

      })
      SetSacleDetails({
        scale: "5 4.5",
        translate: " -2862px -1518px",
        })
        setProjection1Width({
          width:1600,
          height:800
       })
    }
  }
  window.addEventListener("resize", handleResize);
  handleResize()
  return () => {
    window.removeEventListener("resize", handleResize)
  }
},[])

    


/** Conuntry projection start */
  const width = projectionwidth.width;
  const height = projectionwidth.height;
  const width1 = projection1width.width;
  const height1 = projection1width.height;
  const projection = geoAlbersUsa().fitExtent(
    [
      [projectionwidth.X,projectionwidth.Y],
      [width * 0.9, height * 0.9],
    ],
    states
  );
  const path = geoPath().projection(projection);
  projection.scale(projectionwidth.scale);
/** Country projection ends */
/** State projection start */
//let path1 = null
//let projection1 = null
  
  //setProjection(projection1)*/
  //let path1 = geoPath().projection(projection1);
  let color = d3.scaleQuantize([1, 10], d3.schemeBlues[9]); 
/** State projection end */

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

  useEffect(() => {

    const fetchdata = async () => {
      await fetch("https://unpkg.com/us-atlas/counties-10m.json")
        //fetch("https://unpkg.com/us-atlas/states-10m.json")
        .then(async (r) => await r.json())
        .then(async (us) => {
          if (!states.features) {
            setNation(
              ChartGeo.topojson.feature(us, us.objects.nation).features[0]
            );
            setStates(ChartGeo.topojson.feature(us, us.objects.states));
            setCounties(ChartGeo.topojson.feature(us, us.objects.counties));
          }

          if (states.features && count === 0) {
            var availablecounties = [];
            states.features.map((county) => {
              //if (county.properties.name === "Fulton") {
              availablecounties.push(county);
              //}
            });
            setAvailableCounties(...availablecounties);
            var data1 = [];
            availablecounties.map((availcounty) =>
              data1.push({
                id: availcounty.id,
                value: "100",
              })
            );
            setData(data1);
            setCount(1);
          }
        });
    };
    fetchdata();
  });

  const callCountyRender = (e, id, label) => {
    let newState = {};
    setSelectedState(label)
    newState.features = states.features.filter(function (st) {
      return st.properties.name === label;
    });
    let county = {};
    county.features = counties.features.filter(function (ct) {
      if (ct.id.startsWith(newState.features[0].id)) return ct;
    });
    setNewState(newState);
    setCounty(county);
    setScale(600);
    if (county.features) {
      var availablecounties = [];
      county.features.map((county1) => {
        availablecounties.push(county1);
      });
      setAvailableCounties(...availablecounties);
      var data1 = [];
      availablecounties.map((availcounty) =>
        data1.push({
          id: availcounty.id,
          value: "100",
        })
      );
      setData(data1);
      setLabel(label);

    }
    
stateId.map((item, index) => {
  if (item.countryName === label) {
    setX(item.data[0].x);
    setY(item.data[0].y)
    setScale(item.data[0].scale)
     setCount(2);
    return;
  } 
});

   


    //setP
  };
let projection1 = 
  geoAlbersUsa().fitExtent(
    [
      [x, y],
      [width * 0.9, height * 0.9],
    ],
    states
  )
;
  const path1 = geoPath().projection(projection1);
  projection1.scale(scale)

  const handleMouseOver = function (tooltipData, d) { 
    
    let name = tooltipData;
    let gallonPrice = 0.00;
    props.avragePriceRecords.map((item, index)=>{
      if(item.State == tooltipData){
        gallonPrice = item.AvgGallonPrice
      }
    })
    d3.select("#tooltip")
      .style("opacity", 10)
      .style("background-color", "burlywood")
      .text(tooltipData+"/"+gallonPrice);
  };

  const rerender = function (e) {
    d3.select("#tooltip").style("opacity", 0);

    setCount(0);
  };

  const handleMouseOut = function () {
    d3.select("#tooltip").style("opacity", 0);
  };

  // get mouse location so tooltip tracks cursor
  const handleMouseMove = function (event) {
    d3.select("#tooltip")
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY + 10 + "px");
  };

  const getTooltip = (tooltipData) =>{
    let name = tooltipData;
    let gallonPrice = 0.00;
    props.avragePriceRecords.map((item, index)=>{
      if(item.State == tooltipData){
        gallonPrice = item.AvgGallonPrice
      }
    })

    return tooltipData+" / "+gallonPrice+" gallons"
  }

  const getTooltipForCounty = (tooltipData) =>{
    let name = tooltipData;
    let gallonPrice = 0.00;
    props.avragePriceRecords.map((item, index)=>{
      if(item.State == selectedState){
        item.CityFuelPrice && item.CityFuelPrice.map((countyItem, index)=>{
          if(countyItem.City == tooltipData){
            gallonPrice = countyItem.AvgGallonPrice
          }
        })
        //gallonPrice = item.AvgGallonPrice
      }
    })

    return tooltipData+" / "+gallonPrice+" gallons" 
    //return "hello";
  }


  return states.features ? (
    count === 2 ? (
      <div>
        <svg width={width1} height={height1} >
          <g className="geojson-layer geojson-layer-mobile-view" style={sacleDetails} >
            {county.features.map((d) => {
              return (
                <BootstrapTooltip
                  title={getTooltipForCounty(d.properties.name)}
                  arrow
                >
                  <path
                    key={d.properties.name}
                    d={path1(d)}
                    fill={color(Math.random() * 10)}
                    stroke="#0e1724"
                    strokeWidth="1"
                    strokeOpacity="0.5"
                    onMouseOver={() => {
                      handleMouseOver(d.properties.name, d);
                    }}
                    onMouseOut={handleMouseOut}
                    onMouseMove={(event) => {
                      handleMouseMove(event);
                    }}
                    
                    onClick={(e) => rerender(e)}
                  />
                </BootstrapTooltip>
              );
            })}
          </g>
        </svg>
      </div>
    ) : (
      <svg id="state" width={width} height={height}>
        <g className="geojson-layer" >
          {states.features.map((d) => {
            return (
              <BootstrapTooltip title={getTooltip(d.properties.name)} arrow>
                <path
                  key={d.properties.name}
                  d={path(d)}
                  fill={color(Math.random() * 10)}
                  stroke="#0e1724"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                  onClick={(e) => callCountyRender(e, d.id, d.properties.name)}
                  onMouseOver={() => {
                    handleMouseOver(d.properties.name, d);
                  }}
                  onMouseOut={handleMouseOut}
                  onMouseMove={(event) => {
                    handleMouseMove(event);
                  }}
                />
              </BootstrapTooltip>
            );
          })}
        </g>
      </svg>
    )
  ) : (
    <div></div>
  );
}
