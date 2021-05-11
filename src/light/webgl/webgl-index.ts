import { createMatrix, initBuffer, initShader, rotation } from "../../common/base";
import { calculateCylinder } from "../../common/primative";
import {vertexShader1, fragmentShader1} from "./shaders";

export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    webgl.clearColor(0.0, 0.0, 0.0, 1.0);
    webgl.enable(webgl.DEPTH_TEST);
    // webgl.enable(webgl.CULL_FACE);
    const program = initShader(webgl, vertexShader1, fragmentShader1);

    if( program ) {
       
        webgl.useProgram(program);
        const {vertexsArray, pointerArray, len} = calculateCylinder(2, 1, .35, true);
        initBuffer(webgl, program, vertexsArray, 'a_Position', 3, false);
        initBuffer(webgl, program, pointerArray, null, null, webgl.ELEMENT_ARRAY_BUFFER);
        var tick = () => {
            let angle = rotation(0, 45);
            createMatrix(webgl, program, angle, false);
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
            webgl.drawElements(webgl.TRIANGLES, len, webgl.UNSIGNED_SHORT, 0);
            window.requestAnimationFrame(tick)
        }
        tick();
        
    }
}