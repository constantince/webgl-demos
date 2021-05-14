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
    uniform vec3 u_LightDirection;
    uniform float u_limit;
    out vec4 FragColor;
    const float shininess = 300.0;
    void main() {
        vec4 base = vec4(${translateToWebglColor('#421c01').join(',')});

        // surface to light
        vec3 lightDirection = normalize(u_LightPostion - v_WorldPosition.xyz);

        // surface to eye
        vec3 eyeDirection = normalize(u_EyesPosition - v_WorldPosition.xyz);

        vec3 halfVector = normalize(lightDirection + eyeDirection);

        float light = 0.0;
        float specularLightWeight = 0.0;
        float dotFromDirection = dot(lightDirection, -u_LightDirection);

        // if( dotFromDirection >= u_limit) {
            light = max(dot(lightDirection, v_Normal), 0.0);
            if (light > 0.0) {
                specularLightWeight = pow(dot(v_Normal, halfVector), shininess);
            }
        // }       
    
        FragColor = base;

        FragColor.rgb *= light;

        FragColor.rgb += specularLightWeight;

    }

`;