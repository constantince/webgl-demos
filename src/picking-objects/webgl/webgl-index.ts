import { createFrameBuffer, initBuffer, initShader, rotation} from "../../common/base";
import { fb_fragmentShader, fb_vertexShader, fragmentShader, vertexShader } from "./shaders";
import { createCubeMesh, Demention3 } from "../../common/primative";
import { glMatrix, mat4, vec3 } from "gl-matrix";

const OFFSCREEN_WIDTH = 500;
const OFFSCREEN_HEIGHT = 500;
let _x = 0, _y = 0, open = false;

export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    webgl.clearColor(0.0, 0.0, 0.0, 1.0);
    webgl.enable(webgl.DEPTH_TEST);
    webgl.enable(webgl.CULL_FACE);

    initPickingAction(webgl, canvas);
    
    const allObject = createAllObjects(webgl, 5);
    // draw framebuffer;
    const fbo = createFrameBuffer(webgl, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
    var tick = () => {
        
        webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
        
        allObject.forEach(element => {
            var ang = rotation(element.startAngle, 45);

            if( fbo ) {
                const fp = element.fbo_program;
                webgl.useProgram(fp);
                webgl.bindFramebuffer(webgl.FRAMEBUFFER, fbo.fbo);
                initBuffer(webgl, fp, element.buffer.vertex, "a_Position", 3, false);
                // initBuffer(webgl, fp, element, "a_Color", 3, false);
                const u_idLocation = webgl.getUniformLocation(fp, "u_id");
                webgl.uniform4fv(u_idLocation, element.u_id);
                initBuffer(webgl, fp, element.buffer.pointer, null, null, webgl.ELEMENT_ARRAY_BUFFER);
                createMatrix(webgl, fp, [0, ang, 0], element.position);
                webgl.drawElements(webgl.TRIANGLES, element.buffer.count, webgl.UNSIGNED_SHORT, 0);
            }
          
            // // draw sence
            const p = element.program;
            var data = new Uint8Array(4);
            if(open) {
                webgl.readPixels(_x, _y, 1, 1, webgl.RGBA, webgl.UNSIGNED_BYTE, data);
                console.log(data);
                open = false;
            }
            // 
            
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
            // if( fbo ) {
            //     webgl.activeTexture(webgl.TEXTURE0);
            //     webgl.bindTexture(webgl.TEXTURE_2D, fbo.texture);
            // }
            webgl.useProgram(p);
            initBuffer(webgl, p, element.buffer.vertex, "a_Position", 3, false);
            initBuffer(webgl, p, element.buffer.color, "a_Color", 3, false);
            initBuffer(webgl, p, element.buffer.pointer, null, null, webgl.ELEMENT_ARRAY_BUFFER);
            createMatrix(webgl, p, [0, ang, 0], element.position);
            webgl.drawElements(webgl.TRIANGLES, element.buffer.count, webgl.UNSIGNED_SHORT, 0);
        
        });
        window.requestAnimationFrame(tick)
    }

    tick(); 
}

type objectItem = {
    buffer: Demention3,
    fbo_program: WebGLProgram,
    program: WebGLProgram,
    position: number[],
    startAngle: number,
    u_id: number[]
}

function createAllObjects(webgl: WebGL2RenderingContext, count: number): objectItem[] {
    const buffer = createCubeMesh();
    let objects = [];
    
    for (let index = 0; index < count; index++) {
        const item = {
            fbo_program:  <WebGLProgram>initShader(webgl, fb_vertexShader, fb_fragmentShader, [0, 1]),
            buffer: buffer,
            program: <WebGLProgram>initShader(webgl, vertexShader, fragmentShader, [0, 1]),
            position: [(index - 2), 0, 0],
            startAngle: (index * 45) % 360,
            u_id: [
                ((index >>  0) & 0xFF) / 0xFF,
                ((index >>  8) & 0xFF) / 0xFF,
                ((index >> 16) & 0xFF) / 0xFF,
                ((index >> 24) & 0xFF) / 0xFF,
              ],
        }
        objects.push(item);
    }

    return objects
}


function initPickingAction(webgl: WebGL2RenderingContext,canvas: HTMLCanvasElement) {
    canvas.addEventListener("mousedown", (e) => {
        const x = e.clientX, y = e.clientY;
        var rect = canvas.getBoundingClientRect();
       
        _x =  x - rect.left;
        _y =  y - rect.top;
        open = true;
        // console.log(_x, _y);
        // webgl.readPixels(x - rect.left, y - rect.top, 1, 1, webgl.RGBA, webgl.UNSIGNED_BYTE, data);
        // console.log(data);

    })
}

function createMatrix(webgl: WebGL2RenderingContext, program: WebGLProgram, angle:number[], position: number[]) {
    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(30), 1, 1, 100);

    const lM = mat4.create()
    mat4.identity(lM);
    mat4.lookAt(lM, [0, 1, 10], [0, 0, 0], [0, 1, 0]);

    mat4.mul(vM, vM, lM);

    const rM = mat4.create();
    mat4.identity(rM);

    const p = vec3.fromValues(position[0], position[1] - 4, position[2]);
    mat4.translate(rM, rM, p);

    mat4.rotateX(rM, rM, glMatrix.toRadian(angle[0]));
    mat4.rotateY(rM, rM, glMatrix.toRadian(angle[1]));
    mat4.rotateZ(rM, rM, glMatrix.toRadian(angle[2]));
    mat4.translate(rM, rM, [0, 2, 0])

    
    // mat4.rotate(rM, rM, glMatrix.toRadian(angle || 0), [0, 1, 0]);
    mat4.mul(vM, vM, rM);

    const u_MatrixLocation = webgl.getUniformLocation(program, "u_Matrix");
    webgl.uniformMatrix4fv(u_MatrixLocation, false, vM);
}