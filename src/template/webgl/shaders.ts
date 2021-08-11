import { translateToWebglColor } from "../../common/base";

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
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    in vec4 v_Color;
    out vec4 FragColor;
    uniform bool f_Line;
    void main() {
        FragColor = v_Color;
    }
`;