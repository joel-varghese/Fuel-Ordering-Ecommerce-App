import React from 'react'
import { Trips } from './Trips'

export default function CustomCircleChart(props) {
  return (
    <div>
        {/* <div className="bf-tirp-card"> */}
            <div className={props.options === "Trips"?"bf-trip-label":props.options === "Trips4"?`bf-trip-label ${props.condition && props.condition?"bf-trip-label-5":"bf-trip-label-4"}`:props.options === "Trips1"?"bf-trip-label1":props.options === "Trips2"?"bf-trip-label2":props.options === "Trips3"?"bf-trip-label3":null}>{props.label}</div>

            <div className={props.options === "Trips"?"bf-tirp-chart":props.options === "Trips4" ?`bf-tirp-chart ${props.condition && props.condition?"bf-tirp-chart-5":"bf-tirp-chart-4"}`:props.options === "Trips1"?"bf-tirp-chart1":props.options === "Trips2"?"bf-tirp-chart2":props.options === "Trips3"?"bf-tirp-chart3":null}>

              <span className={props.options === "Trips"?"circle":props.options === "Trips4"?`circle ${props.condition && props.condition?"circle-colour":"circle-colour-red"}`:props.options === "Trips1"?"circle1":props.options === "Trips2"?"circle2":props.options === "Trips3"?"circle3":null}>
                <span className="circle-count">{props.totalCount}</span>
                <div className="bf-chart-circle">
                    <Trips
                        title={props.title}
                        trends = {props.trends && props.trends} 
                        options = {props.options}
                        optionArray = {props.optionArray}
                        condition = {props.condition}
                        width ={props.width}
                        innerLabel={props.innerLabel}
                    />
                </div>
              </span>
            </div>
            <div className="order-full">
              <div className="order-dtl">
                <div>{props.value1}</div>
                <div>{props.string1}</div>
              </div>
              <span>|</span>
              <div className="order-dtl">
                <div>{props.value2}</div>
                <div>{props.string2}</div>
              </div>
            </div>
    </div>

  )
}
