import { translateToWebglColor } from "../../common/base";

export const vertexShader = `#version 300 es
    in vec4 a_Position;
    uniform mat4 u_Matrix;

    out vec4 v_Color;
    void main() {
        gl_Position = u_Matrix * a_Position;
        gl_PointSize = 5.0;

    }
`;

export const fragmentShader = `#version 300 es
    precision mediump float;
    in vec4 v_Color;
    out vec4 FragColor;
    uniform bool f_Line;
    void main() {
        if( f_Line ) {
            FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        } else {
            FragColor = vec4(${translateToWebglColor("#c4ffce").join(",")});
        }
        
    }
`;