import { clearCanvas, preparation, rotation } from "../../common/base";
import { Objects } from "../../common/factory";

// the benchmark size of whole canvas sun: 1.0
const sunSize = 1.0;

const earthOrbitSize = sunSize * 4;

const earthSize = sunSize / 6;

const earthXPos = earthOrbitSize;

const MoonSize = earthSize / 2;

const moonOrbitSize = earthSize * 3;

const moonXPos = moonOrbitSize;


export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");

    // the Sun 
    const Sun = new Objects(webgl, canvas, 'sphere').scale([sunSize, sunSize, sunSize])
    // .position([1, 0, 0]);

    // the earth orbit
    const EarthOrbit = new Objects(webgl, canvas, 'orbit', webgl.LINE_LOOP)
    .scale([earthOrbitSize, earthOrbitSize, earthOrbitSize])
    // .position([1, 0, 0])
    .addParent(Sun);

    // the Earth
    const Earth = new Objects(webgl, canvas, 'sphere')
    .scale([earthSize, earthSize, earthSize])
    .position([earthXPos, 0.0, 0.0])
    .addParent(EarthOrbit);


    // the moon orbit
    const MoonOrbit = new Objects(webgl, canvas, 'orbit', webgl.LINE_LOOP)
    .scale([moonOrbitSize, moonOrbitSize, moonOrbitSize])
    .addParent(Earth);


    const Moon = new Objects(webgl, canvas, 'sphere')
    .scale([MoonSize, MoonSize, MoonSize])
    .position([moonXPos, 0.0, 0.0])
    .addParent(MoonOrbit);
   













    var tick = (time:number) => {
        time *= 0.001;
        preparation(webgl);
        clearCanvas(webgl);
        Earth.rotate([rotation(0, 15), 0, 1, 0]);
        Moon.rotate([rotation(0, 45), .2, 1, 0]);
        Sun.draw();
       
        // // console.log(r);
        // Earth.rotate([r, 0, 1, 0]).draw();
        // EarthOrbit.draw();
        window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);

}






