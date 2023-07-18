import React, { Component, useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleReCaptchaProvider,GoogleReCaptcha } from "react-google-recaptcha-v3";

const GoogleCaptcha = () => {
  //const SITE_KEY = "AIzaSyCUqiEb2BJX3k0GaG-pwRsvlh9-y_av7HI";
    const SITE_KEY = "6LcdBkghAAAAADy5LCQLb632PvmJJLMCYN2Gtalt";
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  /* const handleLoaded = _ => {
    window.grecaptcha.ready(_ => {
      window.grecaptcha
        .execute(SITE_KEY, { action: "login" })
        .then(token => {
          // ...
        })
    })
  } */

  const submitData = token => {
    // call a backend API to verify reCAPTCHA response
  }


  /* useEffect(() => {
    // Add reCaptcha
    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
    script.addEventListener("load", handleLoaded)
    document.body.appendChild(script)
  }, []) */
  const handleVerify = (e) =>  {
  }

  return (
    //<GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}>
      <GoogleReCaptcha onVerify={handleVerify} />
   // </GoogleReCaptchaProvider>
  )
}

export default GoogleCaptcha;