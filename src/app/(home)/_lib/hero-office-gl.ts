import { LINE_FLOATS, OCCLUDER_FLOATS, PANEL_FLOATS, POINT_FLOATS, type Camera } from "./hero-office-scene";

/*
 * The office walk's renderer: WebGL 2, no library, three passes.
 *
 * 1. Occluders — every solid wall, rack, screen and person — written to depth
 *    only. Nothing is painted, so the page's gradient stays the background,
 *    but a line behind a wall fails the depth test: the drawing's hidden
 *    lines are removed the way an architect's are.
 * 2. Lines, as screen-space quads a little over a pixel wide with their edges
 *    smoothed, faded with depth. What moves — pulses along a line, a drawing
 *    going up on a board, a chart on a screen — is worked out here, in the
 *    fragment shader, from the clock: the buffers never change after upload.
 * 3. Points: the lights on the racks, blinking on their own clocks.
 *
 * Between the first two, the panels: the words and charts on the walls and
 * the screens, painted once into one texture and drawn in as the camera
 * gets to them.
 */

type Scene = { lines: Float32Array; occluders: Float32Array; points: Float32Array; panels: Float32Array };

const LINE_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec2 a_corner;
layout(location = 1) in vec3 a_a;
layout(location = 2) in vec3 a_b;
layout(location = 3) in vec4 a_color;
layout(location = 4) in vec4 a_anim;
layout(location = 5) in vec4 a_centre;
uniform mat4 u_view;
uniform mat4 u_proj;
uniform vec3 u_right;
uniform vec2 u_viewport;
uniform float u_width;
uniform float u_near;
uniform vec2 u_fog;
out vec4 v_color;
out float v_edge;
out float v_coord;
flat out vec4 v_anim;

vec3 place(vec3 p) {
  return a_centre.w > 0.5 ? a_centre.xyz + u_right * p.x + vec3(0.0, p.y, 0.0) : p;
}

void main() {
  vec4 va = u_view * vec4(place(a_a), 1.0);
  vec4 vb = u_view * vec4(place(a_b), 1.0);
  float ca = a_anim.y;
  float cb = a_anim.z;
  v_anim = a_anim;
  if (va.z > -u_near && vb.z > -u_near) {
    gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
    v_color = vec4(0.0);
    v_edge = 0.0;
    v_coord = 0.0;
    return;
  }
  // Cut at the near plane, so a line running past the camera still draws.
  if (va.z > -u_near) {
    float t = (-u_near - va.z) / (vb.z - va.z);
    va = mix(va, vb, t);
    ca = mix(ca, cb, t);
  }
  if (vb.z > -u_near) {
    float t = (-u_near - vb.z) / (va.z - vb.z);
    vb = mix(vb, va, t);
    cb = mix(cb, ca, t);
  }
  vec4 pa = u_proj * va;
  vec4 pb = u_proj * vb;
  vec2 sa = pa.xy / pa.w * u_viewport * 0.5;
  vec2 sb = pb.xy / pb.w * u_viewport * 0.5;
  vec2 d = sb - sa;
  float len = length(d);
  vec2 dir = len > 1e-4 ? d / len : vec2(1.0, 0.0);
  vec2 n = vec2(-dir.y, dir.x);
  float hw = u_width * 0.5 + 1.0;
  bool end = a_corner.x > 0.5;
  vec4 p = end ? pb : pa;
  vec2 offset = n * a_corner.y * hw + dir * (end ? 0.5 : -0.5);
  p.xy += offset / (u_viewport * 0.5) * p.w;
  gl_Position = p;
  v_edge = a_corner.y * hw;
  float depth = -(end ? vb.z : va.z);
  float fog = (1.0 - smoothstep(u_fog.x, u_fog.y, depth)) * smoothstep(u_near, u_near + 0.7, depth);
  v_color = vec4(a_color.rgb, a_color.a * fog);
  v_coord = end ? cb : ca;
}`;

const LINE_FS = `#version 300 es
precision highp float;
in vec4 v_color;
in float v_edge;
in float v_coord;
flat in vec4 v_anim;
uniform float u_width;
uniform float u_time;
out vec4 outColor;

