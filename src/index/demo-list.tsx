import React from "react";
import { List } from "./types";
import "./index.scss";

const DemoList: React.FC<List> = (props) => {
    return <ul>
    {
        props.lists.map(v => 
            <li key={v.path}>
                <a href={v.path}>{v.name}</a>
            </li>
        )
    }
    </ul>
}

export default DemoList;