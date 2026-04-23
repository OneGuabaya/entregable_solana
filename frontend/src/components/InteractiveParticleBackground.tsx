"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    speed: number;
    radius: number;
    opacity: number;
    isBright: boolean;
}

export default function InteractiveParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particlesArray: Particle[] = [];
        const numberOfParticles = 250; // Ajusta según la densidad que prefieras
        let mouse = { x: 0, y: 0 };
        const mouseRadius = 80; // Radio de interacción del mouse

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles(); // Reiniciar partículas al cambiar el tamaño de ventana
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const initParticles = () => {
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const speed = Math.random() * 0.8 + 0.1; // Caída sutil
                const radius = Math.random() * 1.5 + 0.5; // Pequeñas
                const opacity = Math.random() * 0.5 + 0.1; // Sutiles

                particlesArray.push({ x, y, speed, radius, opacity, isBright: false });
            }
        };

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particlesArray.length; i++) {
                const p = particlesArray[i];
                p.y += p.speed;
                if (p.y > canvas.height) p.y = 0;

                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                ctx.beginPath();
                // Partículas mucho más pequeñas (0.2 a 1.2)
                const currentRadius = distance < mouseRadius ? p.radius * 1.5 : p.radius;
                ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);

                if (distance < mouseRadius) {
                    // Efecto de resplandor (Glow)
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = "#a855f7";
                    ctx.fillStyle = `rgba(168, 85, 247, 0.9)`;
                } else {
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = `rgba(147, 197, 253, ${p.opacity})`;
                }

                ctx.fill();
                ctx.closePath();
            }
            animationFrameId = window.requestAnimationFrame(animateParticles);
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        handleResize();
        initParticles();
        animateParticles();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 -z-10 bg-[#020617]" // Fondo oscuro futurista (Slate 950)
        />
    );
}