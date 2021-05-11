import { glMatrix, mat4 } from "gl-matrix";
import { Glob } from "glob";
import { createMatrix, initBuffer, initShader, rotation } from "../../common/base";
import { calculateCylinder } from "../../common/primative";
import {vertexShader1, fragmentShader1, fragmentShader2, vertexShader2} from "./shaders";

export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    webgl.clearColor(0.0, 0.0, 0.0, 1.0);
    webgl.enable(webgl.DEPTH_TEST);
   

    // webgl.enable(webgl.CULL_FACE);
    const program = initShader(webgl, vertexShader1, fragmentShader1);
    const program2 = initShader(webgl, vertexShader2, fragmentShader2);
    const {vertexsArray, pointerArray, len} = calculateCylinder(2, 1, .35, true);
    if( program && program2) {
       
        
        var tick = () => {
            let angle = rotation(0, 45);
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
            webgl.enable(webgl.POLYGON_OFFSET_FILL);
            webgl.polygonOffset(1.0, 1.0);
            webgl.useProgram(program);

            initBuffer(webgl, program, vertexsArray, 'a_Position', 3, false);
            initBuffer(webgl, program, pointerArray, null, null, webgl.ELEMENT_ARRAY_BUFFER);
            createMatrix(webgl, program, angle, false);
            webgl.drawElements(webgl.TRIANGLES, len, webgl.UNSIGNED_SHORT, 0);
            
            webgl.useProgram(program2);
            
            initBuffer(webgl, program2, vertexsArray, 'a_Position', 3, false);
            initBuffer(webgl, program2, pointerArray, null, null, webgl.ELEMENT_ARRAY_BUFFER);
            createMatrix1(webgl, program2, angle, false);
            webgl.drawElements(webgl.TRIANGLES, len, webgl.UNSIGNED_SHORT, 0);
            webgl.disable(webgl.POLYGON_OFFSET_FILL);
            window.requestAnimationFrame(tick);
        }
        tick();
        
    }
}

function createMatrix1(gl: WebGL2RenderingContext, program: WebGLProgram, angle: number, move: boolean) {
    const u_Matrix = gl.getUniformLocation(program, "u_Matrix");
    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(30), 1, 1, 100);

    const lM = mat4.create();
    mat4.identity(lM);
    mat4.lookAt(lM, [0, 0, 10], [0, 0, 0], [0, 1, 0]);
    
    const rM = mat4.create();
    mat4.identity(rM);
    mat4.rotate(rM, rM, glMatrix.toRadian(angle), [1, 1, 1]);
    mat4.scale(rM, rM, [.99, .99, .99]);
    
    mat4.mul(vM, vM, lM);
    mat4.mul(vM, vM, rM);

    gl.uniformMatrix4fv(u_Matrix, false, vM);

}