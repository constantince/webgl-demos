import React from "react";
import ReactDom from "react-dom";
import DemoList from "./demo-list";
import data from "./data";
import CanvasArea from "./canvas-area";
import "../common/common.scss";
const App: React.FC = (props) : JSX.Element => {
    return <div className="container"> 
        <CanvasArea />
        <DemoList lists={data.lists} />
        <footer className="footer-desc">Power up by Typescript, Webpack and Webgl2 </footer>
    </div>
};

ReactDom.render(<App />, document.getElementById("app"));
