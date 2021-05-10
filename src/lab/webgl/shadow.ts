import {glMatrix, mat4, vec3} from 'gl-matrix';
import {initBuffer, initShader, rotation, createFrameBuffer} from '../../common/base';
import * as shaders from './shaders';

const OFFSCREEN_WIDTH = 500;
const OFFSCREEN_HEIGHT = 500;
const LightSource = vec3.fromValues(0.0, 7.0, 2.0);
type W2RC = WebGL2RenderingContext;

export function main_shadow(id: string) {
	const canvas = <HTMLCanvasElement>document.getElementById(id);
	const webgl = <WebGL2RenderingContext>canvas.getContext('webgl2')!;

	webgl.clearColor(0.0, 0.0, 0.0, 1.0);
	webgl.enable(webgl.DEPTH_TEST);

	const programNormal = initShader(webgl, shaders.normalVertexShader, shaders.normalFragmentShader);
	const programShadow = initShader(webgl, shaders.shadowVertexShader, shaders.shadowFragmentShader);

	if (!programNormal || !programShadow) return;

	const frameBuffer = createFrameBuffer(webgl, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

	if (!frameBuffer) return;

	const {fbo, texture} = frameBuffer;

	webgl.bindTexture(webgl.TEXTURE_2D, texture);
	webgl.activeTexture(webgl.TEXTURE0);

	const tick = () => {
		let ang = rotation(0, 45);

		webgl.useProgram(programShadow);

		webgl.bindFramebuffer(webgl.FRAMEBUFFER, fbo);

		webgl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
		webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
		const lightMatrixForRectangle = <mat4>createRectangle(webgl, programShadow, 0, 'shadow');
		const lightMatrixForTriangle = <mat4>createTriangle(webgl, programShadow, ang, 'shadow');

		webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);

		webgl.useProgram(programNormal);

		const u_Sampler = webgl.getUniformLocation(programNormal, 'u_Sampler');
		webgl.uniform1i(u_Sampler, 0);

		webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

		createRectangle(webgl, programNormal, 0, lightMatrixForRectangle);
		createTriangle(webgl, programNormal, ang, lightMatrixForTriangle);

		window.requestAnimationFrame(tick);
	};

	tick();
}

// create triangle
function createTriangle(webgl: W2RC, program: WebGLProgram, angle: number, type: string | mat4): void | mat4 {
	if (!program) return console.error('program do not exist');
	// webgl.useProgram(program);

	const vertex = new Float32Array([-0.8, 3.5, 0.0, 0.8, 3.5, 0.0, 0.0, 3.5, 1.8]);

	const color = new Float32Array([1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0]);

	initBuffer(webgl, program, vertex, 'a_Position', 3, false);

	let matrix: mat4 | void;
	if (type === 'shadow') {
		matrix = initLightMatrix(webgl, program, angle);
	} else {
		initBuffer(webgl, program, color, 'a_Color', 3, false);
		initNormlMatrix(webgl, program, <mat4>type, angle);
	}

	webgl.drawArrays(webgl.TRIANGLES, 0, 3);

	return matrix;
}

// create rectangle
function createRectangle(webgl: W2RC, program: WebGLProgram, angle: number, type: string | mat4): mat4 | void {
	if (!program) return console.error('program do not exist');
	// webgl.useProgram(program);
	const rectanglePoints = new Float32Array([
		-3.0,
		-1.7,
		2.5,
		3.0,
		-1.7,
		2.5,
		-3.0,
		-1.7,
		-2.5,
		3.0,
		-1.7,
		-2.5, // v0-v1-v2-v3
	]);

	const color = new Float32Array([1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]);
	let matrix: undefined | mat4;
	if (type === 'shadow') {
		matrix = initLightMatrix(webgl, program, angle);
	} else {
		initBuffer(webgl, program, color, 'a_Color', 3, false);
		initNormlMatrix(webgl, program, <mat4>type, angle);
	}
	initBuffer(webgl, program, rectanglePoints, 'a_Position', 3, false);

	webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 4);
	return matrix;
}

function initNormlMatrix(webgl: W2RC, program: WebGLProgram, lightMatrix: mat4 | null, angle: number): void {
	const vM = mat4.create();
	mat4.identity(vM);
	mat4.perspective(vM, glMatrix.toRadian(45), 1, 1, 100);
	const lM = mat4.create();
	mat4.identity(lM);
	mat4.lookAt(lM, [0.0, 7.0, 9.0], [0, 0, 0], [0, 1, 0]);
	const rM = mat4.create();
	mat4.identity(rM);
	mat4.rotate(rM, rM, glMatrix.toRadian(angle), [0, 1, 0]);

	mat4.mul(vM, vM, lM);
	mat4.mul(vM, vM, rM);
	const u_MvpLocation = webgl.getUniformLocation(program, 'u_MvpMatrix');

	webgl.uniformMatrix4fv(u_MvpLocation, false, vM);
	if (lightMatrix) {
		const u_MatrixFromLight = webgl.getUniformLocation(program, 'u_MatrixFromLight');
		webgl.uniformMatrix4fv(u_MatrixFromLight, false, lightMatrix);
	}
}

function initLightMatrix(webgl: W2RC, program: WebGLProgram, angle: number): mat4 {
	const vM = mat4.create();
	mat4.identity(vM);
	mat4.perspective(vM, glMatrix.toRadian(70), 1, 1, 100);
	const lM = mat4.create();
	mat4.identity(lM);
	mat4.lookAt(lM, LightSource, [0, 0, 0], [0, 1, 0]);
	const rM = mat4.create();
	mat4.identity(rM);
	mat4.rotate(rM, rM, glMatrix.toRadian(angle), [0, 1, 0]);

	mat4.mul(vM, vM, lM);
	mat4.mul(vM, vM, rM);

	const u_MvpLocation = webgl.getUniformLocation(program, 'u_MvpMatrix');
	webgl.uniformMatrix4fv(u_MvpLocation, false, vM);

	return vM;
}
