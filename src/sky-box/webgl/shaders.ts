export const vertexShader = `#version 300 es
    in vec4 a_Position;
    in vec3 a_Normal;

    uniform mat4 u_ProjectionMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_Normal;
    // uniform mat4 u_NormalMatrix;
    uniform mat4 u_WorldMatrix;

    out vec3 v_Normal;
    out vec3 v_WorldPostion;
    
    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_WorldMatrix * a_Position;
        v_Normal = mat3(u_WorldMatrix) * a_Normal;
        v_WorldPostion = (u_WorldMatrix * a_Position).xyz;
    }
`;

export const fragmentShader = `#version 300 es
    precision highp float;
    in vec3 v_Normal;
    in vec3 v_WorldPostion;
    uniform vec3 u_CameraPosition;
    out vec4 FragColor;
    uniform samplerCube u_Sampler;
    void main() {
        vec3 normal = normalize(v_Normal);
        vec3 eyeToSurface = normalize(v_WorldPostion - u_CameraPosition);
        vec3 direction = reflect(eyeToSurface, normal);
        FragColor = texture(u_Sampler, direction);
    }
`;

export const vertex_box = `#version 300 es

    in vec4 a_Position;
    out vec4 v_Position;

    void main() {
        v_Position = a_Position;
        gl_Position = a_Position;
        gl_Position.z = 1.0;
    }
`;

export const frag_ment_box = `#version 300 es
    precision highp float;
    in vec4 v_Position;
    uniform mat4 u_viewDirectionProjectionInverse;
    out vec4 outColor;
    uniform samplerCube u_Sampler;
    void main() {
        vec4 t = u_viewDirectionProjectionInverse * v_Position;
        outColor = texture(u_Sampler, normalize(t.xyz / t.w));
    }

`