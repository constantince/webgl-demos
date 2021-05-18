import React from "react";
import ReactDom from "react-dom";
import "../common/common.scss";
import Articles from "../comps/canvas-area";
import { main } from "./webgl/webgl-index";
const win:any = window;
const App: React.FC = props => {
    return <div className="container"> 
        <Articles id="template" main={main}>

            <div>
                <form>

                    <label>
                        fogNear：
                        <input type="range" onChange={(e) => {
                            win.fogNear = e.target.value; 
                        }} step="0.001" min="0" max="40" defaultValue="0"/>
                    </label>
                        <br />
                    <label>
                        fogFar：
                        <input type="range" onChange={(e) => {
                            win.fogFar = e.target.value; 
                        }} step="0.001" min="0" max="40" defaultValue="0"/>
                    </label>

                </form>
            </div>

        </Articles>
        <p>source code: <a></a></p>
        <footer className="footer-desc">Power up by Typescript, Webpack and Webgl2 </footer>
    </div>
};

ReactDom.render(<App />, document.getElementById("app"));
