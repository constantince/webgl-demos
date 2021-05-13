import { glMatrix, mat4 } from "gl-matrix";
import { initBuffer, initShader, rotation } from "../../common/base";
import { calculatePoint, createCircleMesh, createLineMesh, createRectangleMesh, createStarMesh, createTriangleMesh } from "../../common/primative";
import { vertexShaderPoint, fragmentShaderPoint, vertexShader, fragmentShader } from "./shaders";
type CallFunc = (webgl: WebGL2RenderingContext, program: WebGLProgram, angle?: number) => void;
const WIN:any = window;
export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    webgl.clearColor(0.0, 0.0, 0.0, 1.0);
    webgl.enable(webgl.DEPTH_TEST);  
    const programPoint = <WebGLProgram>initShader(webgl, vertexShaderPoint, fragmentShaderPoint);
    var tick = () => {
        const ang = rotation(0, 45);
        switch(WIN.type) {
            case "point":
                point(webgl, programPoint);
                break;

            case "line":
                line(webgl, programPoint);
                break;

            case "triangle":
                triangle(webgl, programPoint);
                break;

            case "rectangle":
                rectangle(webgl, programPoint);
                break;

            case "star":
                star(webgl, programPoint);
                break;

            case "circle":
                circle(webgl, programPoint);
                break;

            default:
                point(webgl, programPoint);
                break;
        }

        window.requestAnimationFrame(tick);
    }
    tick();
}

function createMatrix(webgl: WebGL2RenderingContext, program: WebGLProgram, angle?:number) {
    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(angle || 0), 1, 1, 100);

    const lM = mat4.create()
    mat4.identity(lM);
    mat4.lookAt(lM, [0, 1, 1], [0, 0, 0], [0, 1, 0]);

    mat4.mul(vM, vM, lM);

    const u_MatrixLocation = webgl.getUniformLocation(program, "u_Matrix");
    webgl.uniformMatrix4fv(u_MatrixLocation, false, vM);
}

const point:CallFunc =(webgl, program) => {
    const vertex = calculatePoint();
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
    initBuffer(webgl, program, vertex, "a_Position", 2, false);
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