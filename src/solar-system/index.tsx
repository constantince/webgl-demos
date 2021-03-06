import React, { useState } from "react";
import ReactDom from "react-dom";
import "../common/common.scss";
import Articles from "../comps/new-scene";
import { main } from "./webgl/webgl-index";
import SwithBtn from "../comps/switch-btn";

const App: React.FC = props => {

    return <div className="container"> 
        <Articles id="template" main={main} >
        <div>
            <SwithBtn href="https://github.com/constantince" />
        </div>

        </Articles>
        <footer className="footer-desc">Power up by Typescript, Webpack and Webgl2 </footer>
    </div>
};

ReactDom.render(<App />, document.getElementById("app"));
