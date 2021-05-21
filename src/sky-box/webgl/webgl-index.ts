import { glMatrix, mat4, vec3 } from "gl-matrix";
import { initBuffer, initShader, rotation } from "../../common/base";
import { createCubeMesh } from "../../common/primative";
import { fragmentShader, frag_ment_box, vertexShader, vertex_box } from "./shaders";
import positiveY from "../assets/top.png";
import negativeY from "../assets/bottom.png";
import positiveX from "../assets/right.png";
import negativeX from "../assets/left.png";
import positiveZ from "../assets/front.png";
import negativeZ from "../assets/back.png";

// Please check your code again carefully before excuting for avoid the basic luogic and tiny program;
export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    webgl.clearColor(1.0, 1.0, 1.0, 1.0);
    webgl.enable(webgl.DEPTH_TEST);


    const program = initShader(webgl, vertexShader, fragmentShader);
    const program1 = initShader(webgl, vertex_box, frag_ment_box);

    if( program && program1) {

        

        const {vertex, normal, pointer, count} = createCubeMesh();
        const vertex1 = new Float32Array([
            -1, -1,
            1, -1,
           -1,  1,
           -1,  1,
            1, -1,
            1,  1,
        ]);

       
        var modelYRotationRadians = glMatrix.toRadian(0), modelXRotationRadians = glMatrix.toRadian(0), then =0;

        var tick = (time:number) => {
            // convert to seconds
            time *= 0.001;
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
            // Subtract the previous time from the current time
            // var deltaTime = time - then;
            // Remember the current time for the next frame.
            // then = time;
            //  // Animate the rotation
            // modelYRotationRadians += -0.7 * deltaTime;
            // modelXRotationRadians += -0.4 * deltaTime;
            // rotate 45 degree per second.
            // const ang = rotation(0, modelXRotationRadians, modelYRotationRadians);
            webgl.useProgram(program);
            initBuffer(webgl, program, vertex, "a_Position", 3, false);
            initBuffer(webgl, program, normal, "a_Normal", 3, false);
            initBuffer(webgl, program, pointer, null, null, webgl.ELEMENT_ARRAY_BUFFER);
            const viewProject = createMatrix(webgl, program, time);

            webgl.drawElements(webgl.TRIANGLES, count, webgl.UNSIGNED_SHORT, 0)


            webgl.useProgram(program1);
            initBuffer(webgl, program1, vertex1, "a_Position", 2, false);
            createSkyMatrix(webgl, program1, viewProject);
            webgl.drawArrays(webgl.TRIANGLES, 0, 6);


           
            // webgl.drawArrays(webgl.TRIANGLES, 0, 36);
            // webgl.drawElements(webgl.TRIANGLES, count, webgl.UNSIGNED_SHORT, 0)
            window.requestAnimationFrame(tick);
        }

        createTexture(webgl, program, () => {
            window.requestAnimationFrame(tick);
        });

       
        

    }
}

