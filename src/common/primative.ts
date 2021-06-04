//计算出立方体的各个点的位置
export type VertexObjectsBuffer = {
	vertex: Float32Array;
	color: Float32Array;
	pointer: Uint16Array;
	count: number;
};

type NormalAndTexCoord = {
	normal: Float32Array;
	texcoord: Float32Array;
};

type Demention2 = {
	vertex: Float32Array;
	color: Float32Array;
	count: number;
};

export type Demention3 = Demention2 & {
	pointer: Uint16Array,
	normal: Float32Array,
	texcoord: Float32Array
}

const EMPTYFLOATARRAY = new Float32Array([]);

//create point
export function calculatePoint(): Demention2 {
	const vertex = new Float32Array([0.0, 0.0, 0.0]);

	return {vertex, color: EMPTYFLOATARRAY, count: 0};
}

// create triangle
export function createTriangleMesh(): Demention2 {
	const vertex = new Float32Array([0.5, 0.0, 0.0, -0.5, 0.0, 0.0, 0.0, 0.5, 0.0]);

	const color = new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]);

	return {vertex, color, count: 0};
}

// create line
export function createLineMesh(): Demention2 {
	const vertex = new Float32Array([0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.4, 0.35, 0.0, 0.1, 0.6, 0.0]);

	const color = new Float32Array([1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]);
	return {vertex, color, count: 0};
}

// create rectangle
export function createRectangleMesh(): Demention2 {
	//在webgl中定义好四个点的位置
	const vertex = new Float32Array([ 
		0.0, 0.35, 0.0,
		0.0, 0.0, 0.0,
		0.35, 0.35, 0.0,
		0.35, 0.0, 0.0
	]);

	const color = new Float32Array([1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]);

	return {vertex, color, count: 4};
}

// create Star
export function createStarMesh(): Demention2 {
	//一共十个点
	const counts = 10,
		// 最远的点和最短的点到中心的距离
		radius = 0.45,
		min_radis = 0.25,
		//将夹角转换成弧度
		radiation = (Math.PI / 180) * (360 / 10),
		//中心位置
		center = [0.0, 0.0];

	let vertexs: number[] = center;
	let color: number[] = [1.0, 1.0, 0.0];
	for (let index = 0; index <= counts; index++) {
		// 顶点的位置
		let x = Math.sin(radiation * index) * radius;
		let y = Math.cos(radiation * index) * radius;
		// 内圈顶点的位置
		if (index % 2 === 0) {
			x = Math.sin(radiation * index) * min_radis;
			y = Math.cos(radiation * index) * min_radis;
		}
		vertexs.push(x);
		vertexs.push(y);
		color.push(...[1.0, 1.0, 0.0]);
	}

	return {
		vertex: new Float32Array(vertexs),
		color: new Float32Array(color),
		count: counts + 2,
	};
}

// create circle
export function createCircleMesh(resolution: number, radius: number): Demention2 {
	//将夹角转换成弧度
	const radiation = (Math.PI / 180) * (360 / resolution),
		//中心位置
		center = [0.0, 0.0];
	let vertexs: number[] = center;
	let color: number[] = [0.0, 0.0, 1.0];
	for (let index = 0; index <= resolution; index++) {
		let x = Math.sin(radiation * index) * radius;
		let y = Math.cos(radiation * index) * radius;
		vertexs.push(x);
		vertexs.push(y);
		color.push(0.0, 0.0, 1.0);
	}
	return {
		vertex: new Float32Array(vertexs),
		count: resolution + 2,
		color: new Float32Array(color),
	};
}

// create cube
export function createCubeMesh():Demention3 {
	const vertex = new Float32Array([
		1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
		1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
		1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
		-1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
		-1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
		1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
	]);

	const color = new Float32Array([
		0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
		0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
		1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
		1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
		1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
		0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
	]);

	const normal = new Float32Array([
		0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
		1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
		0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
	   -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
		0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
		0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
	]);

	const pointer = new Uint16Array([
		0, 1, 2,   0, 2, 3,    // front
		4, 5, 6,   4, 6, 7,    // right
		8, 9,10,   8,10,11,    // up
	   12,13,14,  12,14,15,    // left
	   16,17,18,  16,18,19,    // down
	   20,21,22,  20,22,23     // back
	]);

	const texcoord = new Float32Array([
		1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
		0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
		1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
		1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
		0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
		0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
	])

	return {
		vertex, color, pointer, count: pointer.length, normal, texcoord
	}
}

