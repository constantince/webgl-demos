import { clearCanvas, preparation } from "../../common/base";
import { createPane } from "../../common/scene";
import { makeCube } from "../../common/creator";
import { Objects, ViewerIntheSameScene } from "../../common/factory";
import { glMatrix, mat4, vec3 } from "gl-matrix";

export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
   
    preparation(webgl);


    loadFile("https://webgl2fundamentals.org/webgl/resources/models/killer_whale/whale.CYCLES.gltf")
    .then(res => {
    });

    var tick = (time:number) => {
        time *= 0.001;

        clearCanvas(webgl);
    }
   
    window.requestAnimationFrame(tick);
    
    // InitDraggingAction(canvas, tick);
    // window.requestAnimationFrame(tick);
}


async function loadFile(url: string) {
    const file = await fetch(url);
    return file.json();
}







