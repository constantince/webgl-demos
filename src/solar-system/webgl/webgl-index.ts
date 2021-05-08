import Star from "../star";



export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    
    
    webgl.clearColor(0.0, 0.0, 0.0, 1.0);
    webgl.enable(webgl.DEPTH_TEST);


    const Sun = new Star(webgl, canvas, {
        radius: 4,
        resolution: 60,
        fragmentShader: '',
        vertexShader: '',
    });

    const Earth = new Star(webgl, canvas, {
        radius: 4,
        resolution: 60,
        fragmentShader: '',
        vertexShader: ''
    }).lightUp([1.0, 1.0, 1.0], [0.0, 0.0, 0.0], [1.0, 1.0, 1.0]);

    webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
    Sun.draw(webgl.UNSIGNED_SHORT);
    Earth.draw(webgl.UNSIGNED_SHORT);
    
}