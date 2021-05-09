import { glMatrix, mat4 } from "gl-matrix";
import { initBuffer, initShader, rotation } from "../../common/base";
import { calculatePoints } from "../../common/primative";
import * as shaders from "./shaders";

var OFFSCREEN_WIDTH = 255;
var OFFSCREEN_HEIGHT = 255;
type W2RC = WebGL2RenderingContext;

export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <W2RC>canvas.getContext("webgl2");
    const result = initFrameBufferObject(webgl);
    let t: null | WebGLTexture = null;
    const programCube = initShader(webgl, shaders.vertextShaderCube, shaders.fragmentShaderCube);
    const programRectangle = initShader(webgl, shaders.vertextShaderRectangle, shaders.fragmentShaderRectangle);
    
    if(!programCube || !programRectangle) {
        return console.error("program initialize failed");
    }
    
    var tick = () => {
        const angle = rotation(0, 45);
        if( result ) {
            const { fbo, texture } = result;
            t = texture;
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, fbo);
            webgl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
            webgl.enable(webgl.DEPTH_TEST);
            webgl.clearColor(1.0, 1.0, 1.0, 1.0);
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
    
            createCube(webgl, programCube, angle);
        }
        webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
        webgl.viewport(0, 0, 500, 500);
        webgl.clearColor(0.0, 0.0, 0.0, 1.0);
        webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
    
       
        webgl.activeTexture(webgl.TEXTURE0);
        webgl.bindTexture(webgl.TEXTURE_2D, t)
        createRectangle(webgl, programRectangle, angle);
        window.requestAnimationFrame(tick);
    }

    tick();
   
}


// create rectangle
function createRectangle(webgl: W2RC, program: WebGLProgram, angle: number): void {
    
    if(!program) return console.error("program do not exist");
    webgl.useProgram(program);
    const rectanglePoints = new Float32Array([
        -1.0, 1.0, 0.0, -1.0, -1.0, 0.0,  1.0,1.0, 0.0,   1.0, -1.0, 0.0
    ]);

    var texCoords = new Float32Array([ 0.0, 1.0,  0.0, 0.0,  1.0, 1.0,  1.0, 0.0 ]);
    initMatrix(webgl, program, 0);
    initBuffer(webgl, program, rectanglePoints, "a_Position", 3, false);
    initBuffer(webgl, program, texCoords, "a_TexCoord", 2, false);

    webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 4);
}



// create cube
function createCube(webgl: W2RC, program: WebGLProgram, angle: number): void {
    if(!program) return console.error("program do not exist");
    webgl.useProgram(program);
    const { vertexs, color, pointer, len } = calculatePoints();
    initBuffer(webgl, program, vertexs, "a_Position", 3, false);
    initBuffer(webgl, program, color, "a_Color", 3, false);
    initBuffer(webgl, program, pointer, null, null, webgl.ELEMENT_ARRAY_BUFFER);
    initMatrix(webgl, program, angle);
    webgl.drawElements(webgl.TRIANGLES, len, webgl.UNSIGNED_SHORT, 0);
}

// init the cube's matrix
function initMatrix(webgl: W2RC, program: WebGLProgram, angle?: number) {
    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(30), 1, 1, 100);
    const lM = mat4.create();
    mat4.identity(lM);
    mat4.lookAt(lM, [0, 0, 8], [0, 0, 0], [0, 1, 0]);
    const rM = mat4.create();
    mat4.identity(rM);
    mat4.rotate(rM, rM, glMatrix.toRadian(angle || 0), [0, 1, 0]);

    mat4.mul(vM, vM, lM);
    mat4.mul(vM, vM, rM);

    const u_ProjectionViewMatrixLocation = webgl.getUniformLocation(program, "u_ProjectionViewMatrix");
    webgl.uniformMatrix4fv(u_ProjectionViewMatrixLocation, false, vM);
}

type FrameBufferItem = {
    fbo: WebGLFramebuffer,
    texture: WebGLTexture
}
// init frame buffer
function initFrameBufferObject(webgl: W2RC): FrameBufferItem | void {
    const frameBufferObject = webgl.createFramebuffer();
    if( !frameBufferObject ) {
        return console.error("frame buffer error")
    }

    const texture = webgl.createTexture();

    if(!texture) {
        return console.error("texture created error");
    }

    webgl.bindTexture(webgl.TEXTURE_2D, texture);
    webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGB, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, webgl.RGB, webgl.UNSIGNED_BYTE, null);
    // webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);    


    const depthBuffer = webgl.createRenderbuffer();
    webgl.bindRenderbuffer(webgl.RENDERBUFFER, depthBuffer);
    webgl.renderbufferStorage(webgl.RENDERBUFFER, webgl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

    webgl.bindFramebuffer(webgl.FRAMEBUFFER, frameBufferObject);
    webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D, texture, 0);
    webgl.framebufferRenderbuffer(webgl.FRAMEBUFFER, webgl.DEPTH_ATTACHMENT, webgl.RENDERBUFFER, depthBuffer);

    const e = webgl.checkFramebufferStatus(webgl.FRAMEBUFFER);

    if( e !== webgl.FRAMEBUFFER_COMPLETE) {
        return console.error("something goes wrong");
    }


    webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
    webgl.bindTexture(webgl.TEXTURE_2D, null);
    webgl.bindRenderbuffer(webgl.RENDERBUFFER, null);

    return {
        fbo: frameBufferObject,
        texture: texture
    };

}