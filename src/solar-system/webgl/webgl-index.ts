import { clearCanvas, preparation, rotation } from "../../common/base";
import { Objects } from "../../common/factory";
import image_sun from "../../images/sun.jpg";
import image_earth from "../../images/earth.jpg";
import image_moon from "../../images/moon.jpg";
import image_mars from "../../images/mars.jpg";
import image_mercury from "../../images/mercury.jpg";
import image_venus from "../../images/venus.jpg";
import image_jupiter from "../../images/jupiter.jpg";
import image_saturn from "../../images/saturn.jpg";
// the benchmark size of whole canvas sun: 1.0
const sunSize = 1.0;

const publicRotateFactor = 0.5;



const earthOrbitSize = sunSize * 4;

const earthSize = sunSize / 6;

const earthXPos = earthOrbitSize;

const MoonSize = earthSize * 0.45;

const moonOrbitSize = earthSize * 3;

const moonXPos = moonOrbitSize;

const marsSize = earthSize * 0.8;

const marsOrbitSize = sunSize * 7;

const marsXPos = marsOrbitSize;

const mercurySize = earthSize * 0.5;

const mercuryOrbitSize = sunSize * 2;

const mercuryXPos = mercuryOrbitSize;

const venusSize = earthSize * .45;

const venusOrbitSize = sunSize * 3;

const venuseXPos = venusOrbitSize;

const jupiterSize = earthSize * 2;

const jupiterOrbitSize = sunSize * 10;

const jupiterXPos = jupiterOrbitSize;


const saturnSize = earthSize * 1.5;

const saturnOrbitSize = sunSize * 12;

const saturnXPos = saturnOrbitSize;


export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");

    // the Sun 
    const Sun = new Objects(webgl, canvas, 'sphere')
    .scale([sunSize, sunSize, sunSize])
    .coverImg(image_sun)
    // .position([3, 0, 0]);

    // the earth orbit
    const EarthOrbit = new Objects(webgl, canvas, 'orbit', webgl.LINE_LOOP)
    .scale([earthOrbitSize, earthOrbitSize, earthOrbitSize])
    // .position([1, 0, 0])
    .addParent(Sun);

    // the Earth
    const Earth = new Objects(webgl, canvas, 'sphere')
    .scale([earthSize, earthSize, earthSize])
    .position([earthXPos, 0, 0])
    .coverImg(image_earth)
    .lightUp([1.0, 1.0, 1.0], [0, 0, 0], [.1, .1, .1], [0, 0, 0])
    .addParent(EarthOrbit);


    // the moon orbit
    const MoonOrbit = new Objects(webgl, canvas, 'orbit', webgl.LINE_LOOP)
    .scale([moonOrbitSize, moonOrbitSize, moonOrbitSize])
    .addParent(Earth);


    const Moon = new Objects(webgl, canvas, 'sphere')
    .scale([MoonSize, MoonSize, MoonSize])
    .coverImg(image_moon)
    .lightUp([1.0, 1.0, 1.0], [0, 0, 0], [.1, .1, .1], [0, 0, 0])
    .position([moonXPos, 0.0, 0.0])
    .addParent(MoonOrbit);



    const MarsOrbit = new Objects(webgl, canvas, 'orbit', webgl.LINE_LOOP)
    .scale([marsOrbitSize, marsOrbitSize, marsOrbitSize])
    .addParent(Sun);

    const Mars =  new Objects(webgl, canvas, 'sphere')
    .scale([marsSize, marsSize, marsSize])
    .position([marsXPos, 0, 0])
    .coverImg(image_mars)
    .lightUp([1.0, 1.0, 1.0], [0, 0, 0], [.1, .1, .1], [0, 0, 0])
    .addParent(MarsOrbit);

    const venusOrbit = new Objects(webgl, canvas, 'orbit', webgl.LINE_LOOP)
    .scale([venusOrbitSize, venusOrbitSize, venusOrbitSize])
    .addParent(Sun);

    const Venus =  new Objects(webgl, canvas, 'sphere')
    .scale([venusSize, venusSize, venusSize])
    .position([venuseXPos, 0, 0])
    .coverImg(image_venus)
    .lightUp([1.0, 1.0, 1.0], [0, 0, 0], [.1, .1, .1], [0, 0, 0])
    .addParent(venusOrbit);

    const mercuryOrbit = new Objects(webgl, canvas, 'orbit', webgl.LINE_LOOP)
    .scale([mercuryOrbitSize, mercuryOrbitSize, mercuryOrbitSize])
    .addParent(Sun);

    const Mercury =  new Objects(webgl, canvas, 'sphere')
    .scale([mercurySize, mercurySize, mercurySize])
    .position([mercuryXPos, 0, 0])
    .coverImg(image_mercury)
    .lightUp([1.0, 1.0, 1.0], [0, 0, 0], [.1, .1, .1], [0, 0, 0])
    .addParent(mercuryOrbit);


    const saturnOrbit = new Objects(webgl, canvas, 'orbit', webgl.LINE_LOOP)
    .scale([saturnOrbitSize, saturnOrbitSize, saturnOrbitSize])
    .addParent(Sun);

    const Saturn =  new Objects(webgl, canvas, 'sphere')
    .scale([saturnSize, saturnSize, saturnSize])
    .position([saturnXPos, 0, 0])
    .coverImg(image_saturn)
    .lightUp([1.0, 1.0, 1.0], [0, 0, 0], [.1, .1, .1], [0, 0, 0])
    .addParent(saturnOrbit);
   













    var tick = (time:number) => {
        time *= 0.001;
        preparation(webgl);
        clearCanvas(webgl);
        Sun.rotate([rotation(0, -1), 0, 1, 0]);
        // 水星
        Mercury.rotate([rotation(0, 10 * publicRotateFactor),  0, 1, 0])._rotateY = rotation(0, 45);
        // 金星
        Venus.rotate([rotation(0, 9 * publicRotateFactor),  0, 1, 0])._rotateY = rotation(0, 70);
        // 月球
        Moon.rotate([rotation(0, 8 * publicRotateFactor),  0, 1, 0])._rotateY = rotation(0, 60);
        // 地球
        Earth.rotate([rotation(0, 8 * publicRotateFactor), 0, 1, 0])._rotateY = rotation(0, -100);
        // 火星
        Mars.rotate([rotation(0, 7 * publicRotateFactor), 0, 1, 0])._rotateY = rotation(0, -90);


        //金星
        Saturn.rotate([rotation(0, 6 * publicRotateFactor), 0, 1, 0])._rotateY = rotation(0, -90);
        
       
        



        Sun.draw();
       
        window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);

}






