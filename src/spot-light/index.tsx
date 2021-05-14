import React from "react";
import ReactDom from "react-dom";
import "../common/common.scss";
import Articles from "../comps/canvas-area";
import { main } from "./webgl/webgl-index";
const win:any = window;
win.X = 1;
win.Y = 1;
win.Z = 1;
win.L = 6;
win.LO = 6;
const App: React.FC = props => {

    function changeLight(type: string, value: string) {
        win[type] = Number(value);
    }

    return <div className="container"> 
        <Articles id="template" main={main} >
            <div>
                <p>光源位置</p>
                <form>
                    x:
                    <input type="range" step="0.1" max="100" defaultValue="0" min="-100" onChange={(e) => {
                        changeLight("X", e.target.value)
                    }} />
                    y:
                    <input type="range" step="0.1" max="100" defaultValue="0" min="-100" onChange={(e) => {
                        changeLight("Y", e.target.value)
                    }} />
                    z:
                    <input type="range" step="0.1" max="100" defaultValue="0" min="-100" onChange={(e) => {
                        changeLight("Z", e.target.value)
                    }} />
                    inner-l:
                    <input type="range" step="1" max="180" defaultValue="2" min="0" onChange={(e) => {
                        changeLight("L", e.target.value)
                    }} />
                     outer-l:
                    <input type="range" step="1" max="180" defaultValue="2" min="0" onChange={(e) => {
                        changeLight("LO", e.target.value)
                    }} />
                </form>
            </div>
        </Articles>
        <p>source code: <a></a></p>
        <footer className="footer-desc">Power up by Typescript, Webpack and Webgl2 </footer>
    </div>
};

ReactDom.render(<App />, document.getElementById("app"));
