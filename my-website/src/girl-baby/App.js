import '../common/balloon'
import '../common/canvas-style.css'
import React from "react";

export class GirlBaby extends React.Component {
    constructor(props) {
        super(props);
        this.animationManager = props.animationManager;
    }

    componentDidMount() {
        this.animationManager.colors = ['lightpink']
        this.animationManager.drawCanfetti = true;
    }

    render() {
        return (
            /*<video autoPlay loop playsInline className='my-video'>
                <source src={webmVideo} type="video/webm"/>
                <source src={mp4Video} type="video/mp4"/>
                Your browser does not support HTML video.
            </video>*/
            <div className='my-text-div'>
                <h1>Its A GIRL!</h1>
            </div>
        );
    }
}

export default GirlBaby;