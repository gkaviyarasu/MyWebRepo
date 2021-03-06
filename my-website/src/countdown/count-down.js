import * as React from "react";
import aaudio from "../common/beep-10.mp3";

export class CountDown extends React.Component {
    constructor(props) {
        super(props);
        const timestamp = props.timestamp;
        let sec = (timestamp - Date.now()) / 1000;
        this.state = {time: {}, seconds: sec, timestamp: props.timestamp};
        this.callbackFn = props.callback;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
        this.startTimer();
        this.audio = new Audio(aaudio);
    }

    secondsToTime(secs) {
        let hours = Math.floor(secs / (60 * 60));
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let obj = {
            "h": ('0' + hours).slice(-2),
            "m": ('0' + minutes).slice(-2),
            "s": ('0' + seconds).slice(-2)
        };
        return obj;
    }

    startTimer() {
        if (this.state.seconds > -1) {
            this.timer = setInterval(this.countDown, 1000);
        }
    }

    countDown() {
        // Remove one second, set state so a re-render happens.
        let seconds = (this.state.timestamp - Date.now()) / 1000;
        // Check if we're at zero.
        if (seconds < 0) {
            clearInterval(this.timer);
            this.callbackFn();
            return;
        }
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds
        });
        if (seconds < 11 && !this.soundStarted) {
            this.audio.play();
            this.soundStarted = true;
        }
    }

    componentDidMount() {
        let timeLeftVar = this.secondsToTime(this.state.seconds);
        this.setState({time: timeLeftVar});
    }

    render() {
        return (
            <div className='parent-container'>
                <span className="my-timer">{this.state.time.h} : {this.state.time.m} : {this.state.time.s}</span>
            </div>
        );
    }
}

export default CountDown;