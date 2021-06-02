import { InitDraggingAction, translateToWebglColor, resizeCanvasToDisplaySize, rotation } from "../../common/base";
import { createPane } from "../../common/scene";
import { makeCube } from "../../common/creator";
import { Objects, ViewerIntheSameScene } from "../../common/factory";
import { glMatrix, mat4, vec3 } from "gl-matrix";
const w:any = window;
const PLANESIZE = 5;

function createMatrix(canvas: HTMLCanvasElement) {
    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(30), canvas.width / canvas.height, 1, 100);

    const lM = mat4.create();
    mat4.identity(lM);
    mat4.lookAt(lM, [3, 1, 1.5], [0, 0, 0], [0, 1, 0]);

    mat4.mul(vM, vM, lM);

    // const rM = mat4.create();
    // mat4.identity(rM);

    // mat4.rotateY(rM, rM, glMatrix.toRadian(y));

    // mat4.mul(vM, vM, rM);

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

    
    const drawPane = createPane(canvas, webgl, PLANESIZE, null);
    const cube = new Objects(webgl, canvas, 'cube').position([0, 0.1, 0])
    const cube2 = new Objects(webgl, canvas, 'cube').position([1, 0.1, 0]);
    const cube3 = new Objects(webgl, canvas, 'cube').position([1, 0.1, 1]);
    const viewer = new ViewerIntheSameScene(createMatrix(canvas));
    viewer.add([cube, cube2, cube3]).lookAt([3, 1, 1.5], [0, 0, 0], [0, 1, 0]);;
    
    var tick = (time:number) => {
        time *= 0.001;
        const u_CameraPositionValue = vec3.fromValues(Math.cos(time * .1) * 2, 1, Math.sin(time * .1) * 2);
        // const rotateMatrix = mat4.create();
        // mat4.identity(rotateMatrix);
        // mat4.rotateY(rotateMatrix, rotateMatrix, glMatrix.toRadian(y));
        resizeCanvasToDisplaySize(canvas);
        webgl.viewport(0, 0, webgl.canvas.width, webgl.canvas.height);
        webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
        drawPane(u_CameraPositionValue);
        viewer.lookAt(u_CameraPositionValue, [0, 0, 0], [0, 1, 0]);
        viewer.draw();
        // viewer.draw(rotateMatrix);
        // cube.draw();
        // cube2.draw();
        // drawCube(time, x, y);
        window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
    // InitDraggingAction(canvas, tick);
    // window.requestAnimationFrame(tick);
}






