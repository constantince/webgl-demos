import { initEvent, translateToWebglColor } from "../../common/base";
import { createPane } from "../../common/scene";
const w:any = window;
const PLANESIZE = 5;
function resizeCanvasToDisplaySize(canvas:HTMLCanvasElement) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
   
    // Check if the canvas is not the same size.
    const needResize = canvas.width  !== displayWidth ||
                       canvas.height !== displayHeight;
   
    if (needResize) {
      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
   
    return needResize;
  }
export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    resizeCanvasToDisplaySize(canvas);
    const color = translateToWebglColor("#4d4d4d");
    webgl.clearColor(color[0], color[1], color[2], color[3]);
    webgl.enable(webgl.DEPTH_TEST);
    webgl.enable(webgl.POLYGON_OFFSET_FILL);
    webgl.enable(webgl.CULL_FACE);
    const drawPane = createPane(canvas, webgl, PLANESIZE, null);
   
    var tick = (time:number) => {
        webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
        drawPane(time);
        window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
}






