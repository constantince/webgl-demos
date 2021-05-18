import { glMatrix, mat4 } from "gl-matrix";
import { initBuffer, initShader, rotation } from "../../common/base";
import { calculatePoints, createCubeMesh } from "../../common/primative";
import { vertexShader, fragmentShader } from "./shaders";

const win:any = window;
export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    webgl.clearColor(0.0, 0.0, 0.0, 1.0);
    webgl.enable(webgl.DEPTH_TEST);

    const program = initShader(webgl, vertexShader, fragmentShader);
    const {vertex, pointer, color, count}  = createCubeMesh();

    if( program ) {
        webgl.useProgram(program);
        initBuffer(webgl, program, vertex, "a_Position", 3, false);
        initBuffer(webgl, program, color, "a_Color", 3, false);
        initBuffer(webgl, program, pointer, null, null, webgl.ELEMENT_ARRAY_BUFFER);
        createMatrix(webgl, program);
        const u_FogFar = webgl.getUniformLocation(program, "u_FogFar");
        const u_FogNear = webgl.getUniformLocation(program, "u_FogNear");
        

        var tick = () => {
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
            webgl.uniform1f(u_FogNear, win.fogNear);
            webgl.uniform1f(u_FogFar, win.fogFar);
            for (let i = 0; i < 10; i++) {
                const world = mat4.create();
                mat4.identity(world);
                mat4.translate(world, world, [-4 + i * 1.1, 0, -i * 2]);
                const u_WorldMatrix = webgl.getUniformLocation(program, "u_WorldMatrix");
                webgl.uniformMatrix4fv(u_WorldMatrix, false, world);
                webgl.drawElements(webgl.TRIANGLES, count, webgl.UNSIGNED_SHORT, 0);
            }
            
            window.requestAnimationFrame(tick);
        }

        tick();
       

    }
    

   
    
}

function createMatrix(webgl: WebGL2RenderingContext, program: WebGLProgram): void {
    const vM = mat4.create();
    mat4.identity(vM);
    const lM = mat4.create();
    mat4.identity(lM);

    mat4.perspective(vM, glMatrix.toRadian(30), 1, 1, 100);
    mat4.lookAt(lM, [0, 1, 15], [0, 0, 0], [0, 1, 0]);

   

    const u_ProjectionMatrix = webgl.getUniformLocation(program, "u_ProjectionMatrix");
    const u_ViewMatrix = webgl.getUniformLocation(program, "u_ViewMatrix");
    webgl.uniformMatrix4fv(u_ProjectionMatrix, false, vM);
    webgl.uniformMatrix4fv(u_ViewMatrix, false, lM);
}