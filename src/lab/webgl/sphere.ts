import { glMatrix, mat4, vec2, vec3 } from "gl-matrix";
import { initBuffer, initShader, rotation } from "../../common/base";
import { calculateVertexSphere, createCubeMesh } from "../../common/primative";
import { vertex_box, frag_ment_box } from "./shaders";
export const vertexShader = `#version 300 es
    layout(location=0) in vec4 a_Position;
    layout(location=1) in vec4 b_Position;
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
    precision lowp sampler3D;
    uniform sampler3D Noise;
    in vec4 v_Color;
    in vec2 v_TexCoord;
    in vec3 v_Normal;
    in vec4 v_WorldPosition;

   
    // uniform sampler2D u_Sampler;

    
    uniform bool f_Line;
    uniform bool u_hasTexture;
    uniform bool u_hasLight;    

    uniform vec3 u_LightPosition;
    uniform vec3 u_LightColor;
    uniform vec3 u_AmbientColor;

    uniform vec2 u_resoslution;
    uniform float u_time;
    float random(vec2 uv) {
        return fract ( sin(uv.x * 100. + uv.y * 6500.) * 5667.);
    }
    
    float SmoothNoise(vec2 uv) {
        vec2 lv =fract(uv);
        vec2 id = floor(uv);
         lv  = lv*lv*(3.- 2. * lv);
        float bl = random(id);
        float br = random(id + vec2(1., 0.));
        float b = mix(bl, br, lv.x);
    
        float tl = random(id + vec2(0., 1.));
        float tr = random(id + vec2(1., 1.));
        float t = mix(tl, tr, lv.x);
    
        return mix(b, t, lv.y);
    }
    
    float SoomthNoise2(vec2 uv) {
    
        float c = SmoothNoise(uv * 4.);
        c += SmoothNoise(uv * 8.) * .5;
        c += SmoothNoise(uv * 16.) * .25;
        c += SmoothNoise(uv *32.) * .125;
        c += SmoothNoise(uv *64.) * .0625;
    
        return c /= 2.;
    
    }
   


    out vec4 FragColor;
    void main() {
        vec3 normal = normalize(v_Normal);
        vec3 lightDirection = normalize(u_LightPosition - v_WorldPosition.xyz);
        // vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
        float fDot = max(dot(normal, lightDirection), 0.0);

        // vec3 diffuse = u_LightColor * v_Color.rgb * fDot;
        // vec3 ambient = u_AmbientColor * v_Color.rgb;

        // vec3 color = diffuse;
        // FragColor = vec4(diffuse + ambient, v_Color.a);
        vec2 uv = v_WorldPosition.yz;
        // uv += u_time * .0001;
        float c = SoomthNoise2(uv);
        vec3 color1 = vec3(c);
        vec3 color = vec3(1.0, 0., 0.);
        color *= color1;
        FragColor = vec4(color, 1.0);
  
    }
`;


// Please check your code again carefully before excuting for avoid the basic luogic and tiny program;
export function main_sphere(id: string) {
    const canvas = <HTMLCanvasElement>document.getElementById(id);
    const webgl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    webgl.clearColor(0.0, 0.0, 0.0, 1.0);
    webgl.enable(webgl.DEPTH_TEST);

    const { normal, count, color, vertex, pointer} = calculateVertexSphere(10)
    
    
    
    const program = initShader(webgl, vertexShader, fragmentShader);

    if( program ) {
        
        webgl.useProgram(program);
        initBuffer(webgl, program, vertex, "a_Position", 3, false);
        initBuffer(webgl, program, color, "a_Color", 3, false);
        initBuffer(webgl, program, normal, "a_Normal", 3, false);
        initBuffer(webgl, program, pointer, null, null, webgl.ELEMENT_ARRAY_BUFFER);
        lightUp(webgl, program, [1.0, 1.0, 1.0], [-10, -4.0, -3.5], [0.2, 0.2, 0.2]);

        const tick = (time:number) => {
            const a = rotation(0, 45);
            createMatrix(webgl, program, time, a);
            webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
            webgl.drawElements(webgl.TRIANGLES, count, webgl.UNSIGNED_SHORT, 0);
            window.requestAnimationFrame(tick);
        }
        window.requestAnimationFrame(tick);
        
    }
}

// create default matrix;
const createMatrix = (gl: WebGL2RenderingContext, program: WebGLProgram, time: number, angle: number) => {

    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(30), 1, 1, 1000);


    const lM = mat4.create();
    mat4.identity(lM);
    mat4.lookAt(lM, [1.0, 3.0, 7.0], [0, 0, 0], [0, 1, 0]);


    const wM = mat4.create();
    mat4.identity(wM);
    mat4.rotate(wM, wM, glMatrix.toRadian(angle), [0, 1, 0])

    const nM = mat4.create();
    mat4.identity(nM);
    mat4.invert(nM, wM);
    mat4.transpose(nM, nM);
    
    // this.matrix = vM;
    const u_ProjectionMatrix =gl.getUniformLocation(program, "u_ProjectionMatrix");
    const u_ViewMatrix =gl.getUniformLocation(program, "u_ViewMatrix");
    const u_WorldMatrix =gl.getUniformLocation(program, "u_WorldMatrix");
    const u_NormalMatrix =gl.getUniformLocation(program, "u_NormalMatrix");
    const u_time = gl.getUniformLocation(program, "u_time");
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, vM);
    gl.uniformMatrix4fv(u_ViewMatrix, false, lM);
    gl.uniformMatrix4fv(u_WorldMatrix, false, wM);
    gl.uniformMatrix4fv(u_NormalMatrix, false, nM);
    gl.uniform1f(u_time, time);

}

// light up target
const lightUp = (gl: WebGL2RenderingContext, program: WebGLProgram, lightColor: number[], lightPosition: number[], ambient: number[]) => {
    const m = vec3.fromValues(1.0, 8.0, 1.0);
    vec3.normalize(m, m);

    const k = vec3.fromValues(10.0, 0.0, 0.0);
    vec3.normalize(k, k);

    const z = vec3.fromValues(0.1, 0.1, 0.1);
    vec3.normalize(z, z);
    const u_LightColor = gl.getUniformLocation(program, "u_LightColor");
    const u_LightPosition = gl.getUniformLocation(program, "u_LightPosition");
    const u_AmbientColor = gl.getUniformLocation(program, "u_AmbientColor");
    const u_resoslution = gl.getUniformLocation(program, "u_resoslution");
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    gl.uniform3f(u_LightPosition, 10.0, 8.0, 0.0);
    gl.uniform3f(u_AmbientColor, 0.1, 0.1, 0.1);
    gl.uniform2f(u_resoslution, gl.canvas.width, gl.canvas.height);
};