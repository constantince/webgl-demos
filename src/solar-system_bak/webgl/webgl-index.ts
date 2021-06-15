import { clearCanvas, preparation } from "../../common/base";

export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    preparation(webgl);
    
    clearCanvas(webgl);
    console.log("solar-system");;
    
}