import { glMatrix, mat4, vec3 } from "gl-matrix";
import { initBuffer, initEvent, initShader, rotation } from "../../common/base";
import { createCubeMesh, calculateVertexSphere } from "../../common/primative";
import {vertexShader, fragmentShader } from "./shaders";
export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    webgl.clearColor(0.0, 0.0, 0.0, 1.0);
    webgl.enable(webgl.DEPTH_TEST);

    const program = initShader(webgl, vertexShader, fragmentShader);
    let ro = [0,0,0];
    initEvent(canvas, ro)
    if( program ) {
        webgl.useProgram(program);
        const {color, len, vertexs, normal, texcoord, pointer} = calculateVertexSphere();
        initBuffer(webgl, program, vertexs, "a_Position", 3, false);
        // initBuffer(webgl, program, color, "a_Color", 3, false);
        initBuffer(webgl, program, texcoord, "a_TexCoord", 2, false);
        initBuffer(webgl, program, pointer, null, null, webgl.ELEMENT_ARRAY_BUFFER);
        createTexture(webgl, program, canvasTexture("TO BE OR NOT TO BE, THAT IS A QUESTION. HELLO WEBGL", 1000, 1000));
        var tick = () => {
            // const a = rotation(0, 45);
            createMatrix(webgl, program, ro);
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
            webgl.drawElements(webgl.TRIANGLES, len, webgl.UNSIGNED_SHORT, 0);
            window.requestAnimationFrame(tick);
        }

        tick();
        
    }
    
}

function createMatrix(webgl: WebGL2RenderingContext, program: WebGLProgram, angle:number[]) {
    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(30), 1, 1, 100);

    const lM = mat4.create()
    mat4.identity(lM);
    mat4.lookAt(lM, [0, 1, 5], [0, 0, 0], [0, 1, 0]);

    mat4.mul(vM, vM, lM);

    const rM = mat4.create();
    mat4.identity(rM);
    mat4.rotateX(rM, rM, glMatrix.toRadian(angle[0]));
    mat4.rotateY(rM, rM, glMatrix.toRadian(angle[1]));
    mat4.rotateZ(rM, rM, glMatrix.toRadian(angle[2]));
    // mat4.rotate(rM, rM, glMatrix.toRadian(angle || 0), [0, 1, 0]);
    mat4.mul(vM, vM, rM);

    const u_MatrixLocation = webgl.getUniformLocation(program, "u_Matrix");
    webgl.uniformMatrix4fv(u_MatrixLocation, false, vM);
}


function createTexture(webgl: WebGL2RenderingContext, program: WebGLProgram, word: HTMLCanvasElement) {
    const texture = webgl.createTexture();
    // webgl.activeTexture(webgl.TEXTURE_2D);
    

    webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, 1);
    webgl.bindTexture(webgl.TEXTURE_2D, texture);
    webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, word);
    

    // Set texture parameters
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);

    const u_Sampler = webgl.getUniformLocation(program, "u_Sampler");
    webgl.uniform1i(u_Sampler, 0);

}

function canvasTexture(text: string, width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement("canvas").getContext("2d")!;
    canvas.canvas.width = width;
    canvas.canvas.height = height;
    canvas.font = "20px monospace";
    canvas.textAlign = "center";
    canvas.textBaseline = "middle";
    // canvas.fillStyle = "red";
    // set canvas color
    canvas.fillStyle = '#000000';
    canvas.fillRect(0, 0, width, height);
    // set font color
    canvas.fillStyle = "white";
    // canvas.clearRect(0, 0, width, height);
    canvas.fillText(text, width/2, height/2);
  
    return canvas.canvas;
}