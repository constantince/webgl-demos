import { glMatrix, mat4 } from "gl-matrix";
import { initBuffer, initEvent, initShader, rotation } from "../../common/base";
import { 
    calculatePoint,
    createCircleMesh, 
    createCubeMesh, 
    createLineMesh, 
    createRectangleMesh, 
    createStarMesh, 
    createTriangleMesh,
    calculateCylinder_bak,
    ConeMesh,
    SphereMesh

 } from "../../common/primative";
import { vertexShader2Demension, fragmentShader2Demension, vertexShader3Demension, fragmentShader3Demension } from "./shaders";
type CallFunc = (webgl: WebGL2RenderingContext, program: WebGLProgram, angle?: number) => void;
const WIN:any = window;
export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    webgl.clearColor(0.0, 0.0, 0.0, 1.0);
    webgl.enable(webgl.DEPTH_TEST);  
    const program2D = <WebGLProgram>initShader(webgl, vertexShader2Demension, fragmentShader2Demension);
    const program3D = <WebGLProgram>initShader(webgl, vertexShader3Demension, fragmentShader3Demension);
    var tick = () => {
        const ang = rotation(0, 45);
        switch(WIN.type) {
            case "point":
                point(webgl, program2D);
                break;

            case "line":
                line(webgl, program2D);
                break;

            case "triangle":
                triangle(webgl, program2D);
                break;

            case "rectangle":
                rectangle(webgl, program2D);
                break;

            case "star":
                star(webgl, program2D);
                break;

            case "circle":
                circle(webgl, program2D);
                break;

            case "cube":
                cube(webgl, program3D, ang);
                break;

            case "cylinder":
                cylinder(webgl, program3D, ang);
                break;

            case "cone":
                cone(webgl, program3D, ang);
                break;

            case "sphere":
                sphere(webgl, program3D, ang);
                break;
                
            default:
                // cylinder(webgl, program3D, ang);
                point(webgl, program2D);
                break;
        }

        window.requestAnimationFrame(tick);
    }
    tick();
}

function createMatrix(webgl: WebGL2RenderingContext, program: WebGLProgram, angle?:number) {
    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(30), 1, 1, 100);

    const lM = mat4.create()
    mat4.identity(lM);
    mat4.lookAt(lM, [0, 1, 5], [0, 0, 0], [0, 1, 0]);

    mat4.mul(vM, vM, lM);

    const rM = mat4.create();
    mat4.identity(rM);
    mat4.rotate(rM, rM, glMatrix.toRadian(angle || 0), [0, 1, 0]);
    mat4.mul(vM, vM, rM);

    const u_MatrixLocation = webgl.getUniformLocation(program, "u_Matrix");
    webgl.uniformMatrix4fv(u_MatrixLocation, false, vM);
}

const point:CallFunc =(webgl, program) => {
    const {vertex} = calculatePoint();
    webgl.useProgram(program);
    initBuffer(webgl, program, vertex, "a_Position", 3, false);
    initBuffer(webgl, program, new Float32Array([1.0, 0.0, 0.0]), "a_Color", 3, false);

    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.drawArrays(webgl.POINTS, 0, 1);
}


const line: CallFunc = (webgl, program) => {
    const {vertex, color} = createLineMesh();
    webgl.useProgram(program);
    createMatrix(webgl, program);
    initBuffer(webgl, program, vertex, "a_Position", 3, false);
    initBuffer(webgl, program, color, "a_Color", 3, false);
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.drawArrays(webgl.LINES, 0, 4);
}

const triangle: CallFunc = (webgl, program) => {
    const {vertex, color} = createTriangleMesh();
    webgl.useProgram(program);
    initBuffer(webgl, program, vertex, "a_Position", 3, false);
    initBuffer(webgl, program, color, "a_Color", 3, false);
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.drawArrays(webgl.TRIANGLES, 0, 3);
}

const rectangle: CallFunc = (webgl, program) => {
    const {vertex, color} = createRectangleMesh();
    webgl.useProgram(program);
    initBuffer(webgl, program, vertex, "a_Position", 3, false);
    initBuffer(webgl, program, color, "a_Color", 3, false);
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 4);
}

const star: CallFunc = (webgl, program) => {
    const {vertex, color, count} = createStarMesh();
    webgl.useProgram(program);
    initBuffer(webgl, program, vertex, "a_Position", 2, false);
    initBuffer(webgl, program, color, "a_Color", 3, false);
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.drawArrays(webgl.TRIANGLE_FAN, 0, count);
}

const circle: CallFunc = (webgl, program) => {
    const {vertex, color, count} = createCircleMesh(60, 0.5);
    webgl.useProgram(program);
    initBuffer(webgl, program, vertex, "a_Position", 2, false);
    initBuffer(webgl, program, color, "a_Color", 3, false);
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.drawArrays(webgl.TRIANGLE_FAN, 0, count);
}


const cube: CallFunc = (webgl, program, angle) => {
    const {vertex, color, count, pointer} = createCubeMesh();
    webgl.useProgram(program);
   
    initBuffer(webgl, program, vertex, "a_Position", 3, false);
    initBuffer(webgl, program, color, "a_Color", 3, false);
    initBuffer(webgl, program, pointer, null, null, webgl.ELEMENT_ARRAY_BUFFER);
   

    createMatrix(webgl, program, angle);
    webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
    webgl.drawElements(webgl.TRIANGLES, count, webgl.UNSIGNED_SHORT, 0);

}
const cylinder: CallFunc = (webgl, program, angle) => {
    const { colorArray, vertexsArray, len, pointerArray } = calculateCylinder_bak(.5, .5, .5, false);

    webgl.useProgram(program);
    initBuffer(webgl, program, vertexsArray, "a_Position", 3, false);
    initBuffer(webgl, program, colorArray, "a_Color", 3, false);
    initBuffer(webgl, program, pointerArray, null, null, webgl.ELEMENT_ARRAY_BUFFER);
   

    createMatrix(webgl, program, angle);
    webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
    webgl.drawElements(webgl.TRIANGLES, len, webgl.UNSIGNED_SHORT, 0);
    
}

const cone: CallFunc = (webgl, program, angle) => {
    const { colorArray, vertexsArray, len, pointerArray } = ConeMesh();

    webgl.useProgram(program);
    initBuffer(webgl, program, vertexsArray, "a_Position", 3, false);
    initBuffer(webgl, program, colorArray, "a_Color", 3, false);
    initBuffer(webgl, program, pointerArray, null, null, webgl.ELEMENT_ARRAY_BUFFER);
   

    createMatrix(webgl, program, angle);
    webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
    webgl.drawElements(webgl.TRIANGLES, len, webgl.UNSIGNED_SHORT, 0);
}

const sphere: CallFunc = (webgl, program, angle) => {
    const {colorArray, vertexArray, pointerArray, len} = SphereMesh(0.5, 50);
    webgl.useProgram(program);
    initBuffer(webgl, program, vertexArray, "a_Position", 3, false);
    initBuffer(webgl, program, colorArray, "a_Color", 3, false);
    initBuffer(webgl, program, pointerArray, null, null, webgl.ELEMENT_ARRAY_BUFFER);
   

    createMatrix(webgl, program, angle);
    webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
    webgl.drawElements(webgl.TRIANGLES, len, webgl.UNSIGNED_SHORT, 0);
}