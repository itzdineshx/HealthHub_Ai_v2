import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, Clock, Video, User, Check, Plus, 
  ChevronRight, AlertCircle, Phone, ArrowLeft, ArrowRight, ShieldCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
};

interface CalendarSlot {
  time: string;
  patientName?: string;
  condition?: string;
  type?: "Video" | "In-Person";
  status?: "Scheduled" | "Completed" | "Pending";
  image?: string;
}

export default function DoctorCalendar() {
  const { toast } = useState(() => useToast().toast); // Fixed hook usage inside state to keep references correct
  const [selectedDay, setSelectedDay] = useState(2); // 2 represents Tuesday (Today)
  
  const weekDays = [
    { name: "Sun", date: 28, id: 0 },
    { name: "Mon", date: 29, id: 1 },
    { name: "Tue", date: 30, id: 2, isToday: true }, // 30 Jun
    { name: "Wed", date: 1, id: 3 },
    { name: "Thu", date: 2, id: 4 },
    { name: "Fri", date: 3, id: 5 },
    { name: "Sat", date: 4, id: 6 }
  ];

  const calendarSlots: Record<number, CalendarSlot[]> = {
    2: [
      { time: "09:00 AM", patientName: "Dinesh Sharma", condition: "LDL Borderline High", type: "Video", status: "Completed", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
      { time: "10:30 AM", patientName: "Amelia Watson", condition: "Migraine Monitoring", type: "Video", status: "Scheduled", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" },
      { time: "12:00 PM" }, // Free slot
      { time: "01:30 PM", patientName: "Bruce Wayne", condition: "Acute Joint Trauma", type: "In-Person", status: "Scheduled", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
      { time: "03:00 PM" }, // Free slot
      { time: "04:30 PM", patientName: "Clara Oswald", condition: "Annual Checkup", type: "In-Person", status: "Scheduled", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" }
    ],
    3: [
      { time: "10:00 AM", patientName: "John Connor", condition: "Cardiology Review", type: "Video", status: "Scheduled", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" },
      { time: "11:30 AM" },
      { time: "02:00 PM", patientName: "Sara Croft", condition: "Routine ECG Check", type: "In-Person", status: "Scheduled", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" }
    ]
  };

  const daySlots = calendarSlots[selectedDay] || [
    { time: "09:00 AM" }, { time: "11:00 AM" }, { time: "01:00 PM" }, { time: "03:00 PM" }
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 text-slate-100 max-w-[1600px] mx-auto pb-12"
    >
      {/* Header Banner */}
      <motion.div 
        variants={itemVariants} 
        className="relative bg-gradient-to-r from-[#1E1B4B]/80 to-[#0F172A]/80 border border-blue-900/30 rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl backdrop-blur-md"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
              Clinical Scheduler
            </h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Organize your consultation calendar, set slot allocations, and launch remote telemedicine video consults.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-blue-600/10 border border-blue-500/10 px-4 py-2 rounded-xl">
            <CalendarIcon className="h-5 w-5 text-blue-400" />
            <span className="text-xs font-bold text-blue-400 uppercase">July 2026</span>
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Date selection widget */}
        <div className="space-y-6">
          <motion.div variants={itemVariants} className="bg-[#151C2C] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Weekly Overview</h3>
              <div className="flex space-x-1.5">
                <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-slate-500 hover:text-white"><ArrowLeft className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-slate-500 hover:text-white"><ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2.5 text-center">
              {weekDays.map(day => {
                const isSelected = day.id === selectedDay;
                return (
                  <div 
                    key={day.id}
                    onClick={() => setSelectedDay(day.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-between gap-1 border border-transparent ${isSelected ? "bg-blue-600 border-blue-500 shadow-md shadow-blue-500/20 text-white" : "bg-slate-900/30 border-slate-850 text-slate-400 hover:border-slate-800"}`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider">{day.name}</span>
                    <span className="text-sm font-black">{day.date}</span>
                    {day.isToday && <span className={`h-1 w-1 rounded-full ${isSelected ? "bg-white" : "bg-blue-500"}`} />}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right 2 Columns: Scheduled Slots Hour-by-Hour */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants} className="bg-[#151C2C] border border-slate-800 rounded-3xl p-5 shadow-xl">
            <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center justify-between border-b border-slate-850 pb-4">
              <span>Hourly Allocation</span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                {weekDays.find(d => d.id === selectedDay)?.name}, Jul {weekDays.find(d => d.id === selectedDay)?.date}
              </span>
            </h3>

            <div className="space-y-4">
              {daySlots.map((slot, index) => {
                const isBooked = !!slot.patientName;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <span className="w-16 text-right text-[11px] font-bold text-slate-500 pt-3 shrink-0">{slot.time}</span>
                    
                    <div className="flex-1">
                      {isBooked ? (
                        <div className="bg-slate-900/50 border border-slate-850 hover:border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4 transition-colors">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 rounded-xl border border-slate-800">
                              <AvatarImage src={slot.image} className="object-cover" />
                              <AvatarFallback>D</AvatarFallback>
                            </Avatar>
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-bold text-white leading-tight">{slot.patientName}</h4>
                              <p className="text-[10px] text-slate-400">{slot.condition}</p>
                              <span className={`text-[8px] font-bold tracking-wider px-2 py-0.5 rounded-full border inline-block mt-1.5 uppercase ${slot.type === "Video" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>{slot.type}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {slot.status === "Completed" ? (
                              <span className="text-[9px] bg-slate-800 text-slate-400 border border-slate-700/50 px-2 py-0.5 rounded-full font-bold uppercase">Done</span>
                            ) : (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold h-8.5 px-3 text-[10px] flex items-center gap-1">
                                <Video className="h-3.5 w-3.5" /> Start Consult
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="border border-dashed border-slate-800/80 rounded-2xl p-4 flex items-center justify-between text-slate-500 hover:border-slate-800 hover:text-slate-400 transition-colors">
                          <span className="text-xs font-semibold italic">Unallocated Slot</span>
                          <Button size="sm" variant="ghost" className="h-8 rounded-xl text-[10px] font-bold hover:bg-slate-850 text-slate-400 hover:text-white flex items-center gap-1">
                            <Plus className="h-3.5 w-3.5" /> Allocate Patient
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
