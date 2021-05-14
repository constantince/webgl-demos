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
        v_WorldPosition = u_ModelMatrix * a_Position;
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
    uniform vec3 u_EyesPosition;
    out vec4 FragColor;
    const float shininess = 300.0;
    void main() {
        vec4 base = vec4(${translateToWebglColor('#421c01').join(',')});

        // surface to light
        vec3 lightDirection = normalize(u_LightPostion - v_WorldPosition.xyz);

        // surface to eye
        vec3 eyeDirection = normalize(u_EyesPosition - v_WorldPosition.xyz);

        vec3 halfVector = normalize(lightDirection + eyeDirection);

        float light = max(dot(lightDirection, v_Normal), 0.0);
        float specularLightWeight = 0.0;
        if (light > 0.0) {
           specularLightWeight = pow(dot(v_Normal, halfVector), shininess);
        }

        // 环境光线A
        vec3 ambient = u_AmbientColor * base.rgb;
        //漫反射光线D
        vec3 diffuse = u_LightColor * light * base.rgb;
        //镜面光线S
        vec3 specularReflection = u_LightColor * specularLightWeight;
       
        
        vec3 c = diffuse + specularReflection + ambient;
        
        FragColor = vec4(c, 1.0);

        // FragColor = base;

        // FragColor.rgb *= u_LightColor;

        // FragColor.rgb += u_LightColor * u_AmbientColor;

        // FragColor.rgb += u_AmbientColor;

        // FragColor.rgb *= light;

        // FragColor.rgb += specularLightWeight;

       
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