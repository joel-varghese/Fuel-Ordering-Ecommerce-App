import React from 'react';
import { ResponsiveFunnel } from "@nivo/funnel";
import activetrips from "./dates";
export class FunnelNew extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div>
        <div style={{ width: "100%", height: "100%" }}>
          <ResponsiveFunnel
            data={[
              {
                id: "New Jersey",
                value: "90000",
                label: "New Jersey",
              },
              {
                id: "Atlanta",
                value: "80000",
                label: "Atlanta",
              },
              {
                id: "Alaska",
                value: "40000",
                label: "Alaska",
              },
              {
                id: "NewYork",
                value: "60000",
                label: "New York",
              },
              {
                id: "NorthCarolina",
                value: "10000",
                label: "New Carolina",
              },
            ]}
            shapeBlending={0.0}
            spacing={2}
            theme={{
              grid: {
                line: {
                  stroke: "#dddddd",
                  strokeWidth: 0,
                },
              },
            }}
            colors={{ scheme: "nivo" }}
            borderWidth={0}
            borderColor="black"
            borderOpacity={0}
            labelColor={{
              from: "color",
              modifiers: [["darker", 3]],
            }}
            beforeSeparatorLength={100}
            beforeSeparatorOffset={100}
            afterSeparatorLength={100}
            afterSeparatorOffset={100}
            isInteractive={true}
            currentPartSizeExtension={0}
            currentBorderWidth={0}
            animate={false}
          />
        </div>
        {/* <div className='bf-top-destinations'>This section contains top destinations and gallons</div> */}
      </div>
    );
  }
}
