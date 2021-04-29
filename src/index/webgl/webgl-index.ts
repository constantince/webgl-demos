import { initBuffer, initShader, rotation, translateToWebglColor } from "../../common/base";
import { VERTEX_SHADER, FRAGMENT_SHADER} from "./const";
import VOB from "../../common/primative";
import { glMatrix, mat4 } from "gl-matrix";


const useMatrix = (gl: WebGL2RenderingContext, program: WebGLProgram, angle: number) => {
    const u_ProjectionMatrixLocation = gl.getUniformLocation(program, "u_ProjectionMatrix");
    const pM = mat4.create();
    mat4.identity(pM);
    mat4.perspective(pM, glMatrix.toRadian(60), 1, 1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrixLocation, false, pM);

    const u_WorldMatrixLocation = gl.getUniformLocation(program, "u_WorldMatrix");
    const wM = mat4.create();
    mat4.identity(wM);
    mat4.lookAt(wM, [0, 0, 4], [0, 0, 0 ], [0, 1, 0]);
    gl.uniformMatrix4fv(u_WorldMatrixLocation, false, wM);

    const u_RoateMatrix = gl.getUniformLocation(program, "u_RoateMatrix");
    const rM = mat4.create();
    mat4.identity(rM);
    mat4.rotate(rM, rM, glMatrix.toRadian(angle), [1, 1, 1]);
    gl.uniformMatrix4fv(u_RoateMatrix, false, rM);



}

export const main = (id: string): void => {
    const canvas = <HTMLCanvasElement>document.getElementById(id)!;
    const webgl = canvas.getContext("webgl2");
    if( webgl ) {
        const bgColor = translateToWebglColor("#f5f5dc");
        webgl.clearColor(bgColor[0], bgColor[1], bgColor[2], bgColor[3]);
        webgl.enable(webgl.DEPTH_TEST);
        const program = initShader(webgl, VERTEX_SHADER, FRAGMENT_SHADER);
        if ( program === null) {
            return console.warn("webgl initialization failed");
        }
        webgl.useProgram(program);

        const {vertexs, pointer, len, color } = VOB.CubeVertex();

        initBuffer(webgl, program, vertexs, "a_Position", 3, false);
        initBuffer(webgl, program, color, "a_Color", 3, false);
        initBuffer(webgl, program, pointer, null, null, webgl.ELEMENT_ARRAY_BUFFER);

        const tick = () => {
            useMatrix(webgl, program, rotation(0, 45));
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
            webgl.drawElements(webgl.TRIANGLES, len, webgl.UNSIGNED_SHORT, 0);
            
            requestAnimationFrame(tick)
        }
        
        tick();

    }
}