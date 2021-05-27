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
    in vec4 v_Color;
    out vec4 FragColor;

    void main() {
        FragColor = v_Color;
    }
`;

export const fb_vertexShader = `#version 300 es
    in vec4 a_Position;
    uniform mat4 u_Matrix;

    void main() {
        gl_Position = u_Matrix * a_Position;
    }
`;


export const fb_fragmentShader = `#version 300 es
    precision mediump float;
    out vec4 FragColor;
    uniform vec4 u_id;

    void main() {
        FragColor = u_id;
    }

`;