// create cube
export function calculatePoints(): VertexObjectsBuffer & {normals: Float32Array} {
	const vertexs = new Float32Array([
		1.0,
		1.0,
		1.0,
		-1.0,
		1.0,
		1.0,
		-1.0,
		-1.0,
		1.0,
		1.0,
		-1.0,
		1.0, // v0-v1-v2-v3 front
		1.0,
		1.0,
		1.0,
		1.0,
		-1.0,
		1.0,
		1.0,
		-1.0,
		-1.0,
		1.0,
		1.0,
		-1.0, // v0-v3-v4-v5 right
		1.0,
		1.0,
		1.0,
		1.0,
		1.0,
		-1.0,
		-1.0,
		1.0,
		-1.0,
		-1.0,
		1.0,
		1.0, // v0-v5-v6-v1 up
		-1.0,
		1.0,
		1.0,
		-1.0,
		1.0,
		-1.0,
		-1.0,
		-1.0,
		-1.0,
		-1.0,
		-1.0,
		1.0, // v1-v6-v7-v2 left
		-1.0,
		-1.0,
		-1.0,
		1.0,
		-1.0,
		-1.0,
		1.0,
		-1.0,
		1.0,
		-1.0,
		-1.0,
		1.0, // v7-v4-v3-v2 down
		1.0,
		-1.0,
		-1.0,
		-1.0,
		-1.0,
		-1.0,
		-1.0,
		1.0,
		-1.0,
		1.0,
		1.0,
		-1.0, // v4-v7-v6-v5 back
	]);

	const color = new Float32Array([
		0.4,
		0.4,
		1.0,
		0.4,
		0.4,
		1.0,
		0.4,
		0.4,
		1.0,
		0.4,
		0.4,
		1.0, // v0-v1-v2-v3 front(blue)
		0.4,
		1.0,
		0.4,
		0.4,
		1.0,
		0.4,
		0.4,
		1.0,
		0.4,
		0.4,
		1.0,
		0.4, // v0-v3-v4-v5 right(green)
		1.0,
		0.4,
		0.4,
		1.0,
		0.4,
		0.4,
		1.0,
		0.4,
		0.4,
		1.0,
		0.4,
		0.4, // v0-v5-v6-v1 up(red)
		1.0,
		1.0,
		0.4,
		1.0,
		1.0,
		0.4,
		1.0,
		1.0,
		0.4,
		1.0,
		1.0,
		0.4, // v1-v6-v7-v2 left
		1.0,
		1.0,
		1.0,
		1.0,
		1.0,
		1.0,
		1.0,
		1.0,
		1.0,
		1.0,
		1.0,
		1.0, // v7-v4-v3-v2 down
		0.4,
		1.0,
		1.0,
		0.4,
		1.0,
		1.0,
		0.4,
		1.0,
		1.0,
		0.4,
		1.0,
		1.0, // v4-v7-v6-v5 back
	]);

	var normals = new Float32Array([
		// Normal
		0.0,
		0.0,
		1.0,
		0.0,
		0.0,
		1.0,
		0.0,
		0.0,
		1.0,
		0.0,
		0.0,
		1.0, // v0-v1-v2-v3 front
		1.0,
		0.0,
		0.0,
		1.0,
		0.0,
		0.0,
		1.0,
		0.0,
		0.0,
		1.0,
		0.0,
		0.0, // v0-v3-v4-v5 right
		0.0,
		1.0,
		0.0,
		0.0,
		1.0,
		0.0,
		0.0,
		1.0,
		0.0,
		0.0,
		1.0,
		0.0, // v0-v5-v6-v1 up
		-1.0,
		0.0,
		0.0,
		-1.0,
		0.0,
		0.0,
		-1.0,
		0.0,
		0.0,
		-1.0,
		0.0,
		0.0, // v1-v6-v7-v2 left
		0.0,
		-1.0,
		0.0,
		0.0,
		-1.0,
		0.0,
		0.0,
		-1.0,
		0.0,
		0.0,
		-1.0,
		0.0, // v7-v4-v3-v2 down
		0.0,
		0.0,
		-1.0,
		0.0,
		0.0,
		-1.0,
		0.0,
		0.0,
		-1.0,
		0.0,
		0.0,
		-1.0, // v4-v7-v6-v5 back
	]);

	const pointer = new Uint16Array([
		0,
		1,
		2,
		0,
		2,
		3, // front
		4,
		5,
		6,
		4,
		6,
		7, // right
		8,
		9,
		10,
		8,
		10,
		11, // up
		12,
		13,
		14,
		12,
		14,
		15, // left
		16,
		17,
		18,
		16,
		18,
		19, // down
		20,
		21,
		22,
		20,
		22,
		23, // back
	]);

	return {vertex: vertexs, color, pointer, normals, count: pointer.length};
}

