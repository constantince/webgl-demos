import { translateToWebglColor } from "../../common/base";

export const vertexShader = `#version 300 es
    in vec4 a_Position;
    in vec4 a_Normal;
    uniform mat4 u_Matrix;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_NormalMatrix;

    out vec4 v_WorldPosition;
    out vec3 v_Normal;
    void main() {
        gl_Position = u_Matrix * a_Position;
        v_WorldPosition = u_NormalMatrix * a_Position;
        v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
    }
`;

export const fragmentShader = `#version 300 es
    precision mediump float;
    in vec4 v_WorldPosition;
    in vec3 v_Normal;
    
    uniform vec3 u_LightColor;
    uniform vec3 u_AmbientColor;
    uniform vec3 u_LightPostion;
    out vec4 FragColor;
    const float shiness = 32.0;
    void main() {
        // vec3 normal = normalize(v_Normal);
        vec3 lightDirection = normalize(u_LightPostion - v_WorldPosition.xyz);
        vec4 base = vec4(${translateToWebglColor('#421c01').join(',')});
        float Fdot = max(dot(lightDirection, v_Normal), 0.0);

        vec3 reflection = normalize(reflect(lightDirection, v_Normal));
        // 反射光线与法线的点积 l * n * cos()
        float sDot = max(dot(reflection, -v_WorldPosition.xyz), 0.0);
        // 镜面放射光 S
        float specularLightWeight = pow(sDot, shiness);


        // 环境光线A
        vec3 ambient = u_AmbientColor;
        // 漫反射光线D
        vec3 diffuse = u_LightColor * Fdot;
        // 镜面光线S
        vec3 specularReflection =  u_LightColor * specularLightWeight;
       
        
        vec3 c = ( diffuse + ambient + specularReflection ) * base.rgb;

        FragColor = vec4(c, base.a);
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
        FragColor = vec4(${translateToWebglColor('#421c01').join(',')});
    }

`;

export const vertexShader2 = `#version 300 es
    in vec4 a_Position;
    in vec4 a_Color;
    uniform mat4 u_Matrix;
    void main() {
        gl_Position = u_Matrix * a_Position;
    }
`;

export const fragmentShader2 = `#version 300 es
    precision mediump float;
    out vec4 FragColor;

    void main() {
        FragColor = vec4(${translateToWebglColor('#212120').join(',')});
    }

`;