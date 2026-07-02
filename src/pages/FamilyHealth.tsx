import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, UserPlus, Heart, Activity, Calendar, Shield, 
  ChevronRight, RefreshCw, Key, ShieldCheck, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
};

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  bloodGroup: string;
  healthScore: number;
  heartRate: string;
  lastActive: string;
  image: string;
  accessGranted: "Full" | "Emergency Only" | "View Only";
}

export default function FamilyHealth() {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Member Form
  const [memberName, setMemberName] = useState("");
  const [relation, setRelation] = useState("");
  const [age, setAge] = useState<number>(28);
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [access, setAccess] = useState<"Full" | "Emergency Only" | "View Only">("View Only");

  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: "fam1",
      name: "Priya Kumar",
      relation: "Spouse",
      age: 28,
      bloodGroup: "O+",
      healthScore: 92,
      heartRate: "68 bpm",
      lastActive: "Active 10m ago",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      accessGranted: "Full"
    },
    {
      id: "fam2",
      name: "Aarav Kumar",
      relation: "Son",
      age: 6,
      bloodGroup: "O+",
      healthScore: 98,
      heartRate: "80 bpm",
      lastActive: "Active 2h ago",
      image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=100&h=100&fit=crop",
      accessGranted: "Full"
    },
    {
      id: "fam3",
      name: "Ramesh Kumar",
      relation: "Father",
      age: 62,
      bloodGroup: "A-",
      healthScore: 78,
      heartRate: "74 bpm",
      lastActive: "Active 1d ago",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      accessGranted: "Emergency Only"
    }
  ]);

  const handleAddMember = () => {
    if (!memberName || !relation) {
      toast({
        title: "Missing details",
        description: "Please fill in the member name and relationship.",
        variant: "destructive"
      });
      return;
    }

    const newMember: FamilyMember = {
      id: "fam-" + Math.random().toString(36).substring(2),
      name: memberName,
      relation: relation,
      age: age,
      bloodGroup: bloodGroup,
      healthScore: 85, // Default average
      heartRate: "72 bpm",
      lastActive: "Added just now",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop", // Default avatar
      accessGranted: access
    };

    setMembers([...members, newMember]);
    setIsAddOpen(false);
    setMemberName("");
    setRelation("");
    setAge(28);
    setBloodGroup("O+");
    setAccess("View Only");

    toast({
      title: "Family Member Added",
      description: `${memberName} has been added to your Family Health Space.`
    });
  };

  const handleAccessToggle = (id: string, current: string) => {
    const nextAccess: Record<string, "Full" | "Emergency Only" | "View Only"> = {
      "Full": "View Only",
      "View Only": "Emergency Only",
      "Emergency Only": "Full"
    };

    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        const updatedAccess = nextAccess[current];
        toast({
          title: "Permissions Updated",
          description: `Access levels for ${m.name} changed to ${updatedAccess}.`
        });
        return { ...m, accessGranted: updatedAccess };
      }
      return m;
    }));
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-450 bg-clip-text text-transparent">
              Family Health Space
            </h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Consolidate health cards, monitor vital readings in real time, and share critical emergency clearances with your household.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="shrink-0">
            <Button onClick={() => setIsAddOpen(true)} className="bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-white shadow-lg shadow-emerald-500/20 rounded-2xl px-6 h-12 text-sm font-bold tracking-wide border-none flex items-center gap-2">
              <UserPlus className="h-4.5 w-4.5" />
              <span>Add Family Member</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Profiles list */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((m) => (
              <motion.div
                key={m.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-[#151C2C] border-slate-800 hover:border-slate-700/80 hover:shadow-[0_0_30px_rgba(16,185,129,0.06)] transition-all flex flex-col justify-between overflow-hidden shadow-lg h-full">
                  <CardHeader className="p-5 flex flex-row items-center gap-4 space-y-0 pb-4">
                    <Avatar className="h-14 w-14 rounded-full border border-slate-700/60 shadow-md">
                      <AvatarImage src={m.image} className="object-cover" />
                      <AvatarFallback>{m.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 justify-between">
                        <h4 className="font-extrabold text-white text-sm truncate">{m.name}</h4>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">{m.relation}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold pt-1">{m.lastActive}</p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="px-5 pb-4 pt-0">
                    <div className="grid grid-cols-3 gap-2 bg-slate-900/40 p-3 rounded-2xl border border-slate-850 text-center">
                      <div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Heart Rate</p>
                        <p className="text-xs font-extrabold text-white mt-1 flex items-center justify-center gap-1">
                          <Activity className="h-3 w-3 text-red-500 shrink-0" />
                          <span>{m.heartRate}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Blood Group</p>
                        <p className="text-xs font-extrabold text-red-400 mt-1">{m.bloodGroup}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Age</p>
                        <p className="text-xs font-extrabold text-slate-305 mt-1">{m.age} yrs</p>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="bg-slate-900/40 px-5 py-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-7 w-7">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="text-emerald-500" strokeWidth="3" strokeDasharray={`${m.healthScore}, 100`} stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white">{m.healthScore}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold tracking-wide">Health Score</span>
                    </div>

                    <Button 
                      onClick={() => handleAccessToggle(m.id, m.accessGranted)} 
                      size="sm" 
                      variant="ghost" 
                      className="text-slate-400 hover:text-white text-xs h-8.5 flex items-center gap-1.5 px-3 border border-slate-800 bg-slate-900 rounded-xl transition-all"
                    >
                      <Shield className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="font-semibold text-[10px]">Clearance: {m.accessGranted}</span>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right 1 Column: Safe Sharing & Access Hub */}
        <div className="space-y-6">
          <motion.div variants={itemVariants} className="bg-[#151C2C] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 pl-2 border-l-2 border-emerald-500">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span>Safe Sync Control</span>
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Household diagnostics and emergency alerts are synced locally. In case of emergency triggers, members with **Emergency Only** or **Full** access clearances will automatically receive instant SOS broadcasts.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs border-b border-slate-850 pb-2.5">
                <span className="text-slate-400 font-bold">Auto-Sync Emergency Vitals</span>
                <span className="text-emerald-400 font-black bg-emerald-500/10 px-2 py-0.5 rounded-md text-[10px] border border-emerald-500/10">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-slate-850 pb-2.5">
                <span className="text-slate-400 font-bold">Local Bluetooth Hub</span>
                <span className="text-slate-500 font-bold">SCANNING...</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold">Family Group ID</span>
                <span className="font-mono text-[10px] text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-850">FAM-90218-X</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Add Member Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-[#151C2C] border-slate-800 text-white max-w-sm rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-bold">Add Family Member</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs mt-1">
              Add a new family record to monitor health scores in sync.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-350 font-bold">Full Name</label>
              <Input 
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="bg-slate-900 border-slate-800 text-white h-10 rounded-xl focus-visible:ring-emerald-600 shadow-inner"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-slate-350 font-bold">Relationship</label>
                <Input 
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  placeholder="e.g. Spouse, Father"
                  className="bg-slate-900 border-slate-800 text-white h-10 rounded-xl focus-visible:ring-emerald-600 shadow-inner"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-350 font-bold">Age</label>
                <Input 
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 28)}
                  className="bg-slate-900 border-slate-800 text-white h-10 rounded-xl focus-visible:ring-emerald-600 shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-slate-350 font-bold">Blood Group</label>
                <Input 
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  placeholder="e.g. O+"
                  className="bg-slate-900 border-slate-800 text-white h-10 rounded-xl focus-visible:ring-emerald-600 shadow-inner"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-350 font-bold">Consent Clearance</label>
                <select 
                  value={access}
                  onChange={(e) => setAccess(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 text-white h-10 rounded-xl px-2 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="View Only">View Only</option>
                  <option value="Emergency Only">Emergency Only</option>
                  <option value="Full">Full Access</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white hover:bg-slate-800 h-10 rounded-xl text-xs">
              Cancel
            </Button>
            <Button onClick={handleAddMember} className="bg-emerald-600 hover:bg-emerald-500 text-white h-10 rounded-xl text-xs font-bold px-5">
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
