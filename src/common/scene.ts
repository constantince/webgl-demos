import { glMatrix, mat4 } from "gl-matrix";
import { initBuffer, initShader, translateToWebglColor } from "./base";

const vertexShader = `#version 300 es
    in vec4 a_Position;
    uniform mat4 u_Matrix;

    out vec4 v_Color;
    void main() {
        gl_Position = u_Matrix * a_Position;
    }
`;

const fragmentShader = `#version 300 es
    precision mediump float;
    in vec4 v_Color;
    out vec4 FragColor;
    uniform bool f_Line;
    void main() {
        if( f_Line ) {
            FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        } else {
            FragColor = vec4(${translateToWebglColor("#c4ffce").join(",")});
        }
        
    }
`;


function createVertex (square:number) {
    square =  square * 10;
    let vertex:number[] = [];
    let pointer: number[] = [];
    let linePointer: number[] = [];
    for (let indexX = 0; indexX < square; indexX++) {// z 
        for (let indexY = 0; indexY < square; indexY++) {// z 
            vertex.push(indexX * 0.1,  0, -indexY * 0.1);
        }
        linePointer.push(indexX * square, (indexX + 1) * square - 1);
    }

    for (let indexX = 0; indexX < Math.pow(square, 2) - square; indexX++) {// z 
        pointer.push(indexX, indexX + square);
       
    }

    linePointer = linePointer.concat(pointer);

	return {
        vertexArray: new Float32Array(vertex),
        pointerArray: new Uint16Array(pointer),
        pointerLineArray: new Uint16Array(linePointer),
        count: pointer.length,
        lineCount: linePointer.length
    };
}

const w:any = window;

function createMatrix(canvas: HTMLCanvasElement,webgl: WebGL2RenderingContext, program: WebGLProgram, time: number, paneSize:number) {
    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(30), canvas.width / canvas.height, 1, 100);

    const lM = mat4.create();
    mat4.identity(lM);
    mat4.lookAt(lM, [w.x, w.y, w.z], [0, 0, 0], [0, 1, 0]);

    mat4.mul(vM, vM, lM);

    const rM = mat4.create();
    mat4.identity(rM);
    mat4.translate(rM, rM, [-paneSize / 2, 0.0, paneSize / 2]);
    mat4.mul(vM, vM, rM);

    const u_MatrixLocation = webgl.getUniformLocation(program, "u_Matrix");
    webgl.uniformMatrix4fv(u_MatrixLocation, false, vM);
}

// create Floor 0.1 * 0.1 per 1 squat
export const createPane =(canvas: HTMLCanvasElement ,webgl: WebGL2RenderingContext, paneSize: number, paneColor: string | null) => {
    const program = initShader(webgl, vertexShader, fragmentShader);
    if( program ) {
        const {vertexArray, count, pointerArray, pointerLineArray, lineCount} = createVertex(paneSize);
        // console.log(vertexArray, pointerArray, pointerLineArray);
       
        
       return (time: number = 1) => {
            time *= 0.001;
            webgl.useProgram(program);

            initBuffer(webgl, program, vertexArray, "a_Position", 3, false);
            createMatrix(canvas, webgl, program, time, paneSize);
            // draw lines.
            webgl.polygonOffset(1.0, 1.0);
            const f_Line = webgl.getUniformLocation(program, "f_Line");
            webgl.uniform1i(f_Line, 1);
            initBuffer(webgl, program, pointerLineArray, null, null, webgl.ELEMENT_ARRAY_BUFFER);
            webgl.drawElements(webgl.LINES, lineCount, webgl.UNSIGNED_SHORT, 0);
    
            // draw triangles.
            if( paneColor ) {
                initBuffer(webgl, program, pointerArray, null, null, webgl.ELEMENT_ARRAY_BUFFER);
                webgl.uniform1i(f_Line, 0);
                webgl.drawElements(webgl.TRIANGLE_STRIP, count, webgl.UNSIGNED_SHORT, 0);
            }
           
       }
    } else {
        return function(){}
    }
}
