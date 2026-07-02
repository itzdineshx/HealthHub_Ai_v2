import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Pill, Clock, Plus, AlertCircle, RefreshCw, Calendar, Check,
  ChevronRight, Sparkles, Trash2, Heart 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
};

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  pillsRemaining: number;
  totalPills: number;
  timeOfDay: ("morning" | "afternoon" | "evening")[];
}

export default function Medications() {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Form states
  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [instructions, setInstructions] = useState("");
  const [totalPills, setTotalPills] = useState(30);
  const [times, setTimes] = useState<("morning" | "afternoon" | "evening")[]>(["morning"]);

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "med1",
      name: "Atorvastatin",
      dosage: "10mg",
      frequency: "Once daily",
      instructions: "Take in the evening after meals",
      pillsRemaining: 18,
      totalPills: 30,
      timeOfDay: ["evening"]
    },
    {
      id: "med2",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      instructions: "Take with breakfast and dinner",
      pillsRemaining: 8, // Trigger low stock warning
      totalPills: 60,
      timeOfDay: ["morning", "evening"]
    },
    {
      id: "med3",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      instructions: "Take in the morning on an empty stomach",
      pillsRemaining: 24,
      totalPills: 30,
      timeOfDay: ["morning"]
    }
  ]);

  const [dailyLog, setDailyLog] = useState<Record<string, Record<string, boolean>>>({
    morning: { med2: true, med3: false },
    afternoon: {},
    evening: { med1: false, med2: false }
  });

  const toggleDose = (time: string, id: string) => {
    const isCurrentlyTaken = dailyLog[time]?.[id];
    setDailyLog(prev => ({
      ...prev,
      [time]: {
        ...prev[time],
        [id]: !prev[time]?.[id]
      }
    }));
    
    // Deduct/add pill count based on intake state
    setMedications(prev => prev.map(m => {
      if (m.id === id) {
        const nextCount = isCurrentlyTaken 
          ? Math.min(m.totalPills, m.pillsRemaining + 1)
          : Math.max(0, m.pillsRemaining - 1);
        return { ...m, pillsRemaining: nextCount };
      }
      return m;
    }));

    if (!isCurrentlyTaken) {
      toast({
        title: "Dose logged!",
        description: "Your medication intake has been recorded."
      });
    }
  };

  const handleAddMedication = () => {
    if (!medName || !dosage || !frequency) {
      toast({
        title: "Missing fields",
        description: "Please fill out the medication name, dosage, and frequency.",
        variant: "destructive"
      });
      return;
    }

    const newMed: Medication = {
      id: "med-" + Math.random().toString(36).substring(2),
      name: medName,
      dosage: dosage,
      frequency: frequency,
      instructions: instructions,
      pillsRemaining: totalPills,
      totalPills: totalPills,
      timeOfDay: times
    };

    setMedications([...medications, newMed]);
    
    // Initialize log entries
    times.forEach(time => {
      setDailyLog(prev => ({
        ...prev,
        [time]: {
          ...prev[time],
          [newMed.id]: false
        }
      }));
    });

    setIsAddOpen(false);
    setMedName("");
    setDosage("");
    setFrequency("");
    setInstructions("");
    setTotalPills(30);
    setTimes(["morning"]);

    toast({
      title: "Medication Added",
      description: `${newMed.name} has been added to your schedule.`
    });
  };

  const deleteMedication = (id: string, name: string) => {
    setMedications(medications.filter(m => m.id !== id));
    toast({
      title: "Medication Removed",
      description: `${name} has been removed from your list.`
    });
  };

  const handleRefill = (id: string, name: string) => {
    setMedications(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, pillsRemaining: m.totalPills };
      }
      return m;
    }));
    toast({
      title: "Refill Requested",
      description: `Refill for ${name} has been processed successfully.`
    });
  };

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
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent">
              Medication Tracker
            </h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Track dose schedules, log daily intake history, and request prescription refills with one click.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="shrink-0">
            <Button onClick={() => setIsAddOpen(true)} className="bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#6366F1] hover:to-[#4F46E5] text-white shadow-lg shadow-indigo-500/20 rounded-2xl px-6 h-12 text-sm font-bold tracking-wide border-none flex items-center gap-2">
              <Plus className="h-4.5 w-4.5" />
              <span>Add Medication</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Daily Log */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div variants={itemVariants} className="bg-[#151C2C] border border-slate-800 rounded-3xl p-5 shadow-xl">
            <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2 pl-1 border-l-2 border-indigo-500 pl-2">
              <Clock className="h-4.5 w-4.5 text-indigo-400" />
              <span>Today's Dosage Log</span>
            </h3>

            {/* Time Slots Mapping */}
            {(["morning", "afternoon", "evening"] as const).map(time => {
              const list = medications.filter(m => m.timeOfDay.includes(time));
              return (
                <div key={time} className="space-y-3 mb-6 last:mb-0">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest pl-1 mb-2.5">{time}</h4>
                  
                  <div className="space-y-2">
                    {list.map(m => {
                      const isTaken = dailyLog[time]?.[m.id];
                      return (
                        <motion.div 
                          key={m.id} 
                          whileHover={{ scale: 1.01 }}
                          className={`flex items-center justify-between border rounded-2xl p-3.5 transition-all ${isTaken ? "bg-[#10B981]/5 border-[#10B981]/20" : "bg-slate-900/30 border-slate-800/80 hover:border-slate-850"}`}
                        >
                          <div className="flex items-center gap-3">
                            <motion.button 
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleDose(time, m.id)}
                              className={`h-5.5 w-5.5 rounded-lg flex items-center justify-center border transition-all ${isTaken ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-700 hover:border-slate-500 text-transparent"}`}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </motion.button>
                            <div>
                              <p className={`text-xs font-bold transition-all ${isTaken ? "line-through text-slate-500" : "text-white"}`}>{m.name}</p>
                              <p className="text-[10px] text-slate-500 font-medium">{m.dosage}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-semibold ${isTaken ? "text-emerald-500/80" : "text-slate-500"}`}>{isTaken ? "Taken" : m.frequency}</span>
                        </motion.div>
                      );
                    })}
                    {list.length === 0 && (
                      <p className="text-[10px] text-slate-500 italic pl-1 py-1">No medication scheduled.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Right 2 Columns: Prescription List */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-bold text-slate-200 pl-1">Active Prescriptions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {medications.map((m) => {
                const percentageRemaining = (m.pillsRemaining / m.totalPills) * 100;
                const isLow = m.pillsRemaining <= 10;
                
                return (
                  <motion.div 
                    key={m.id}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className={`bg-[#151C2C] border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col justify-between overflow-hidden shadow-lg h-full ${isLow ? "hover:shadow-[0_0_30px_rgba(239,68,68,0.06)]" : "hover:shadow-[0_0_30px_rgba(99,102,241,0.06)]"}`}>
                      <CardHeader className="p-5 flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
                        <div>
                          <CardTitle className="text-white text-base font-bold flex items-center gap-1.5">
                            <Pill className="h-4.5 w-4.5 text-indigo-400" />
                            <span>{m.name}</span>
                          </CardTitle>
                          <CardDescription className="text-xs text-blue-400 font-semibold pt-0.5">{m.dosage} • {m.frequency}</CardDescription>
                        </div>
                        <button 
                          onClick={() => deleteMedication(m.id, m.name)} 
                          className="text-slate-600 hover:text-red-400 p-1 transition-colors rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </CardHeader>
                      
                      <CardContent className="px-5 pb-4 pt-0 space-y-3.5 text-xs text-slate-300">
                        <p className="italic text-[11px] text-slate-400 leading-normal bg-slate-900/20 p-2.5 rounded-xl border border-slate-850">"{m.instructions}"</p>
                        
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-slate-500 font-bold uppercase tracking-wider">Supply status</span>
                            <span className={`font-extrabold ${isLow ? "text-red-400" : "text-slate-400"}`}>{m.pillsRemaining} / {m.totalPills} pills</span>
                          </div>
                          <Progress value={percentageRemaining} className={`h-1.5 bg-slate-800 ${isLow ? "text-red-500" : "text-indigo-500"}`} />
                        </div>
                      </CardContent>

                      <CardFooter className="bg-slate-900/40 px-5 py-4 border-t border-slate-800/80 flex items-center justify-between">
                        {isLow ? (
                          <span className="flex items-center gap-1 text-[10px] text-red-400 font-bold bg-red-500/10 border border-red-500/10 px-2.5 py-0.5 rounded-full animate-pulse">
                            <AlertCircle className="h-3 w-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/10 px-2.5 py-0.5 rounded-full">Optimal</span>
                        )}
                        
                        <Button 
                          onClick={() => handleRefill(m.id, m.name)} 
                          size="sm" 
                          variant="outline" 
                          className="border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 text-[10px] h-8.5 rounded-xl flex items-center gap-1 px-3"
                        >
                          <RefreshCw className="h-3 w-3" /> Refill
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

      </div>

      {/* Add Medication Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-[#151C2C] border-slate-800 text-white max-w-sm rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-bold">Add New Medication</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs mt-1">
              Add a new prescription to your dashboard and specify intake schedule.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold">Medication Name</label>
              <Input 
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                placeholder="e.g. Lipitor"
                className="bg-slate-900 border-slate-800 text-white h-10 rounded-xl focus-visible:ring-indigo-600 shadow-inner"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Dosage</label>
                <Input 
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g. 10mg"
                  className="bg-slate-900 border-slate-800 text-white h-10 rounded-xl focus-visible:ring-indigo-600 shadow-inner"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Frequency</label>
                <Input 
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  placeholder="e.g. Once daily"
                  className="bg-slate-900 border-slate-800 text-white h-10 rounded-xl focus-visible:ring-indigo-600 shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold">Special Instructions</label>
              <Input 
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Take after dinner"
                className="bg-slate-900 border-slate-800 text-white h-10 rounded-xl focus-visible:ring-indigo-600 shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold">Pills in Pack</label>
              <Input 
                type="number"
                value={totalPills}
                onChange={(e) => setTotalPills(parseInt(e.target.value) || 30)}
                className="bg-slate-900 border-slate-800 text-white h-10 rounded-xl focus-visible:ring-indigo-600 shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold">Daily Intake Slots</label>
              <div className="flex gap-2">
                {["morning", "afternoon", "evening"].map((time) => {
                  const isSelected = times.includes(time as any);
                  return (
                    <Button
                      key={time}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      className={`h-9 text-[10px] capitalize flex-1 rounded-xl font-bold ${isSelected ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "border-slate-800 text-slate-300 hover:bg-slate-800 bg-transparent"}`}
                      onClick={() => {
                        if (isSelected) {
                          setTimes(times.filter(t => t !== time));
                        } else {
                          setTimes([...times, time as any]);
                        }
                      }}
                    >
                      {time}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white hover:bg-slate-800 h-10 rounded-xl text-xs">
              Cancel
            </Button>
            <Button onClick={handleAddMedication} className="bg-indigo-600 hover:bg-indigo-500 text-white h-10 rounded-xl text-xs font-bold px-5">
              Save Medication
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
