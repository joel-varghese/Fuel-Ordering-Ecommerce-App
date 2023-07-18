import { Circle } from './Circle';
import { Trips } from './Trips'
import React from 'react'
export class Overlay extends React.Component {


    render()
    {
        return (
          <>
            <div>
              <Circle></Circle>
              <Trips class="overlay"></Trips>
            </div>
          </>
        );
    }
}