void main() {
  float cover = clamp(u_width * 0.5 + 0.5 - abs(v_edge), 0.0, 1.0);
  float alpha = v_color.a * cover;
  if (v_anim.x > 0.5) {
    // Flow: a pulse every 2.6 m, bright at its head, trailing off behind.
    float p = fract((v_coord - u_time * v_anim.w) / 2.6);
    alpha *= 0.2 + 0.8 * smoothstep(0.7, 0.98, p);
  }
  if (alpha < 0.003) discard;
  outColor = vec4(v_color.rgb * alpha, alpha);
}`;

const OCCLUDER_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec3 a_pos;
layout(location = 1) in vec4 a_centre;
uniform mat4 u_view;
uniform mat4 u_proj;
uniform vec3 u_right;
void main() {
  vec3 p = a_centre.w > 0.5 ? a_centre.xyz + u_right * a_pos.x + vec3(0.0, a_pos.y, 0.0) : a_pos;
  gl_Position = u_proj * u_view * vec4(p, 1.0);
}`;

const OCCLUDER_FS = `#version 300 es
precision mediump float;
out vec4 outColor;
void main() {
  outColor = vec4(0.0);
}`;

const POINT_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec3 a_pos;
layout(location = 1) in vec4 a_color;
layout(location = 2) in vec4 a_blink;
layout(location = 3) in float a_size;
uniform mat4 u_view;
uniform mat4 u_proj;
uniform float u_time;
uniform float u_dpr;
uniform vec2 u_fog;
out vec4 v_color;
void main() {
  vec4 v = u_view * vec4(a_pos, 1.0);
  gl_Position = u_proj * v;
  float depth = -v.z;
  float on = a_blink.x > 0.5 ? (fract(u_time * a_blink.y + a_blink.z) < a_blink.w ? 1.0 : 0.16) : 1.0;
  float fog = (1.0 - smoothstep(u_fog.x, u_fog.y, depth)) * smoothstep(0.3, 1.0, depth);
  gl_PointSize = clamp(a_size * u_dpr * 3.0 / max(depth, 0.5), 1.0, 7.0 * u_dpr);
  v_color = vec4(a_color.rgb, a_color.a * on * fog);
}`;

const POINT_FS = `#version 300 es
precision mediump float;
in vec4 v_color;
out vec4 outColor;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float alpha = v_color.a * (1.0 - smoothstep(0.32, 0.5, d));
  if (alpha < 0.01) discard;
  outColor = vec4(v_color.rgb * alpha, alpha);
}`;

const PANEL_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec3 a_pos;
layout(location = 1) in vec2 a_uv;
layout(location = 2) in vec2 a_local;
layout(location = 3) in vec4 a_reveal;
uniform mat4 u_view;
uniform mat4 u_proj;
uniform vec2 u_fog;
out vec2 v_uv;
out vec2 v_local;
out float v_fog;
flat out vec4 v_reveal;
void main() {
  vec4 v = u_view * vec4(a_pos, 1.0);
  gl_Position = u_proj * v;
  float depth = -v.z;
  v_fog = (1.0 - smoothstep(u_fog.x, u_fog.y, depth)) * smoothstep(0.2, 0.8, depth);
  v_uv = a_uv;
  v_local = a_local;
  v_reveal = a_reveal;
}`;

