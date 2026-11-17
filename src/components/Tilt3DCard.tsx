import { useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface Tilt3DCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

export function Tilt3DCard({ children, className = '', maxTilt = 7 }: Tilt3DCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, hovered: false });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const rotateY = (px - 0.5) * 2 * maxTilt;
    const rotateX = -(py - 0.5) * 2 * maxTilt;

    setTilt({
      rotateX,
      rotateY,
      glareX: px * 100,
      glareY: py * 100,
      hovered: true,
    });
  }

  function handleMouseLeave() {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, hovered: false });
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        scale: tilt.hovered && !prefersReducedMotion ? 1.015 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 240,
        damping: 22,
        mass: 0.7,
      }}
      style={{
        transformPerspective: 1100,
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
    >
      {children}
      {!prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-200"
          style={{
            opacity: tilt.hovered ? 0.14 : 0,
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(200, 245, 44, 0.55), transparent 60%)`,
          }}
        />
      )}
    </motion.div>
  );
}
