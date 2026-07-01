import React from "react";
import { motion, PanInfo, useAnimation } from "framer-motion";

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftActionContent?: React.ReactNode;
  rightActionContent?: React.ReactNode;
  className?: string;
}

export function SwipeableCard({ 
  children, 
  onSwipeLeft, 
  onSwipeRight,
  leftActionContent,
  rightActionContent,
  className = "" 
}: SwipeableCardProps) {
  const controls = useAnimation();
  const swipeThreshold = 80;

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    
    if (offset > swipeThreshold && onSwipeRight) {
      // Swiped right
      await controls.start({ x: window.innerWidth, opacity: 0, transition: { duration: 0.2 } });
      onSwipeRight();
    } else if (offset < -swipeThreshold && onSwipeLeft) {
      // Swiped left
      await controls.start({ x: -window.innerWidth, opacity: 0, transition: { duration: 0.2 } });
      onSwipeLeft();
    } else {
      // Snap back
      controls.start({ x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Background Actions Layer */}
      <div className="absolute inset-0 flex items-center justify-between px-6 z-0 rounded-2xl">
        <div className="opacity-70">{leftActionContent}</div>
        <div className="opacity-70">{rightActionContent}</div>
      </div>

      {/* Foreground Draggable Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.5}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="relative z-10 w-full bg-card border border-border/40 shadow-sm rounded-2xl cursor-grab active:cursor-grabbing touch-pan-y"
      >
        {children}
      </motion.div>
    </div>
  );
}
