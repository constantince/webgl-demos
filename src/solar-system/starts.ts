import { initShader, initBuffer } from "../common/base";
import { calculatePoints, calculateVertexSphere } from "../common/primative";
import {mat4, glMatrix} from "gl-matrix";

type VertexObjectsBuffer = {
    vertexs: Float32Array,
    color: Float32Array,
    pointer: Uint16Array,
    normal: Float32Array,
    texcoord: Float32Array
    len: number
}

type StartItem = {
    gl: WebGL2RenderingContext,
    radius: number, // how big the planet is
    resolution: number, // how soomth the planet is
    program: WebGLProgram, // webgl program
    textureImage: string, // the texture path
    fragmentShader: string,
    vertexShader: string,
    primatives: VertexObjectsBuffer

    init: () => void,
    // init shader program
    createShader: {
        (): WebGLProgram
    },
    // create buffer for webgl graphic
    createBuffer: {
        (): {

        }
    },
    // init matrix 
    createMatrix: {
        (name: string): mat4
    },
    // craete Light
    createLight: {
        () : {

        }
    },
    // create texture for webgl 
    createTexture: {
        () : {

        }
    },
    // create frame buffer
    createFrameBuffer: {
        () : {
            
        }
    },
    // init vertex

}

type Props = {
    radius: number,
    resolution: number,
    fragmentShader: string,
    vertexShader: string,
    textureImage: string
}

class Start implements StartItem {
    radius: null

    resolution: null

    constructor(props: Props) {
       
        
    }
    createBuffer: () => {};
    primatives: VertexObjectsBuffer;
    createPre: any;
    fragmentShader: string;
    vertexShader: string;
    gl: WebGL2RenderingContext;
    textureImage: string;
    program: WebGLProgram;
    init = () => {
        this.primatives = this.calculateVertexSphere();
        this.program = this.createShader();
        this.gl.useProgram(this.program);

        
    };

    createShader = () => {
        return initShader(this.gl, this.vertexShader, this.fragmentShader);
    }

    calculateVertexSphere = () => {
        return calculateVertexSphere(this.resolution, this.radius);
    }

    createMatrix = (name: string) => {
        const vM = mat4.create();
        mat4.identity(vM);
        mat4.perspective(vM, glMatrix.toRadian(30), 1, 1, 100);
        mat4.lookAt(vM, [0, 0, 10], [0, 0, 0], [0, 1, 0]);
        const location = this.gl.getUniformLocation(this.program, name);

        const rM = mat4.create();
        mat4.rotate(vM, rM, glMatrix.toRadian(30), [0, 1, 0]);

        this.gl.uniformMatrix4fv(location, false, vM);

        return vM;
    }

    createLight: () => {};
    createTexture: () => {};
    createFrameBuffer: () => {};


}