function createMatrix(webgl:WebGL2RenderingContext, program: WebGLProgram, time: number): mat4 {
    const u_CameraPositionValue = vec3.fromValues(Math.cos(time * .1) * 2, 0, Math.sin(time * .1) * 2);
    const u_ProjectionMatrix = webgl.getUniformLocation(program, "u_ProjectionMatrix");

    const  pM = mat4.create();
    mat4.identity(pM);
    mat4.perspective(pM, glMatrix.toRadian(60), 1, 1, 100);
    webgl.uniformMatrix4fv(u_ProjectionMatrix, false, pM);

    const  vM = mat4.create();
    mat4.identity(vM);
    mat4.lookAt(vM, u_CameraPositionValue, [0, 0, 0], [0, 1, 0]);

    const cM = mat4.create()
    mat4.identity(cM);
    mat4.invert(cM, vM);
    // mat4.transpose(cM, vM);

    const wM = mat4.create();
    mat4.identity(wM);
    mat4.rotateX(wM, wM, time * 0.11);
    // mat4.rotate(wM, wM, glMatrix.toRadian(angle || 0), [1, 1, 0]);

    // const nM = mat4.create();
    // mat4.identity(nM);
    // mat4.invert(nM, wM);
    // mat4.transpose(nM, nM);

    const newMatrix = mat4.copy(mat4.create(), vM);

    newMatrix[12] = 0;
    newMatrix[13] = 0;
    newMatrix[14] = 0;
    
    const u_ViewMatrix = webgl.getUniformLocation(program, "u_ViewMatrix");
    const u_WorldMatrix = webgl.getUniformLocation(program, "u_WorldMatrix");
    // const u_NormalMatrix = webgl.getUniformLocation(program, "u_NormalMatrix");
    const u_CameraPosition = webgl.getUniformLocation(program, "u_CameraPosition");
    const u_samplerLocation = webgl.getUniformLocation(program, "u_Sampler");
    
    webgl.uniformMatrix4fv(u_ProjectionMatrix, false, pM);
    webgl.uniformMatrix4fv(u_ViewMatrix, false, vM);
    webgl.uniformMatrix4fv(u_WorldMatrix, false, wM);
    // webgl.uniformMatrix4fv(u_NormalMatrix, false, nM);
    webgl.uniform3fv(u_CameraPosition, u_CameraPositionValue);
    webgl.uniform1i(u_samplerLocation, 0);

    return mat4.mul(pM, pM, newMatrix);
}


function createSkyMatrix(webgl: WebGL2RenderingContext, program: WebGLProgram, uM: mat4) {
    // draw sky

    webgl.depthFunc(webgl.LEQUAL);

   
    const u_viewDirectionProjectionInverse = webgl.getUniformLocation(program, "u_viewDirectionProjectionInverse");
    const u_samplerLocation1 = webgl.getUniformLocation(program, "u_Sampler");
    
    webgl.uniformMatrix4fv(u_viewDirectionProjectionInverse, false, mat4.invert(uM, uM));
    webgl.uniform1i(u_samplerLocation1, 0);
}


type IMAGE = {
    target: number,
    src: string
}

function loadImage (images: IMAGE[]): Promise<[HTMLImageElement, number]>[] {
    return images.map(v => {
        // webgl.texImage2D(v.target, 0,  webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, new Image());
        // webgl.generateMipmap(webgl.TEXTURE_CUBE_MAP);
        // webgl.texParameteri(webgl.TEXTURE_CUBE_MAP, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR_MIPMAP_LINEAR);
        return new Promise((reslove, reject) => {
            const image = new Image();
            image.onload = function() {
                reslove([image, v.target]);
            }
            image.crossOrigin = "anonymous"
            image.src = v.src;
        });
       
    });
}

function createTexture(webgl: WebGL2RenderingContext, program: WebGLProgram, done: {(): void}) {
    const IMAGES:IMAGE[] = [
        {
            target: webgl.TEXTURE_CUBE_MAP_POSITIVE_X,
            src: positiveX,
        },
        {
            target: webgl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            src: negativeX,
        },
        {
            target: webgl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            src: positiveY,
        },
        {
            target: webgl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            src: negativeY,
        },
        {
            target: webgl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            src: positiveZ,
        },
        {
            target: webgl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
            src: negativeZ,
        }
    ];

    
    Promise.all(loadImage(IMAGES)).then(res => {
        const texture  = webgl.createTexture();
        webgl.activeTexture(webgl.TEXTURE0);
        webgl.bindTexture(webgl.TEXTURE_CUBE_MAP, texture);
        res.forEach(v => {
            webgl.texImage2D(v[1], 0,  webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, v[0]);
        });
        webgl.generateMipmap(webgl.TEXTURE_CUBE_MAP);
        webgl.texParameteri(webgl.TEXTURE_CUBE_MAP, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR_MIPMAP_LINEAR);
       
        done && done();
    });
    
    

    
}