import { glMatrix, mat4, vec3 } from "gl-matrix";
import { initBuffer, initShader, rotation, createFrameBuffer } from "../../common/base";
import * as shaders from "./shaders";

const OFFSCREEN_WIDTH = 255;
const OFFSCREEN_HEIGHT = 255;
const LightSource = vec3.fromValues(10.0, 5.0, 5.0);
type W2RC = WebGL2RenderingContext;


export function main_shadow(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2")!;

    webgl.clearColor(0.0, 0.0, 0.0, 1.0);
    webgl.enable(webgl.DEPTH_TEST);

    const programNormal = initShader(webgl, shaders.normalVertexShader, shaders.normalFragmentShader);
    const programShadow = initShader(webgl, shaders.shadowVertexShader, shaders.shadowFragmentShader);

    if( !programNormal || !programShadow ) return;

    const frameBuffer = createFrameBuffer(webgl, programShadow, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

   if( !frameBuffer ) return;

    const { fbo, texture} = frameBuffer

    webgl.bindTexture(webgl.TEXTURE_2D, texture);
    webgl.activeTexture(webgl.TEXTURE0);

    webgl.bindFramebuffer(webgl.FRAMEBUFFER, fbo);

    const lightMatrix = <mat4>createRectangle(webgl, programShadow, 0, "shadow");
    createTriangle(webgl, programShadow, 0);

    webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);

    const u_Sampler = webgl.getUniformLocation(programNormal, "u_Sampler");
    webgl.uniform1i(u_Sampler, 0);
    createRectangle(webgl, programNormal, 0, lightMatrix);
    createTriangle(webgl, programNormal, 0);


}

// create triangle
function createTriangle(webgl: W2RC, program: WebGLProgram, angle: number): void {
    if( !program ) return console.error("program do not exist");
    webgl.useProgram(program);

    const vertex = new Float32Array([
        0.3, 0.3, 0.0,
        0.0, 0.0, 0.0,
        0.3, 0.0, 0.0
    ]);

    const color = new Float32Array([
        1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, 1.0
    ]);

    initBuffer(webgl, program, vertex, "a_Position", 3, false);
    initBuffer(webgl, program, color, "a_Color",  3, false);
    initNormlMatrix(webgl, program, null);

    webgl.drawArrays(webgl.TRIANGLES, 0, 3);
}

// create rectangle
function createRectangle(webgl: W2RC, program: WebGLProgram, angle: number, type: string| mat4): mat4 | void {
    
    if(!program) return console.error("program do not exist");
    webgl.useProgram(program);
    const rectanglePoints = new Float32Array([
        -1.0, 1.0, 0.0, -1.0, -1.0, 0.0,  1.0,1.0, 0.0,   1.0, -1.0, 0.0
    ]);
    let matrix;
    if ( type === "shadow") {
        matrix = initLightMatrix(webgl, program);
    } else {
        initNormlMatrix(webgl, program, <mat4>type);
    }
    initBuffer(webgl, program, rectanglePoints, "a_Position", 3, false);

    webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 4);
    return matrix;
}

function initNormlMatrix(webgl: W2RC, program: WebGLProgram, lightMatrix: mat4| null): void {
    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(30), 1, 1, 100);
    mat4.lookAt(vM,  [0, 0, 10], [0, 0, 0], [0,1,0]);

    const u_MvpLocation = webgl.getUniformLocation(program, "a_MvpMatrix");
    
    webgl.uniformMatrix4fv(u_MvpLocation, false, vM);
    if( lightMatrix ) {
        const u_MatrixFromLight = webgl.getUniformLocation(program, "u_MatrixFromLight");
        webgl.uniformMatrix4fv(u_MatrixFromLight, false, lightMatrix);
    }
        
}

function initLightMatrix(webgl: W2RC, program: WebGLProgram): mat4 {
    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(30), 1, 1, 100);
    mat4.lookAt(vM,  LightSource, [0, 0, 0], [0,1,0]);

    const u_MvpLocation = webgl.getUniformLocation(program, "a_MvpMatrix");
    webgl.uniformMatrix4fv(u_MvpLocation, false, vM);

    return vM;

}