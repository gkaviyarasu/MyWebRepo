import '../common/balloon'
import '../common/canvas-style.css'
import video from '../common/its-a-girl.webm'
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
            <video autoPlay loop className='my-video'>
                <source src={video} type="video/webm"/>
                Your browser does not support HTML video.
            </video>
        );
    }
}

export default GirlBaby;