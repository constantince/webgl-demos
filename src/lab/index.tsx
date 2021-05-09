import React from "react";
import ReactDom from "react-dom";
import "../common/common.scss";
import Articles from "../comps/canvas-area";
import { main } from "./webgl/webgl-index";
import { main_shadow } from "./webgl/shadow";

const App: React.FC = props => {

    return <div className="container"> 
        <Articles id="lab-expirement" main={main_shadow} />
        <p>source code: <a></a></p>
        
        <footer className="footer-desc">Power up by Typescript, Webpack and Webgl2 </footer>
    </div>
};

ReactDom.render(<App />, document.getElementById("app"));
