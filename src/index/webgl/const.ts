// 顶点着色器。
export const VERTEX_SHADER: string =`#version 300 es
    in vec4 a_Position;
    in vec4 a_Color;

    uniform mat4 u_ProjectionMatrix;
    uniform mat4 u_WorldMatrix;
    uniform mat4 u_RoateMatrix;

    out vec4 v_Color;
    void main() {
    gl_Position = u_ProjectionMatrix * u_WorldMatrix * u_RoateMatrix * a_Position;
    v_Color = a_Color;
}`;
// 片元着色器
export const FRAGMENT_SHADER: string = `#version 300 es
    precision mediump float;
    in vec4 v_Color;
    out vec4 outColor;
    void main() {
        outColor = v_Color;
}`;
