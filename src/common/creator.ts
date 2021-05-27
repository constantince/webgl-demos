import { glMatrix, mat4 } from "gl-matrix";
import { createFrameBuffer, initBuffer, initShader, rotation, translateToWebglColor } from "./base";
import { createCubeMesh } from "./primative";

export const vertexShader = `#version 300 es
    in vec4 a_Position;
    in vec4 a_Color;
    uniform mat4 u_Matrix;

    out vec4 v_Color;
    void main() {
        gl_Position = u_Matrix * a_Position;
        v_Color = a_Color;
    }
`;

export const fragmentShader = `#version 300 es
    precision mediump float;
    in vec4 v_Color;
    out vec4 FragColor;
    uniform bool f_Line;
    void main() {
        FragColor = v_Color;
    }
`;

export const vertexShader_frame = `#version 300 es
    in vec4 a_Position;
    in vec4 a_Color;
    uniform mat4 u_Matrix;

    out vec4 v_Color;
    void main() {
        gl_Position = u_Matrix * a_Position;
    }
`;

export const fragmentShader_frame = `#version 300 es
    precision mediump float;
    in vec4 v_Color;
    out vec4 FragColor;
    uniform vec4 u_id;
    void main() {
        FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`;

const w: any = window;

export function makeCube (canvas: HTMLCanvasElement, webgl: WebGL2RenderingContext) {
    const program = initShader(webgl, vertexShader, fragmentShader);
    const fprogram = initShader(webgl, vertexShader_frame, fragmentShader_frame);
    const fbo = createFrameBuffer(webgl, canvas.width, canvas.height);
    const {color, vertex, pointer, count} = createCubeMesh();
    if(program && fprogram) {
        return (time:number) => {
            if( fbo ) {
                webgl.bindFramebuffer(webgl.FRAMEBUFFER, fbo.fbo);
                webgl.useProgram(fprogram);
                createCubeMatrix(canvas, webgl, fprogram, time)
                initBuffer(webgl, fprogram, vertex, "a_Position", 3, false);
                initBuffer(webgl, fprogram, pointer, null, null, webgl.ELEMENT_ARRAY_BUFFER);
                const u_idLocation = webgl.getUniformLocation(fprogram, "u_id");
                webgl.uniform4fv(u_idLocation, [.38, 0, 0, 0]); 
               
                webgl.drawElements(webgl.TRIANGLES, count, webgl.UNSIGNED_SHORT, 0)
            }

            if( w.open ) {
                const data = new Uint8Array(4);
                console.log(w.px, w.py)
                webgl.readPixels(w.px, w.py, 1, 1, webgl.RGBA, webgl.UNSIGNED_BYTE, data);
                console.log(data);
                w.open = false;
            }
           
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
            webgl.useProgram(program);
            createCubeMatrix(canvas, webgl, program, time)
            initBuffer(webgl, program, color, "a_Color", 3, false);
            initBuffer(webgl, program, vertex, "a_Position", 3, false);
            initBuffer(webgl, program, pointer, null, null, webgl.ELEMENT_ARRAY_BUFFER);
            
            webgl.drawElements(webgl.TRIANGLES, count, webgl.UNSIGNED_SHORT, 0)
        }
    } else {
        return () => {};
    }
    
}

function createCubeMatrix(canvas: HTMLCanvasElement, webgl: WebGL2RenderingContext, program: WebGLProgram, time: number) {
    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(30), 1, 1, 100);

    const lM = mat4.create();
    mat4.identity(lM);
    mat4.lookAt(lM, [w.x, w.y, w.z], [0, 0, 0], [0, 1, 0]);

    mat4.mul(vM, vM, lM);

    const rM = mat4.create();
    mat4.identity(rM);
    let r = rotation(0, 45);
    mat4.rotate(rM, rM, glMatrix.toRadian(r), [0, 1, 0]);
    // mat4.scale(rM, rM, [.1, .1, .1]);
    mat4.translate(rM, rM, [0, .5, 0]);
    mat4.mul(vM, vM, rM);

    const u_MatrixLocation = webgl.getUniformLocation(program, "u_Matrix");
    webgl.uniformMatrix4fv(u_MatrixLocation, false, vM);
}