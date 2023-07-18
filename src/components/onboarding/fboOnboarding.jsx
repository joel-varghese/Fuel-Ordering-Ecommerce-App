import React, { useState,useEffect } from 'react';
import { enrollmentPending } from '../../actions/accountEnrollService/accountEnrollService';
import { bulkNotification, saveNotificationList } from '../../actions/notificationService/notificationAction';
import { Storage} from '../../controls/Storage';
import './fboOnboarding.scss';


export const overdueEnrollment = (message,dispatch) => {
    const orgName = Storage.getItem('organizationName')
    const loginName = Storage.getItem('email')
    const access = JSON.parse(Storage.getItem('accessLevel'))[0]

    enrollmentPending().then(response =>{
        let enroll = response && response.data.res
        //const interval = setInterval(() => {
        let arrayReq = []
        let index = 0
        enroll && enroll.forEach((item)=>{
          let jsonpayload = JSON.parse(item.jsonNode)
          if(item.username == loginName && jsonpayload.hasOwnProperty('timestamp')){
            let diff = new Date().getTime() - new Date(jsonpayload.timestamp).getTime()
            let time = Math.floor(diff / (1000*60*60*24))
            if(time >= 2){
              let payload = {}
              payload.type = "update"
              payload.notificationMessage = message+item.companyName
              payload.organizationName = null
              payload.loginUserName = loginName
              payload.sendNotificationTo = "Individual"
              payload.levelOfAccess = access == "Super" ? "Level 1 (Admin)" : access == "Admin" ? "Level 2 (Standard)" : "Level 3 (Basic)"
              payload.individualUser = loginName
              payload.isActionable = false
              payload.actionTaken = ""
              payload.category = "account"
              payload.readInd = false
              arrayReq[index] = payload
              index++
            }
          }
        })
        if(arrayReq.length > 0){
          bulkNotification(arrayReq,dispatch).then((res)=>{

          })
        }
    // },1000*60*60);
    // return () => clearInterval(interval);
    })
    }