// create sphere
export function calculateVertexSphere(
	RESOLUTION: number = 60,
	RADIUS: number = 1,
): VertexObjectsBuffer & NormalAndTexCoord {
	const theta = (180 / RESOLUTION) * (Math.PI / 180); // 疑问
	const beta = (360 / RESOLUTION) * (Math.PI / 180);
	let vertexs: number[] = [],
		pointer: number[] = [],
		normal: number[] = [],
		textures: number[] = [],
		colors: number[] = [];
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

			var u = 1 - index1 / RESOLUTION;
			var v = 1 - index / RESOLUTION;
			vertexs.push(x * RADIUS, y * RADIUS, z * RADIUS);
			colors.push(1.0, 1.0, 1.0);
			normal.push(x, y, z);
			textures.push(u, v);
		}
	}

	/* 计算出顶点的位置为 [0, 1,..... 一个循环之后, RESOLUTION, RESOLUTION + 1]
     我们需要连接的是 0, 1, RESOLUTION 顶点的位置拼凑成一个三角形
    */
	for (var index = 0; index < Math.pow(RESOLUTION, 2); index++) {
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
		vertex: new Float32Array(vertexs),
		pointer: new Uint16Array(pointer),
		color: new Float32Array(colors),
		count: pointer.length,
		normal: new Float32Array(normal),
		texcoord: new Float32Array(textures),
	};
}

export function test() { // Create a sphere
	var SPHERE_DIV = 13;
  
	var i, ai, si, ci;
	var j, aj, sj, cj;
	var p1, p2;
  
	var positions = [];
	var indices = [];
	var colors = [];
  
	// Generate coordinates
	for (j = 0; j <= SPHERE_DIV; j++) {
	  aj = j * Math.PI / SPHERE_DIV;
	  sj = Math.sin(aj);
	  cj = Math.cos(aj);
	  for (i = 0; i <= SPHERE_DIV; i++) {
		ai = i * 2 * Math.PI / SPHERE_DIV;
		si = Math.sin(ai);
		ci = Math.cos(ai);
  
		positions.push(si * sj);  // X
		positions.push(cj);       // Y
		positions.push(ci * sj);  // Z

		colors.push(1.0, 1.0, 1.0);
	  }
	}
  
	// Generate indices
	for (j = 0; j < SPHERE_DIV; j++) {
	  for (i = 0; i < SPHERE_DIV; i++) {
		p1 = j * (SPHERE_DIV+1) + i;
		p2 = p1 + (SPHERE_DIV+1);
  
		indices.push(p1);
		indices.push(p2);
		indices.push(p1 + 1);
  
		indices.push(p1 + 1);
		indices.push(p2);
		indices.push(p2 + 1);
	  }
	}
  
	return {
		vertex: new Float32Array(positions),
		pointer: new Uint16Array(indices),
		color: new Float32Array(colors),
		count: indices.length,
		normal: new Float32Array(positions),
		texcoord: new Float32Array([]),
	};
  }

