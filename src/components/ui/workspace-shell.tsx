import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface WorkspaceShellProps {
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
}

export function WorkspaceShell({ title, description, icon: Icon, colorClass }: WorkspaceShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 flex flex-col h-full"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 md:p-8 rounded-[32px] border border-border/40 shadow-sm relative overflow-hidden">
        <div className="space-y-2 relative z-10 flex items-center space-x-4">
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner ${colorClass}`}>
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            <p className="text-muted-foreground font-medium">{description}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border/60 rounded-[32px] bg-muted/10">
        <Icon className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-bold text-muted-foreground mb-2">Workspace in Development</h3>
        <p className="text-sm text-muted-foreground max-w-sm">This module is currently being integrated into the core OS engine. It will be available in the next phase.</p>
      </div>
    </motion.div>
  );
}
