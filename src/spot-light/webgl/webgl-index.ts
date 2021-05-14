import { glMatrix, mat4 } from "gl-matrix";
import { Glob } from "glob";
import { initBuffer, initShader, rotation, initEvent, translateToWebglColor } from "../../common/base";
import { newCylinder, calculateCylinder, calculatePoints } from "../../common/primative";
import {vertexShader, fragmentShader} from "./shaders";
const WIN:any = window;


function createRectangleMesh() {
    const vertex = new Float32Array([
        -5, -1, 5,
        -5, -1, -5,
        5, -1, 5,
        5, -1, -5
    ]);
    return {
        vertex, count: 4
    }
}


function createCubeMesh() {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    var vertex = new Float32Array([   // Coordinates
       1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
       1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
       1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
      -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
      -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
       1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
    ]);
  
  
    var color = new Float32Array([    // Colors
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
   ]);
  
  
    var normal = new Float32Array([    // Normal
      0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
      1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
      0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
     -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
      0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
      0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
    ]);
  
  
    // Indices of the vertices
    var pointer = new Uint16Array([
       0, 1, 2,   0, 2, 3,    // front
       4, 5, 6,   4, 6, 7,    // right
       8, 9,10,   8,10,11,    // up
      12,13,14,  12,14,15,    // left
      16,17,18,  16,18,19,    // down
      20,21,22,  20,22,23     // back
   ]);
  
  
    // Write the vertex property to buffers (coordinates, colors and normals)
    return {
        vertex, pointer, normal, count: pointer.length, color
    }
  }

export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    const bkColor = translateToWebglColor("#000000");
    webgl.clearColor(bkColor[0], bkColor[1], bkColor[2], 1.0);
    webgl.enable(webgl.DEPTH_TEST);
   

    // webgl.enable(webgl.CULL_FACE);
    const program = initShader(webgl, vertexShader, fragmentShader);
    // const {vertexs, color, pointer, normals, len} = calculatePoints();
    const {vertex, count} = createRectangleMesh();
    const cube = createCubeMesh();
    let currentAngle = [0, 0, 0];
    initEvent(canvas, currentAngle);
    
    if( program ) {
        webgl.useProgram(program);
        
       
        // initBuffer(webgl, program, pointerArray, null, null, webgl.ELEMENT_ARRAY_BUFFER);
        var tick = () => {
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
            createMatrix(webgl, program, currentAngle, false);
            lightUp(webgl, program);

            initBuffer(webgl, program, vertex, 'a_Position', 3, false);
            // initBuffer(webgl, program, vertex, 'a_Position', 3, false);
            initBuffer(webgl, program, new Float32Array([
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
                0, 1, 0]), 'a_Normal', 3, false);

            initBuffer(webgl, program, new Float32Array([
                1.0, 1, 1,
                1.0, 1, 1,
                1.0, 1, 1,
                1.0, 1, 1,
            ]), 'a_Color', 3, false);
            webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, count);


            initBuffer(webgl, program, cube.vertex, 'a_Position', 3, false);
            initBuffer(webgl, program, cube.normal, 'a_Normal', 3, false);
            initBuffer(webgl, program, cube.color, 'a_Color', 3, false);
            initBuffer(webgl, program, cube.pointer, null, null, webgl.ELEMENT_ARRAY_BUFFER);
            webgl.drawElements(webgl.TRIANGLES, cube.count, webgl.UNSIGNED_SHORT, 0);

            window.requestAnimationFrame(tick);
        }
        tick();  
    }
}


function lightUp(gl: WebGL2RenderingContext, program: WebGLProgram) {
    const u_AmbientColorLocation = gl.getUniformLocation(program, "u_AmbientColor");
    const u_LightColorLocation = gl.getUniformLocation(program, "u_LightColor");
    const u_LightPositionLocation = gl.getUniformLocation(program, "u_LightPostion");
    const u_SpotDirectionLocation = gl.getUniformLocation(program, "u_SpotDirection");
    const u_innerLimitLocation = gl.getUniformLocation(program, "u_innerLimit");
    const u_outerLimitLocation = gl.getUniformLocation(program, "u_outerLimit");
    const u_LightDirectionLocation = gl.getUniformLocation(program, "u_LightDirection");

    // const innerLimit = glMatrix.toRadian(WIN.L);
    // const outerLimit = glMatrix.toRadian(WIN.LO);

    gl.uniform3fv(u_AmbientColorLocation, [0.1, 0.1, 0.1]);
    gl.uniform3fv(u_LightColorLocation, [1.0, 1.0, 1.0]);
    gl.uniform3fv(u_LightPositionLocation, [0.0, 20.0, -20.0]);
    gl.uniform1f(u_innerLimitLocation, Math.cos(glMatrix.toRadian(3.1)));
    gl.uniform1f(u_outerLimitLocation, Math.cos(glMatrix.toRadian(4.1)));

    gl.uniform3fv(u_SpotDirectionLocation, [WIN.X, WIN.Y, 100]);
    // gl.uniform3fv(u_LightDirectionLocation, [0.0, 20.0, -20.0]);

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
    mat4.lookAt(lM, [0, 20, -20], [0, 0, 0], [0, 1, 0]);
    gl.uniform3fv(u_EyesPosition, [0, 10, -15]);

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

