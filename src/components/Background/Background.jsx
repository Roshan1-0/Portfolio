import { useEffect, useRef } from 'react';
import { useMousePosition } from '../../hooks/useMousePosition';
import './Background.css';

export default function Background() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const scrollRef = useRef(0);
  const animRef = useRef(null);
  const glRef = useRef(null);
  const uniformsRef = useRef({});
  const mouse = useMousePosition();

  // Update mouse ref without causing re-render
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w > 0) {
      mouseRef.current.x = mouse.x / w;
      mouseRef.current.y = mouse.y / h;
    }
  }, [mouse]);

  // Track scroll
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;
    glRef.current = gl;

    const resize = () => {
      // Scale down canvas resolution for performance (renders at 35% resolution)
      // This massively reduces fragment shader workload while keeping the atmospheric look
      const scale = 0.35; 
      canvas.width = window.innerWidth * scale;
      canvas.height = window.innerHeight * scale;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── Vertex Shader */
    const vertSrc = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    /* ── Fragment Shader — cinematic atmospheric noise */
    const fragSrc = `
      precision highp float;

      uniform vec2  u_resolution;
      uniform float u_time;
      uniform vec2  u_mouse;
      uniform float u_scroll;

      /* ── Simplex noise */
      vec3 mod289(vec3 x){ return x - floor(x*(1./289.))*289.; }
      vec2 mod289(vec2 x){ return x - floor(x*(1./289.))*289.; }
      vec3 permute(vec3 x){ return mod289(((x*34.)+1.)*x); }
      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.,0.) : vec2(0.,1.);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
        vec3 m = max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
        m = m*m; m = m*m;
        vec3 x = 2.*fract(p*C.www)-1.;
        vec3 h = abs(x)-0.5;
        vec3 ox = floor(x+0.5);
        vec3 a0 = x-ox;
        m *= 1.79284291400159-0.85373472095314*(a0*a0+h*h);
        vec3 g;
        g.x  = a0.x*x0.x +h.x*x0.y;
        g.yz = a0.yz*x12.xz+h.yz*x12.yw;
        return 130.*dot(m,g);
      }

      /* ── FBM (Reduced iterations for performance) */
      float fbm(vec2 p){
        float v = 0.; float a = 0.5;
        vec2 shift = vec2(100.);
        mat2 rot = mat2(cos(.5),sin(.5),-sin(.5),cos(.5));
        for(int i=0;i<3;i++){ /* Reduced from 5 to 3 */
          v += a*snoise(p);
          p  = rot*p*2.+shift;
          a *= .5;
        }
        return v;
      }

      void main(){
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 mouse = u_mouse;
        float t = u_time * 0.06;
        float scroll = u_scroll;

        /* Layered organic noise */
        vec2 q = vec2(fbm(uv + t*0.15), fbm(uv + vec2(1.0)));
        vec2 r = vec2(
          fbm(uv + 1.0*q + vec2(1.7, 9.2) + 0.15*t),
          fbm(uv + 1.0*q + vec2(8.3, 2.8) + 0.126*t)
        );
        float f = fbm(uv + r);

        /* ── Base cinematic dark */
        vec3 col = vec3(0.02, 0.02, 0.025);

        /* Scroll-based mood transition:
           0.0 = hero (warm gold tones)
           0.5 = middle (cool deep blue)
           1.0 = contact (soft warm amber) */
        vec3 moodA = vec3(0.06, 0.04, 0.015); /* warm gold */
        vec3 moodB = vec3(0.01, 0.02, 0.04);  /* deep blue */
        vec3 moodC = vec3(0.05, 0.03, 0.02);  /* amber */
        vec3 mood;
        if(scroll < 0.5){
          mood = mix(moodA, moodB, scroll * 2.0);
        } else {
          mood = mix(moodB, moodC, (scroll - 0.5) * 2.0);
        }

        /* Apply noise-modulated mood */
        col += mood * (f*f*f + 0.6*f*f + 0.5*f);

        /* ── Mouse soft halo */
        float md = length(uv - mouse);
        float mGlow = smoothstep(0.55, 0.0, md);
        vec3 mouseCol = mix(
          vec3(0.10, 0.07, 0.03),  /* gold */
          vec3(0.03, 0.06, 0.12),  /* blue */
          scroll
        );
        col += mouseCol * mGlow * 0.09;

        /* ── Horizon glow at scroll midpoint */
        float horizY = 0.5;
        float horizGlow = smoothstep(0.25, 0.0, abs(uv.y - horizY)) * scroll * (1.0 - scroll) * 4.0;
        col += vec3(0.02, 0.04, 0.07) * horizGlow;

        /* ── Strong vignette */
        vec2 vigUv = uv * 2.0 - 1.0;
        float vig = 1.0 - dot(vigUv * 0.6, vigUv * 0.6);
        vig = clamp(pow(vig, 2.2), 0.0, 1.0);
        col *= vig * 0.9 + 0.1;

        /* ── Tone clamp */
        col = clamp(col, 0.0, 0.12);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const createShader = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn('Shader error:', gl.getShaderInfoLog(sh));
      }
      return sh;
    };

    const prog = gl.createProgram();
    gl.attachShader(prog, createShader(gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(prog, createShader(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const verts = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    uniformsRef.current = {
      uResolution: gl.getUniformLocation(prog, 'u_resolution'),
      uTime:       gl.getUniformLocation(prog, 'u_time'),
      uMouse:      gl.getUniformLocation(prog, 'u_mouse'),
      uScroll:     gl.getUniformLocation(prog, 'u_scroll'),
    };

    const u = uniformsRef.current;

    const render = (timestamp) => {
      const t = timestamp * 0.001;
      gl.uniform2f(u.uResolution, canvas.width, canvas.height);
      gl.uniform1f(u.uTime, t);
      gl.uniform2f(u.uMouse, mouseRef.current.x, 1.0 - mouseRef.current.y);
      gl.uniform1f(u.uScroll, scrollRef.current);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="bg-canvas"
      aria-hidden="true"
    />
  );
}
