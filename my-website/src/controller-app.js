import AnimationManager from "./common/animation-manager";
import * as React from 'react';
import './common/canvas-style.css';
import BoyBaby from "./boy-baby/App";
import GirlBaby from "./girl-baby/App";
import CountDown from "./countdown/count-down";
import Loader from "react-loader-spinner";
import {Survey} from "./survey/survey";


class ControllerApp extends React.Component {
    constructor(props) {
        super(props);

        this.appId = props.params ? props.params.appId : undefined;
        let urlParams = new URLSearchParams(window.location.search);
        let babyGender = urlParams ? urlParams.get('g') : undefined;
        let seconds = urlParams ? urlParams.get('s') : undefined;
        if (babyGender && seconds) {
            this.state = {
                timestamp: Date.now() + seconds * 1000,
                isLoaded: true,
                Item: undefined,
                baby: babyGender,
                animationManager: undefined,
                countedDown: false,
                survey: false
            }
        } else if (this.appId) {
            this.state = {
                timestamp: undefined,
                isLoaded: false,
                baby: babyGender,
                animationManager: undefined,
                countedDown: false,
                survey: false
            }
        } else {
            this.state = {
                timestamp: Date.now() + 15 * 1000,
                baby: 'girl',
                animationManager: undefined,
                countedDown: false,
                isLoaded: true,
                survey: false
            };
        }
        this.animationManager = undefined;
    }

    componentDidMount() {
        if (this.appId) {
            this.updateStateFromBackend();
        }
        let canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.animationManager = new AnimationManager(canvas, 30, ['lightpink', 'skyblue'])
        this.setState({animationManager: this.animationManager})

    }

    updateStateFromBackend() {
        fetch("https://cidxc1n129.execute-api.us-east-1.amazonaws.com/prod/" + this.appId)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        timestamp: result.Item.dTimestamp,
                        baby: result.Item.gender,
                        countedDown: result.Item.dTimestamp < Date.now(),
                    });
                    if (this.countDown) {
                        this.countDown.setState({timestamp: result.Item.dTimestamp});
                    }
                    if (this.state)
                        if (!result.Item.gender) {
                            setTimeout(this.updateStateFromBackend.bind(this), 600000)
                        }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    countDownCallbackHandler() {
        this.setState({countedDown: true})
    }

    surveyCallbackHandler() {

        this.setState({survey: true, countedDown: (this.state.timestamp - Date.now()) < 0});
    }

    render() {
        let content = <Loader type="Puff" color="#00BFFF" height={100} width={100} timeout={3000}/>;
        let vid = <div className='vd-parent'>
            <iframe className='yt-video-under-banner'
                    src="https://www.youtube.com/embed/mYLF82Uqj1c?autoplay=1&showinfo=0&modestbranding=1"
                    title="YouTube video player" frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen></iframe>
        </div>
        let chatbot = <div></div>;
        if(window.innerWidth < 1200) {
            chatbot="";
        }
        if (this.state.isLoaded) {
            content = <CountDown callback={this.countDownCallbackHandler.bind(this)}
                                 timestamp={this.state.timestamp}
                                 ref={ref => (this.countDown = ref)}
            />;
            if (!this.state.survey) {
                content = <Survey callback={this.surveyCallbackHandler.bind(this)} appId={this.appId}/>;
                vid = <div/>
            }
            if (this.state.countedDown) {
                if (this.state.baby == 'boy') {
                    content = <BoyBaby animationManager={this.state.animationManager}/>;

                } else if (this.state.baby == 'girl') {
                    content = <GirlBaby animationManager={this.state.animationManager}/>;
                }
            }
            if (!this.animationRendered && this.animationManager) {
                this.animationManager.renderBalloons();
                this.animationManager.setRedrawTimeInterval(10);
                this.animationRendered = true;
            }
        } else {
            vid = "";
        }
        return (
            <div className="App">
                <canvas id='canvas' className='my-canvas'/>
                <div className='welcome-banner'>
                    <h2>Welcome to Gokul & Saranya's Gender reveal</h2>
                </div>
                <div>
                    {content}
                </div>
                {vid}
                {chatbot}
            </div>
        );
    }
}

export default ControllerApp;