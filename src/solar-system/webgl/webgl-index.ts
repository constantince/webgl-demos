import { clearCanvas, preparation, rotation } from "../../common/base";
import { Objects } from "../../common/factory";

// the benchmark size of whole canvas sun: 1.0
const sunSize = 1.0;

const earthOrbitSize = sunSize * 4;

const earthSize = sunSize / 40;

const earthXPos = earthOrbitSize / earthSize;

export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");



    // the Sun 
    const Sun = new Objects(webgl, canvas, 'sphere').scale([sunSize, sunSize, sunSize])
    .position([1, 0, 0]);

    // the earth orbit
    const EarthOrbit = new Objects(webgl, canvas, 'orbit', webgl.LINE_LOOP)
    .scale([earthOrbitSize, earthOrbitSize, earthOrbitSize])
    .addParent(Sun);

    // the Earth
    const Earth = new Objects(webgl, canvas, 'sphere')
    .scale([earthSize, earthSize, earthSize])
    .position([earthXPos, 0.0, 0.0])
    .addParent(EarthOrbit);
   
    var tick = (time:number) => {
        time *= 0.001;
        preparation(webgl);
        clearCanvas(webgl);
        var r = rotation(0, 15);
        Earth.rotate([r, 0, 1, 0]);


        Sun.draw();
       
        // // console.log(r);
        // Earth.rotate([r, 0, 1, 0]).draw();
        // EarthOrbit.draw();
        window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);

}






