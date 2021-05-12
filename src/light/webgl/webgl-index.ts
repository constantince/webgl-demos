import { glMatrix, mat4 } from "gl-matrix";
import { Glob } from "glob";
import { createMatrix, initBuffer, initShader, rotation, initEvent } from "../../common/base";
import { calculateCylinder } from "../../common/primative";
import {vertexShader, fragmentShader, vertexShader1, fragmentShader1, fragmentShader2, vertexShader2} from "./shaders";

export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    webgl.clearColor(0.0, 0.0, 0.0, 1.0);
    webgl.enable(webgl.DEPTH_TEST);
   

    // webgl.enable(webgl.CULL_FACE);
    const program = initShader(webgl, vertexShader, fragmentShader);
    const program2 = initShader(webgl, vertexShader2, fragmentShader2);
    const {vertexsArray, pointerArray, len, normalArray} = calculateCylinder(2, 1, .35, true);
    let currentAngle = [0, 0, 0];
    initEvent(canvas, currentAngle);
    if( program && program2) {
        var tick = () => {
            // let angle = rotation(0, 45);
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

            webgl.useProgram(program);
            lightUp(webgl, program);
            initBuffer(webgl, program, vertexsArray, 'a_Position', 3, false);
            initBuffer(webgl, program, normalArray, 'a_Normal', 3, false);
            initBuffer(webgl, program, pointerArray, null, null, webgl.ELEMENT_ARRAY_BUFFER);
            createMatrix(webgl, program, currentAngle, false);
            webgl.drawElements(webgl.TRIANGLES, len, webgl.UNSIGNED_SHORT, 0);


            window.requestAnimationFrame(tick);
        }
        tick();  
    }
}

function lightUp(gl: WebGL2RenderingContext, program: WebGLProgram) {
    const u_AmbientColorLocation = gl.getUniformLocation(program, "u_AmbientColor");
    const u_LightColorLocation = gl.getUniformLocation(program, "u_LightColor");
    const u_LightPositionLocation = gl.getUniformLocation(program, "u_LightPostion");

    gl.uniform3fv(u_AmbientColorLocation, [0.2, 0.2, 0.2]);
    gl.uniform3fv(u_LightColorLocation, [1.0, 1.0, 1.0]);
    gl.uniform3fv(u_LightPositionLocation, [-3, 2, 0]);

}

