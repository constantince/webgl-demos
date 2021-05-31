import { glMatrix, mat4 } from "gl-matrix";
import { initBuffer, initShader, rotation, translateToWebglColor } from "../../common/base";
import { makeCube, makeSphere } from "../../common/creator";
import { createPane } from "../../common/scene";
const w:any = window;
const PLANESIZE = 10;
export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    const color = translateToWebglColor("#FFFFFF");
    webgl.clearColor(color[0], color[1], color[2], color[3]);
    webgl.enable(webgl.DEPTH_TEST);
    // webgl.enable(webgl.POLYGON_OFFSET_FILL);
    // webgl.enable(webgl.CULL_FACE);
    const drawPane = createPane(canvas, webgl, PLANESIZE);
    const drawCube = makeCube(canvas, webgl);
    const drawSphere = makeSphere(canvas, webgl);
    // init click event;
   
    var tick = (time:number) => {
        webgl.viewport(0, 0, 500, 500);
        webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
        drawPane(time);
        drawCube.drawFrameBuffer(time);
        if( w.open ) {
            const data = new Uint8Array(4);
            // console.log(w.px, w.py)
            webgl.readPixels(w.px, w.py, 1, 1, webgl.RGBA, webgl.UNSIGNED_BYTE, data);
            console.log(data[0], 'Selected object:');
            w.open = false;
        }
        
        
        drawCube.drawColorBuffer(time);

       




        //drawSphere(time);
      
        window.requestAnimationFrame(tick);
    }

    initPickingAction(canvas, tick);
    window.requestAnimationFrame(tick);
}

function initPickingAction(canvas: HTMLCanvasElement, draw:{(time: number): void}) {
    canvas.addEventListener("mousedown", (e) => {
        const x = e.clientX, y = e.clientY;
        var rect = canvas.getBoundingClientRect();
        w.px = x - rect.left;
        w.py = rect.bottom - y;
        w.open = true;
    })
}






