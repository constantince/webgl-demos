import React from "react";
import ReactDom from "react-dom";
import "../common/common.scss";
import Articles from "../comps/canvas-area";
import { main } from "./webgl/webgl-index";

const App: React.FC = props => {
    return <div className="container"> 
        <Articles id="template" main={main} >

            <form>
                <label>基础形状：</label>
                <select>
                    <option value="point">点-point</option>
                    <option value="point">线-line</option>
                </select>
            </form>

        </Articles>
        <p>source code: <a></a></p>
        <footer className="footer-desc">Power up by Typescript, Webpack and Webgl2 </footer>
    </div>
};

ReactDom.render(<App />, document.getElementById("app"));
