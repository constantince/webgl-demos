import { mat4, glMatrix } from "gl-matrix";

type W2RC = WebGL2RenderingContext;

// load vertex and fragment shader
function _loaderShader(gl: W2RC, type: number, source: string): WebGLShader | null {
	const shader = gl.createShader(type);
	if (shader) {
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			const info = gl.getShaderInfoLog(shader);
			console.warn(info);
			return null;
		}
		return shader;
	}
	return null;
}
// create a webgl program
export function createProgram(gl: W2RC, shader1: WebGLShader, shader2: WebGLShader): WebGLProgram | null {
	const program = gl.createProgram();
	if (program) {
		gl.attachShader(program, shader1);
		gl.attachShader(program, shader2);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			const info = gl.getProgramInfoLog(program);
			console.warn(info);
			return null;
		}
		return program;
	}
	return null;
}
// initial the shaders
export function initShader(gl: W2RC, v: string, f: string): WebGLProgram | null {
	const vShader = _loaderShader(gl, gl.VERTEX_SHADER, v);
	const fShader = _loaderShader(gl, gl.FRAGMENT_SHADER, f);
	if (!vShader || !fShader) return null;
	const program = createProgram(gl, vShader, fShader);
	return program;
}
// initial the buffers
export function initBuffer(
	gl: W2RC,
	program: WebGLProgram,
	data: Float32Array | Uint16Array | Uint8Array,
	name: string | null,
	size: number | null,
	type: false | number,
) {
	const buffer = gl.createBuffer();
	if (buffer) {
		const bufferType = type === false ? gl.ARRAY_BUFFER : gl.ELEMENT_ARRAY_BUFFER;
		gl.bindBuffer(bufferType, buffer);
		gl.bufferData(bufferType, data, gl.STATIC_DRAW);

		if (type === false && name !== null && size !== null) {
			const target: number = gl.getAttribLocation(program, name);
			if (target < 0) {
				console.log('Failed to get the storage location of ' + name);
				return false;
			}
			gl.vertexAttribPointer(target, size, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(target);
		}
	}
}

function _translate16ColorToRGBA(f: string): number[] {
	let sColor = f.toLowerCase();
	const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	if (sColor && reg.test(sColor)) {
		if (sColor.length === 4) {
			var sColorNew = '#';
			for (var i = 1; i < 4; i += 1) {
				sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
			}
			sColor = sColorNew;
		}
		//处理六位的颜色值
		var sColorChange = [];
		for (var i = 1; i < 7; i += 2) {
			sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
		}
		return sColorChange.concat(1);
	} else {
		return [255, 255, 255, 255];
	}
}
// translate a 16 color to webgl color;
export function translateToWebglColor(color: string): number[] {
	// #19a397
	const colors = _translate16ColorToRGBA(color);
	const result = [colors[0] / 255, colors[1] / 255, colors[2] / 255, colors[3]];
	return result;
}

// rotate object
const now = Date.now();
export function rotation(beginAngle: number, secondPerAngle: number): number {
	let then = Date.now();
	const detla = then - now;
	let rotateAngle = beginAngle + (secondPerAngle * detla) / 1000;
	return (rotateAngle %= 360);
}

type TEXTURE_ITEMS = {
	program: WebGLProgram;
	src: string;
};

export function createTexture(gl: W2RC, item: TEXTURE_ITEMS[]): Promise<WebGLTexture[]> {
	return Promise.all(item.map((v) => loadImage(gl, v.program, v.src)));
}

function loadImage(gl: W2RC, program: WebGLProgram, src: string): Promise<WebGLTexture> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.crossOrigin = 'anonymous';
		image.src = src;

		image.onload = function () {
			resolve(loadTexture(gl, program, image, gl.TEXTURE0));
		};
	});
}

function loadTexture(gl: W2RC, program: WebGLProgram, image: TexImageSource, type: number): WebGLTexture {
	gl.useProgram(program);
	const texture = gl.createTexture();

	gl.activeTexture(type);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	const samplerLocation = gl.getUniformLocation(program, 'u_Sampler');
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	// gl.texParameteri(gl.TEXTURE_2D, gl.LINEAR_MIPMAP_LINEAR, gl.LINEAR);

	// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	gl.generateMipmap(gl.TEXTURE_2D);
	// gl.bindTexture(gl.TEXTURE_2D, null); // Unbind texture

	gl.uniform1i(samplerLocation, 0);

	return <WebGLTexture>texture;
}

type FrameBufferItem = {
	fbo: WebGLFramebuffer;
	texture: WebGLTexture;
};

// create FrameBufferObject
export function createFrameBuffer(gl: W2RC, width: number, height: number): FrameBufferItem | null {
	const fbo = gl.createFramebuffer();

	if (!fbo) {
		console.error('frame buffer error');
		return null;
	}

	const texture = gl.createTexture();

	if (!texture) {
		console.error('texture created error');
		return null;
	}

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	const depthBuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

	const e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

	if (e !== gl.FRAMEBUFFER_COMPLETE) {
		console.error('something goes wrong');
		return null;
	}

	gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

	return {fbo, texture};
}

// create basic matrix;
export function createMatrix(gl: WebGL2RenderingContext, program: WebGLProgram, angle: number[], move: boolean) {
    const u_Matrix = gl.getUniformLocation(program, "u_Matrix");
	const u_NormalMatrix = gl.getUniformLocation(program, "u_NormalMatrix");
    const vM = mat4.create();
    mat4.identity(vM);
    mat4.perspective(vM, glMatrix.toRadian(30), 1, 1, 100);

    const lM = mat4.create();
    mat4.identity(lM);
    mat4.lookAt(lM, [0, 0, 10], [0, 0, 0], [0, 1, 0]);
    
    const rM = mat4.create();
    mat4.identity(rM);
    mat4.rotateX(rM, rM, glMatrix.toRadian(angle[0]));
	mat4.rotateZ(rM, rM, glMatrix.toRadian(-angle[1]));
    move && mat4.translate(rM, rM, [0.2, 0.2, 0]);
    
    mat4.mul(vM, vM, lM);
    mat4.mul(vM, vM, rM);

	const nM = mat4.create();
	mat4.identity(nM);
	mat4.invert(nM, rM);
	mat4.transpose(nM, nM);

    gl.uniformMatrix4fv(u_Matrix, false, vM);
	gl.uniformMatrix4fv(u_NormalMatrix, false, nM);

}


export function initEvent(canvas:HTMLCanvasElement, currentAngle: number[]) {

	let dragging = false, lastX = -1, lastY = -1;
	canvas.onmousedown = function(ev: MouseEvent) {
		const x = ev.clientX, y = ev.clientY;

		const rect = canvas.getBoundingClientRect();

		if( rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom ) {
			lastX = x; lastY = y;
			dragging = true;
		}


	}


	canvas.onmouseup = function(ev) {
		dragging = false;
	}

	canvas.onmousemove = function(ev) {
		const x = ev.clientX, y = ev.clientY;
		if( dragging) {
			const factor = 100 / canvas.height;
			const dx = factor * (x - lastX);
			const dy = factor * (y - lastY);

			currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 180.0), -180.0);
			currentAngle[1] = currentAngle[1] + dx;
		}

		lastX = x, lastY = y;
	}
}
