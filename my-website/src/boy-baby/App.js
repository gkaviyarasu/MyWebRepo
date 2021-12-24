import '../common/balloon'
import '../common/canvas-style.css'
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
            <div className='parent-container'>
                <div className='my-text-div'>
                    <h1>Its A BOY!</h1>
                </div>
            </div>
        );
    }
}

export default BoyBaby;