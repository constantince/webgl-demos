import React from "react";
import ReactDom from "react-dom";
import "../common/common.scss";
import Articles from "../comps/canvas-area";
import { main } from "./webgl/webgl-index";


const App: React.FC = props => {
    return <div className="container"> 
        <Articles id="earht-sphere" main={main} />
        <footer className="footer-desc">Power up by Typescript, Webpack and Webgl2 </footer>
    </div>
};

ReactDom.render(<App />, document.getElementById("app"));