// create cylinder
//计算出圆柱体以及表面线条的各个点的位置
export function calculateCylinder_bak(height: number, radiusB: number, radiusT: number, empty: boolean) {
	//高，顶面圆中心点位置，粗细，分辨率，底面圆中心位置
	const HEIGHT = height,
		TOP = [0, HEIGHT, 0],
		RESOLUTION = 50,
		BOTTOM = [0, -1, 0],
		theta = ((360 / RESOLUTION) * Math.PI) / 180;
	let vertexs: number[] = [];
	let normal: number[] = [];
	let color: number[] = [];
	// 分别计算出上下表面圆边上的点
	for (let index = 0; index < RESOLUTION; index++) {
		// top circle
		const x = Math.cos(theta * index) * radiusB;
		const z = Math.sin(theta * index) * radiusB;
		// bottom circle
		const x1 = Math.cos(theta * index) * radiusT;
		const z1 = Math.sin(theta * index) * radiusT;

		vertexs.push(x, HEIGHT, z, x1, -1, z1);
		color.push(1.0, 0.0, 0.0, 0.0, 1.0, 0.0);
		normal.push(x, HEIGHT, z, x1, -1, z1);
	}
	// 其他点1~resolution 底部中心点的位置 resolution + 1; 顶点位置 resolution，
	vertexs.push(...BOTTOM, ...TOP);

	let pointer: number[] = [];
	// //斜边
	for (let index = 0; index < RESOLUTION * 2; index++) {
		pointer.push(index); // 顶部点的位；
		/* 通过 % 实现当Y Z大于resultion的时候取绝对值，实现点位的循环。
        如：x =40 时 x 为 0  或者x = 41时，x 为 1；
        因为矩形的最后一个三角面点需要和第一个点和第二个点进行合并。
        */
		pointer.push((index + 1) % (RESOLUTION * 2), (index + 2) % (RESOLUTION * 2));
	}
	if (empty === false) {
		let linePointer = [];
		for (let index = 1; index <= RESOLUTION * 2; index = index + 2) {
			// 第一条线
			linePointer.push(2 * RESOLUTION + 1); // 上表面中心
			linePointer.push(index); // 上表面边上的一点
			// // 第二条线
			linePointer.push(index); //上表面边上的一点
			linePointer.push(index + 1); //下表面边上的一点
			// // 第三条线
			linePointer.push(index); //下表面边上的一点
			linePointer.push(2 * RESOLUTION); // 下表面中心
		}
		//底边
		for (let index = 0; index < RESOLUTION; index++) {
			const step = (2 * index + 1) % (2 * RESOLUTION);
			const step2 = (2 * (index + 1) + 1) % (2 * RESOLUTION);
			// 永远是底部中心点开始的
			pointer.push(step);
			pointer.push(RESOLUTION + 1); // 顶部中心点的在vertexs中的位置 即 1 + RESOLUTION
			pointer.push(step2);
		}

		//顶边
		for (let index = 0; index < RESOLUTION; index++) {
			const step = (2 * index + 2) % (2 * RESOLUTION);
			const step2 = (2 * (index + 2)) % (2 * RESOLUTION);
			// 永远是底部中心点开始的
			pointer.push(step);
			pointer.push(RESOLUTION); // 底部中心点的在vertexs中的位置 即 RESOLUTION
			pointer.push(step2);
		}
	}

	const vertexsArray = new Float32Array(vertexs);
	const pointerArray = new Uint16Array(pointer);
	const normalArray = new Float32Array(normal);
	const colorArray = new Float32Array(color);

	return {vertexsArray, pointerArray, len: pointerArray.length, normalArray, colorArray};
}

export function calculateCylinder() {
	var h = 1,
		r1 = 0.5,
		r2 = 0.2,
		nPhi = 100;
	var pt = [],
		nt = [];
	var Phi = 0,
		dPhi = (2 * Math.PI) / (nPhi - 1),
		Nx = r1 - r2,
		Ny = h,
		N = Math.sqrt(Nx * Nx + Ny * Ny);
	Nx /= N;
	Ny /= N;
	for (var i = 0; i < nPhi; i++) {
		var cosPhi = Math.cos(Phi);
		var sinPhi = Math.sin(Phi);
		var cosPhi2 = Math.cos(Phi + dPhi / 2);
		var sinPhi2 = Math.sin(Phi + dPhi / 2);
		pt.push(-h / 2, cosPhi * r1, sinPhi * r1); // points
		nt.push(Nx, Ny * cosPhi, Ny * sinPhi); // normals
		pt.push(h / 2, cosPhi2 * r2, sinPhi2 * r2); // points
		nt.push(Nx, Ny * cosPhi2, Ny * sinPhi2); // normals
		Phi += dPhi;
	}

	const vertexsArray = new Float32Array(pt);
	// const pointerArray = new Uint16Array(pointer);
	const normalArray = new Float32Array(nt);

	return {
		vertexsArray,
		normalArray,
		len: 2 * nPhi,
	};
}

