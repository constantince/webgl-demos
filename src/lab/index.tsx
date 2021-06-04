import React from "react";
import ReactDom from "react-dom";
import "../common/common.scss";
import Articles from "../comps/canvas-area";
import { main_buffer } from "./webgl/frame-buffer";
import { main_shadow } from "./webgl/shadow";
import { main_box } from "./webgl/box";
import { main_sphere } from "./webgl/sphere";

const App: React.FC = props => {

    return <div className="container"> 
        <Articles id="lab-expirement" main={main_sphere} />
        <p>source code: <a></a></p>
        
        <footer className="footer-desc">Power up by Typescript, Webpack and Webgl2 </footer>
    </div>
};

ReactDom.render(<App />, document.getElementById("app"));
