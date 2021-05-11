import { translateToWebglColor } from "../../common/base";

export const vertexShader = `#version 300 es
    in vec4 a_Position;
    in vec4 a_Normal;
    uniform mat4 u_Matrix;
    uniform mat4 u_Normal;

    out vec4 v_WorldPosition;
    out vec3 v_Normal;
    void main() {
        gl_Position = u_Matrix * a_Position;
        v_WorldPosition = u_Normal * a_Position;
        v_Normal = a_Normal;
    }
`;

export const fragmentShader = `#version 300 es
    precision mediump float;
    in vec4 v_WorldPosition;
    in vec4 v_Normal;
    
    uniform vec3 u_LightColor;
    uniform vec3 u_AmbientColor;
    uniform vec3 u_LightPostion;
    out vec4 FragColor;

    void main() {
        normal = normalize(v_Normal);
        vec3 lightDirection = normalize(u_LightPostion - v_WorldPosition.xyz);
        vec4 base = vec4(1.0, 1.0, 1.0, 1.0);
        float FDot = dot(lightDirection, normal);
        vec4 diffuse = u_LightColor * fDot * base.rgb;
        vec4 ambient = u_AmbientColor * base.rgb;

        FragColor = vec4(diffuse + ambient, base.a);
    }

`;

export const vertexShader1 = `#version 300 es
    in vec4 a_Position;
    in vec4 a_Color;
    uniform mat4 u_Matrix;
    void main() {
        gl_Position = u_Matrix * a_Position;
    }
`;

export const fragmentShader1 = `#version 300 es
    precision mediump float;
    out vec4 FragColor;

    void main() {
        FragColor = vec4(${translateToWebglColor('#754c0f').join(',')});
    }

`;