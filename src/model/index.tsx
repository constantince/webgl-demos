import React, { useState } from "react";
import ReactDom from "react-dom";
import "../common/common.scss";
import Articles from "../comps/new-scene";
import { main } from "./webgl/webgl-index";
import SwithBtn from "../comps/switch-btn";
import { useEffect } from "react";
const w:any = window;
w.x = 2;
w.y = 2;
w.z = 2;

w.targetX = 0.5;
w.targetY = 0.5;
w.targetZ = 0.5;


type Postion = "x" | "y" | "z" | "targetX" | "targetY" | "targetZ";
type TICKER =  {(time: number): void};
// type Target = "m" | "n" | "l";
const App: React.FC = props => {
    const [positionX, setPX] = useState("0.5");
    const [positionY, setPY] = useState("0.5");
    const [positionZ, setPZ] = useState("0.5");

    const [targetX, setTX] = useState("0.5");
    const [targetY, setTY] = useState("0.5");
    const [targetZ, setTZ] = useState("0.5");
    let tick: TICKER;
    useEffect(() => {
        tick = main("template") as TICKER;
    }, []);
   
    function changeLight(type: Postion, value: string) {
        w[type] = Number(value);
    }


    return <div className="container"> 
        <Articles id="template" >
        <div>
        <SwithBtn href="https://github.com/constantince" />
                <p>Position</p>
                <form> 
                    <div>
                        X: 
                        <input type="range" step={0.1} max="20" defaultValue="2" min="0" onChange={(e) => {
                            w["x"] = Number(e.target.value);
                            window.requestAnimationFrame(tick);
                        }} />
                        { positionX }
                    </div>
                    <div>
                        Y:
                        <input type="range" step={0.1} max="20" defaultValue="2" min="0" onChange={(e) => {
                             w["y"] = Number(e.target.value);
                            window.requestAnimationFrame(tick);
                        }} />
                        { positionY }
                    </div>
                    <div>
                        Z:
                        <input type="range" step={0.1} max="20" defaultValue="2" min="0" onChange={(e) => {
                             w["z"] = Number(e.target.value);
                            window.requestAnimationFrame(tick);
                        }} />
                        { positionZ }
                    </div>

                    <div>
                        targetX: 
                        <input type="range" step={0.1} max="10" defaultValue="0.5" min="-10" onChange={(e) => {
                             w["targetX"] = Number(e.target.value);
                            window.requestAnimationFrame(tick);
                        }} />
                        { targetX }
                    </div>

                    <div>
                        targetY: 
                        <input type="range" step={0.1} max="10" defaultValue="0.5" min="-10" onChange={(e) => {
                             w["targetY"] = Number(e.target.value);
                            window.requestAnimationFrame(tick);
                        }} />
                        { targetY }
                    </div>

                    <div>
                        targetZ: 
                        <input type="range" step={0.1} max="10" defaultValue="0.5" min="-10" onChange={(e) => {
                             w["targetZ"] = Number(e.target.value);
                            window.requestAnimationFrame(tick);
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
