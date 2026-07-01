import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Server, 
  Cpu, 
  Activity,
  UserCheck,
  Shield,
  Search
} from "lucide-react";
import { 
  AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { motion } from "framer-motion";

export default function AdminPanel() {
  const { user } = useAuth();
  const { toast } = useToast();

  // System stats mock
  const stats = {
    activeUsers: 1420,
    totalDoctors: 96,
    pendingVerifications: 3,
    latency: "38ms",
    cpuUsage: 14,
    accuracy: "97.2%",
    status: "Normal"
  };

  // Live query trends for Recharts
  const systemQueries = [
    { name: "09:00", requests: 480 },
    { name: "10:00", requests: 620 },
    { name: "11:00", requests: 590 },
    { name: "12:00", requests: 810 },
    { name: "13:00", requests: 740 },
    { name: "14:00", requests: 920 }
  ];

  const [usersList, setUsersList] = useState([
    { id: "usr-1", name: "Dr. John Watson", email: "j.watson@healthhub.ai", role: "doctor", status: "active", verified: true },
    { id: "usr-2", name: "Dr. Sarah Connor", email: "s.connor@healthhub.ai", role: "doctor", status: "pending", verified: false },
    { id: "usr-3", name: "Dinesh Sharma", email: "dinesh@healthhub.ai", role: "patient", status: "active", verified: true },
  ]);

  const handleApproveDoctor = (userId: string, name: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, verified: true, status: "active" } : u));
    toast({
      title: "Doctor Approved",
      description: `License verified successfully for ${name}.`,
      className: "bg-emerald-green text-white border-none"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* TOP SUMMARY BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-3xl border border-border/40 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Enterprise Console</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Platform oversight, active nodes, and regulatory compliance audit trail.</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-green/10 px-4 py-2 rounded-xl">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-green animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-xs font-bold text-emerald-green tracking-wider">SYSTEM STATUS: NORMAL</span>
        </div>
      </div>

      {/* Health indicators list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border/40 rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted-foreground font-bold tracking-wider">ACTIVE SESSIONS</span>
              <div className="h-8 w-8 rounded-xl bg-medical-blue/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-medical-blue" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold">{stats.activeUsers}</h3>
            <span className="text-[10px] text-emerald-green font-semibold mt-1 block">↑ 14% growth today</span>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/40 rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted-foreground font-bold tracking-wider">API LATENCY</span>
              <div className="h-8 w-8 rounded-xl bg-medical-blue/10 flex items-center justify-center">
                <Server className="h-4 w-4 text-medical-blue" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold">{stats.latency}</h3>
            <span className="text-[10px] text-emerald-green font-semibold mt-1 block">Response within baselines</span>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/40 rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted-foreground font-bold tracking-wider">AI ACCURACY</span>
              <div className="h-8 w-8 rounded-xl bg-ai-purple/10 flex items-center justify-center">
                <Cpu className="h-4 w-4 text-ai-purple" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold">{stats.accuracy}</h3>
            <span className="text-[10px] text-ai-purple font-semibold mt-1 block">Gemini Clinical v2.1</span>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/40 rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted-foreground font-bold tracking-wider">CPU METRIC LOAD</span>
              <div className="h-8 w-8 rounded-xl bg-warning-amber/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-warning-amber" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold">{stats.cpuUsage}%</h3>
            <Progress value={stats.cpuUsage} className="h-1.5 mt-3 bg-muted" />
          </CardContent>
        </Card>
      </div>

      {/* Admin visual graphs and pending license checking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* API volume Recharts Area */}
        <Card className="lg:col-span-2 bg-card border-border/40 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">API Transaction Metrics</CardTitle>
            <CardDescription>Live database and LLM queries processed per hour</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={systemQueries}>
                <defs>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--medical-blue))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--medical-blue))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.1)" />
                <XAxis dataKey="name" stroke="rgba(150,150,150,0.5)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(150,150,150,0.5)" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="requests" stroke="hsl(var(--medical-blue))" strokeWidth={3} fillOpacity={1} fill="url(#colorQueries)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pending Approvals queue */}
        <Card className="bg-card border-border/40 rounded-3xl flex flex-col">
          <CardHeader>
            <CardTitle className="text-md font-bold flex items-center">
              <div className="h-8 w-8 rounded-xl bg-warning-amber/10 flex items-center justify-center mr-3">
                <UserCheck className="h-4.5 w-4.5 text-warning-amber" />
              </div>
              License Approvals
            </CardTitle>
            <CardDescription>Verify clinical credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            {usersList.filter(u => !u.verified && u.role === "doctor").map((doctor) => (
              <div key={doctor.id} className="p-4 bg-muted/30 border border-border/50 rounded-2xl space-y-4">
                <div>
                  <h4 className="font-bold text-sm">{doctor.name}</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">Credentials: NPI-ID, Medical Degree PDF</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleApproveDoctor(doctor.id, doctor.name)}
                    className="flex-1 bg-emerald-green hover:bg-emerald-600 text-white font-bold text-xs h-10 rounded-xl shadow-lg shadow-emerald-green/20"
                  >
                    Approve License
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-xs border-critical-red/20 text-critical-red hover:bg-critical-red/10 h-10 rounded-xl px-4"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
            {usersList.filter(u => !u.verified && u.role === "doctor").length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-2">
                <Shield className="h-8 w-8 opacity-20" />
                <p className="text-xs font-semibold">All clinician credentials verified.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
