// import Link from "next/link";
// export default function Home() {
//   return (
//     <main className="min-h-screen bg-black text-white">
//       {/* Navbar */}
//       <nav className="flex items-center justify-between px-8 py-6">
//         <div className="text-2xl font-bold tracking-tight">
//           Shippable
//         </div>

//         <div className="flex items-center gap-6">
//           <button className="text-sm text-gray-300 hover:text-white">
//             Login
//           </button>

//          <Link
//             href="/signup"
//             className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-200"
//           >
//                  Get Started
//          </Link>
//         </div>
//       </nav>

//       {/* Hero */}
//       <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
//         <div className="mb-6 rounded-full border border-gray-800 px-4 py-2 text-sm text-gray-400">
//           AI-powered application builder
//         </div>

//         <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
//           Build. Test. Secure. Ship.
//         </h1>

//         <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
//           Build real applications with AI. Choose your technology stack,
//           describe what you want, and turn your idea into a shippable product.
//         </p>

//         <div className="mt-10 flex flex-col gap-4 sm:flex-row">
//           <button className="rounded-lg bg-white px-6 py-3 font-medium text-black hover:bg-gray-200">
//             Start Building
//           </button>

//           <button className="rounded-lg border border-gray-700 px-6 py-3 font-medium text-white hover:bg-gray-900">
//             See How It Works
//           </button>
//         </div>
//       </section>
//     </main>
//   );
// }



// "use client";

// import Link from "next/link";
// import { useEffect, useRef } from "react";
// import * as THREE from "three";

// export default function Home() {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // --- THREE.JS DOTTED SURFACE WAVE SETUP ---
//     const SEPARATION = 40;
//     const AMOUNTX = 75;
//     const AMOUNTY = 75;

//     const scene = new THREE.Scene();
//     scene.fog = new THREE.FogExp2(0x000000, 0.0012);

//     const camera = new THREE.PerspectiveCamera(
//       60,
//       window.innerWidth / window.innerHeight,
//       1,
//       10000
//     );
//     camera.position.set(0, 350, 1200);

//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     containerRef.current.appendChild(renderer.domElement);

//     const numParticles = AMOUNTX * AMOUNTY;
//     const positions = new Float32Array(numParticles * 3);
//     const scales = new Float32Array(numParticles);

//     let i = 0;
//     for (let ix = 0; ix < AMOUNTX; ix++) {
//       for (let iy = 0; iy < AMOUNTY; iy++) {
//         positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
//         positions[i + 1] = 0; // y
//         positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z
//         scales[i / 3] = 1;
//         i += 3;
//       }
//     }

//     const geometry = new THREE.BufferGeometry();
//     geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
//     geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

//     // Custom Shader for circular glowing dots
//     const material = new THREE.ShaderMaterial({
//       uniforms: {
//         color: { value: new THREE.Color(0xffffff) },
//       },
//       vertexShader: `
//         attribute float scale;
//         void main() {
//           vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
//           gl_PointSize = scale * ( 250.0 / - mvPosition.z );
//           gl_Position = projectionMatrix * mvPosition;
//         }
//       `,
//       fragmentShader: `
//         uniform vec3 color;
//         void main() {
//           if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.47) discard;
//           gl_FragColor = vec4( color, 0.85 );
//         }
//       `,
//       transparent: true,
//       depthTest: true,
//     });

//     const particles = new THREE.Points(geometry, material);
//     scene.add(particles);

//     // Mouse Interaction
//     let mouseX = 0;
//     let mouseY = 0;
//     let targetX = 0;
//     let targetY = 0;

//     const handleMouseMove = (event: MouseEvent) => {
//       mouseX = (event.clientX - window.innerWidth / 2) * 0.4;
//       mouseY = (event.clientY - window.innerHeight / 2) * 0.4;
//     };

//     window.addEventListener("mousemove", handleMouseMove);

//     // Resize Handler
//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     window.addEventListener("resize", handleResize);

//     // Animation Loop
//     let count = 0;
//     let animationFrameId: number;

//     const animate = () => {
//       animationFrameId = requestAnimationFrame(animate);

