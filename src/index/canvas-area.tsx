import React, { useEffect } from "react";
import { main }  from "./webgl/webgl-index";
const CanvasArea: React.FC = () => {

    useEffect(() => {
        main("index-webgl-title-canvas");
    },[])

    return <canvas id="index-webgl-title-canvas" height="120" width="120">

    </canvas>
}

export default CanvasArea;