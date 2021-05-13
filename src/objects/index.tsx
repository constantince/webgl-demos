import React, { useState } from "react";
import ReactDom from "react-dom";
import "../common/common.scss";
import Articles from "../comps/canvas-area";
import { main } from "./webgl/webgl-index";
const data = [{
        name: "point",
        word: "点-point"
    },
    {
        name: "line",
        word: "线-line"
    },
    {
        name: "triangle",
        word: "三角形-triangle"
    },
    {
        name: "rectangle",
        word: "矩形-rectangle"
    },
    {
        name: "star",
        word: "五角星-star"
    },
    {
        name: "circle",
        word: "圆形-circle"
    },
    {
        name: "cube",
        word: "立方体-cube"
    }
]

const WIN: any = window;
const App: React.FC = props => {

    function select(ev: any) {
       WIN.type = ev.target.value;
    }

    return <div className="container"> 
        <Articles id="template" main={main} >

            <form>
                <label>基础形状：</label>
                <select onChange={select}>
                    {data.map(v => <option key={v.name} value={v.name} >{v.word}</option>)}
                </select>
            </form>

        </Articles>
        <p>source code: <a></a></p>
        <footer className="footer-desc">Power up by Typescript, Webpack and Webgl2 </footer>
    </div>
};

ReactDom.render(<App />, document.getElementById("app"));
