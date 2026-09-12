import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on devices with fine pointer (desktop)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    setVisible(true);
    document.body.style.cursor = 'none';

    const move = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target;
      const isInteractive = target.closest('a, button, input, textarea, select, [role="button"], [data-cursor="hover"]');
      setHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      document.body.style.cursor = '';
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <div
        className="pointer-events-none fixed z-[9999] transition-transform duration-100 ease-out"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${hovering ? 1.5 : 1})`,
        }}
      >
        <div className="w-6 h-6 rounded-full border-2 border-blue-600 dark:border-cyan-400 bg-blue-500/20 dark:bg-cyan-400/20" />
      </div>
      <div
        className="pointer-events-none fixed z-[9999] w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  );
}