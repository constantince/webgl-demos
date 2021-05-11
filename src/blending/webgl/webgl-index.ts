import { initBuffer, initShader, rotation } from "../../common/base";
import { vertexShader, fragmentShader } from "./shaders";
import {glMatrix, mat4} from "gl-matrix";

export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    webgl.clearColor(0.0, 0.0, 0.0, 1.0);
    // webgl.enable(webgl.DEPTH_TEST);
    webgl.enable(webgl.BLEND);
    webgl.blendFunc(webgl.SRC_ALPHA, webgl.ONE);
    const program = initShader(webgl, vertexShader, fragmentShader);

    if ( program ) {
        webgl.useProgram(program);
        const vertes = new Float32Array([
            0.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            1.0, 0.0, 0.0
        ]);

        const color = new Float32Array([
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
        ]);

        const vertes1 = new Float32Array([
            0.0, 0.0, 0.1,
            0.0, 1.0, 0.1,
            1.0, 0.0, 0.1
        ]);

        const color1 = new Float32Array([
            1.0, 0.0, 0.0, 1,
            1.0, 0.0, 0.0, 1,
            1.0, 0.0, 0.0, 1
        ]);
        
        var tick = () => {
            let angle = rotation(0, 45);
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
            createMatrix(webgl, program, angle, false);
            initBuffer(webgl, program, vertes, "a_Position", 3, false);
            initBuffer(webgl, program, color, "a_Color", 4, false);
            webgl.drawArrays(webgl.TRIANGLES, 0, 3);
            createMatrix(webgl, program, angle, true);
            initBuffer(webgl, program, vertes1, "a_Position", 3, false);
            initBuffer(webgl, program, color1, "a_Color", 4, false);
            webgl.drawArrays(webgl.TRIANGLES, 0, 3);
            // window.requestAnimationFrame(tick);
        }
        tick();
    }
}


function createMatrix(gl: WebGL2RenderingContext, program: WebGLProgram, angle: number, move: boolean) {
    const u_Matrix = gl.getUniformLocation(program, "u_Matrix");
    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(30), 1, 1, 100);

    const lM = mat4.create();
    mat4.identity(lM);
    mat4.lookAt(lM, [0, 0, 10], [0, 0, 0], [0, 1, 0]);
    
    const rM = mat4.create();
    mat4.identity(rM);
    mat4.rotate(rM, rM, glMatrix.toRadian(angle), [0, 0, 1]);
    move && mat4.translate(rM, rM, [0.2, 0.2, 0]);
    
    mat4.mul(vM, vM, lM);
    mat4.mul(vM, vM, rM);

    

    gl.uniformMatrix4fv(u_Matrix, false, vM);

}