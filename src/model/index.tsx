import React, { useState } from "react";
import ReactDom from "react-dom";
import "../common/common.scss";
import Articles from "../comps/new-scene";
import { main } from "./webgl/webgl-index";
import SwithBtn from "../comps/switch-btn";
const w:any = window;
w.x = 2;
w.y = 2;
w.z = 2;

w.targetX = 0.5;
w.targetY = 0.5;
w.targetZ = 0.5;


type Postion = "x" | "y" | "z" | "targetX" | "targetY" | "targetZ";
// type Target = "m" | "n" | "l";
const App: React.FC = props => {
    const [positionX, setPX] = useState("0.5");
    const [positionY, setPY] = useState("0.5");
    const [positionZ, setPZ] = useState("0.5");

    const [targetX, setTX] = useState("0.5");
    const [targetY, setTY] = useState("0.5");
    const [targetZ, setTZ] = useState("0.5");
    function changeLight(type: Postion, value: string) {
        w[type] = Number(value);
    }


    return <div className="container"> 
        <Articles id="template" main={main} >
        <div>
        <SwithBtn href="https://github.com/constantince" />
                <p>Position</p>
                <form> 
                    <div>
                        X: 
                        <input type="range" step={0.1} max="20" defaultValue="2" min="0" onChange={(e) => {
                            changeLight("x", e.target.value);
                            setPX(e.target.value);
                        }} />
                        { positionX }
                    </div>
                    <div>
                        Y:
                        <input type="range" step={0.1} max="20" defaultValue="2" min="0" onChange={(e) => {
                            changeLight("y", e.target.value);
                            setPY(e.target.value);
                        }} />
                        { positionY }
                    </div>
                    <div>
                        Z:
                        <input type="range" step={0.1} max="20" defaultValue="2" min="0" onChange={(e) => {
                            changeLight("z", e.target.value);
                            setPZ(e.target.value);
                        }} />
                        { positionZ }
                    </div>

                    <div>
                        targetX: 
                        <input type="range" step={0.1} max="10" defaultValue="0.5" min="-10" onChange={(e) => {
                            changeLight("targetX", e.target.value);
                            setTX(e.target.value);
                        }} />
                        { targetX }
                    </div>

                    <div>
                        targetY: 
                        <input type="range" step={0.1} max="10" defaultValue="0.5" min="-10" onChange={(e) => {
                            changeLight("targetY", e.target.value);
                            setTY(e.target.value);
                        }} />
                        { targetY }
                    </div>

                    <div>
                        targetZ: 
                        <input type="range" step={0.1} max="10" defaultValue="0.5" min="-10" onChange={(e) => {
                            changeLight("targetZ", e.target.value);
                            setTZ(e.target.value);
                        }} />
                        { targetZ }
                    </div>
                </form>
        

        
        </div>

        </Articles>
        <footer className="footer-desc">Power up by Typescript, Webpack and Webgl2 </footer>
    </div>
};

ReactDom.render(<App />, document.getElementById("app"));