const PANEL_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
in vec2 v_local;
in float v_fog;
flat in vec4 v_reveal;
uniform sampler2D u_atlas;
uniform float u_time;
uniform float u_loop;
uniform float u_strength;
out vec4 outColor;
void main() {
  vec4 color = texture(u_atlas, v_uv);
  float shown = 1.0;
  if (v_reveal.x > 0.5) {
    // Drawn in from when the camera gets there; kept for half a round, then
    // put away unseen, behind the walls, until the camera comes back.
    float t = mod(u_time - v_reveal.y, u_loop);
    float p = clamp(t / v_reveal.z, 0.0, 1.0) * step(t, u_loop * 0.5);
    if (v_reveal.x < 1.5) {
      shown = clamp((p * 1.06 - v_local.x) / 0.06, 0.0, 1.0);
    } else {
      float row = floor(v_local.y * v_reveal.w);
      shown = clamp(p * v_reveal.w - row, 0.0, 1.0);
    }
  }
  float k = shown * v_fog * u_strength;
  if (color.a * k < 0.003) discard;
  outColor = color * k;
}`;

/** Vertical field of view, the near plane, and fog: full to 11 m, gone by 28. */
const FOV = (58 * Math.PI) / 180;
const NEAR = 0.18;
const FAR = 60;
const FOG: [number, number] = [11, 28];
/** Line width in CSS pixels. */
const WIDTH = 1.15;

export type Renderer = {
  /** `panels` is how strongly the words and charts are drawn: 0 leaves them out. */
  render: (camera: Camera, time: number, loop: number, panels: number) => void;
  setAtlas: (source: HTMLCanvasElement) => void;
  resize: () => void;
  dispose: () => void;
};

/** Sets up the renderer on `canvas`, or returns null where WebGL 2 is not there. */
export function createRenderer(canvas: HTMLCanvasElement, scene: Scene): Renderer | null {
  const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: true, depth: true, powerPreference: "low-power" });
  if (!gl) return null;

  const lineProgram = program(gl, LINE_VS, LINE_FS);
  const occluderProgram = program(gl, OCCLUDER_VS, OCCLUDER_FS);
  const pointProgram = program(gl, POINT_VS, POINT_FS);
  const panelProgram = program(gl, PANEL_VS, PANEL_FS);
  if (!lineProgram || !occluderProgram || !pointProgram || !panelProgram) return null;

  const buffers: WebGLBuffer[] = [];
  const upload = (data: Float32Array) => {
    const buffer = gl.createBuffer()!;
    buffers.push(buffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buffer;
  };
  const attribute = (location: number, size: number, stride: number, offset: number, divisor = 0) => {
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride * 4, offset * 4);
    gl.vertexAttribDivisor(location, divisor);
  };

  /* Lines: one quad, drawn once per line. */
  const lineVao = gl.createVertexArray()!;
  gl.bindVertexArray(lineVao);
  upload(new Float32Array([0, -1, 0, 1, 1, -1, 1, 1]));
  attribute(0, 2, 2, 0);
  upload(scene.lines);
  attribute(1, 3, LINE_FLOATS, 0, 1);
  attribute(2, 3, LINE_FLOATS, 3, 1);
  attribute(3, 4, LINE_FLOATS, 6, 1);
  attribute(4, 4, LINE_FLOATS, 10, 1);
  attribute(5, 4, LINE_FLOATS, 14, 1);
  const lineCount = scene.lines.length / LINE_FLOATS;

  const occluderVao = gl.createVertexArray()!;
  gl.bindVertexArray(occluderVao);
  upload(scene.occluders);
  attribute(0, 3, OCCLUDER_FLOATS, 0);
  attribute(1, 4, OCCLUDER_FLOATS, 3);
  const occluderCount = scene.occluders.length / OCCLUDER_FLOATS;

  const pointVao = gl.createVertexArray()!;
  gl.bindVertexArray(pointVao);
  upload(scene.points);
  attribute(0, 3, POINT_FLOATS, 0);
  attribute(1, 4, POINT_FLOATS, 3);
  attribute(2, 4, POINT_FLOATS, 7);
  attribute(3, 1, POINT_FLOATS, 11);
  const pointCount = scene.points.length / POINT_FLOATS;

  const panelVao = gl.createVertexArray()!;
  gl.bindVertexArray(panelVao);
  upload(scene.panels);
  attribute(0, 3, PANEL_FLOATS, 0);
  attribute(1, 2, PANEL_FLOATS, 3);
  attribute(2, 2, PANEL_FLOATS, 5);
  attribute(3, 4, PANEL_FLOATS, 7);
  const panelCount = scene.panels.length / PANEL_FLOATS;
  gl.bindVertexArray(null);

  // The atlas arrives once the page's fonts have; until then the panels wait.
  let atlas: WebGLTexture | null = null;
  const setAtlas = (source: HTMLCanvasElement) => {
    atlas = atlas ?? gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, atlas);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const anisotropic = gl.getExtension("EXT_texture_filter_anisotropic");
    if (anisotropic) {
      const max = gl.getParameter(anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number;
      gl.texParameterf(gl.TEXTURE_2D, anisotropic.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, max));
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  };

  const uniforms = (target: WebGLProgram, names: string[]) =>
    Object.fromEntries(names.map((name) => [name, gl.getUniformLocation(target, name)]));
  const lineU = uniforms(lineProgram, ["u_view", "u_proj", "u_right", "u_viewport", "u_width", "u_near", "u_fog", "u_time"]);
  const occluderU = uniforms(occluderProgram, ["u_view", "u_proj", "u_right"]);
  const pointU = uniforms(pointProgram, ["u_view", "u_proj", "u_time", "u_dpr", "u_fog"]);
  const panelU = uniforms(panelProgram, ["u_view", "u_proj", "u_fog", "u_atlas", "u_time", "u_loop", "u_strength"]);

  let dpr = 1;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  };
  resize();

  const render = (camera: Camera, time: number, loop: number, panels: number) => {
    const width = canvas.width;
    const height = canvas.height;
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const proj = perspective(FOV, width / height, NEAR, FAR);
    const { view, right } = lookAt(camera.eye, camera.target);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // 1 · Depth only, pushed back a little so a line drawn on a wall passes.
    gl.useProgram(occluderProgram);
    gl.uniformMatrix4fv(occluderU.u_view, false, view);
    gl.uniformMatrix4fv(occluderU.u_proj, false, proj);
    gl.uniform3fv(occluderU.u_right, right);
    gl.colorMask(false, false, false, false);
    gl.depthMask(true);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(2, 8);
    gl.bindVertexArray(occluderVao);
    gl.drawArrays(gl.TRIANGLES, 0, occluderCount);
    gl.disable(gl.POLYGON_OFFSET_FILL);
    gl.colorMask(true, true, true, true);

    // The panels, blended over the depth the walls left.
    gl.depthMask(false);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    if (atlas && panelCount && panels > 0) {
      gl.useProgram(panelProgram);
      gl.uniformMatrix4fv(panelU.u_view, false, view);
      gl.uniformMatrix4fv(panelU.u_proj, false, proj);
      gl.uniform2f(panelU.u_fog, FOG[0], FOG[1]);
      gl.uniform1f(panelU.u_time, time);
      gl.uniform1f(panelU.u_loop, loop);
      gl.uniform1f(panelU.u_strength, panels);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, atlas);
      gl.uniform1i(panelU.u_atlas, 0);
      gl.bindVertexArray(panelVao);
      gl.drawArrays(gl.TRIANGLES, 0, panelCount);
    }

    // 2 · Lines, not writing depth so they never hide each other.
    gl.useProgram(lineProgram);
    gl.uniformMatrix4fv(lineU.u_view, false, view);
    gl.uniformMatrix4fv(lineU.u_proj, false, proj);
    gl.uniform3fv(lineU.u_right, right);
    gl.uniform2f(lineU.u_viewport, width, height);
    gl.uniform1f(lineU.u_width, WIDTH * dpr);
    gl.uniform1f(lineU.u_near, NEAR);
    gl.uniform2f(lineU.u_fog, FOG[0], FOG[1]);
    gl.uniform1f(lineU.u_time, time);
    gl.bindVertexArray(lineVao);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, lineCount);

    // 3 · The lights.
    gl.useProgram(pointProgram);
    gl.uniformMatrix4fv(pointU.u_view, false, view);
    gl.uniformMatrix4fv(pointU.u_proj, false, proj);
    gl.uniform1f(pointU.u_time, time);
    gl.uniform1f(pointU.u_dpr, dpr);
    gl.uniform2f(pointU.u_fog, FOG[0], FOG[1]);
    gl.bindVertexArray(pointVao);
    gl.drawArrays(gl.POINTS, 0, pointCount);

    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.depthMask(true);
  };

  const dispose = () => {
    for (const buffer of buffers) gl.deleteBuffer(buffer);
    for (const vao of [lineVao, occluderVao, pointVao, panelVao]) gl.deleteVertexArray(vao);
    for (const target of [lineProgram, occluderProgram, pointProgram, panelProgram]) gl.deleteProgram(target);
    if (atlas) gl.deleteTexture(atlas);
  };

  return { render, resize, dispose, setAtlas };
}

function program(gl: WebGL2RenderingContext, vertex: string, fragment: string) {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  };
  const vs = compile(gl.VERTEX_SHADER, vertex);
  const fs = compile(gl.FRAGMENT_SHADER, fragment);
  if (!vs || !fs) return null;
  const target = gl.createProgram()!;
  gl.attachShader(target, vs);
  gl.attachShader(target, fs);
  gl.linkProgram(target);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(target, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(target));
    return null;
  }
  return target;
}

function perspective(fov: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
}

/** The view matrix for a camera at `eye` looking at `target`, y up, and its
 *  right, which the billboards face across. */
function lookAt(eye: readonly number[], target: readonly number[]) {
  const z = normalize([eye[0] - target[0], eye[1] - target[1], eye[2] - target[2]]);
  const x = normalize(cross([0, 1, 0], z));
  const y = cross(z, x);
  const view = new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -dot(x, eye), -dot(y, eye), -dot(z, eye), 1,
  ]);
  return { view, right: new Float32Array(x) };
}

const dot = (a: readonly number[], b: readonly number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: readonly number[], b: readonly number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
function normalize(v: number[]) {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
}
