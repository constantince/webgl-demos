export const vertexShader2Demension = `#version 300 es
    in vec4 a_Position;
    in vec4 a_Color;
    out vec4 v_Color;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
        v_Color = a_Color;
    }
`;

export const fragmentShader2Demension = `#version 300 es
    precision mediump float;
    in vec4 v_Color;
    out vec4 outColor;
    void main() {
        outColor = v_Color;
    }
`;

export const vertexShader3Demension = `#version 300 es
    in vec4 a_Position;
    in vec4 a_Color;
    uniform mat4 u_Matrix;

    out vec4 v_Color;
    void main() {
        gl_Position = u_Matrix * a_Position;
        v_Color = a_Color;
    }
`;

export const fragmentShader3Demension = `#version 300 es
    precision mediump float;
    in vec4 v_Color;
    out vec4 FragColor;

    void main() {
        FragColor = v_Color;
    }
`;