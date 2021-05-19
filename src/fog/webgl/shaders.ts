export const vertexShader = `#version 300 es
    in vec4 a_Position;
    in vec4 a_Color;
    // uniform mat4 u_Matrix;
    uniform mat4 u_ProjectionMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_WorldMatrix;

    out vec3 v_Depth;
    out vec4 v_Color;
    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_WorldMatrix * a_Position;
        v_Color = a_Color;
        // 线性雾化，只计算深度值
        // v_Depth = gl_Position.w; gl_FragCoord.z/ do the something
        // 原性雾化，计算试点的距离
        v_Depth = (u_WorldMatrix * a_Position).xyz;
    }
`;

export const fragmentShader = `#version 300 es
    precision mediump float;
    in vec4 v_Color;
    in vec3 v_Depth;
    out vec4 FragColor;
    uniform float u_FogFar;
    uniform float u_FogNear;
    // uniform float u_fogAmount;
    uniform float u_fogDensity;
    void main() {

        #define LOG2 1.4426945

        float fogDistance = length(v_Depth);
        // density equation;
        float fogAmount = 1. - exp2(-u_fogDensity * u_fogDensity * fogDistance * fogDistance * LOG2);
        fogAmount = clamp(fogAmount, 0., 1.);
        // float u_fogAmount = smoothstep(u_FogNear, u_FogFar, fogDistance);
        FragColor = mix(v_Color, vec4(0.0, 0.0, 0.0, 1), fogAmount);
    }
`;