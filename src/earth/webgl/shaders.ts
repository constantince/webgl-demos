export const VERTEX_SHADER = `#version 300 es
    in vec4 a_Position;
    in vec2 a_TexCoord;
    out vec2 v_TexCoord;
    uniform mat4 u_WorldViewMatrix;
    uniform mat4 u_NormalMatrix;

    in vec4 a_Normal;
    out vec3 v_Normal;
    out vec4 v_WorldVertex;
    void main() {
        gl_Position = u_WorldViewMatrix * a_Position;
        v_WorldVertex = u_NormalMatrix * a_Position;
        v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
        v_TexCoord = a_TexCoord;

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

    uniform sampler2D u_Sampler;

    uniform vec3 u_LightReflectPosition;
    // 镜面反射因子
    const float a = 64.0;
    void main() {
        //vec3 normalDirection = normalize(v_Normal);

        vec3 lightDirection = normalize(u_LightReflectPosition - v_WorldVertex.xyz);

        float nDot = max(dot(lightDirection, v_Normal), 0.0);

        // 纹素
        vec4 tex = texture(u_Sampler, v_TexCoord);

        //环境光的颜色 A
        vec3 ambient = vec3(0.1, 0.1, 0.1) * tex.rgb;

        //vec3 Light = u_LightColor + ambient.rgb;

        //漫反射光 D
        vec3 diffuse = tex.rgb * u_LightColor * nDot;

        vec3 reflection = normalize(reflect(lightDirection, v_Normal));
        vec3 viewVectorEye = -v_WorldVertex.xyz;
        // 反射光线与法线的点积 l * n * cos()
        float sDot = max(dot(reflection, viewVectorEye), 0.0);
        // 镜面放射光 S
        float specularLightWeight = pow(sDot, a);

        // 镜面光线
        vec3 specularReflection =  tex.rgb * u_LightColor * specularLightWeight;

        

        // 最终的片元
        //outColor = tex;
        outColor = vec4(diffuse + ambient + specularReflection, tex.a);
    }
`;