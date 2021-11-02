import React from "react";
import ReactDom from "react-dom";
import "../common/common.scss";
import Articles from "../comps/canvas-area";
import { main } from "./webgl/webgl-index";

const win: any = window
const App: React.FC = props => {


    function changeLight(type: string, value: string) {
        win[type] = Number(value);
    }

    return <div className="container"> 
        <Articles id="earth-sphere" main={main} >
            <div>
                <p>光源位置</p>
                <form>
                    x:
                    <input type="range" max="30" defaultValue="0" min="-30" onChange={(e) => {
                        changeLight("POSITIONX", e.target.value)
                    }} />
                    y:
                    <input type="range" max="30" defaultValue="0" min="-30" onChange={(e) => {
                        changeLight("POSITIONY", e.target.value)
                    }} />
                    z:
                    <input type="range" max="30" defaultValue="0" min="-30" onChange={(e) => {
                        changeLight("POSITIONZ", e.target.value)
                    }} />
                </form>
            </div>
        </Articles>
        <footer className="footer-desc">Power up by Typescript, Webpack and Webgl2 </footer>
    </div>
};

ReactDom.render(<App />, document.getElementById("app"));
