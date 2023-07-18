import React from "react";

export class GoogleCaptcha extends React.Component {

    constructor(props) {
        super(props);
        const SITE_KEY = process.env.REACT_APP_GOOGLE_SITE_KEY;
        
        this.siteKey = SITE_KEY;
        this.action = this.props.action;
        loadReCaptcha(this.siteKey);
    }

    async getToken() {
        let token = "";
        await window.grecaptcha.execute(this.siteKey, {action: this.action})
            .then((res) => {
                token = res;
            })
        return token;
    }
}
const loadReCaptcha = () => {
    const SITE_KEY = process.env.REACT_APP_GOOGLE_SITE_KEY;
    const script = document.createElement('script')
    script.src = `https://www.recaptcha.net/recaptcha/api.js?render=${SITE_KEY}&badge=bottomleft`
    document.body.appendChild(script)
}