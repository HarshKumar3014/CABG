"use client";

import { useEffect, useRef } from "react";
import { Renderer, Triangle, Program, Mesh, Vec2 } from "ogl";

const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

/* Layered value-noise flow. Reads as slow drifting light on a dark
   field rather than a rainbow mesh — the accent only ever tints it. */
const fragment = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform vec3 uAccent;
uniform float uReveal;
uniform float uScroll;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 st = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = vec2(st.x * aspect, st.y);

  float t = uTime * 0.045 + uScroll * 0.35;

  // domain warp
  vec2 q = vec2(fbm(p * 1.6 + t), fbm(p * 1.6 + vec2(3.2, 1.7) - t));
  vec2 r = vec2(
    fbm(p * 1.9 + 3.0 * q + vec2(1.7, 9.2) + t * 0.7),
    fbm(p * 1.9 + 3.0 * q + vec2(8.3, 2.8) - t * 0.6)
  );
  float f = fbm(p * 1.4 + 3.5 * r);

  // pointer adds a soft local lift, so the surface answers the cursor
  vec2 pm = vec2(uPointer.x * aspect, uPointer.y);
  float d = distance(p, pm);
  float lift = exp(-d * d * 6.0) * 0.35;

  // uReveal resolves the field out of flat noise as the page arrives
  float energy = smoothstep(mix(0.95, 0.38, uReveal), 1.08, f + lift);

  // Weight the light mass toward the upper right so the left column,
  // where the headline sits, stays close to the page background.
  float bias = smoothstep(0.18, 0.92, st.x) * smoothstep(0.05, 0.75, st.y);
  energy *= 0.25 + 0.75 * bias;

  vec3 base = vec3(0.027, 0.031, 0.039);
  vec3 mid = mix(base, uAccent * 0.22, energy);
  vec3 col = mix(mid, uAccent * 0.62, pow(energy, 3.0) * 0.5);

  // fade out toward the edges so it never becomes a full-bleed wash
  float vign = smoothstep(1.15, 0.25, length(st - 0.5) * 1.3);
  col = mix(base, col, vign);

  // dither to kill banding on large dark gradients
  float dither = (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(col + dither, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace("#", "").trim();
  const full =
    v.length === 3
      ? v
          .split("")
          .map((c) => c + c)
          .join("")
      : v;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return [0.31, 0.49, 1.0];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export default function ShaderBackdrop({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: false,
        antialias: false,
        /* A soft noise field has no detail to lose at 1x, and at 2x the
           fragment shader does four times the work on every frame the
           hero is on screen — the frames scrolling needs. */
        dpr: 1,
      });
    } catch {
      return; // no WebGL: the CSS fallback behind this stays visible
    }

    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    host.appendChild(canvas);

    const accentHex =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "#4f7dff";

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2(1, 1) },
        uPointer: { value: new Vec2(0.5, 0.55) },
        uAccent: { value: hexToRgb(accentHex) },
        uReveal: { value: 0 },
        uScroll: { value: 0 },
      },
    });

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value.set(w, h);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    // pointer target, eased toward each frame
    const target = new Vec2(0.5, 0.55);
    const onPointer = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      target.set(
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height
      );
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // the field resolves once, on the same curve as the hero text
    const revealStart = performance.now();
    const REVEAL_MS = 2200;

    // scroll pushes the field, so the backdrop belongs to the page
    let scrollNorm = 0;
    const onScroll = () => {
      scrollNorm = window.scrollY / Math.max(window.innerHeight, 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(frame);
      },
      { threshold: 0 }
    );
    io.observe(host);

    const start = performance.now();
    function frame(now: number) {
      raf = 0;
      if (!visible) return;

      const cur = program.uniforms.uPointer.value as Vec2;
      cur.set(cur.x + (target.x - cur.x) * 0.045, cur.y + (target.y - cur.y) * 0.045);

      // reduced motion: hold a still frame, still answer the pointer
      program.uniforms.uTime.value = reduced ? 12 : (now - start) / 1000;

      const rp = Math.min((now - revealStart) / REVEAL_MS, 1);
      program.uniforms.uReveal.value = reduced ? 1 : 1 - Math.pow(1 - rp, 3);

      const su = program.uniforms.uScroll;
      su.value += (scrollNorm - su.value) * 0.06;

      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      style={{
        // visible before WebGL boots, and the fallback if it never does
        background:
          "radial-gradient(120% 90% at 55% 45%, color-mix(in oklab, var(--accent) 22%, var(--bg)) 0%, var(--bg) 62%)",
      }}
    />
  );
}
