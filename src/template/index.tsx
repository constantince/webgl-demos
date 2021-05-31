import React, { useState } from "react";
import ReactDom from "react-dom";
import "../common/common.scss";
import Articles from "../comps/new-scene";
import { main } from "./webgl/webgl-index";

const w:any = window;
w.x = 1;
w.y = 1,
w.z = -1.5
type Postion = "x" | "y" | "z";

const App: React.FC = props => {
    const [positionX, setPX] = useState("0");
    const [positionY, setPY] = useState("0");
    const [positionZ, setPZ] = useState("0");
    function changeLight(type: Postion, value: string) {
        w[type] = Number(value);
    }


    return <div className="container"> 
        <Articles id="template" main={main} >
        <div>
                <p>视图</p>
                <form>
                    <div>
                        X: 
                        <input type="range" step={0.5} max="50" defaultValue="1" min="-50" onChange={(e) => {
                            changeLight("x", e.target.value);
                            setPX(e.target.value);
                        }} />
                        { positionX }
                    </div>
                    <div>
                        Y:
                        <input type="range" step={0.5} max="50" defaultValue="1" min="-50" onChange={(e) => {
                            changeLight("y", e.target.value);
                            setPY(e.target.value);
                        }} />
                        { positionY }
                    </div>
                    <div>
                        Z:
                        <input type="range" step={0.5} max="50" defaultValue="-1.5" min="-50" onChange={(e) => {
                            changeLight("z", e.target.value);
                            setPZ(e.target.value);
                        }} />
                        { positionZ }
                    </div>
                </form>
            </div>

        </Articles>
        <footer className="footer-desc">Power up by Typescript, Webpack and Webgl2 </footer>
    </div>
};

ReactDom.render(<App />, document.getElementById("app"));
