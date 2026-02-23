/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MousePointer2, Mouse, ArrowBigUp, Space as SpaceIcon, Command } from 'lucide-react';

type KeyState = { [key: string]: boolean };

export default function App() {
  const [pressedKeys, setPressedKeys] = useState<KeyState>({});
  const [mouseButtons, setMouseButtons] = useState<KeyState>({});
  const [bgColor, setBgColor] = useState('#000000');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKeys((prev) => ({ ...prev, [e.code]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys((prev) => ({ ...prev, [e.code]: false }));
    };

    const handleMouseDown = (e: MouseEvent) => {
      // 0: Left, 1: Middle, 2: Right
      setMouseButtons((prev) => ({ ...prev, [`Mouse${e.button}`]: true }));
    };

    const handleMouseUp = (e: MouseEvent) => {
      setMouseButtons((prev) => ({ ...prev, [`Mouse${e.button}`]: false }));
    };

    // Prevent context menu on right click to allow tracking Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const Key = ({ code, label, className = "" }: { code: string, label: React.ReactNode, className?: string }) => {
    const isPressed = pressedKeys[code];
    return (
      <div
        className={`
          flex items-center justify-center rounded-md border-2 transition-all duration-100
          ${className}
          ${isPressed 
            ? 'bg-zinc-800 border-[#00ffff] text-[#00ffff] shadow-[0_0_15px_rgba(0,255,255,0.6)] scale-95' 
            : 'bg-zinc-900 border-zinc-700 text-zinc-500 shadow-none scale-100'
          }
        `}
      >
        <span className="font-bold text-sm uppercase">{label}</span>
      </div>
    );
  };

  const MouseButton = ({ button, label, className = "" }: { button: number, label: React.ReactNode, className?: string }) => {
    const isPressed = mouseButtons[`Mouse${button}`];
    return (
      <div
        className={`
          flex items-center justify-center rounded-md border-2 transition-all duration-100
          ${className}
          ${isPressed 
            ? 'bg-zinc-800 border-[#00ffff] text-[#00ffff] shadow-[0_0_15px_rgba(0,255,255,0.6)] scale-95' 
            : 'bg-zinc-900 border-zinc-700 text-zinc-500 shadow-none scale-100'
          }
        `}
      >
        {label}
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-8 font-mono select-none overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Settings Toggle (Hidden in Streamlabs usually, but good for setup) */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setBgColor('#000000')}
          className="w-6 h-6 rounded-full bg-black border border-white/20"
          title="Black Background"
        />
        <button 
          onClick={() => setBgColor('#00FF00')}
          className="w-6 h-6 rounded-full bg-[#00FF00] border border-black/20"
          title="Green Screen"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-center">
        {/* Keyboard Layout */}
        <div className="grid gap-4">
          {/* WASD Cluster */}
          <div className="grid grid-cols-3 gap-2 justify-center">
            <div />
            <Key code="KeyW" label="W" className="w-14 h-14" />
            <div />
            <Key code="KeyA" label="A" className="w-14 h-14" />
            <Key code="KeyS" label="S" className="w-14 h-14" />
            <Key code="KeyD" label="D" className="w-14 h-14" />
          </div>

          {/* Modifiers */}
          <div className="grid grid-cols-1 gap-2">
            <div className="flex gap-2">
              <Key code="ShiftLeft" label="Shift" className="w-24 h-12" />
              <Key code="ControlLeft" label="Ctrl" className="w-20 h-12" />
            </div>
            <Key code="Space" label="Space" className="w-full h-12" />
          </div>
        </div>

        {/* Mouse Layout */}
        <div className="relative w-40 h-64 bg-zinc-900/50 rounded-3xl border-2 border-zinc-800 flex flex-col p-2">
          <div className="flex h-1/2 gap-1">
            <MouseButton button={0} label={<span className="text-xs font-bold">LMB</span>} className="flex-1 rounded-tl-2xl" />
            <div className="w-4 flex flex-col gap-1">
              <MouseButton button={1} label={<div className="w-1 h-4 bg-current rounded-full" />} className="h-12" />
            </div>
            <MouseButton button={2} label={<span className="text-xs font-bold">RMB</span>} className="flex-1 rounded-tr-2xl" />
          </div>
          <div className="flex-1 flex items-center justify-center opacity-20">
            <Mouse size={48} className="text-zinc-500" />
          </div>
        </div>
      </div>

      {/* Info for setup */}
      <div className="mt-12 text-zinc-600 text-[10px] uppercase tracking-widest text-center">
        Gaming Input Overlay • Streamlabs Ready
        <br />
        Right-click context menu disabled for tracking
      </div>
    </div>
  );
}
