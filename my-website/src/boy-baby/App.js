import '../common/balloon'
import '../common/canvas-style.css'
import video from '../common/its-a-boy.webm'
import React from "react";

export class BoyBaby extends React.Component {
    constructor(props) {
        super(props);
        this.animationManager = props.animationManager;
    }

    componentDidMount() {
        this.animationManager.colors = ['skyblue'];
        this.animationManager.drawCanfetti = true;
    }

    render() {
        return (
            <iframe className='my-video' width="1230" height="692" src="https://www.youtube.com/embed/w0VIq_6ctow?autoplay=1&controls=0&loop=1&showinfo=0&modestbranding=1"
                    title="YouTube video player" frameBorder="0"
                    allow=" autoplay; modestbranding;clipboard-write; encrypted-media"
            ></iframe>

            /*allow="accelerometer; autoplay; loop; clipboard-write; encrypted-media; gyroscope; picture-in-picture"*/
            /*<video autoPlay loop className='my-video' id="video">
                <source src={video} type="video/webm"/>
                Your browser does not support HTML video.
            </video>*/
        );
    }
}

export default BoyBaby;