import { initBuffer, initShader } from "../../common/base";
import {VERTEX_SHADER, FRAGMENT_SHADER} from "./shaders";
import { calculateVertexSphere } from "../../common/primative";
import { glMatrix, mat4 } from "gl-matrix";
import { rotation } from "../../common/base";
export const main = (id: string) => {
    const canvas = <HTMLCanvasElement>document.getElementById(id)!;
    const webgl = canvas.getContext("webgl2")!;

    webgl.clearColor(0, 0, 0, 1.0);
    webgl.enable(webgl.DEPTH_TEST);

    const program = initShader(webgl, VERTEX_SHADER, FRAGMENT_SHADER);
    if( program ) {
        webgl.useProgram(program);
        const {vertexs, pointer, len, normal}  = calculateVertexSphere();
        initBuffer(webgl, program, vertexs, "a_Position", 3, false);
        initBuffer(webgl, program, normal, "a_Normal", 3, false);
        initBuffer(webgl, program, pointer, null, null, webgl.ELEMENT_ARRAY_BUFFER);
        createLight(webgl, program);

        var tick = () => {
            let angle = rotation(0, 45);
            createWorldMatrix(webgl, program, angle);
            webgl.clear(webgl.COLOR_BUFFER_BIT |  webgl.DEPTH_BUFFER_BIT);
            webgl.drawElements(webgl.TRIANGLES, len, webgl.UNSIGNED_SHORT, 0);
            requestAnimationFrame(tick)
        }
        tick()
        

    }
    

}

function createLight(gl: WebGL2RenderingContext, program: WebGLProgram): void {
    const u_LightPositionLocation = gl.getUniformLocation(program,  "u_LightPosition");
    const u_LightColor = gl.getUniformLocation(program, "u_LightColor");

    gl.uniform3fv(u_LightPositionLocation, [10, 1, 10]);
    gl.uniform3fv(u_LightColor, [1.0, 1.0, 1.0])
}

function createWorldMatrix(gl: WebGL2RenderingContext, program: WebGLProgram, angle: number): void {
    const u_WorldViewMatrixLocation = gl.getUniformLocation(program, "u_WorldViewMatrix");
    const u_NormalMatrixLocation = gl.getUniformLocation(program, "u_NormalMatrix");
    const wM = mat4.create();
    mat4.identity(wM);
    const look = mat4.create();
    mat4.identity(look);
    const rM = mat4.create();
    mat4.identity(rM);
    mat4.perspective(wM, glMatrix.toRadian(30), 1, 1, 100);
    mat4.lookAt(look, [0, 0, 10], [0, 0, 0], [0, 1, 0]);
    mat4.rotate(rM, mat4.create(), glMatrix.toRadian(angle), [0, 1, 0]);
    mat4.mul(wM, wM, look);
    mat4.mul(wM, wM, rM);
    gl.uniformMatrix4fv(u_WorldViewMatrixLocation, false, wM);

    const uM = mat4.create();
    mat4.identity(uM);
    mat4.invert(uM, rM);
    mat4.transpose(uM, uM);
    gl.uniformMatrix4fv(u_NormalMatrixLocation, false, uM);
}