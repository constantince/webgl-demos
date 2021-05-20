import { glMatrix, mat4, vec3 } from "gl-matrix";
import { initBuffer, initShader, rotation } from "../../common/base";
import { createCubeMesh } from "../../common/primative";
import { fragmentShader, vertexShader } from "./shaders";

// Please check your code again carefully before excuting for avoid the basic luogic and tiny program;
export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    webgl.clearColor(1.0, 1.0, 1.0, 1.0);
    webgl.enable(webgl.DEPTH_TEST);


    const program = initShader(webgl, vertexShader, fragmentShader);

    if( program ) {

        webgl.useProgram(program);

        const {vertex, normal, pointer, count} = createCubeMesh();
        initBuffer(webgl, program, vertex, "a_Position", 3, false);
        initBuffer(webgl, program, normal, "a_Normal", 3, false);
        initBuffer(webgl, program, pointer, null, null, webgl.ELEMENT_ARRAY_BUFFER);

       
        var modelYRotationRadians = glMatrix.toRadian(0), modelXRotationRadians = glMatrix.toRadian(0), then =0;

        var tick = (time:number) => {
            // convert to seconds
            time *= 0.001;
            // Subtract the previous time from the current time
            var deltaTime = time - then;
            // Remember the current time for the next frame.
            then = time;
             // Animate the rotation
            modelYRotationRadians += -0.7 * deltaTime;
            modelXRotationRadians += -0.4 * deltaTime;
            // rotate 45 degree per second.
            // const ang = rotation(0, modelXRotationRadians, modelYRotationRadians);
            createMatrix(webgl, program, modelXRotationRadians, modelYRotationRadians);
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
            // webgl.drawArrays(webgl.TRIANGLES, 0, 36);
            webgl.drawElements(webgl.TRIANGLES, count, webgl.UNSIGNED_SHORT, 0)
            window.requestAnimationFrame(tick);
        }

        createTexture(webgl, program, () => {
            window.requestAnimationFrame(tick);
        });

       
        

    }
}

function createMatrix(webgl:WebGL2RenderingContext, program: WebGLProgram, anglex: number, angley: number): mat4 {
    const u_CameraPositionValue = vec3.fromValues(0, 0, 4);
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
    mat4.rotateX(wM, wM, anglex);
    mat4.rotateY(wM, wM, angley);
    // mat4.rotate(wM, wM, glMatrix.toRadian(angle || 0), [1, 1, 0]);

    // const nM = mat4.create();
    // mat4.identity(nM);
    // mat4.invert(nM, wM);
    // mat4.transpose(nM, nM);
    

    
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
    return vM;
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
            src: 'https://webgl2fundamentals.org/webgl/resources/images/computer-history-museum/pos-x.jpg',
        },
        {
            target: webgl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            src: 'https://webgl2fundamentals.org/webgl/resources/images/computer-history-museum/neg-x.jpg',
        },
        {
            target: webgl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            src: 'https://webgl2fundamentals.org/webgl/resources/images/computer-history-museum/pos-y.jpg',
        },
        {
            target: webgl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            src: 'https://webgl2fundamentals.org/webgl/resources/images/computer-history-museum/neg-y.jpg',
        },
        {
            target: webgl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            src: 'https://webgl2fundamentals.org/webgl/resources/images/computer-history-museum/pos-z.jpg',
        },
        {
            target: webgl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
            src: 'https://webgl2fundamentals.org/webgl/resources/images/computer-history-museum/neg-z.jpg',
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