import { InitDraggingAction, translateToWebglColor, resizeCanvasToDisplaySize, rotation, initShader } from "../../common/base";
import { createPane } from "../../common/scene";
import { makeCube } from "../../common/creator";
import { Objects, ViewerIntheSameScene } from "../../common/factory";
import { glMatrix, mat4, vec3 } from "gl-matrix";
import webglImage from "../../images/webgl.png";
import cloudOnSky from "../../images/sky_cloud.jpg";
import F from "../../images/f-texture.png";
import { vertexShader, fragmentShader} from "./shaders";

const w:any = window;
const PLANESIZE = 5;

function createMatrix(webgl:WebGL2RenderingContext, canvas: HTMLCanvasElement, program: WebGLProgram, camera: vec3) {
    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(30), canvas.width / canvas.height, 1, 100);

    const lM = mat4.create();
    mat4.identity(lM);
    mat4.lookAt(lM, camera, [0.0, 0, 0.0], [0, 1.0, 0]);

    // mat4.mul(vM, vM, lM);

    const m = webgl.getUniformLocation(program, "u_ProjectionMatrix");
    webgl.uniformMatrix4fv(m, false, vM);

    const c = webgl.getUniformLocation(program, "u_CameraMatrix");
    webgl.uniformMatrix4fv(c, false,lM);

    return [vM, lM];
}

function _createBuffer(gl: WebGL2RenderingContext, program: WebGLProgram, name: string, data: Float32Array) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const target = gl.getAttribLocation(program, name);

    gl.vertexAttribPointer(target, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(target);
}

function createTexture(gl: WebGL2RenderingContext, program: WebGLProgram, url: string, render: {(): void}) {
    // Create a texture.
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.activeTexture(gl.TEXTURE0);
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));
    // Asynchronously load an image
    const image = new Image();
    image.src = url;
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      // assumes this texture is a power of 2
      gl.generateMipmap(gl.TEXTURE_2D);

      const target = gl.getUniformLocation(program, "u_texture");
      gl.uniform1f(target, 0);
      render();
    });
    return texture;
}

function _createFMatrix(webgl:WebGL2RenderingContext, canvas: HTMLCanvasElement, program: WebGLProgram, cameraMatrix: mat4[]) {
    // const view = mat4.invert(mat4.create(), cameraMatrix[1]);
    
    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(30), canvas.width / canvas.height, 0.1, 100);

    const lM = mat4.create();
    mat4.identity(lM);
    mat4.lookAt(lM, [2.75, 5.0, 2.0], [2.5, 4.8, 4.3], [2.5, 1.0, 3.0]);

    const textureMatrix = mat4.mul(
        vM,
        vM,
        lM
    );

    const m = webgl.getUniformLocation(program, "u_textureMatrix");
    webgl.uniformMatrix4fv(m, false, textureMatrix);

}

const paneVertex = new Float32Array([
    -1.0, 0.0, -1.0,
    -1.0, 0.0, 1.0,
    1.0, 0.0, -1.0,
    1.0, 0.0, 1.0
]);

export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    const program = initShader(webgl, vertexShader, fragmentShader);
    if(!program) return;

    
    webgl.useProgram(program);
    const color = translateToWebglColor("#4d4d4d");
    webgl.clearColor(color[0], color[1], color[2], color[3]);
    webgl.enable(webgl.DEPTH_TEST);
    webgl.enable(webgl.POLYGON_OFFSET_FILL);
    webgl.enable(webgl.CULL_FACE);

    createTexture(webgl, program, F, () => {
        window.requestAnimationFrame(tick);
    });
    
    var tick = (time:number) => {
        time *= 0.001;
        const u_CameraPositionValue = vec3.fromValues(Math.cos(time * .1) * 2, 1, Math.sin(time * .1) * 2);
        resizeCanvasToDisplaySize(canvas);
        webgl.viewport(0, 0, webgl.canvas.width, webgl.canvas.height);
        webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

        _createBuffer(webgl, program, "a_Position", paneVertex);
        const [vM, lM] = createMatrix(webgl, canvas, program, u_CameraPositionValue);
        
        _createFMatrix(webgl, canvas, program, [vM, lM])
        webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 4);
        window.requestAnimationFrame(tick);
    }
    // setTimeout(() => {
       
    // }, 2000)
    
    // InitDraggingAction(canvas, tick);
    // window.requestAnimationFrame(tick);
}








