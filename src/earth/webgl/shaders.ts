export const VERTEX_SHADER = `#version 300 es
    in vec4 a_Position;
    in vec2 a_TexCoord;
    uniform mat4 u_WorldViewMatrix;
    uniform mat4 u_NormalMatrix;

    in vec4 a_Normal;
    out vec3 v_Normal;
    out vec4 v_WorldVertex;
    void main() {
        gl_Position = u_WorldViewMatrix * a_Position;
        v_WorldVertex = u_NormalMatrix * a_Position;
        v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
        //v_TexCoord = a_TexCoord;

    }

`;


export const FRAGMENT_SHADER = `#version 300 es
    precision mediump float;
    out vec4 outColor;
    in vec2 v_TexCoord;
    in vec4 v_WorldVertex;
    in vec3 v_Normal;

    uniform vec3 u_LightPosition;
    uniform vec3 u_LightColor;

    void main() {
        //vec3 normalDirection = normalize(v_Normal);

        vec3 lightDirection = normalize(u_LightPosition - v_WorldVertex.xyz);

        float nDot = max(dot(lightDirection, v_Normal), 0.0);

        // 纹素
        vec4 tex = vec4(1.0, 0.0, 0.0, 1.0);

        //光的颜色
        vec4 ambient = vec4(0.7, 0.7, 0.2, 1.0);

        vec3 Light = u_LightColor + ambient.rgb;

        //漫反射光
        vec3 diffuse = tex.rgb * Light * nDot;

        // 环境光
        

        // 最终的颜色
        outColor = vec4(diffuse, 1.0);
    }
`;