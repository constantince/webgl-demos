export const vertextShaderRectangle = `#version 300 es
    in vec4 a_Position;
    in vec2 a_TexCoord;
    out vec2 v_TexCoord;
    uniform mat4 u_ProjectionViewMatrix;
    void main() {
        gl_Position = u_ProjectionViewMatrix * a_Position;
        v_TexCoord = a_TexCoord;
    }
`;

export const fragmentShaderRectangle = `#version 300 es
    precision mediump float;
    out vec4 outColor;
    in vec2 v_TexCoord;
    uniform sampler2D u_Sampler;
    void main() {
        outColor = texture(u_Sampler, v_TexCoord);
    }
`;

export const vertextShaderCube = `#version 300 es
    uniform mat4 u_ProjectionViewMatrix;
    in vec4 a_Position;
    in vec4 a_Color;
    out vec4 v_Color;

    void main() {
        gl_Position = u_ProjectionViewMatrix * a_Position;
        v_Color = a_Color;
    }
`;

export const fragmentShaderCube = `#version 300 es
    precision mediump float;
    in vec4 v_Color;
    out vec4 outColor;

    void main() {
        outColor = v_Color;
    }

`