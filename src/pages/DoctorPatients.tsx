import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Search, User, Filter, AlertCircle, Phone, 
  Mail, Calendar, Heart, FileText, Plus, ShieldCheck, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  condition: string;
  risk: "high" | "medium" | "low";
  lastVisit: string;
  image: string;
  history: string[];
}

const mockPatients: Patient[] = [
  {
    id: "pat-1",
    name: "Dinesh Sharma",
    age: 34,
    gender: "Male",
    bloodGroup: "O+",
    phone: "+91 98765 43210",
    email: "dinesh.sharma@example.com",
    condition: "LDL Borderline High",
    risk: "medium",
    lastVisit: "28 Jun 2026",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    history: ["Mild hyperlipidemia diagnosed in 2025", "Consistent cardiovascular vital checks", "Allergic to Penicillin"]
  },
  {
    id: "pat-2",
    name: "Amelia Watson",
    age: 29,
    gender: "Female",
    bloodGroup: "A-",
    phone: "+1 (555) 902-1832",
    email: "amelia.w@example.com",
    condition: "Migraine Monitoring",
    risk: "low",
    lastVisit: "15 Jun 2026",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    history: ["Chronic migraine since adolescence", "Taking lifestyle triggers notes monthly", "No known food allergies"]
  },
  {
    id: "pat-3",
    name: "Bruce Wayne",
    age: 41,
    gender: "Male",
    bloodGroup: "AB+",
    phone: "+1 (555) 302-1982",
    email: "bruce@waynecorp.com",
    condition: "Acute Joint Trauma",
    risk: "high",
    lastVisit: "Yesterday",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    history: ["Multiple soft tissue injuries", "Requires regular orthopedic rehabilitation assessments", "Mild sleep disorder notes"]
  },
  {
    id: "pat-4",
    name: "Clara Oswald",
    age: 26,
    gender: "Female",
    bloodGroup: "B-",
    phone: "+44 7911 123456",
    email: "clara.oswald@domain.co.uk",
    condition: "Annual Checkup",
    risk: "low",
    lastVisit: "01 Jun 2026",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    history: ["General wellness optimal", "Vitamins supplement recommendations", "No medical concerns flagged"]
  }
];

export default function DoctorPatients() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("pat-1");
  const [noteText, setNoteText] = useState("");
  
  const activePatient = mockPatients.find(p => p.id === selectedPatientId) || mockPatients[0];
  
  const filteredPatients = mockPatients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNote = () => {
    if (!noteText.trim()) {
      toast({
        title: "Empty note",
        description: "Please write some clinical context before saving.",
        variant: "destructive"
      });
      return;
    }

    activePatient.history.unshift(noteText);
    setNoteText("");
    toast({
      title: "Note Saved",
      description: `Clinical update added to ${activePatient.name}'s chart.`
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
              Patient Records Directory
            </h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Access comprehensive Electronic Health Records (EHR), track clinical diagnostics, and save diagnostic consult updates.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-blue-600/10 border border-blue-500/10 px-4 py-2 rounded-xl">
            <Users className="h-5 w-5 text-blue-400" />
            <span className="text-xs font-bold text-blue-400 uppercase">{mockPatients.length} Active Patients</span>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Patient List Selector */}
        <div className="space-y-6">
          <motion.div variants={itemVariants} className="relative flex items-center bg-[#151C2C] border border-slate-800 rounded-2xl px-4 py-1.5 focus-within:border-blue-500/50 transition-colors shadow-inner">
            <Search className="text-slate-500 h-5 w-5 mr-2 shrink-0" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patients by name or diagnostic..."
              className="bg-transparent border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder-slate-500 h-10 w-full"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            {filteredPatients.map((p) => {
              const isSelected = p.id === selectedPatientId;
              return (
                <div 
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 shadow-md ${isSelected ? "bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.06)]" : "bg-[#151C2C] border-slate-800 hover:border-slate-700/80"}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 rounded-xl border border-slate-700">
                      <AvatarImage src={p.image} className="object-cover" />
                      <AvatarFallback>{p.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white leading-tight">{p.name}</h4>
                      <p className="text-[10px] text-slate-400">{p.gender} • {p.age} yrs • {p.condition}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${p.risk === "high" ? "bg-red-500/10 text-red-400 border-red-500/20" : p.risk === "medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>{p.risk}</span>
                    <span className="text-[9px] text-slate-500">{p.lastVisit}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right 2 Columns: Selected Patient Chart */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants} className="bg-[#151C2C] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 rounded-2xl border border-slate-700">
                  <AvatarImage src={activePatient.image} className="object-cover" />
                  <AvatarFallback>{activePatient.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-extrabold text-white">{activePatient.name}</h3>
                  <p className="text-xs text-blue-400 font-semibold">{activePatient.condition}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Record ID: {activePatient.id.toUpperCase()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1 rounded-full border font-bold uppercase ${activePatient.risk === "high" ? "bg-red-500/10 text-red-400 border-red-500/20" : activePatient.risk === "medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>{activePatient.risk} Risk</span>
              </div>
            </div>

            {/* Demographics details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900/30 p-4 rounded-2xl border border-slate-850 text-xs">
              <div>
                <p className="text-slate-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">Age / Gender</p>
                <p className="text-white font-bold">{activePatient.age} yrs • {activePatient.gender}</p>
              </div>
              <div>
                <p className="text-slate-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">Blood Type</p>
                <p className="text-red-400 font-bold">{activePatient.bloodGroup}</p>
              </div>
              <div>
                <p className="text-slate-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">Phone Contact</p>
                <p className="text-white font-medium">{activePatient.phone}</p>
              </div>
              <div>
                <p className="text-slate-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">Email Address</p>
                <p className="text-white font-medium truncate">{activePatient.email}</p>
              </div>
            </div>

            {/* Medical Log Timeline */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-blue-400" />
                <span>Clinical Notes & History</span>
              </h4>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1.5 scrollbar-none">
                {activePatient.history.map((log, i) => (
                  <div key={i} className="bg-slate-900/20 border border-slate-850 p-3.5 rounded-xl flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-350 leading-relaxed font-semibold">{log}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add note area */}
            <div className="space-y-3 border-t border-slate-850 pt-5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">Add Progress Note</h4>
              <div className="flex gap-2">
                <Input 
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Type new checkup findings or vital warnings here..."
                  className="bg-slate-900 border-slate-800 text-white h-10 rounded-xl focus-visible:ring-blue-600 shadow-inner w-full"
                />
                <Button onClick={handleAddNote} className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-10 rounded-xl px-5 border-none">
                  Add Note
                </Button>
              </div>
            </div>

          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
