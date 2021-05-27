import { glMatrix, mat4 } from "gl-matrix";
import { initBuffer, initShader, rotation, translateToWebglColor } from "../../common/base";
import { makeCube } from "../../common/creator";
import { createPane } from "../../common/scene";
const w:any = window;
const PLANESIZE = 10;
export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    const color = translateToWebglColor("#FFFFFF");
    webgl.clearColor(color[0], color[1], color[2], color[3]);
    webgl.enable(webgl.DEPTH_TEST);
    webgl.enable(webgl.POLYGON_OFFSET_FILL);
    const drawPane = createPane(canvas, webgl, PLANESIZE);
    const drawCube = makeCube(canvas, webgl);
    // init click event;
    initPickingAction(canvas)
    var tick = (time:number) => {
        webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
        drawPane(time);
        drawCube(time);
        
        window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
}

function initPickingAction(canvas: HTMLCanvasElement) {
    canvas.addEventListener("mousedown", (e) => {
        w.open = true;
        const x = e.clientX, y = e.clientY;
        var rect = canvas.getBoundingClientRect();
        w.px = x - rect.left;
        w.py = y - rect.top;
    })
}






