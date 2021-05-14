import { glMatrix, mat4 } from "gl-matrix";
import { Glob } from "glob";
import { initBuffer, initShader, rotation, initEvent, translateToWebglColor } from "../../common/base";
import { newCylinder, calculateCylinder, calculatePoints, createRectangleMesh } from "../../common/primative";
import {vertexShader, fragmentShader} from "./shaders";
const WIN:any = window;
export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    const bkColor = translateToWebglColor("#FFFFFF");
    webgl.clearColor(bkColor[0], bkColor[1], bkColor[2], 1.0);
    webgl.enable(webgl.DEPTH_TEST);
   

    // webgl.enable(webgl.CULL_FACE);
    const program = initShader(webgl, vertexShader, fragmentShader);
    // const {vertexs, color, pointer, normals, len} = calculatePoints();
    const {vertex, color, count} = createRectangleMesh();
    let currentAngle = [0, 0, 0];
    initEvent(canvas, currentAngle);
    
    if( program ) {
        webgl.useProgram(program);
        
        initBuffer(webgl, program, vertex, 'a_Position', 3, false);
        // initBuffer(webgl, program, vertex, 'a_Position', 3, false);
        initBuffer(webgl, program, new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]), 'a_Normal', 3, false);
        // initBuffer(webgl, program, pointerArray, null, null, webgl.ELEMENT_ARRAY_BUFFER);
        var tick = () => {
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
            createMatrix(webgl, program, currentAngle, false);
            lightUp(webgl, program);
            // webgl.drawElements(webgl.TRIANGLES, len, webgl.UNSIGNED_SHORT, 0);
            webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, count);
            window.requestAnimationFrame(tick);
        }
        tick();  
    }
}

function lightUp(gl: WebGL2RenderingContext, program: WebGLProgram) {
    const u_AmbientColorLocation = gl.getUniformLocation(program, "u_AmbientColor");
    const u_LightColorLocation = gl.getUniformLocation(program, "u_LightColor");
    const u_LightPositionLocation = gl.getUniformLocation(program, "u_LightPostion");
    const u_LightDirectionLocation = gl.getUniformLocation(program, "u_LightDirection");
    const u_limitLocation = gl.getUniformLocation(program, "u_limit");

    const limit = glMatrix.toRadian(2);

    gl.uniform3fv(u_AmbientColorLocation, [0.3, 0.3, 0.3]);
    gl.uniform3fv(u_LightColorLocation, [1.0, 1.0, 1.0]);
    gl.uniform3fv(u_LightPositionLocation, [1.0, 1.0, 10.0]);
    gl.uniform1f(u_limitLocation, Math.cos(limit));

    gl.uniform3fv(u_LightDirectionLocation, [WIN.X, WIN.Y, WIN.Z]);

}

// create basic matrix;
function createMatrix(gl: WebGL2RenderingContext, program: WebGLProgram, angle: number[], move: boolean) {
    const u_Matrix = gl.getUniformLocation(program, "u_Matrix");
	const u_NormalMatrix = gl.getUniformLocation(program, "u_NormalMatrix");
	const u_ModelMatrix = gl.getUniformLocation(program, "u_ModelMatrix");
	const u_EyesPosition = gl.getUniformLocation(program, "u_EyesPosition");
    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(30), 1, 1, 1000);


    const lM = mat4.create();
    mat4.identity(lM);
    mat4.lookAt(lM, [0, 0, 5], [0, 0, 0], [0, 1, 0]);
    gl.uniform3fv(u_EyesPosition, [0, 0, 1]);

    const rM = mat4.create();
    mat4.identity(rM);
    mat4.rotateX(rM, rM, glMatrix.toRadian(angle[0]));
	mat4.rotateZ(rM, rM, glMatrix.toRadian(-angle[1]));
    move && mat4.translate(rM, rM, [0.2, 0.2, 0]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, rM);


    mat4.mul(vM, vM, lM);
    mat4.mul(vM, vM, rM);

	const nM = mat4.create();
	mat4.identity(nM);
	mat4.invert(nM, rM);
	mat4.transpose(nM, nM);

    gl.uniformMatrix4fv(u_Matrix, false, vM);
	gl.uniformMatrix4fv(u_NormalMatrix, false, nM);

}