//       targetX += (mouseX - targetX) * 0.03;
//       targetY += (mouseY - targetY) * 0.03;

//       camera.position.x += (targetX - camera.position.x) * 0.05;
//       camera.position.y += (-targetY + 400 - camera.position.y) * 0.05;
//       camera.lookAt(0, 50, 0);

//       const pos = geometry.attributes.position.array as Float32Array;
//       const sc = geometry.attributes.scale.array as Float32Array;

//       let ptr = 0;
//       for (let ix = 0; ix < AMOUNTX; ix++) {
//         for (let iy = 0; iy < AMOUNTY; iy++) {
//           // Wave movement equation
//           pos[ptr + 1] =
//             Math.sin((ix + count) * 0.3) * 50 +
//             Math.sin((iy + count) * 0.5) * 50;

//           sc[ptr / 3] =
//             (Math.sin((ix + count) * 0.3) + 1) * 2 +
//             (Math.sin((iy + count) * 0.5) + 1) * 2;

//           ptr += 3;
//         }
//       }

//       geometry.attributes.position.needsUpdate = true;
//       geometry.attributes.scale.needsUpdate = true;

//       renderer.render(scene, camera);
//       count += 0.06;
//     };

//     animate();

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("resize", handleResize);
//       cancelAnimationFrame(animationFrameId);
//       if (containerRef.current) {
//         containerRef.current.innerHTML = "";
//       }
//     };
//   }, []);

//   return (
//     <main className="relative min-h-screen overflow-hidden bg-black text-white selection:bg-white selection:text-black">
//       {/* 3D Wave Canvas Container */}
//       <div
//         ref={containerRef}
//         className="pointer-events-none absolute inset-0 z-0 opacity-80"
//       />

//       {/* Top radial gradient mask for smooth fading */}
//       <div className="pointer-events-none absolute inset-0 z-0 bg-radial-vignette bg-gradient-to-b from-black/80 via-transparent to-black" />

//       {/* Content Container */}
//       <div className="relative z-10">
//         {/* Navbar */}
//         <nav className="flex items-center justify-between px-8 py-6">
//           <div className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
//             Shippable
//           </div>

//           <div className="flex items-center gap-6">
//             <button className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
//               Login
//             </button>

//             <Link
//               href="/signup"
//               className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-white/10 transition-all duration-300 hover:scale-[1.03] hover:bg-gray-100 hover:shadow-white/20 active:scale-[0.98]"
//             >
//               Get Started
//             </Link>
//           </div>
//         </nav>

//         {/* Hero */}
//         <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
//           <div className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 backdrop-blur-md transition-all hover:border-white/20">
//             AI-powered application builder
//           </div>

//           <h1 className="max-w-4xl bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
//             Build. Test. Secure. Ship.
//           </h1>

//           <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
//             Build real applications with AI. Choose your technology stack,
//             describe what you want, and turn your idea into a shippable product.
//           </p>

//           <div className="mt-10 flex flex-col gap-4 sm:flex-row">
//             <button className="rounded-lg bg-white px-6 py-3 font-semibold text-black shadow-lg shadow-white/10 transition-all duration-300 hover:scale-[1.03] hover:bg-gray-100 hover:shadow-white/25 active:scale-[0.98]">
//               Start Building
//             </button>

//             <button className="rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-medium text-white backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-white/40 hover:bg-white/10 active:scale-[0.98]">
//               See How It Works
//             </button>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }





