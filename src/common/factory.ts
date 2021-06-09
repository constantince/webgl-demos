import { glMatrix, mat4, quat, vec3 } from "gl-matrix";
import { createFrameBuffer, initBuffer, initShader} from "./base";
import { createCubeMesh, SphereMesh, calculateVertexSphere, test } from "./primative";
export const vertexShader = `#version 300 es
    in vec4 a_Position;
    in vec4 a_Color;
    in vec2 a_TexCoord;
    in vec4 a_Normal;


    uniform mat4 u_ProjectionMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_WorldMatrix;
    uniform mat4 u_NormalMatrix;

    out vec2 v_TexCoord;
    out vec4 v_Color;
    out vec3 v_Normal;
    out vec4 v_WorldPosition;
    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_WorldMatrix * a_Position;
        v_Color = a_Color;
        v_TexCoord = a_TexCoord;
        v_WorldPosition = u_WorldMatrix * a_Position;
        v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
    }
`;

export const fragmentShader = `#version 300 es
    precision mediump float;
    in vec4 v_Color;
    in vec2 v_TexCoord;
    in vec3 v_Normal;
    in vec4 v_WorldPosition;

   
    uniform sampler2D u_Sampler;

    
    uniform bool f_Line;
    
    uniform bool u_HasLight;    

    uniform vec3 u_LightPosition;
    uniform vec3 u_LightColor;
    uniform vec3 u_AmbientColor;
    uniform vec3 u_EyesPosition;
    uniform bool u_HasTexture;

    out vec4 FragColor;
    const float shininess = 120.0;
    void main() {
        
        // a·d·s light start
        vec3 normal = normalize(v_Normal);
        vec3 lightDirection = normalize(u_LightPosition - v_WorldPosition.xyz);
        vec3 eyesToSurface = normalize(u_EyesPosition - v_WorldPosition.xyz);
        vec3 halfVector = normalize(eyesToSurface + lightDirection);

        float specular = 0.0;
        float fDot = max(dot(lightDirection, normal), 0.0);
        
        if( fDot > 0.0) { // 背面不进行光亮处理
            vec3 reflectVec = reflect(-lightDirection, normal);
            specular = pow(dot(reflectVec, eyesToSurface), shininess);
        }

        vec4 baseColor = vec4(1.0, 1.0, 1.0, 1.0);

        if ( u_HasTexture ) {
            vec4 baseColor = texture(u_Sampler, v_TexCoord);    
        } else {
            baseColor = v_Color;
        }

        
        vec3 diffuse = u_LightColor * baseColor.rgb * fDot;
        vec3 ambient = u_AmbientColor * baseColor.rgb;
        
       
        if( u_HasLight ) {
            FragColor = vec4(diffuse + ambient + specular, baseColor.a);  // 反射光线无需混合基底颜色调制
        } else {
            FragColor = baseColor;
        }
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
    // matrixLocation: WebGLUniformLocation,
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
    lightUp: (lightColor: vec3, lightPosition: vec3, ambient: vec3, eyes: vec3) => void,
    // create texture for webgl 
    createTexture: (image: HTMLImageElement) => void;
    // create frame buffer
    createFrameBuffer: () => void;
    // init vertex

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

const V3 = vec3.fromValues(0, 0, 0);
export class Objects implements ObjectClassItem {
    matrixFromOutside = false;
    matrix = mat4.create();
    primativeData: BufferData[];
    canvas: HTMLCanvasElement;
    type: string;
    primatives: VertexObjectsBuffer;
    // matrixLocation: WebGLUniformLocation;
    createPre: any;
    fragmentShader = fragmentShader;
    vertexShader = vertexShader;
    gl: WebGL2RenderingContext;
    textureImage = "";
    texture: WebGLTexture | null | "loading";
    program: WebGLProgram;
    worldMatrix = mat4.create();
    _position = V3;
    _lookAt = [vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0)];
    _scale = vec3.fromValues(1, 1, 1);
    _rotate = [glMatrix.toRadian(60), 0, 0, 0]


    constructor(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement, type: string) {
        // this.primatives = this.calculateVertexSphere();
        this.texture = null;
        this.type = type;
        this.gl = gl;
        this.canvas = canvas;
        this.program = <WebGLProgram>this.createShader();
        this.primatives = this.pickPrimative();
        this.primativeData = [];
        gl.useProgram(this.program);
        this.init();
        // this.matrixLocation = gl.getUniformLocation(this.program, "u_Matrix") as WebGLUniformLocation;
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
       this._scale = v;
       return this;
    }

    rotate = (v: number[]) => {
        this._rotate = v;
        return this;
    }

    coverImg = (src: string) => {
        const img = new Image();
        img.src = src;
        this.texture = "loading";
        img.onload = () => {
            this.createTexture(img);
        }
        return this;
    }

    // to choose white prive is 
    pickPrimative = (): VertexObjectsBuffer => {
        switch(this.type) {
            case "cube":
                return createCubeMesh();
            case "sphere":
                return calculateVertexSphere();

            default:
                return createCubeMesh();
        }
    }

    init = () => {
        
        // this.createMatrix();
        // const u_hasTexture = this.gl.getUniformLocation(this.program, "u_HasTexture");
        // this.gl.uniform1i(u_hasTexture, 0);
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
            {
                name: "a_Normal",
                size: 3,
                type: false,
                data: this.primatives.normal
            },
            {
                name: "a_TexCoord",
                size: 2,
                type: false,
                data: this.primatives.texcoord
            },
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
        // texture images is loading. 
        if(this.texture === "loading") {
            return;
        }

        // tab the program
        this.gl.useProgram(this.program);

        // update matrix 
        this.createMatrix(matrix);
        
        // update buffer data
        this.createBuffer(this.primativeData);

       

        // texutre images loading done. active and bind texture.
        if( this.texture ) {
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        }
        
        // draw object.
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
    
        const wM = mat4.create();
        mat4.identity(wM);

       
        var i=0;
        mat4.mul(
            wM, 
            wM, 
            mat4.fromRotationTranslationScaleOrigin(
                mat4.create(),
                mat4.fromRotation(mat4.create(), glMatrix.toRadian(
                    this._rotate[i++]
                    ), 
                    [this._rotate[i++], this._rotate[i++], this._rotate[i++]
                ]), 
                this._position, 
                this._scale,
                [0,0,0]
            )
        );

        if( mat ) {
            mat4.mul(wM, wM, mat);
        }

        const nM = mat4.create();
        mat4.identity(nM);
        mat4.invert(nM, mat4.mul(mat4.create(), lM, wM));
        mat4.transpose(nM, nM);
       
        // this.matrix = vM;
        const u_ProjectionMatrix = this.gl.getUniformLocation(this.program, "u_ProjectionMatrix");
        const u_ViewMatrix = this.gl.getUniformLocation(this.program, "u_ViewMatrix");
        const u_WorldMatrix = this.gl.getUniformLocation(this.program, "u_WorldMatrix");
        const u_NormalMatrix = this.gl.getUniformLocation(this.program, "u_NormalMatrix");
        this.gl.uniformMatrix4fv(u_ProjectionMatrix, false, vM);
        this.gl.uniformMatrix4fv(u_ViewMatrix, false, lM);
        this.gl.uniformMatrix4fv(u_WorldMatrix, false, wM);
        this.gl.uniformMatrix4fv(u_NormalMatrix, false, nM);

    }

    // light up target
    lightUp = (lightColor: vec3, lightPosition: vec3, ambient: vec3, eyes: vec3): this => {
        const gl = this.gl, program = this.program;
        gl.useProgram(program);
        const u_LightUp = gl.getUniformLocation(program, "u_HasLight");
        const u_LightColor = gl.getUniformLocation(program, "u_LightColor");
        const u_LightPosition = gl.getUniformLocation(program, "u_LightPosition");
        const u_AmbientColor = gl.getUniformLocation(program, "u_AmbientColor");
        const u_EyesPosition = gl.getUniformLocation(program, "u_EyesPosition");
        gl.uniform3fv(u_LightColor, lightColor);
        gl.uniform3fv(u_LightPosition, lightPosition);
        gl.uniform3fv(u_AmbientColor, ambient);
        gl.uniform3fv(u_EyesPosition, eyes);
        gl.uniform1i(u_LightUp, 1);
        return this;
        
    };


    createTexture = (image: HTMLImageElement) => {
        const gl = this.gl;
        this.gl.useProgram(this.program);
        const u_Sampler = gl.getUniformLocation(this.program, "u_Sampler");

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        const texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);


        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.generateMipmap(gl.TEXTURE_2D);

        gl.uniform1i(u_Sampler, 0);
        const u_HasTexture = this.gl.getUniformLocation(this.program, "u_HasTexture");
        this.gl.uniform1i(u_HasTexture, 1);

        this.texture = texture;
        // return texture as WebGLTexture;
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

    lightUp(lightColor: vec3, lightPosition: vec3, ambient: vec3, eyes: vec3) {
        this.stuffs.forEach(element => {
            element.lightUp(lightColor, lightPosition, ambient, eyes);
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