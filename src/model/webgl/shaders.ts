import { translateToWebglColor } from "../../common/base";

export const vertexShader = `#version 300 es
    in vec4 a_Position;
    in vec4 a_Color;
    in vec2 a_textureCoord;
    uniform mat4 u_textureMatrix;
    uniform mat4 u_ProjectionMatrix;
    uniform mat4 u_CameraMatrix;

    out vec4 v_texturePosition;
    out vec2 v_textureCoord;
    out vec4 v_Color;
    void main() {
        gl_Position = u_ProjectionMatrix * u_CameraMatrix * a_Position;
        // gl_PointSize = 10.0;

        v_texturePosition = u_textureMatrix * a_Position;

        v_Color = a_Color;
    }
`;

export const fragmentShader = `#version 300 es
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    in vec4 v_Color;
    in vec4 v_texturePosition;
    in vec2 v_textureCoord;
    out vec4 FragColor;
    uniform bool f_Line;

    uniform sampler2D u_texture;

    void main() {
        vec3 col = vec3(1.0);
        vec3 t = v_texturePosition.xyz / v_texturePosition.w;

        bool iRange = t.x >= 0.0 && t.x <= 1.0 && t.y >= 0.0 && t.y <= 1.0;
        vec3 col2 = texture(u_texture, t.xy).rgb;
        if(iRange) {
            FragColor = vec4(col2, 1.0);
        } else {
            FragColor = vec4(col, 1.0);
        }
        // float i = iRange ? 1.0 : 0.0;
       

        // // FragColor = vec4(mix(col, col2, i), 1.0);
        // FragColor = vec4(col2, 1.0);
    }
`;