"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous canvas if strict mode mounts twice
    containerRef.current.innerHTML = "";

    // --- THREE.JS DOTTED SURFACE WAVE SETUP ---
    const SEPARATION = 40;
    const AMOUNTX = 75;
    const AMOUNTY = 75;

    const scene = new THREE.Scene();
    
    // Deep rich dark-green fog and background
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

    // Custom Shader for vibrant glowing mint/emerald dots
    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x6ee7b7) }, // Glowing emerald/mint green
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

    // Mouse Movement Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.8;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.8;
    };

    // Attach tracking directly to global window
    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Continuous Animation Loop
    let count = 0;
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      console.log("Anim frame running")

      // Smooth camera interpolation based on mouse coordinates
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
          // Dynamic Wave Movement
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
      count += 0.07; // Wave speed
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
      {/* 3D Wave Canvas Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-0 opacity-90"
      />

      {/* Subtle radial vignette gradient to blend the green background smoothly */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#02170e]/60 via-transparent to-[#02170e]" />

      {/* Content Container */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-8 py-6">
          <div className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
            Shippable
          </div>

          <div className="flex items-center gap-6">
            <button className="text-sm font-medium text-emerald-100 transition-colors hover:text-white">
              Login
            </button>

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

// "use client";

// import Link from "next/link";
// import { useEffect, useRef } from "react";
// import * as THREE from "three";
// import { motion } from "framer-motion";

// export default function Home() {
//   const containerRef = useRef<HTMLDivElement>(null);

//   // Words for the interactive heading
//   const headlineWords = [
//     { text: "Build.", delay: 0 },
//     { text: "Test.", delay: 0.2 },
//     { text: "Secure.", delay: 0.4 },
//     { text: "Ship.", delay: 0.6 },
//   ];

//   useEffect(() => {
//     if (!containerRef.current) return;
//     containerRef.current.innerHTML = "";

//     // --- THREE.JS DOTTED SURFACE WAVE SETUP ---
//     const SEPARATION = 40;
//     const AMOUNTX = 75;
//     const AMOUNTY = 75;

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x02170e);
//     scene.fog = new THREE.FogExp2(0x02170e, 0.0012);

//     const camera = new THREE.PerspectiveCamera(
//       60,
//       window.innerWidth / window.innerHeight,
//       1,
//       10000
//     );
//     camera.position.set(0, 350, 1200);

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     containerRef.current.appendChild(renderer.domElement);

//     const numParticles = AMOUNTX * AMOUNTY;
//     const positions = new Float32Array(numParticles * 3);
//     const scales = new Float32Array(numParticles);

//     let i = 0;
//     for (let ix = 0; ix < AMOUNTX; ix++) {
//       for (let iy = 0; iy < AMOUNTY; iy++) {
//         positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
//         positions[i + 1] = 0;
//         positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
//         scales[i / 3] = 1;
//         i += 3;
//       }
//     }

//     const geometry = new THREE.BufferGeometry();
//     geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
//     geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

//     const material = new THREE.ShaderMaterial({
//       uniforms: {
//         color: { value: new THREE.Color(0x6ee7b7) },
//       },
//       vertexShader: `
//         attribute float scale;
//         void main() {
//           vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
//           gl_PointSize = scale * ( 250.0 / - mvPosition.z );
//           gl_Position = projectionMatrix * mvPosition;
//         }
//       `.trim(),
//       fragmentShader: `
//         uniform vec3 color;
//         void main() {
//           if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.47) discard;
//           gl_FragColor = vec4( color, 0.9 );
//         }
//       `.trim(),
//       transparent: true,
//       depthTest: true,
//     });

//     const particles = new THREE.Points(geometry, material);
//     scene.add(particles);

//     let mouseX = 0;
//     let mouseY = 0;
//     let targetX = 0;
//     let targetY = 0;

//     const handleMouseMove = (event: MouseEvent) => {
//       mouseX = (event.clientX - window.innerWidth / 2) * 0.8;
//       mouseY = (event.clientY - window.innerHeight / 2) * 0.8;
//     };

//     window.addEventListener("mousemove", handleMouseMove);

//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     window.addEventListener("resize", handleResize);

//     let count = 0;
//     let animationFrameId: number;

//     const animate = () => {
//       animationFrameId = requestAnimationFrame(animate);

//       targetX += (mouseX - targetX) * 0.05;
//       targetY += (mouseY - targetY) * 0.05;

//       camera.position.x += (targetX - camera.position.x) * 0.05;
//       camera.position.y += (-targetY + 400 - camera.position.y) * 0.05;
//       camera.lookAt(0, 50, 0);

//       const pos = geometry.attributes.position.array as Float32Array;
//       const sc = geometry.attributes.scale.array as Float32Array;

//       let ptr = 0;
//       for (let ix = 0; ix < AMOUNTX; ix++) {
//         for (let iy = 0; iy < AMOUNTY; iy++) {
//           pos[ptr + 1] =
//             Math.sin((ix + count) * 0.3) * 55 +
//             Math.sin((iy + count) * 0.5) * 55;

//           sc[ptr / 3] =
//             (Math.sin((ix + count) * 0.3) + 1) * 2.2 +
//             (Math.sin((iy + count) * 0.5) + 1) * 2.2;

//           ptr += 3;
//         }
//       }

//       geometry.attributes.position.needsUpdate = true;
//       geometry.attributes.scale.needsUpdate = true;

//       renderer.render(scene, camera);
//       count += 0.07;
//     };

//     animate();

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("resize", handleResize);
//       cancelAnimationFrame(animationFrameId);
//       if (containerRef.current) {
//         containerRef.current.innerHTML = "";
//       }
//     };
//   }, []);

//   return (
//     <main className="relative min-h-screen overflow-hidden bg-[#02170e] text-white selection:bg-emerald-400 selection:text-black">
//       {/* 3D Wave Canvas Container */}
//       <div ref={containerRef} className="absolute inset-0 z-0 opacity-90" />

//       {/* Radial vignette overlay */}
//       <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#02170e]/60 via-transparent to-[#02170e]" />

//       {/* Content Container */}
//       <div className="relative z-10">
//         {/* Navbar */}
//         <nav className="flex items-center justify-between px-8 py-6">
//           <div className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
//             Shippable
//           </div>

//           <div className="flex items-center gap-6">
//             <button className="text-sm font-medium text-emerald-100 transition-colors hover:text-white">
//               Login
//             </button>

//             <Link
//               href="/signup"
//               className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#02170e] shadow-lg shadow-emerald-950/20 transition-all duration-300 hover:scale-[1.03] hover:bg-emerald-50 hover:shadow-emerald-500/20 active:scale-[0.98]"
//             >
//               Get Started
//             </Link>
//           </div>
//         </nav>

//         {/* Hero */}
//         <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
//           <div className="mb-6 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-4 py-2 text-sm text-emerald-300 backdrop-blur-md transition-all hover:border-emerald-400/50">
//             AI-powered application builder
//           </div>

//           {/* FLOATING & INTERACTIVE HEADLINE */}
//           <h1 className="flex max-w-4xl flex-wrap justify-center gap-x-4 gap-y-2 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
//             {headlineWords.map((word, index) => (
//               <motion.span
//                 key={index}
//                 className="inline-block cursor-pointer bg-gradient-to-b from-white via-emerald-100 to-emerald-400/80 bg-clip-text text-transparent"
//                 // Continuous Floating Animation
//                 animate={{
//                   y: [0, -10, 0],
//                 }}
//                 transition={{
//                   duration: 3,
//                   repeat: Infinity,
//                   repeatType: "reverse",
//                   ease: "easeInOut",
//                   delay: word.delay,
//                 }}
//                 // Hover & Touch Dynamic Reaction
//                 whileHover={{
//                   scale: 1.15,
//                   rotate: index % 2 === 0 ? 3 : -3,
//                   y: -18,
//                   transition: { type: "spring", stiffness: 300, damping: 10 },
//                 }}
//                 whileTap={{
//                   scale: 0.95,
//                 }}
//               >
//                 {word.text}
//               </motion.span>
//             ))}
//           </h1>

//           <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-100/70">
//             Build real applications with AI. Choose your technology stack,
//             describe what you want, and turn your idea into a shippable product.
//           </p>

//           <div className="mt-10 flex flex-col gap-4 sm:flex-row">
//             <button className="rounded-lg bg-white px-6 py-3 font-semibold text-[#02170e] shadow-lg shadow-emerald-950/30 transition-all duration-300 hover:scale-[1.03] hover:bg-emerald-50 active:scale-[0.98]">
//               Start Building
//             </button>

//             <button className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-6 py-3 font-medium text-white backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-emerald-400/60 hover:bg-emerald-900/40 active:scale-[0.98]">
//               See How It Works
//             </button>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }