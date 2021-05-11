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

`;

export const shadowVertexShader = `#version 300 es
    in vec4 a_Position;
    uniform mat4 u_MvpMatrix;

    void main() {
        gl_Position = u_MvpMatrix * a_Position;
    }

`;


export const shadowFragmentShader = `#version 300 es
    precision mediump float;
    out vec4 outColor;

    void main() {
        const vec4 bitShift = vec4(1.0, 256.0, 256.0*256.0, 256.0*256.0*256.0);
        const vec4 bitMask = vec4(1.0/256.0, 1.0/256.0, 1.0/256.0, 0.0);
        vec4 depth = fract(gl_FragCoord.z * bitShift);
        depth -= depth.gbaa * bitMask;
        outColor = depth;
    }
`;

export const normalVertexShader = `#version 300 es
    in vec4 a_Position;
    in vec4 a_Color;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_MatrixFromLight; 
    out vec4 v_PositionFromLight;
    out vec4 v_Color;
    void main() {
        gl_Position = u_MvpMatrix * a_Position;
        v_PositionFromLight = u_MatrixFromLight * a_Position;
        v_Color = a_Color;
    }

`;

export const normalFragmentShader = `#version 300 es
    precision mediump float;
    in vec4 v_PositionFromLight;
    in vec4 v_Color;
    out vec4 outColor;
    uniform sampler2D u_Samper;

    float unpackDepth(const in vec4 depth) {
        const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0*256.0), 1.0/(256.0*256.0*256.0));
        float result = dot(depth, bitShift);
        return result;
    }

    void main() {
        vec3 shadowCoord = (v_PositionFromLight.xyz / v_PositionFromLight.w) / 2.0 + 0.5;
        vec4 tex = texture(u_Samper, shadowCoord.xy);
        float depth = unpackDepth(tex);
        float visiable = (shadowCoord.z > depth + 0.0015) ? 0.7 : 1.0;
        outColor = vec4(v_Color.rgb * visiable, v_Color.a);
    }

`;