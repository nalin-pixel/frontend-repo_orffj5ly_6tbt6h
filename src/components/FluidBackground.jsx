import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function FluidBackground() {
  const ref = useRef(null)
  const raf = useRef(0)

  useEffect(() => {
    const container = ref.current
    const scene = new THREE.Scene()

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uColorA: { value: new THREE.Color('#1A1A1A') },
      uColorB: { value: new THREE.Color('#2C5F4D') },
      uGrain: { value: 0.05 },
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      fragmentShader: `
        precision highp float;
        uniform vec2 uResolution;
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uGrain;

        // Simplex noise by IQ (trimmed)
        vec3 mod289(vec3 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
        vec2 mod289(vec2 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
        vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);} 
        float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ; m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        float fbm(vec2 p){
          float f = 0.0;
          float a = 0.5;
          for(int i=0;i<5;i++){
            f += a * snoise(p);
            p *= 2.0; a *= 0.5;
          }
          return f;
        }

        void main(){
          vec2 uv = gl_FragCoord.xy / uResolution.xy;
          uv -= 0.5; uv.x *= uResolution.x/uResolution.y; uv += 0.5;
          float t = uTime * 0.022; // ~45s cycle
          float n = fbm(uv * 1.5 + t);
          float m = fbm(uv * 0.6 - t*0.6);
          float g = smoothstep(0.2, 0.8, n);
          vec3 base = mix(uColorA, uColorB, g * 0.6 + m*0.2);
          // radial vignette
          float r = distance(uv, vec2(0.6,0.5));
          base *= 1.0 - smoothstep(0.4, 1.0, r);
          // grain
          float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233))) * 43758.5453);
          base = mix(base, base + vec3(grain*0.1), uGrain);
          gl_FragColor = vec4(base, 0.9);
        }
      `,
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const onResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight)
      uniforms.uResolution.value.set(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', onResize)

    const start = performance.now()
    const loop = () => {
      const t = (performance.now() - start) / 1000
      uniforms.uTime.value = t
      renderer.render(scene, camera)
      raf.current = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', onResize)
      container.removeChild(renderer.domElement)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [])

  return <div ref={ref} className="absolute inset-0" />
}
