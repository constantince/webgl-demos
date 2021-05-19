import { glMatrix, mat4 } from "gl-matrix";
import { initBuffer, initShader, rotation } from "../../common/base";
import { createCubeMesh } from "../../common/primative";
import { fragmentShader, vertexShader } from "./shaders";

// Please check your code again carefully before excuting for avoid the basic luogic and tiny program;
export function main(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    webgl.clearColor(0.0, 0.0, 0.0, 1.0);
    webgl.enable(webgl.DEPTH_TEST);


    const program = initShader(webgl, vertexShader, fragmentShader);

    if( program ) {

        webgl.useProgram(program);

        const {vertex, normal, pointer, count} = createCubeMesh();
        initBuffer(webgl, program, vertex, "a_Position", 3, false);
        initBuffer(webgl, program, pointer, null, null, webgl.ELEMENT_ARRAY_BUFFER);

       
       

        var tick = () => {
            // rotate 45 degree per second.
            const ang = rotation(0, 45);
            createMatrix(webgl, program, ang);
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
            webgl.drawElements(webgl.TRIANGLES, count, webgl.UNSIGNED_SHORT, 0);
            window.requestAnimationFrame(tick);
        }

        createTexture(webgl, program, () => {
            tick();
        });

       
        

    }
}

function createMatrix(webgl:WebGL2RenderingContext, program: WebGLProgram, angle?: number): mat4 {
    const  vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(30), 1, 1, 100);

    const  wM = mat4.create();
    mat4.identity(wM);
    mat4.lookAt(wM, [0, 0, 5], [0, 0, 0], [0, 1, 0]);
    mat4.rotate(wM, wM, glMatrix.toRadian(angle || 0), [1, 1, 1]);
    

    const u_MatrixLocation = webgl.getUniformLocation(program, "u_Matrix");
    webgl.uniformMatrix4fv(u_MatrixLocation, false, mat4.mul(vM, vM, wM));

    return vM;
}


type IMAGE = {
    target: number,
    src: string
}

function loadImage (webgl:WebGL2RenderingContext, images: IMAGE[]): Promise<[HTMLImageElement, number]>[] {
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

    
    Promise.all(loadImage(webgl, IMAGES)).then(res => {
        const texture  = webgl.createTexture();
        webgl.activeTexture(webgl.TEXTURE0);
        webgl.bindTexture(webgl.TEXTURE_CUBE_MAP, texture);
        res.forEach(v => {
            
            // webgl.bindTexture(webgl.TEXTURE_CUBE_MAP, texture);
            webgl.texImage2D(v[1], 0,  webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, v[0]);
           
        });
        webgl.generateMipmap(webgl.TEXTURE_CUBE_MAP);
        webgl.texParameteri(webgl.TEXTURE_CUBE_MAP, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR_MIPMAP_LINEAR);
        const u_samplerLocation = webgl.getUniformLocation(program, "u_Sampler");
        webgl.uniform1i(u_samplerLocation, 0);
        done && done();
    });
    
    

    
}