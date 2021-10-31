import { InitDraggingAction, translateToWebglColor, resizeCanvasToDisplaySize, rotation, initShader } from "../../common/base";
import { createPane } from "../../common/scene";
import { makeCube } from "../../common/creator";
import { Objects, ViewerIntheSameScene } from "../../common/factory";
import { glMatrix, mat4, vec3 } from "gl-matrix";
import {vertexShader, fragmentShader} from "./shaders";
const PLANESIZE = 5;

function createMatrix(canvas: HTMLCanvasElement) {
    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(30), canvas.width / canvas.height, 1, 100);

    const lM = mat4.create();
    mat4.identity(lM);
    mat4.lookAt(lM, [3, 1, 1.5], [0, 0, 0], [0, 1, 0]);

    mat4.mul(vM, vM, lM);

    return vM;
}

export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
   
    const color = translateToWebglColor("#4d4d4d");
    webgl.clearColor(color[0], color[1], color[2], color[3]);
    webgl.enable(webgl.DEPTH_TEST);
    webgl.enable(webgl.POLYGON_OFFSET_FILL);
    webgl.enable(webgl.CULL_FACE);

    const program = initShader(webgl, vertexShader, fragmentShader);
    if( !program ) return;
    const drawPane = createPane(canvas, program, webgl, PLANESIZE, null);
    const webglBox = new Objects(webgl, canvas, 'cube')
    .position([0, 0.1, 0])
    .scale([0.3, 0.3, 0.3])
    .rotate([60, 0, 1, 0])
    .lookAt([3, 1, 1.5], [0, 0, 0], [0, 1, 0])
    .lightUp([0.8, 0.8, 0.8], [2.0, 2.0, 2.0], [0.1, 0.1, 0.1], [2, 2, 1]);
    
    
    var tick = (time:number) => {
        time *= 0.001;
        var a = rotation(0, 10);
        const u_CameraPositionValue = vec3.fromValues(3, 1, 1.5);
        resizeCanvasToDisplaySize(canvas);
        webgl.viewport(0, 0, webgl.canvas.width, webgl.canvas.height);
        webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
        // drawPane(u_CameraPositionValue);
        webglBox.rotate([a, 0, 1, 0]).draw();
        window.requestAnimationFrame(tick);
    }
   
    
    // InitDraggingAction(canvas, tick);
    window.requestAnimationFrame(tick);
}






