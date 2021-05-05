//计算出立方体的各个点的位置
type VertexObjectsBuffer = {
    vertexs: Float32Array,
    color: Float32Array,
    pointer: Uint16Array,
    len: number
}

type NormalAndTexCoord = {
    normal: Float32Array,
    texcoord: Float32Array
}

function calculatePoints(): VertexObjectsBuffer {
    const vertexs = new Float32Array([
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
       -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
       -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
    ]);

    const color = new Float32Array([
        0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
       0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
       1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
       1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
       1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
       0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
    ]);

    const pointer = new Uint16Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
       12,13,14,  12,14,15,    // left
       16,17,18,  16,18,19,    // down
       20,21,22,  20,22,23     // back
    ]);

    return {vertexs, color, pointer, len: pointer.length};
}

export function calculateVertexSphere(RESOLUTION: number = 60, RADIUS: number = 1): VertexObjectsBuffer & NormalAndTexCoord {
    const theta = (180 / RESOLUTION) * (Math.PI / 180); // 疑问 
    const beta = (360 / RESOLUTION) * (Math.PI / 180); 
    let vertexs:number[] = [], pointer:number[] = [], normal:number[] = [], textures: number[] = [];
     for (let index = 0; index <= RESOLUTION; index++) {
         // 同等高度的Y值
        const y = Math.cos(theta * index);
        // 底边作为斜边的长度
        const d = Math.sin(theta * index);
        for (let index1 = 0; index1 <= RESOLUTION; index1++) {
            // 斜边的余弦即是x轴的距离
            const x = Math.cos(beta * index1) * d;
            // 斜边的正弦即是Z轴的距离
            const z = Math.sin(beta * index1) * d;

            var u = 1 - (index1 / RESOLUTION);
            var v = 1 - (index / RESOLUTION);
            vertexs.push(x * RADIUS);
            vertexs.push(y * RADIUS);
            vertexs.push(z * RADIUS);
            normal.push(x),
            normal.push(y);
            normal.push(z);
            textures.push(u);
            textures.push(v);
        }
     }

    /* 计算出顶点的位置为 [0, 1,..... 一个循环之后, RESOLUTION, RESOLUTION + 1]
     我们需要连接的是 0, 1, RESOLUTION 顶点的位置拼凑成一个三角形
    */
    for(var index = 0; index < Math.pow(RESOLUTION, 2); index ++)
    {
            pointer.push(index); // 本行第一个
            pointer.push(index + RESOLUTION + 1); // 下一行第一个
            pointer.push(index + 1); // 本行第二个

            pointer.push(index + 1); // 本行第二个
            pointer.push(index + RESOLUTION + 1); // 下一行第一个
            pointer.push(index + RESOLUTION + 2); // 下一行第二个

            //到此，一个四边形被拼凑成功

            // 划线只需要沿着精度和纬度连接每个点即可
            // linePointer.push(index);
            // linePointer.push(index + 1);
            // linePointer.push(index);
            // linePointer.push(index + RESOLUTION + 1);


    }    
    return {
        vertexs : new Float32Array( vertexs ),
        pointer: new Uint16Array( pointer ),
        color: new Float32Array([]),
        len: pointer.length,
        normal: new Float32Array(normal),
        texcoord: new Float32Array(textures)
    };
}

const VOB = {
    CubeVertex: calculatePoints,
    SphereVertex: calculateVertexSphere
}

export default VOB;