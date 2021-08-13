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

const settings = {
    cameraX: 1.75,
    cameraY: 5,
    posX: w.x,
    posY: w.y,
    posZ: w.z,
    targetX: 0.8,
    targetY: 0,
    targetZ: .7,
    projWidth: 1,
    projHeight: 1,
  };

function createMatrix(webgl:WebGL2RenderingContext, canvas: HTMLCanvasElement, program: WebGLProgram, camera: vec3) {
    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(60), canvas.width / canvas.height, 1, 100);

    const lM = mat4.create();
    mat4.identity(lM);
    mat4.lookAt(lM, camera, [0.0, 0.0, 0.0], [0, 1.0, 0]);
    // mat4.invert(lM, lM);
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
    const size = data.BYTES_PER_ELEMENT;

    const a_Position = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, size * 6, size * 0);
    gl.enableVertexAttribArray(a_Position);

    const a_Color = gl.getAttribLocation(program, "a_Color");
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, size * 6, size * 3);
    gl.enableVertexAttribArray(a_Color);

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

    //   const target = gl.getUniformLocation(program, "u_texture");
    //   gl.uniform1f(target, 0);
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
    mat4.lookAt(lM,
        [w.x, w.y, w.z],          // position
        [w.targetX, w.targetY, w.targetZ], // target
        [0, 1, 0]
    );

    mat4.scale(lM, lM, [settings.projWidth, settings.projHeight, 1]);

    mat4.mul(lM, vM, lM);
    const m = webgl.getUniformLocation(program, "u_textureMatrix");
    webgl.uniformMatrix4fv(m, false, lM);

}

const paneVertex = new Float32Array([
    -5.0, -1.0, -5.0, 1.0, 1.0, 1.0,
    -5.0, -1.0, 5.0, 1.0, 1.0, 1.0,
    5.0, -1.0, -5.0, 1.0, 1.0, 1.0,
    5.0, -1.0, 5.0, 1.0, 1.0, 1.0
]);

function initVertexBuffers(gl: WebGL2RenderingContext, program: WebGLProgram) {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    var verticesColors = new Float32Array([
      // Vertex coordinates and color
       1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
      -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta
      -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
       1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow
       1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green
       1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan
      -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue
      -1.0, -1.0, -1.0,     0.0,  0.0,  0.0   // v7 Black
    ]);
  
    // Indices of the vertices
    var indices = new Uint16Array([
      0, 1, 2,   0, 2, 3,    // front
      0, 3, 4,   0, 4, 5,    // right
      0, 5, 6,   0, 6, 1,    // up
      1, 6, 7,   1, 7, 2,    // left
      7, 4, 3,   7, 3, 2,    // down
      4, 7, 6,   4, 6, 5     // back
   ]);
  
    // Create a buffer object
    var vertexColorBuffer = gl.createBuffer();
    var indexBuffer = gl.createBuffer();
    if (!vertexColorBuffer || !indexBuffer) {
      return -1;
    }
  
    // Write the vertex coordinates and color to the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
  
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    // Assign the buffer object to a_Position and enable the assignment
    var a_Position = gl.getAttribLocation(program, 'a_Position');
    if(a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
    // Assign the buffer object to a_Color and enable the assignment
    var a_Color = gl.getAttribLocation(program, 'a_Color');
    if(a_Color < 0) {
      console.log('Failed to get the storage location of a_Color');
      return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);
  
    // Write the indices to the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  
    return indices.length;
}

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
        // time *= 0.0001;
        // const u_CameraPositionValue = vec3.fromValues(settings.cameraX, settings.cameraY, 7);
        const u_CameraPositionValue = vec3.fromValues(5, 5, 5);
        resizeCanvasToDisplaySize(canvas);
        webgl.viewport(0, 0, webgl.canvas.width, webgl.canvas.height);
        webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
       
        _createBuffer(webgl, program, "a_Position", paneVertex);
        const [vM, lM] = createMatrix(webgl, canvas, program, u_CameraPositionValue);
        
        _createFMatrix(webgl, canvas, program, [vM, lM])
        webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 4);



       
        const n = initVertexBuffers(webgl, program);
        webgl.drawElements(webgl.TRIANGLES, n, webgl.UNSIGNED_SHORT, 0);

        // window.requestAnimationFrame(tick);
    }

    return tick;
    // setTimeout(() => {
       
    // }, 2000)
    
    // InitDraggingAction(canvas, tick);
    // window.requestAnimationFrame(tick);
}








