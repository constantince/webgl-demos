import { glMatrix, mat4 } from "gl-matrix";
import { initBuffer, initShader, translateToWebglColor } from "../../common/base";
import { makePane } from "../../common/scene";
import { fragmentShader, vertexShader } from "./shaders";

const PLANESIZE = 2;
export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    const color = translateToWebglColor("#FFFFFF");
    webgl.clearColor(color[0], color[1], color[2], color[3]);
    webgl.enable(webgl.DEPTH_TEST);
    webgl.enable(webgl.POLYGON_OFFSET_FILL);
    

    const program = initShader(webgl, vertexShader, fragmentShader);
    if( program ) {
       
        webgl.useProgram(program);
        const {vertexArray, count, pointerArray, pointerLineArray, lineCount} = makePane(PLANESIZE);
        console.log(vertexArray, pointerArray, pointerLineArray);
        initBuffer(webgl, program, vertexArray, "a_Position", 3, false);
        

        var tick = (time: number) => {
            time *= 0.001;
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
            createMatrix(webgl, program, time);
            // draw lines.
            webgl.polygonOffset(1.0, 1.0);
            const f_Line = webgl.getUniformLocation(program, "f_Line");
            webgl.uniform1i(f_Line, 1);
            initBuffer(webgl, program, pointerLineArray, null, null, webgl.ELEMENT_ARRAY_BUFFER);
            webgl.drawElements(webgl.LINES, lineCount, webgl.UNSIGNED_SHORT, 0);
    
            // draw triangles.
            initBuffer(webgl, program, pointerArray, null, null, webgl.ELEMENT_ARRAY_BUFFER);
            webgl.uniform1i(f_Line, 0);
            webgl.drawElements(webgl.TRIANGLE_STRIP, count, webgl.UNSIGNED_SHORT, 0);
            window.requestAnimationFrame(tick)
        }
       
        window.requestAnimationFrame(tick)


    }
}

function createMatrix(webgl: WebGL2RenderingContext, program: WebGLProgram, time: number) {
    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(30), 1, 1, 100);

    const lM = mat4.create();
    mat4.identity(lM);
    mat4.lookAt(lM, [Math.cos(time * .1) * 2, 1, Math.sin(time * .1) * 2], [0, 0, 0], [0, 1, 0]);

    mat4.mul(vM, vM, lM);

    const rM = mat4.create();
    mat4.identity(rM);
    mat4.rotate(rM, rM, glMatrix.toRadian(90), [1, 0, 0]);
    mat4.translate(rM, rM, [-PLANESIZE/2, -PLANESIZE/2, 0]);
    mat4.mul(vM, vM, rM);

    const u_MatrixLocation = webgl.getUniformLocation(program, "u_Matrix");
    webgl.uniformMatrix4fv(u_MatrixLocation, false, vM);
}