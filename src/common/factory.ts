import { glMatrix, mat4, vec3 } from "gl-matrix";
import { createFrameBuffer, initBuffer, initShader} from "./base";
import { createCubeMesh, SphereMesh, calculateVertexSphere } from "./primative";
export const vertexShader = `#version 300 es
    in vec4 a_Position;
    in vec4 a_Color;
    uniform mat4 u_Matrix;

    out vec4 v_Color;
    void main() {
        gl_Position = u_Matrix * a_Position;
        v_Color = a_Color;
    }
`;

export const fragmentShader = `#version 300 es
    precision mediump float;
    in vec4 v_Color;
    out vec4 FragColor;
    uniform bool f_Line;
    void main() {
        FragColor = v_Color;
    }
`;

type VertexObjectsBuffer = {
    vertex: Float32Array,
    color: Float32Array,
    pointer: Uint16Array,
    normal: Float32Array,
    texcoord: Float32Array
    count: number
}

type BufferData = {
    data: Float32Array | Uint16Array,
    name: string | null,
    size: 2 | 3 | null,
    type: number | false
}

type ObjectClassItem = {
    canvas: HTMLCanvasElement,
    gl: WebGL2RenderingContext,
    type: string,
    matrixLocation: WebGLUniformLocation,
    worldMatrix: mat4,
    program: WebGLProgram, // webgl program
    textureImage: string, // the texture path
    fragmentShader: string,
    vertexShader: string,
    //primatives: VertexObjectsBuffer,
    matrix: mat4,

    primativeData: BufferData[],

    init: () => void,
    // init shader program
    createShader: () => WebGLProgram | null,
    // create buffer for webgl graphic
    createBuffer: (data: BufferData[]) => void,
    // init matrix 
    createMatrix: (mat: mat4) => void
    // craete Light
    lightUp: (lightColor: number[], lightPosition: number[], ambient: number[]) => void,
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

// create object stuffs with Objects class
/*
    const cube = new Objects(webgl, canvas, 'cube')
    .texture("image-src")
    .lightUp([0,0,0])
    .scale([0,0,0])
    .position([0,0,0])
    .rotate([0,0,0]);

    cube.setMatrix(vM).draw().bufferDraw();


*/


export class Objects implements ObjectClassItem {
    matrixFromOutside = false;
    matrix = mat4.create();
    primativeData: BufferData[];
    canvas: HTMLCanvasElement;
    type: string;
    primatives: VertexObjectsBuffer;
    matrixLocation: WebGLUniformLocation;
    createPre: any;
    fragmentShader = fragmentShader;
    vertexShader = vertexShader;
    gl: WebGL2RenderingContext;
    textureImage = "";
    program: WebGLProgram;
    worldMatrix = mat4.create();
    _position : vec3;
    _lookAt : vec3[];


    constructor(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement, type: string) {
        // this.primatives = this.calculateVertexSphere();
        const V3 = vec3.fromValues(0, 0, 0);
        this.type = type;
        this.gl = gl;
        this.canvas = canvas;
        this.program = <WebGLProgram>this.createShader();
        this.primatives = this.pickPrimative();
        this.primativeData = [];
        this._position = vec3.fromValues(0, 0, 0);
        this._lookAt = [V3, V3, V3];
        gl.useProgram(this.program);
        this.init();
        this.matrixLocation = gl.getUniformLocation(this.program, "u_Matrix") as WebGLUniformLocation;
        // this.matrix = this.createMatrix();
        
        
        
    }

    lookAt = (eyes: vec3, source: vec3, up: vec3) => {
       this._lookAt = [eyes, source, up];
       return this;
    }

    position = (v: vec3) => {
       this._position = v;
       return this;
    }

    scale = (v: vec3) => {
        const rm = mat4.create();
        mat4.identity(rm);
        mat4.fromScaling(this.worldMatrix, v)
    }

    rotate = (v: vec3) => {
        
    }

    // to choose white prive is 
    pickPrimative = (): VertexObjectsBuffer => {
        switch(this.type) {
            case "cube":
                return createCubeMesh();
            break;

            default:
                return createCubeMesh();
        }
    }

    init = () => {
        
        // this.createMatrix();

        this.buildBufferData(); 
    };

    buildBufferData = () => {
        const location: BufferData[] = [
            {
                name: "a_Position",
                size: 3,
                type: false,
                data: this.primatives.vertex
            },
            {
                name: "a_Color",
                size: 3,
                type: false,
                data: this.primatives.color
            },
            // {
            //     name: "a_Normal",
            //     size: 2,
            //     type: this.gl.ARRAY_BUFFER,
            //     data: this.primatives.normal
            // },
            // {
            //     name: "a_texCoord",
            //     size: 2,
            //     type: this.gl.ARRAY_BUFFER,
            //     data: this.primatives.texcoord
            // },
            {
                name: null,
                size: null,
                type: this.gl.ELEMENT_ARRAY_BUFFER,
                data: this.primatives.pointer
            }
        ];
        this.primativeData = location;
        return location;
    }

    draw = (matrix: mat4 | void) => {
        this.gl.useProgram(this.program);
        // let currentmatrix;
        // this.createBuffer(this.primativeData);

        // if(!this.matrix) {
        //     this.matrix = this.createMatrix();
        // }
        // if(this.matrixFromOutside) {
        //     currentmatrix = this.resetProjectionAndViewMatrix();
        // } else {
        //     this.createMatrix();
        // }
       
        // if( matrix ) {
        //     mat4.mul(this.worldMatrix, this.worldMatrix, matrix);
        // }

        this.createMatrix(matrix);
        
       
       
        // init
       
        this.createBuffer(this.primativeData);
      
        this.gl.drawElements(this.gl.TRIANGLES, this.primatives.count, this.gl.UNSIGNED_SHORT, 0);
    }

    createShader = () => {
        return initShader(this.gl, this.vertexShader, this.fragmentShader);
    }

  

    createBuffer = (data: BufferData[]) => {
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            initBuffer(this.gl, this.program, element.data, element.name, element.size, element.type);
        }
    }
    
    // reset matrix by paramters
    resetProjectionAndViewMatrix = (mat: mat4) => {
        mat4.mul(mat, mat, this.worldMatrix);
        // this.gl.uniformMatrix4fv(this.matrixLocation, false, mat);
        this.matrix = mat;
        // this.matrixFromOutside = true;
        return mat;
    }

    // create default matrix;
    createMatrix = (mat: mat4 | void) => {

        const vM = mat4.create();
        mat4.identity(vM);
        mat4.perspective(vM, glMatrix.toRadian(30), this.canvas.width / this.canvas.height, 1, 1000);

        const lM = mat4.create();
        mat4.identity(lM);
        mat4.lookAt(lM, this._lookAt[0], this._lookAt[1], this._lookAt[2]);
    
        
        mat4.mul(lM, lM, mat4.fromTranslation(mat4.create(), this._position));

        mat4.mul(vM, vM, lM);

        
        if( mat ) {
            mat4.mul(vM, vM, mat);
        }
       
        // this.matrix = vM;
        const u_MatrixLocation = this.gl.getUniformLocation(this.program, "u_Matrix");
        this.gl.uniformMatrix4fv(u_MatrixLocation, false, vM);

    }

    // light up target
    lightUp = (lightColor: number[], lightPosition: number[], ambient: number[]): this => {
        const gl = this.gl, program = this.program;
        const u_LightColor = gl.getUniformLocation(program, "u_LightColor");
        const u_LightPosition = gl.getUniformLocation(program, "u_LightPosition");
        const u_AmbientColor = gl.getUniformLocation(program, "u_AmbientColor");
        gl.uniform3fv(u_LightColor, lightColor);
        gl.uniform3fv(u_LightPosition, lightPosition);
        gl.uniform3fv(u_AmbientColor, ambient);
        return this;
        
    };


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

    createFrameBuffer = () => {

    };


}


export class ViewerIntheSameScene {
    projectionAndViewMatrix: mat4;
    stuffs: Objects[];

    constructor(commonMatrix: mat4) {
        this.projectionAndViewMatrix = commonMatrix;
        this.stuffs = [];
    }

    lookAt(eyes:vec3, source: vec3, up: vec3) {
        this.stuffs.forEach(element => {
            element.lookAt(eyes, source, up);
        });
        return this;
    }

    position(p: vec3) {
        this.stuffs.forEach(element => {
            element.position(p);  
        });
        return this;
    }

    add(objects: Objects[]) {
        this.stuffs.push(...objects);
        return this;
    }

    draw(constChangeMatrix: mat4 | void) {
        this.stuffs.forEach(element => {
            element.draw(constChangeMatrix);
        });
    }


}