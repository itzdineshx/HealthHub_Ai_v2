import React from "react";
import { motion, AnimatePresence, useDragControls, PanInfo } from "framer-motion";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function BottomSheet({ isOpen, onClose, children, title, className = "" }: BottomSheetProps) {
  const dragControls = useDragControls();

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If dragged down by more than 100px or fast swipe down, close it
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={`fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-card rounded-t-[2rem] border-t border-border shadow-2xl max-h-[90vh] pb-safe-area ${className}`}
          >
            {/* Drag Handle */}
            <div 
              className="w-full flex justify-center py-4 cursor-grab active:cursor-grabbing touch-none"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-12 h-1.5 bg-muted rounded-full" />
            </div>

            {/* Content Area */}
            <div className="px-6 pb-6 overflow-y-auto">
              {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
