"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    
    containerRef.current.innerHTML = "";

    
    const SEPARATION = 40;
    const AMOUNTX = 75;
    const AMOUNTY = 75;

    const scene = new THREE.Scene();
    
    
    scene.background = new THREE.Color(0x02170e);
    scene.fog = new THREE.FogExp2(0x02170e, 0.0012);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.set(0, 350, 1200);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const numParticles = AMOUNTX * AMOUNTY;
    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);

    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
        positions[i + 1] = 0; // y
        positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z
        scales[i / 3] = 1;
        i += 3;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

   
    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x6ee7b7) }, 
      },
      vertexShader: `
        attribute float scale;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          gl_PointSize = scale * ( 250.0 / - mvPosition.z );
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        void main() {
          if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.47) discard;
          gl_FragColor = vec4( color, 0.9 );
        }
      `,
      transparent: true,
      depthTest: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

   
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.8;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.8;
    };

    
    window.addEventListener("mousemove", handleMouseMove);

   
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    
    let count = 0;
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      console.log("Anim frame running")

      
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (-targetY + 400 - camera.position.y) * 0.05;
      camera.lookAt(0, 50, 0);

      const pos = geometry.attributes.position.array as Float32Array;
      const sc = geometry.attributes.scale.array as Float32Array;

      let ptr = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          
          pos[ptr + 1] =
            Math.sin((ix + count) * 0.3) * 55 +
            Math.sin((iy + count) * 0.5) * 55;

          sc[ptr / 3] =
            (Math.sin((ix + count) * 0.3) + 1) * 2.2 +
            (Math.sin((iy + count) * 0.5) + 1) * 2.2;

          ptr += 3;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.scale.needsUpdate = true;

      renderer.render(scene, camera);
      count += 0.07; 
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02170e] text-white selection:bg-emerald-400 selection:text-black">
     
      <div
        ref={containerRef}
        className="absolute inset-0 z-0 opacity-90"
      />

      
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#02170e]/60 via-transparent to-[#02170e]" />

   
      <div className="relative z-10">
        
        <nav className="flex items-center justify-between px-8 py-6">
          <div className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
            Shippable
          </div>

          <div className="flex items-center gap-6">
            <Link 
             href="/login"
            className="text-sm font-medium text-emerald-100 transition-colors hover:text-white">
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#02170e] shadow-lg shadow-emerald-950/20 transition-all duration-300 hover:scale-[1.03] hover:bg-emerald-50 hover:shadow-emerald-500/20 active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-4 py-2 text-sm text-emerald-300 backdrop-blur-md transition-all hover:border-emerald-400/50">
            AI-powered application builder
          </div>

          <h1 className="max-w-4xl bg-gradient-to-b from-white via-emerald-100 to-emerald-400/80 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
            Build. Test. Secure. Ship.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-100/70">
            Build real applications with AI. Choose your technology stack,
            describe what you want, and turn your idea into a shippable product.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button className="rounded-lg bg-white px-6 py-3 font-semibold text-[#02170e] shadow-lg shadow-emerald-950/30 transition-all duration-300 hover:scale-[1.03] hover:bg-emerald-50 active:scale-[0.98]">
              Start Building
            </button>

            <button className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-6 py-3 font-medium text-white backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-emerald-400/60 hover:bg-emerald-900/40 active:scale-[0.98]">
              See How It Works
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
