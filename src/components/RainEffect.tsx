import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    speed: number;
    length: number;
    opacity: number;
}

interface RainEffectProps {
    active: boolean;
}

const RainEffect = ({ active }: RainEffectProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animFrameRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);

    useEffect(() => {
        if (!active) {
            cancelAnimationFrame(animFrameRef.current);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Init particles
        particlesRef.current = Array.from({ length: 120 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: 6 + Math.random() * 8,
            length: 15 + Math.random() * 20,
            opacity: 0.2 + Math.random() * 0.5,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesRef.current.forEach((p) => {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - 1, p.y + p.length);
                ctx.strokeStyle = `rgba(96, 165, 250, ${p.opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
                p.y += p.speed;
                if (p.y > canvas.height) {
                    p.y = -p.length;
                    p.x = Math.random() * canvas.width;
                }
            });
            animFrameRef.current = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            cancelAnimationFrame(animFrameRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [active]);

    if (!active) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: 0.6 }}
        />
    );
};

export default RainEffect;
