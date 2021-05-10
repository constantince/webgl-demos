import { initBuffer, initShader } from "../../common/base";
import { calculatePoint } from "../../common/primative";
import { vertexShaderPoint, fragmentShaderPoint } from "./shaders";

export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    webgl.clearColor(0.0, 0.0, 0.0, 1.0);
    webgl.enable(webgl.DEPTH_TEST);

    const vertex = calculatePoint();
    const program = initShader(webgl, vertexShaderPoint, fragmentShaderPoint);
    if( !program ) {
        return console.error("program initialize failed");
    }
    webgl.useProgram(program);
    initBuffer(webgl, program, vertex, "a_Position", 3, false);
    initBuffer(webgl, program, new Float32Array([1.0, 0.0, 0.0]), "a_Color", 3, false);

    webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
    webgl.drawArrays(webgl.POINTS, 0, 1);

}