import { InitDraggingAction, translateToWebglColor, resizeCanvasToDisplaySize } from "../../common/base";
import { createPane } from "../../common/scene";
import { makeCube } from "../../common/creator";
const w:any = window;
const PLANESIZE = 5;

export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    
    const color = translateToWebglColor("#4d4d4d");
    webgl.clearColor(color[0], color[1], color[2], color[3]);
    webgl.enable(webgl.DEPTH_TEST);
    webgl.enable(webgl.POLYGON_OFFSET_FILL);
    webgl.enable(webgl.CULL_FACE);
    const drawPane = createPane(canvas, webgl, PLANESIZE, null);
    const { drawColorBuffer: drawCube } = makeCube(canvas, webgl);
    var tick = (time:number, x:number, y: number) => {
        resizeCanvasToDisplaySize(canvas);
        webgl.viewport(0, 0, webgl.canvas.width, webgl.canvas.height);
        webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
        drawPane(time, x, y);
        drawCube(time, x, y);
        // window.requestAnimationFrame(tick);
    }
    tick(0, 0, 0);
    InitDraggingAction(canvas, tick);
    // window.requestAnimationFrame(tick);
}






