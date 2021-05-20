import { glMatrix, mat4, vec3 } from "gl-matrix";
import { initBuffer, initShader, rotation } from "../../common/base";
import { createCubeMesh } from "../../common/primative";
import { vertex_box, frag_ment_box } from "./shaders";

// Please check your code again carefully before excuting for avoid the basic luogic and tiny program;
export function main_box(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    webgl.clearColor(1.0, 1.0, 1.0, 1.0);
    webgl.enable(webgl.DEPTH_TEST);


    const program = initShader(webgl, vertex_box, frag_ment_box);

    if( program ) {

        webgl.useProgram(program);

        const vertex = new Float32Array([
            -1, -1,
            1, -1,
           -1,  1,
           -1,  1,
            1, -1,
            1,  1,
        ]);
        initBuffer(webgl, program, vertex, "a_Position", 2, false);

        var tick = (time:number) => {
            // convert to seconds
            time *= 0.001;
            // rotate 45 degree per second.
            // const ang = rotation(0, modelXRotationRadians, modelYRotationRadians);
            createMatrix(webgl, program, time);
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
            // webgl.drawArrays(webgl.TRIANGLES, 0, 36);
            webgl.drawArrays(webgl.TRIANGLES, 0, 6);
            window.requestAnimationFrame(tick);
        }

        createTexture(webgl, program, () => {
            window.requestAnimationFrame(tick);
        });

       
        

    }
}

function createMatrix(webgl:WebGL2RenderingContext, program: WebGLProgram, time:number): mat4 {
    const u_CameraPositionValue = vec3.fromValues(Math.cos(time * .1), 0, Math.sin(time * .1));
    const  pM = mat4.create();
    mat4.identity(pM);
    mat4.perspective(pM, glMatrix.toRadian(60), 1, 1, 100);

    const  vM = mat4.create();
    mat4.identity(vM);
    mat4.lookAt(vM, u_CameraPositionValue, [0, 0, 0], [0, 1, 0]);

    const latM = mat4.mul(mat4.create(), pM, vM);

    const uM = mat4.create();
    mat4.identity(uM);
    mat4.invert(uM, latM);
    // mat4.transpose(uM, uM);


    const u_viewDirectionProjectionInverse = webgl.getUniformLocation(program, "u_viewDirectionProjectionInverse");
    const u_samplerLocation = webgl.getUniformLocation(program, "u_Sampler");
    
    webgl.uniformMatrix4fv(u_viewDirectionProjectionInverse, false, uM);
    webgl.uniform1i(u_samplerLocation, 0);
     // let our quad pass the depth test at 1.0
     webgl.depthFunc(webgl.LEQUAL);

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