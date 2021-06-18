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
const distanceUnit = 1.0;

const publicRotateFactor = .8;

const earthOrbitSize = distanceUnit * 3;

const earthSize = sunSize / 4;

const earthXPos = earthOrbitSize * 1.5;


const mercurySize = earthSize * 0.5;

const mercuryOrbitSize = distanceUnit;

const mercuryXPos = distanceUnit * 1.5;


const MoonSize = earthSize * 0.45;

const moonOrbitSize = earthSize * 1.3;

const moonXPos = moonOrbitSize * 1.5;



const marsSize = earthSize * 0.8;

const marsOrbitSize = distanceUnit * 4;

const marsXPos = marsOrbitSize * 1.5;



const venusSize = earthSize * .45;

const venusOrbitSize = distanceUnit * 2;

const venuseXPos = venusOrbitSize * 1.5;




const jupiterSize = earthSize * 3;

const jupiterOrbitSize = distanceUnit * 6;

const jupiterXPos = jupiterOrbitSize * 1.5;


const saturnSize = earthSize * 2;

const saturnOrbitSize = distanceUnit * 9;

const saturnXPos = saturnOrbitSize * 1.5;


const saturnRingSize = earthSize * 2.5;

export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");

    // the Sun 
    const Sun = new Objects(webgl, canvas, 'sphere')
    .scale([sunSize, sunSize, sunSize])
    .coverImg(image_sun)
    // .position([3, 0, 0]);



    const mercuryOrbit = new Objects(webgl, canvas, 'orbit', webgl.LINE_LOOP)
    .scale([mercuryOrbitSize, mercuryOrbitSize, mercuryOrbitSize])
    .addParent(Sun);

    const Mercury =  new Objects(webgl, canvas, 'sphere')
    .scale([mercurySize, mercurySize, mercurySize])
    .position([mercuryXPos, 0, 0])
    .coverImg(image_mercury)
    .lightUp([1.0, 1.0, 1.0], [0, 0, 0], [.1, .1, .1], [0, 0, 0])
    .addParent(mercuryOrbit);

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

    const jupiterOrbit = new Objects(webgl, canvas, 'orbit', webgl.LINE_LOOP)
    .scale([jupiterOrbitSize, jupiterOrbitSize, jupiterOrbitSize])
    .addParent(Sun);

    const Jupiter =  new Objects(webgl, canvas, 'sphere')
    .scale([jupiterSize, jupiterSize, jupiterSize])
    .position([jupiterXPos, 0, 0])
    .coverImg(image_jupiter)
    .lightUp([1.0, 1.0, 1.0], [0, 0, 0], [.1, .1, .1], [0, 0, 0])
    .addParent(jupiterOrbit);


    const saturnOrbit = new Objects(webgl, canvas, 'orbit', webgl.LINE_LOOP)
    .scale([saturnOrbitSize, saturnOrbitSize, saturnOrbitSize])
    .addParent(Sun);

    const Saturn =  new Objects(webgl, canvas, 'sphere')
    .scale([saturnSize, saturnSize, saturnSize])
    .position([saturnXPos, 0, 0])
    .coverImg(image_saturn)
    .lightUp([1.0, 1.0, 1.0], [0, 0, 0], [.1, .1, .1], [0, 0, 0])
    .addParent(saturnOrbit);


    const SaturnRing = new Objects(webgl, canvas, 'ring', webgl.TRIANGLE_STRIP)
    .scale([saturnRingSize * 1.3, saturnRingSize, saturnRingSize])
    // .position([saturnXPos, 0, 0])
    .lightUp([1.0, 1.0, 1.0], [0, 0, 0], [.3, .3, .3], [0, 0, 0])
    .addParent(Saturn);

   






    const initPosition = new Array(20).fill(0).map(v => Math.random() * 365);
    console.log(initPosition)


    var tick = (time:number) => {
        time *= 0.001;
        preparation(webgl);
        clearCanvas(webgl);
        Sun.rotate([rotation(initPosition[0], -1), 0, 1, 0]);
        // 水星
        Mercury.rotate([rotation(initPosition[1], 20 * publicRotateFactor),  0, 1, 0])._rotateY = rotation(0, 45);
        // 金星
        Venus.rotate([rotation(initPosition[2], 15 * publicRotateFactor),  0, 1, 0])._rotateY = rotation(0, 70);
        // 月球
        Moon.rotate([rotation(initPosition[3], 18 * publicRotateFactor),  0, 1, 0])._rotateY = rotation(0, 60);
        // 地球
        Earth.rotate([rotation(initPosition[4], 8 * publicRotateFactor), 0, 1, 0])._rotateY = rotation(0, -60);
        // 火星
        Mars.rotate([rotation(initPosition[5], 4 * publicRotateFactor), 0, 1, 0])._rotateY = rotation(0, -10);
        //木星
        Jupiter.rotate([rotation(initPosition[6], 3 * publicRotateFactor), 0, 1, 0])._rotateY = rotation(0, -20);

        // 金星
        Saturn.rotate([rotation(initPosition[7], 2 * publicRotateFactor), 0, 1, 0])._rotateY = rotation(0, -10);
        SaturnRing.rotate([40, 1, 1, 0]);
        

        Sun.draw();
        // SaturnRing.draw();
        // Saturn.draw();
       
        window.requestAnimationFrame(tick);
    }

   setTimeout(() => {
    window.requestAnimationFrame(tick);
   }, 0);
    // window.requestAnimationFrame(tick);
    

    // setTimeout(() => {
    //     window.requestAnimationFrame(tick);
    // }, 5000)
    

}






