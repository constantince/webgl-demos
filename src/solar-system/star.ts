import { initShader, initBuffer } from "../common/base";
import { calculateVertexSphere } from "../common/primative";
import {mat4, glMatrix} from "gl-matrix";

type VertexObjectsBuffer = {
    vertexs: Float32Array,
    color: Float32Array,
    pointer: Uint16Array,
    normal: Float32Array,
    texcoord: Float32Array
    len: number
}

type BufferData = {
    data: Float32Array | Uint16Array,
    name: string,
    size: 2 | 3,
    type: number | null
}

type StartItem = {
    gl: WebGL2RenderingContext,
    radius: number, // how big the planet is
    resolution: number, // how soomth the planet is
    program: WebGLProgram, // webgl program
    textureImage: string, // the texture path
    fragmentShader: string,
    vertexShader: string,
    primatives: VertexObjectsBuffer,
    matrix: mat4

    init: () => void,
    // init shader program
    createShader: {
        (): WebGLProgram
    },
    // create buffer for webgl graphic
    createBuffer: (data: BufferData[]) => void,
    // init matrix 
    createMatrix: {
        (name: string): mat4
    },
    // craete Light
    createLight: (lightColor: number[], lightPosition: number[], ambien: number[]) => void,
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

export default class Star implements StartItem {
    radius = null

    resolution =  null

    matrix =  null

    constructor(props: Props) {
       this.init();
    }
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
        this.createBuffer(this.buildBufferData());
    };

    buildBufferData = () => {
        const location: BufferData[] = [
            {
                name: "a_Position",
                size: 3,
                type: this.gl.ARRAY_BUFFER,
                data: this.primatives.vertexs
            },
            {
                name: "a_Color",
                size: 3,
                type: this.gl.ARRAY_BUFFER,
                data: this.primatives.color
            },
            {
                name: "a_Normal",
                size: 2,
                type: this.gl.ARRAY_BUFFER,
                data: this.primatives.normal
            },
            {
                name: "a_texCoord",
                size: 2,
                type: this.gl.ARRAY_BUFFER,
                data: this.primatives.texcoord
            },
            {
                name: null,
                size: null,
                type: this.gl.ELEMENT_ARRAY_BUFFER,
                data: this.primatives.pointer
            }
        ];
        return location;
    }

    draw = (type: number) => {
        this.gl.useProgram(this.program);
        this.matrix = this.createMatrix("v_PositonMatrix");
        this.gl.drawElements(this.gl.TRIANGLES, this.primatives.len, type, 0);
    }

    createShader = () => {
        return initShader(this.gl, this.vertexShader, this.fragmentShader);
    }

    calculateVertexSphere = () => {
        return calculateVertexSphere(this.resolution, this.radius);
    }

    createBuffer = (data: BufferData[]) => {
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            initBuffer(this.gl, this.program, element.data, element.name, element.size, element.type);
        }
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

    createLight = (lightColor: number[], lightPosition: number[], ambien: number[]): this => {
        const u_LightColor = this.gl.getUniformLocation(this.program, "u_LightColor");
        const u_LightPosition = this.gl.getUniformLocation(this.program, "u_LightPosition");
        const u_AmbienColor = this.gl.getUniformLocation(this.program, "u_AmbienColor");

        this.gl.uniform3fv(u_LightColor, lightColor);
        this.gl.uniform3fv(u_LightPosition, lightPosition);
        this.gl.uniform3fv(u_AmbienColor, ambien);
        return this;
        
    };

    lightUp = this.createLight;


    createTexture: () => {};
    createFrameBuffer: () => {};


}