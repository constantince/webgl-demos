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
    name: string | null,
    size: 2 | 3 | null,
    type: number | false
}

type StartItem = {
    canvas: HTMLCanvasElement,
    gl: WebGL2RenderingContext,
    radius: number, // how big the planet is
    resolution: number, // how soomth the planet is
    program: WebGLProgram, // webgl program
    textureImage: string, // the texture path
    fragmentShader: string,
    vertexShader: string,
    //primatives: VertexObjectsBuffer,
    matrix: mat4

    init: () => void,
    // init shader program
    createShader: () => WebGLProgram | null,
    // create buffer for webgl graphic
    createBuffer: (data: BufferData[]) => void,
    // init matrix 
    createMatrix: (name: string) => mat4
    // craete Light
    createLight: (lightColor: number[], lightPosition: number[], ambient: number[]) => void,
    // create texture for webgl 
    createTexture: (image: HTMLImageElement) => WebGLTexture;
    // create frame buffer
    createFrameBuffer: () => void;
    // init vertex

}

type Props = {
    radius: number,
    resolution: number,
    fragmentShader: string,
    vertexShader: string,
}

export default class Star implements StartItem {
    radius = 1;

    resolution =  60;

    matrix =  mat4.create();
    canvas: HTMLCanvasElement;
    primatives: VertexObjectsBuffer;
    createPre: any;
    fragmentShader = "";
    vertexShader = "";
    gl: WebGL2RenderingContext;
    textureImage = "";
    program: WebGLProgram;

    constructor(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement ,props: Props) {
        this.primatives = this.calculateVertexSphere();
        this.gl = gl;
        this.canvas = canvas;
        const _program = <WebGLProgram>this.createShader();
        this.program = _program;
        this.gl.useProgram(_program);
        this.init();
        
        
    }

    init = () => {
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

    draw = (type: number = this.gl.UNSIGNED_SHORT) => {

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

    createLight = (lightColor: number[], lightPosition: number[], ambient: number[]): this => {
        const gl = this.gl, program = this.program;
        const u_LightColor = gl.getUniformLocation(program, "u_LightColor");
        const u_LightPosition = gl.getUniformLocation(program, "u_LightPosition");
        const u_AmbientColor = gl.getUniformLocation(program, "u_AmbientColor");
        gl.uniform3fv(u_LightColor, lightColor);
        gl.uniform3fv(u_LightPosition, lightPosition);
        gl.uniform3fv(u_AmbientColor, ambient);
        return this;
        
    };

    lightUp = this.createLight;


    createTexture = (image: HTMLImageElement): WebGLTexture => {
        const gl = this.gl,
            u_Sampler = gl.getUniformLocation(this.program, "u_sampler");

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        const texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

        gl.uniform1i(u_Sampler, 0);

        return texture as WebGLTexture;
    };
    createFrameBuffer = () => {};


}