import React, { createContext, useContext, useState, ReactNode } from "react";
import { TimelineEvent } from "@/components/ui/timeline-preview";

interface TimelineEngineState {
  events: TimelineEvent[];
  addEvent: (event: Omit<TimelineEvent, "id">) => void;
  removeEvent: (id: string) => void;
  clearEvents: () => void;
}

const TimelineContext = createContext<TimelineEngineState | undefined>(undefined);

export function TimelineProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<TimelineEvent[]>([
    { id: "e1", type: "report", title: "Lipid Panel Uploaded", description: "LDL Borderline High. OCR complete.", timestamp: "2 hrs ago", status: "completed" },
    { id: "e2", type: "chat", title: "AI Copilot Analysis", description: "Generated insights for Lipid Panel.", timestamp: "2 hrs ago", status: "completed" },
    { id: "e3", type: "medicine", title: "Atorvastatin 20mg", description: "Take with food.", timestamp: "In 1 hr", status: "pending" },
    { id: "e4", type: "appointment", title: "Cardiology Follow-up", description: "Dr. Robert Johnson.", timestamp: "Tomorrow", status: "alert" },
  ]);

  const addEvent = (event: Omit<TimelineEvent, "id">) => {
    const newEvent = { ...event, id: `evt-${Date.now()}` };
    setEvents(prev => [newEvent, ...prev]);
  };

  const removeEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const clearEvents = () => setEvents([]);

  return (
    <TimelineContext.Provider value={{ events, addEvent, removeEvent, clearEvents }}>
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimelineEngine() {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error("useTimelineEngine must be used within a TimelineProvider");
  }
  return context;
}
