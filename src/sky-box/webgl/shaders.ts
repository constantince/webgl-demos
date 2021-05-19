export const vertexShader = `#version 300 es
    uniform mat4 u_Matrix;
    out vec3 v_normal;
    in vec4 a_Position;
    void main() {
        gl_Position = u_Matrix * a_Position;
        v_normal = normalize(a_Position.xyz);
    }
`;

export const fragmentShader = `#version 300 es
    precision mediump float;
    in vec3 v_normal;
    out vec4 FragColor;
    uniform samplerCube u_Sampler;
    void main() {
        FragColor = texture(u_Sampler, normalize(v_normal));
    }
`;