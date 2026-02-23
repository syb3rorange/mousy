/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';

export default function App() {
  const [isLeftPawDown, setIsLeftPawDown] = useState(false);
  const [isRightPawDown, setIsRightPawDown] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [bgColor, setBgColor] = useState('#00FF00'); // Default to green screen
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = () => setIsLeftPawDown(true);
    const handleKeyUp = () => setIsLeftPawDown(false);

    const handleMouseDown = () => setIsRightPawDown(true);
    const handleMouseUp = () => setIsRightPawDown(false);

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Normalize mouse position relative to the cat's right side area
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        // Limit movement range for the right paw
        setMousePos({
          x: (x - 0.7) * 40, // Offset and scale
          y: (y - 0.5) * 40
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ backgroundColor: bgColor }}
    >
      {/* Settings (Hidden in OBS usually) */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 hover:opacity-100 transition-opacity z-50">
        <button onClick={() => setBgColor('#000000')} className="w-8 h-8 rounded bg-black border border-white/20" />
        <button onClick={() => setBgColor('#00FF00')} className="w-8 h-8 rounded bg-[#00FF00] border border-black/20" />
      </div>

      <div className="relative w-[600px] h-[400px]">
        {/* Desk / Keyboard Area */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-zinc-800 rounded-t-xl border-t-4 border-zinc-700 shadow-2xl" />
        
        {/* The Cat Body */}
        <svg viewBox="0 0 500 300" className="w-full h-full drop-shadow-2xl">
          {/* Body */}
          <path 
            d="M100,250 Q100,100 250,100 Q400,100 400,250 L400,300 L100,300 Z" 
            fill="white" 
            stroke="black" 
            strokeWidth="8"
          />
          
          {/* Ears */}
          <path d="M130,120 L110,70 L170,105" fill="white" stroke="black" strokeWidth="8" strokeLinejoin="round" />
          <path d="M370,120 L390,70 L330,105" fill="white" stroke="black" strokeWidth="8" strokeLinejoin="round" />
          
          {/* Eyes */}
          <circle cx="200" cy="180" r="6" fill="black" />
          <circle cx="300" cy="180" r="6" fill="black" />
          
          {/* Mouth */}
          <path d="M240,210 Q250,220 260,210" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
          
          {/* Left Paw (Keyboard) */}
          <motion.path
            animate={{
              d: isLeftPawDown 
                ? "M120,250 Q140,280 180,280" // Down position
                : "M120,250 Q140,200 180,220", // Up position
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            fill="none"
            stroke="white"
            strokeWidth="25"
            strokeLinecap="round"
          />
          <motion.path
            animate={{
              d: isLeftPawDown 
                ? "M120,250 Q140,280 180,280" 
                : "M120,250 Q140,200 180,220",
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            fill="none"
            stroke="black"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Right Paw (Mouse) */}
          <motion.g
            animate={{
              x: mousePos.x,
              y: mousePos.y + (isRightPawDown ? 10 : 0)
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Paw Arm */}
            <path
              d="M380,250 Q360,200 320,220"
              fill="none"
              stroke="white"
              strokeWidth="25"
              strokeLinecap="round"
            />
            <path
              d="M380,250 Q360,200 320,220"
              fill="none"
              stroke="black"
              strokeWidth="8"
              strokeLinecap="round"
            />
            
            {/* Mouse Visual */}
            <rect x="290" y="210" width="30" height="45" rx="15" fill="#333" stroke="black" strokeWidth="2" />
            <line x1="305" y1="210" x2="305" y2="225" stroke="black" strokeWidth="2" />
          </motion.g>
        </svg>

        {/* Visual Feedback for Keys */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none">
          <div className={`px-4 py-2 rounded-lg border-2 transition-colors ${isLeftPawDown ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-zinc-900/50 border-zinc-700 text-zinc-500'}`}>
            KEYBOARD
          </div>
          <div className={`px-4 py-2 rounded-lg border-2 transition-colors ${isRightPawDown ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-zinc-900/50 border-zinc-700 text-zinc-500'}`}>
            MOUSE
          </div>
        </div>
      </div>

      <div className="mt-8 text-zinc-800 font-bold text-xl uppercase tracking-widest opacity-30">
        Bongo Cat Cam v2
      </div>
    </div>
  );
}
