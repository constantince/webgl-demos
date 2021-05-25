export const vertexShader = `#version 300 es
    in vec4 a_Position;
    in vec4 a_Color;
    in vec2 a_TexCoord;

    uniform mat4 u_Matrix;

    out vec4 v_Color;
    out vec2 v_TexCoord;
    void main() {
        gl_Position = u_Matrix * a_Position;
        // v_Color = a_Color;
        v_TexCoord = a_TexCoord;
    }
`;

export const fragmentShader = `#version 300 es
    precision mediump float;
    in vec4 v_Color;
    out vec4 FragColor;

    uniform sampler2D u_Sampler;
    in vec2 v_TexCoord;
    void main() {
        FragColor = texture(u_Sampler, v_TexCoord);
    }
`;