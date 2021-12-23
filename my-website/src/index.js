import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import './common/canvas-style.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import {withRouter} from './common/withRouter';
import  "./controller-app";
import ControllerApp from "./controller-app";

let ControllerAppWrapper = withRouter(ControllerApp);
ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<ControllerAppWrapper/>}/>
            <Route path="/:appId" element={<ControllerAppWrapper/>}/>
        </Routes>
    </BrowserRouter>
    ,
    document.getElementById('root')
);

//render={props => <ProblemPage {...props.match.params} />}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
