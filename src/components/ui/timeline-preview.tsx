import React from "react";
import { CheckCircle2, FileText, Pill, Stethoscope, Dumbbell, Utensils, MessageSquare, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "./badge";

export type TimelineEvent = {
  id: string;
  type: "report" | "medicine" | "appointment" | "workout" | "meal" | "chat";
  title: string;
  description: string;
  timestamp: string;
  status?: "pending" | "completed" | "alert";
};

const iconMap = {
  report: { icon: FileText, color: "text-medical-blue", bg: "bg-medical-blue/10" },
  medicine: { icon: Pill, color: "text-warning-amber", bg: "bg-warning-amber/10" },
  appointment: { icon: Stethoscope, color: "text-emerald-green", bg: "bg-emerald-green/10" },
  workout: { icon: Dumbbell, color: "text-info-cyan", bg: "bg-info-cyan/10" },
  meal: { icon: Utensils, color: "text-orange-500", bg: "bg-orange-500/10" },
  chat: { icon: MessageSquare, color: "text-ai-purple", bg: "bg-ai-purple/10" },
};

interface TimelinePreviewProps {
  events: TimelineEvent[];
}

export function TimelinePreview({ events }: TimelinePreviewProps) {
  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const style = iconMap[event.type];
        const Icon = style.icon;

        return (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            key={event.id} 
            className="flex gap-4 relative"
          >
            {/* Connecting line */}
            {index !== events.length - 1 && (
              <div className="absolute left-5 top-10 bottom-[-16px] w-0.5 bg-border/60 z-0" />
            )}
            
            <div className={`h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center relative z-10 shadow-sm ${style.bg} ${style.color}`}>
              <Icon className="h-5 w-5" />
            </div>

            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground leading-none">{event.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1.5">{event.description}</p>
                </div>
                <div className="text-right flex flex-col items-end shrink-0 pl-2">
                  <span className="text-[10px] font-semibold text-muted-foreground">{event.timestamp}</span>
                  {event.status === "alert" && (
                    <Badge className="mt-1 bg-critical-red/10 text-critical-red border-none text-[8px] px-1 py-0 uppercase">Action Needed</Badge>
                  )}
                  {event.status === "pending" && (
                    <Badge className="mt-1 bg-warning-amber/10 text-warning-amber border-none text-[8px] px-1 py-0 uppercase">Pending</Badge>
                  )}
                  {event.status === "completed" && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-green mt-1" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
      
      <button className="w-full py-2 flex items-center justify-center text-xs font-semibold text-medical-blue hover:bg-medical-blue/5 rounded-xl transition-colors border border-dashed border-border">
        <Plus className="h-3.5 w-3.5 mr-1" /> View Full Timeline
      </button>
    </div>
  );
}