export function newCylinder() {
	var h = 1,
		r1 = 0.5,
		r2 = 0.2,
		nPhi = 100;
	var pt = [],
		nt = [];
	var Phi = 0,
		dPhi = (2 * Math.PI) / (nPhi - 1),
		Nx = r1 - r2,
		Ny = h,
		N = Math.sqrt(Nx * Nx + Ny * Ny);
	Nx /= N;
	Ny /= N;
	for (var i = 0; i < nPhi; i++) {
		var cosPhi = Math.cos(Phi);
		var sinPhi = Math.sin(Phi);
		var cosPhi2 = Math.cos(Phi + dPhi / 2);
		var sinPhi2 = Math.sin(Phi + dPhi / 2);
		pt.push(-h / 2, cosPhi * r1, sinPhi * r1); // points
		nt.push(Nx, Ny * cosPhi, Ny * sinPhi); // normals
		pt.push(h / 2, cosPhi2 * r2, sinPhi2 * r2); // points
		nt.push(Nx, Ny * cosPhi2, Ny * sinPhi2); // normals
		Phi += dPhi;
	}

	const vertexsArray = new Float32Array(pt);
	// const pointerArray = new Uint16Array(pointer);
	const normalArray = new Float32Array(nt);

	return {
		vertexsArray,
		normalArray,
		len: 2 * nPhi,
	};
}

export function ConeMesh() {
		const HEIGHT = 0.5,
		TOP = [0, HEIGHT, 0], RADIUS = 0.5, RESOLUTION = 30, BOTTOM = [0, -0.5, 0],
		theta = 360 / RESOLUTION * Math.PI / 180;
		let vertexs:number[] = TOP;
		let color:number[] = [];
		for (let index = 0; index < RESOLUTION; index++) {
			vertexs.push(Math.cos(theta * index) * RADIUS, -0.5, Math.sin(theta * index) * RADIUS);
			color.push(1.0, 0.0, 0.0);
		}
		// 顶点位置0，其他点1~resolution 底部中心点的位置 resolution + 1;
		vertexs.push(...BOTTOM);
		color.push(1.0, 0.0, 0.0, 1.0, 0.0, 0.0,);
		let pointer:number[] = [];
		//斜边
		for (let index = 0; index < RESOLUTION; index++) {
			//永远是第一个顶点开始的
			pointer.push(0, 1 + (index % RESOLUTION), 1 + ((index+1) % RESOLUTION)); // 顶部点的位置，在 0；
		}
		//底边
		for (let index = 0; index < RESOLUTION; index++) {
			// 永远是底部中心点开始的
			pointer.push(RESOLUTION + 1, 1 + (index % RESOLUTION), 1 + ((index+1) % RESOLUTION));// 底部中心点的在vertexs中的位置 即 1 + RESOLUTION

		}
	
		let lPointer:number[] = [];
		//线条
		for (let index = 1; index <= RESOLUTION; index++) {
		  //永远是第一个顶点开始的
		  lPointer.push(0); // 顶部点的位置，在 0；
		  lPointer.push(1 + (index % RESOLUTION));
	
		  lPointer.push(1 + (index % RESOLUTION));
		  lPointer.push(RESOLUTION + 1);
		}
	
	
	
		const vertexsArray = new Float32Array(vertexs);
		const pointerArray = new Uint16Array(pointer);
		const colorArray = new Float32Array(color)
		// lPointer = new Uint16Array(lPointer);
	
		return {vertexsArray, colorArray, pointerArray, lPointer, len: pointer.length};
	
}

export function SphereMesh(radius: number, resolution: number) {
	const RADIUS = radius, RESOLUTION = resolution;
	const theta = (180 / RESOLUTION) * (Math.PI / 180);
	const beta = (360 / RESOLUTION) * (Math.PI / 180);
	//计算出圆体以及表面线条的各个点的位置
    let vertexs:number[] = [], pointer:number[] = [], linePointer:number[] = [], color:number[] = [];
     for (let index = 0; index <= RESOLUTION; index++) {
         // 同等高度的Y值
        const y = Math.cos(theta * index) * RADIUS;
        // 底边作为斜边的长度
        const d = Math.sin(theta * index) * RADIUS;
        for (let index1 = 0; index1 <= RESOLUTION; index1++) {
            // 斜边的余弦即是x轴的距离
            const x = Math.cos(beta * index1) * d;
            // 斜边的正弦即是Z轴的距离
            const z = Math.sin(beta * index1) * d;
            vertexs.push(x, y, z);
         	color.push(1.0, 1.0, 0.0);
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
            linePointer.push(index);
            linePointer.push(index + 1);
            linePointer.push(index);
            linePointer.push(index + RESOLUTION + 1);


    }

    return {
        vertexArray : new Float32Array( vertexs ),
        pointerArray: new Uint16Array(pointer),
        linePointer: new Uint16Array(linePointer),
		colorArray: new Float32Array(color),
		len: pointer.length
    };
}



const VOB = {
	CubeVertex: calculatePoints,
	SphereVertex: calculateVertexSphere,
	CylinderVertex: calculateCylinder,
};

export default VOB;
