import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Search, UserCheck, ShieldAlert, Key, Trash2, 
  Check, Filter, ShieldCheck, Mail, Shield, AlertTriangle 
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

interface EnterpriseUser {
  id: string;
  name: string;
  email: string;
  role: "doctor" | "patient" | "admin";
  status: "active" | "blocked" | "pending";
  verified: boolean;
  image?: string;
}

export default function AdminUsers() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "doctor" | "patient" | "admin">("all");
  
  const [users, setUsers] = useState<EnterpriseUser[]>([
    { id: "usr-1", name: "Dr. John Watson", email: "j.watson@healthhub.ai", role: "doctor", status: "active", verified: true, image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop" },
    { id: "usr-2", name: "Dr. Sarah Connor", email: "s.connor@healthhub.ai", role: "doctor", status: "pending", verified: false, image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=100&h=100&fit=crop" },
    { id: "usr-3", name: "Dinesh Sharma", email: "dinesh@healthhub.ai", role: "patient", status: "active", verified: true, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
    { id: "usr-4", name: "Elena Gilbert", email: "elena@healthhub.ai", role: "patient", status: "blocked", verified: true, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" }
  ]);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleVerify = (id: string, name: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, verified: true, status: "active" } : u));
    toast({
      title: "Credentials Approved",
      description: `License verified successfully for ${name}.`
    });
  };

  const handleToggleBlock = (id: string, currentStatus: string, name: string) => {
    const nextStatus = currentStatus === "blocked" ? "active" : "blocked";
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: nextStatus } : u));
    toast({
      title: nextStatus === "blocked" ? "User Blocked" : "User Reactivated",
      description: `Access credentials updated for ${name}.`
    });
  };

  const handleDelete = (id: string, name: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast({
      title: "Account Purged",
      description: `${name}'s profile data has been removed from active tables.`
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
              User Directory Console
            </h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Oversee platform credentials, approve clinical practice licenses, and manage authorization levels for doctors and patients.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-blue-600/10 border border-blue-500/10 px-4 py-2 rounded-xl">
            <Users className="h-5 w-5 text-blue-400" />
            <span className="text-xs font-bold text-blue-400 uppercase">{users.length} Registered Nodes</span>
          </div>
        </div>
      </motion.div>

      {/* Filters Bar */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex items-center bg-[#151C2C] border border-slate-800 rounded-2xl px-4 py-1.5 focus-within:border-blue-500/50 transition-colors shadow-inner w-full sm:max-w-xs">
          <Search className="text-slate-500 h-4.5 w-4.5 mr-2 shrink-0" />
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search directory..."
            className="bg-transparent border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder-slate-500 h-9 w-full text-xs"
          />
        </div>

        {/* Role Filters */}
        <div className="flex gap-2">
          {(["all", "doctor", "patient", "admin"] as const).map(role => {
            const isSelected = roleFilter === role;
            return (
              <Button
                key={role}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`h-9 text-[10px] uppercase rounded-xl font-bold ${isSelected ? "bg-blue-600 hover:bg-blue-500 text-white" : "border-slate-800 text-slate-350 hover:bg-slate-850 bg-transparent"}`}
                onClick={() => setRoleFilter(role)}
              >
                {role}
              </Button>
            );
          })}
        </div>

      </motion.div>

      {/* Directory Table */}
      <motion.div variants={itemVariants} className="bg-[#151C2C] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-850">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Audit Listings</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs leading-normal">
            <thead>
              <tr className="bg-slate-900/30 text-slate-500 uppercase text-[9px] font-bold tracking-widest border-b border-slate-850">
                <th className="p-4 pl-6">Profile</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Authorization</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 bg-slate-900/10">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/20 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded-xl border border-slate-800">
                        <AvatarImage src={u.image} className="object-cover" />
                        <AvatarFallback>{u.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-white leading-tight">{u.name}</h4>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">UID: {u.id.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-350 font-medium">{u.email}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${u.role === "doctor" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : u.role === "admin" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>{u.role}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${u.status === "active" ? "bg-emerald-500" : u.status === "blocked" ? "bg-red-500" : "bg-amber-500"}`} />
                      <span className="capitalize font-semibold text-[10px] text-slate-400">{u.status}</span>
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-1.5">
                    {!u.verified && u.role === "doctor" && (
                      <Button onClick={() => handleVerify(u.id, u.name)} size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg h-7.5 px-2.5 text-[10px] border-none font-bold">
                        Verify License
                      </Button>
                    )}
                    <Button 
                      onClick={() => handleToggleBlock(u.id, u.status, u.name)} 
                      size="sm" 
                      variant="outline" 
                      className={`border-slate-800 bg-transparent h-7.5 px-2.5 text-[10px] rounded-lg font-bold ${u.status === "blocked" ? "text-emerald-400 hover:text-emerald-300" : "text-amber-400 hover:text-amber-300"}`}
                    >
                      {u.status === "blocked" ? "Unblock" : "Block"}
                    </Button>
                    <button 
                      onClick={() => handleDelete(u.id, u.name)}
                      className="text-slate-600 hover:text-red-400 p-1.5 rounded-lg transition-colors border border-transparent inline-block align-middle"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
