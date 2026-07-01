import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Video,
  AlertTriangle,
  Brain,
  SlidersHorizontal,
  ChevronRight,
  Stethoscope,
  Pill,
  Plus
} from "lucide-react";
import { 
  AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { motion } from "framer-motion";

export default function DoctorPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Doctor stats
  const stats = {
    totalPatients: 142,
    appointmentsToday: 7,
    criticalFlags: 2,
    completionRate: "94%"
  };

  // Patients Queue list
  const [patients, setPatients] = useState([
    { id: "pat-1", name: "Dinesh Sharma", age: 34, gender: "Male", condition: "LDL Borderline High", risk: "medium", time: "09:30 AM", status: "waiting" },
    { id: "pat-2", name: "Amelia Watson", age: 29, gender: "Female", condition: "Migraine Monitoring", risk: "low", time: "10:15 AM", status: "waiting" },
    { id: "pat-3", name: "Bruce Wayne", age: 41, gender: "Male", condition: "Acute Joint Trauma", risk: "high", time: "11:00 AM", status: "scheduled" },
    { id: "pat-4", name: "Clara Oswald", age: 26, gender: "Female", condition: "Annual Checkup", risk: "low", time: "02:00 PM", status: "completed" }
  ]);

  const [selectedPatientId, setSelectedPatientId] = useState<string>("pat-1");
  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Prescription builder state
  const [selectedDrug, setSelectedDrug] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [prescriptionsList, setPrescriptionsList] = useState<any[]>([
    { drug: "Lisinopril 10mg", dosage: "1 tab daily", instructions: "Lower blood pressure" }
  ]);

  const [interactionWarning, setInteractionWarning] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDrug.toLowerCase().includes("aspirin") && activePatient.name === "Dinesh Sharma") {
      setInteractionWarning("Moderate Interaction Alert: Aspirin may enhance Warfarin/anticoagulant effects. Track INR parameters.");
    } else {
      setInteractionWarning(null);
    }
  }, [selectedDrug, activePatient]);

  const addPrescription = () => {
    if (!selectedDrug || !dosage) {
      toast({
        title: "Prescription Incomplete",
        description: "Please specify drug name and dosage details.",
        variant: "destructive"
      });
      return;
    }
    setPrescriptionsList(prev => [...prev, { drug: selectedDrug, dosage, instructions }]);
    setSelectedDrug("");
    setDosage("");
    setInstructions("");
    toast({
      title: "Rx Pill Added",
      description: "Medication successfully added to draft prescription slip."
    });
  };

  const savePrescription = () => {
    toast({
      title: "Rx Dispatched",
      description: `Digital prescription sent successfully to ${activePatient.name}'s dashboard.`,
      className: "bg-emerald-green text-white border-none"
    });
    setPrescriptionsList([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* DOCTOR HEADER SUMMARY */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-3xl border border-border/40 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Clinical Workstation</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Welcome, Dr. {user?.name || "Robert Johnson"} • Cardiology Division</p>
        </div>
        
        <div className="flex space-x-2">
          <Badge className="bg-critical-red/10 text-critical-red border-none font-semibold px-3 py-1.5 text-xs rounded-xl">
            {stats.criticalFlags} CRITICAL FLAGS
          </Badge>
          <Badge className="bg-medical-blue/10 text-medical-blue border-none font-semibold px-3 py-1.5 text-xs rounded-xl">
            {stats.appointmentsToday} PATIENTS TODAY
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Patient List / Queue */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border/40 rounded-3xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
              <CardTitle className="text-md font-bold flex items-center justify-between">
                <span>Today's Queue</span>
                <span className="text-xs bg-medical-blue text-white px-2 py-0.5 rounded-full">{patients.length}</span>
              </CardTitle>
              <div className="flex items-center space-x-2 pt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Filter queue..." 
                    className="h-8 pl-9 text-xs bg-card rounded-xl border-border/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl shrink-0"><SlidersHorizontal className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {patients.map((p) => {
                  const isSelected = selectedPatientId === p.id;
                  return (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedPatientId(p.id)}
                      className={`p-4 transition-all cursor-pointer flex flex-col gap-2 ${
                        isSelected 
                          ? "bg-medical-blue/5 border-l-4 border-l-medical-blue" 
                          : "hover:bg-muted/30 border-l-4 border-l-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-9 w-9 rounded-xl">
                            <AvatarFallback className={`${isSelected ? 'bg-medical-blue text-white' : 'bg-muted text-muted-foreground'} font-bold text-xs`}>
                              {p.name.split(' ')[0][0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-bold text-sm text-foreground">{p.name}</span>
                            <div className="flex items-center space-x-1.5 mt-0.5">
                              <span className="text-[10px] text-muted-foreground">Age {p.age} • {p.time}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-transform ${isSelected ? 'text-medical-blue translate-x-1' : 'text-muted-foreground'}`} />
                      </div>
                      
                      <div className="flex items-center justify-between mt-1 pl-12">
                        <span className="text-[10px] text-muted-foreground truncate flex-1 pr-2">{p.condition}</span>
                        <Badge className={`text-[8px] font-bold tracking-wider border-none px-1.5 py-0 rounded-md uppercase shrink-0 ${
                          p.risk === "high" ? "bg-critical-red/10 text-critical-red" :
                          p.risk === "medium" ? "bg-warning-amber/10 text-warning-amber" :
                          "bg-emerald-green/10 text-emerald-green"
                        }`}>
                          {p.risk} RISK
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Deep Patient Context & Rx Pad */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border/40 rounded-3xl h-full flex flex-col">
            <CardHeader className="pb-4 border-b border-border/40">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-medical-blue font-bold tracking-wider uppercase flex items-center mb-1">
                    <Stethoscope className="h-3 w-3 mr-1" />
                    ACTIVE CLINICAL RECORD
                  </span>
                  <CardTitle className="text-xl font-bold">{activePatient.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1 text-xs">
                    {activePatient.gender} • {activePatient.age} yrs • Scheduled for {activePatient.time}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="rounded-xl h-8 text-xs border-emerald-green/30 text-emerald-green hover:bg-emerald-green/10">
                    <Video className="h-3.5 w-3.5 mr-1.5" />
                    Teleconsult
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 flex-1">
              
              {/* AI Insight banner */}
              <div className="p-4 bg-gradient-to-r from-ai-purple/10 to-medical-blue/5 border border-ai-purple/20 rounded-2xl flex gap-3 items-start">
                <div className="h-8 w-8 rounded-xl bg-ai-purple/20 flex items-center justify-center shrink-0">
                  <Brain className="h-4 w-4 text-ai-purple" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ai-purple mb-1">Copilot Diagnostic Insight</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Patient history indicates recurring {activePatient.condition.toLowerCase()}. Evaluate compliance with current medication. Consider reviewing recent lipid panel uploaded on June 28.
                  </p>
                </div>
              </div>

              {/* Vitals Trend Chart */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-foreground">Recent Vitals Trend</h4>
                <div className="h-48 p-4 bg-muted/20 rounded-2xl border border-border/50">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { name: "Week 1", value: 68 },
                      { name: "Week 2", value: 72 },
                      { name: "Week 3", value: 70 },
                      { name: "Week 4", value: 74 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(150,150,150,0.5)" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis domain={[50, 90]} stroke="rgba(150,150,150,0.5)" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--medical-blue))" strokeWidth={3} fillOpacity={0.1} fill="hsl(var(--medical-blue))" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Digital Rx Pad */}
              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-bold text-foreground flex items-center">
                  <Pill className="h-4 w-4 mr-1.5 text-medical-blue" />
                  Prescription Pad
                </h4>

                <div className="bg-muted/30 border border-border/50 rounded-2xl p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                    <div className="sm:col-span-5">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase mb-1.5 block">Medication</label>
                      <Input 
                        value={selectedDrug}
                        onChange={(e) => setSelectedDrug(e.target.value)}
                        placeholder="Search formulary..." 
                        className="bg-card border-border/50 rounded-xl shadow-sm"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase mb-1.5 block">Dosage</label>
                      <Input 
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                        placeholder="e.g. 10mg" 
                        className="bg-card border-border/50 rounded-xl shadow-sm"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase mb-1.5 block">Instructions</label>
                      <div className="flex space-x-2">
                        <Input 
                          value={instructions}
                          onChange={(e) => setInstructions(e.target.value)}
                          placeholder="e.g. Daily" 
                          className="bg-card border-border/50 rounded-xl shadow-sm"
                        />
                        <Button 
                          onClick={addPrescription}
                          size="icon"
                          className="bg-medical-blue hover:bg-blue-600 rounded-xl shrink-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {interactionWarning && (
                    <div className="p-3 bg-warning-amber/10 border border-warning-amber/20 rounded-xl text-xs text-amber-600 dark:text-amber-400 flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{interactionWarning}</span>
                    </div>
                  )}

                  {prescriptionsList.length > 0 && (
                    <div className="mt-4 border border-border/60 rounded-xl overflow-hidden text-xs">
                      <div className="bg-muted/50 p-2.5 font-semibold text-muted-foreground grid grid-cols-12 gap-2 text-[10px] uppercase tracking-wider border-b border-border/60">
                        <span className="col-span-5">Drug Name</span>
                        <span className="col-span-3">Dose</span>
                        <span className="col-span-4">Sig</span>
                      </div>
                      <div className="divide-y divide-border/40 bg-card">
                        {prescriptionsList.map((item, idx) => (
                          <div key={idx} className="p-3 grid grid-cols-12 gap-2 items-center">
                            <span className="font-bold col-span-5">{item.drug}</span>
                            <span className="col-span-3 text-muted-foreground">{item.dosage}</span>
                            <span className="col-span-4 text-muted-foreground truncate">{item.instructions}</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 bg-muted/20 border-t border-border/60 flex justify-end">
                        <Button 
                          onClick={savePrescription}
                          className="bg-emerald-green hover:bg-emerald-600 text-xs rounded-xl px-5 shadow-lg shadow-emerald-green/20"
                        >
                          Sign & E-Prescribe
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
