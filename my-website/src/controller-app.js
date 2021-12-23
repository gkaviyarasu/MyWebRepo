import AnimationManager from "./common/animation-manager";
import * as React from 'react';
import './common/canvas-style.css';
import BoyBaby from "./boy-baby/App";
import GirlBaby from "./girl-baby/App";
import CountDown from "./countdown/count-down";
import Loader from "react-loader-spinner";

class ControllerApp extends React.Component {
    constructor(props) {
        super(props);

        this.appId = props.params ? props.params.appId : undefined;
        let urlParams = new URLSearchParams(window.location.search);
        let babyGender = urlParams ? urlParams.get('g') : undefined;
        let seconds = urlParams ? urlParams.get('s') : undefined;
        if (babyGender && seconds) {
            this.state = {
                seconds: seconds,
                isLoaded: true,
                Item: undefined,
                baby: babyGender,
                animationManager: undefined,
                countedDown: false
            }
        } else if (this.appId) {
            this.state = {
                seconds: undefined,
                isLoaded: false,
                baby: babyGender,
                animationManager: undefined,
                countedDown: false
            }
        } else {
            this.state = {
                seconds: 15,
                baby: 'girl',
                animationManager: undefined,
                countedDown: false,
                isLoaded: true
            };
        }
        this.animationManager = undefined;
    }

    //const { id } = useParams();

    componentDidMount() {
        if (this.appId) {
            fetch("https://cidxc1n129.execute-api.us-east-1.amazonaws.com/prod/" + this.appId)
                .then(res => res.json())
                .then(
                    (result) => {
                        let canvas = document.getElementById("canvas");
                        canvas.width = window.innerWidth - 20;
                        canvas.height = window.innerHeight - 25;
                        this.animationManager = new AnimationManager(canvas, 30, ['lightpink', 'skyblue'])
                        //this.animationManager.renderBalloons();
                        //this.animationManager.setRedrawTimeInterval(10);
                        let sec = (result.Item.dTimestamp - Date.now())/1000;
                        console.log("remaining seconds:  " + sec)
                        this.setState({
                            isLoaded: true,
                            seconds: sec,
                            baby: result.Item.gender,
                            animationManager: this.animationManager,
                            countedDown: sec < 0,
                        });
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
        } else {
            let canvas = document.getElementById("canvas");
            canvas.width = window.innerWidth - 20;
            canvas.height = window.innerHeight - 25;
            this.animationManager = new AnimationManager(canvas, 30, ['lightpink', 'skyblue'])
            this.setState({animationManager: this.animationManager})
        }
    }

    callbackHandler() {
        this.setState({countedDown: true, seconds:0})
    }

    render() {
        let content = <Loader type="Puff" color="#00BFFF" height={100} width={100} timeout={3000}/>;
        if (this.state.isLoaded) {
            content = <CountDown callback={this.callbackHandler.bind(this)} seconds={this.state.seconds}/>;
            if (this.state.countedDown) {
                if (this.state.baby == 'boy') {
                    content = <BoyBaby animationManager={this.state.animationManager}/>;

                } else if (this.state.baby == 'girl') {
                    content = <GirlBaby animationManager={this.state.animationManager}/>;
                }
            }
            if(!this.animationRendered && this.animationManager) {
                this.animationManager.renderBalloons();
                this.animationManager.setRedrawTimeInterval(10);
                this.animationRendered = true;
            }
        }
        return (
            <div className="App">
                <canvas id='canvas' className='my-canvas'/>
                {content}
            </div>
        );
    }
}

export default ControllerApp;
