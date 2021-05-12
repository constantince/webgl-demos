import { glMatrix, mat4 } from "gl-matrix";
import { Glob } from "glob";
import { createMatrix, initBuffer, initShader, rotation, initEvent, translateToWebglColor } from "../../common/base";
import { newCylinder, calculateCylinder, calculatePoints } from "../../common/primative";
import {vertexShader, fragmentShader, vertexShader1, fragmentShader1, fragmentShader2, vertexShader2} from "./shaders";

export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    const bkColor = translateToWebglColor("#465571");
    webgl.clearColor(bkColor[0], bkColor[1], bkColor[2], 1.0);
    webgl.enable(webgl.DEPTH_TEST);
   

    // webgl.enable(webgl.CULL_FACE);
    const program = initShader(webgl, vertexShader, fragmentShader);
    const program2 = initShader(webgl, vertexShader2, fragmentShader2);
    const {vertexs, color, pointer, normals, len} = calculatePoints();
    let currentAngle = [0, 0, 0];
    initEvent(canvas, currentAngle);
    
    if( program && program2) {
        webgl.useProgram(program);
        lightUp(webgl, program);
        initBuffer(webgl, program, vertexs, 'a_Position', 3, false);
        initBuffer(webgl, program, normals, 'a_Normal', 3, false);
        initBuffer(webgl, program, pointer, null, null, webgl.ELEMENT_ARRAY_BUFFER);
        var tick = () => {
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
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

    gl.uniform3fv(u_AmbientColorLocation, [0.3, 0.3, 0.3]);
    gl.uniform3fv(u_LightColorLocation, [1.0, 1.0, 1.0]);
    gl.uniform3fv(u_LightPositionLocation, [5.0, 8.0, 7.0]);

}

