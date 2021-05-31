import { initEvent, translateToWebglColor, resizeCanvasToDisplaySize } from "../../common/base";
import { createPane } from "../../common/scene";
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
    const drawPane = createPane(canvas, webgl, PLANESIZE,  500 / 1600, null);
   
    var tick = (time:number) => {
        webgl.viewport(0, 0, canvas.width, canvas.height);
        resizeCanvasToDisplaySize(canvas);
        webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
        drawPane(time);
        window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
}






