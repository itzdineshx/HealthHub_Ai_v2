import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertCircle, Phone, Heart, Users, ShieldAlert, Check, 
  MapPin, Printer, ShieldCheck, HelpCircle, Eye, Info, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
};

export default function Emergency() {
  const { toast } = useToast();
  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [countdownTimer, setCountdownTimer] = useState<NodeJS.Timeout | null>(null);
  
  const handleSOSClick = () => {
    if (sosActive) {
      // Cancel SOS
      if (countdownTimer) clearInterval(countdownTimer);
      setSosActive(false);
      setSosCountdown(5);
      toast({
        title: "SOS Cancelled",
        description: "Emergency broadcast has been aborted.",
        variant: "default"
      });
    } else {
      // Trigger countdown
      setSosActive(true);
      const timer = setInterval(() => {
        setSosCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            toast({
              title: "SOS Alert Dispatched!",
              description: "Simulated emergency alert sent to your Care Circle and EMT responders.",
              variant: "destructive"
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setCountdownTimer(timer);
    }
  };

  const emergencyContacts = [
    { name: "Emergency Services", phone: "911", relation: "Local Emergency" },
    { name: "Priya Kumar", phone: "+1 (555) 902-1823", relation: "Spouse (Primary Contact)" },
    { name: "Dr. Sarah Johnson", phone: "+1 (555) 124-5829", relation: "Cardiologist (Physician)" }
  ];

  const guides = [
    {
      title: "Choking (Conscious)",
      steps: [
        "Give 5 back blows between the shoulder blades with the heel of your hand.",
        "Give 5 abdominal thrusts (Heimlich maneuver).",
        "Alternate 5 blows and 5 thrusts until the blockage is cleared."
      ]
    },
    {
      title: "Cardiopulmonary Resuscitation (CPR)",
      steps: [
        "Call 911 immediately.",
        "Push hard and fast in the center of the chest (100 to 120 compressions per min).",
        "If trained, give 2 rescue breaths after every 30 compressions."
      ]
    },
    {
      title: "Severe Bleeding",
      steps: [
        "Apply direct pressure to the wound with a clean cloth or bandage.",
        "Maintain pressure until bleeding stops.",
        "Elevate the injured limb above heart level if possible."
      ]
    },
    {
      title: "Chemical / Heat Burns",
      steps: [
        "Cool the burn with cool (not cold) running water for at least 10 minutes.",
        "Remove any tight clothing or jewelry before swelling begins.",
        "Cover loosely with a sterile, non-adhesive bandage."
      ]
    }
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
        className="relative bg-gradient-to-r from-red-950/40 to-[#0F172A]/80 border border-red-900/30 rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl backdrop-blur-md"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <ShieldAlert className="h-8.5 w-8.5 text-red-500 animate-pulse" />
              <span className="bg-gradient-to-r from-white via-slate-100 to-red-400 bg-clip-text text-transparent">Emergency Center</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Trigger instant SOS broadcasts, access clinical medical credentials for first-responders, and review first-aid instructions.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: SOS Trigger & Contacts */}
        <div className="space-y-6">
          
          {/* Big SOS Button Card */}
          <motion.div variants={itemVariants} className="bg-[#151C2C] border border-slate-800 rounded-3xl p-6 shadow-xl text-center flex flex-col items-center justify-center relative overflow-hidden">
            <h3 className="text-base font-bold text-slate-200 mb-6 uppercase tracking-wider text-xs">SOS Dispatcher</h3>
            
            <div className="relative flex items-center justify-center h-44 w-44 mb-6">
              {/* Outer pulsing rings */}
              <AnimatePresence>
                {sosActive && (
                  <>
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ scale: 1.6, opacity: 0 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 rounded-full bg-red-600"
                    />
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0.3 }}
                      animate={{ scale: 2.0, opacity: 0 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                      className="absolute inset-0 rounded-full bg-red-500"
                    />
                  </>
                )}
              </AnimatePresence>
              
              <button 
                onClick={handleSOSClick}
                className={`h-36 w-36 rounded-full flex flex-col items-center justify-center font-black text-white text-3xl transition-all shadow-2xl relative z-10 ${sosActive ? "bg-slate-850 hover:bg-slate-800 ring-4 ring-red-500/20 text-red-500 border border-slate-800" : "bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-95 text-white"}`}
              >
                {sosActive ? (
                  <>
                    <span className="text-4xl text-red-500">{sosCountdown}</span>
                    <span className="text-[10px] tracking-widest uppercase text-slate-400 font-extrabold mt-2.5">Cancel</span>
                  </>
                ) : (
                  <>
                    <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">SOS</span>
                    <span className="text-[9px] tracking-widest uppercase text-red-200 font-extrabold mt-2 bg-red-800/30 px-3 py-1 rounded-full border border-red-500/20">Trigger</span>
                  </>
                )}
              </button>
            </div>
            
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              {sosActive 
                ? "Emergency dispatcher engaged. Tapping cancels broadcast."
                : "Active SOS triggers instant location-sharing, dials primary emergency contacts, and prepares your medical files for responders."}
            </p>
          </motion.div>

          {/* Quick-Dial Contacts */}
          <motion.div variants={itemVariants} className="bg-[#151C2C] border border-slate-800 rounded-3xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-1.5 pl-2 border-l-2 border-red-500">
              <Phone className="h-4.5 w-4.5 text-red-500" />
              <span>Emergency Contacts</span>
            </h3>

            <div className="space-y-3">
              {emergencyContacts.map((contact, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/40 border border-slate-850">
                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug">{contact.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{contact.relation}</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-slate-800 bg-[#151C2C] text-red-400 hover:bg-red-500/10 hover:text-red-300 h-8.5 rounded-xl font-bold text-[10px] flex items-center gap-1">
                    <Phone className="h-3 w-3 fill-red-500/10" /> Call
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Center Column: Digital Health Card */}
        <div className="space-y-6">
          <motion.div 
            variants={itemVariants} 
            className="bg-gradient-to-br from-[#1E1B4B] via-[#111827] to-[#030712] border border-blue-900/30 rounded-3xl p-5 shadow-xl space-y-4 hover:shadow-[0_0_40px_rgba(239,68,68,0.04)] transition-all"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Heart className="h-4.5 w-4.5 text-red-500 fill-red-500/20" />
                Digital Medical Passport
              </h3>
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white text-xs h-7 px-2">
                <Printer className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-4 space-y-3.5 text-xs leading-normal">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Full Name</span>
                <span className="text-white font-extrabold">Dinesh Kumar</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Blood Group</span>
                <span className="text-red-400 font-black bg-red-500/10 border border-red-500/10 px-3 py-0.5 rounded-md text-xs">O+ (Positive)</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Age / DOB</span>
                <span className="text-white font-bold">32 / 12 Oct 1994</span>
              </div>
              <div className="space-y-1.5 border-b border-slate-900 pb-2.5">
                <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Severe Allergies</p>
                <p className="text-amber-400 font-extrabold bg-amber-500/10 border border-amber-500/10 px-2.5 py-0.5 rounded-md w-fit text-[11px]">Penicillin, Peanuts</p>
              </div>
              <div className="space-y-1.5 border-b border-slate-900 pb-2.5">
                <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Chronic Medications</p>
                <p className="text-slate-300 font-bold text-[11px]">Atorvastatin (10mg), Metformin (500mg)</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Critical Diagnostics</p>
                <p className="text-slate-400 text-[11px] leading-relaxed font-semibold">Prior mild cardiovascular history, checks vitals twice weekly. Keep epinephrine auto-injector handy.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 justify-center">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="font-semibold">Compliant HIPAA secure credentials.</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: First Aid AI Guides */}
        <div className="space-y-6">
          <motion.div variants={itemVariants} className="bg-[#151C2C] border border-slate-800 rounded-3xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-1.5 pl-2 border-l-2 border-indigo-500">
              <HelpCircle className="h-4.5 w-4.5 text-indigo-400" />
              <span>First-Aid Quick Action</span>
            </h3>

            <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1.5 scrollbar-none">
              {guides.map((guide, i) => (
                <div key={i} className="border border-slate-850 rounded-2xl p-4 space-y-2.5 bg-slate-900/20">
                  <h4 className="text-xs font-extrabold text-white flex items-center justify-between">
                    <span>{guide.title}</span>
                    <Eye className="h-4 w-4 text-slate-500 cursor-pointer hover:text-slate-300 transition-colors" />
                  </h4>
                  <ul className="space-y-2 list-none">
                    {guide.steps.map((step, idx) => (
                      <li key={idx} className="text-[10px] text-slate-450 leading-relaxed font-semibold flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
