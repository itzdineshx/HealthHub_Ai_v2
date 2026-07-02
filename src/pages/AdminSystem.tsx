import React from "react";
import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Server, Cpu, Activity, ShieldCheck, Sliders, 
  Terminal as TerminalIcon, HardDrive, RefreshCw, AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
};

const systemQueries = [
  { name: "09:00", requests: 480 },
  { name: "10:00", requests: 620 },
  { name: "11:00", requests: 590 },
  { name: "12:00", requests: 810 },
  { name: "13:00", requests: 740 },
  { name: "14:00", requests: 920 }
];

export default function AdminSystem() {
  const telemetry = [
    { title: "CPU Infrastructure", value: "14%", progress: 14, subtitle: "Normal Core Load", icon: Cpu, color: "text-blue-500 bg-blue-500/10" },
    { title: "Memory Allocation", value: "4.2GB / 8GB", progress: 52, subtitle: "52% Allocation Rate", icon: HardDrive, color: "text-purple-500 bg-purple-500/10" },
    { title: "API Latency", value: "38ms", progress: 85, subtitle: "Optimal ping metrics", icon: Activity, color: "text-emerald-500 bg-emerald-500/10" },
    { title: "DB Cluster Space", value: "1.8GB / 5GB", progress: 36, subtitle: "36% cluster storage", icon: Server, color: "text-amber-500 bg-amber-500/10" }
  ];

  const logs = [
    { time: "06:12:04", type: "INFO", message: "FastAPI server initialized successfully on port 8000" },
    { time: "06:12:11", type: "INFO", message: "Motor Client established handshake replica set atlas-mkv3vl-shard-0" },
    { time: "06:13:42", type: "WARN", message: "LLM Provider fallback: request rate threshold close to tier limits" },
    { time: "06:15:20", type: "INFO", message: "Authorized CORS preflight credentials verified from origin: localhost:8080" }
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
              System Diagnostics
            </h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Verify server microservices diagnostics telemetry, examine hardware cluster load limits, and check API logs.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-600/10 border border-emerald-500/10 px-4 py-2 rounded-xl">
            <ShieldCheck className="h-5 w-5 text-emerald-450" />
            <span className="text-xs font-bold text-emerald-450 uppercase">Infrastructure Stable</span>
          </div>
        </div>
      </motion.div>

      {/* Telemetry Progress Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {telemetry.map((tel, i) => {
          const Icon = tel.icon;
          return (
            <Card key={i} className="bg-[#151C2C] border-slate-800 hover:border-slate-700/80 transition-all shadow-lg">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{tel.title}</span>
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${tel.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">{tel.value}</h3>
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">{tel.subtitle}</span>
                </div>
                <Progress value={tel.progress} className="h-1.5 bg-slate-800 text-blue-500" />
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Charts & System Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Load Trends */}
        <div className="lg:col-span-2">
          <motion.div variants={itemVariants}>
            <Card className="bg-[#151C2C] border-slate-800 shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base font-bold flex items-center gap-1.5">
                  <Activity className="h-4.5 w-4.5 text-blue-400" />
                  <span>Request Ingress Load</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">Total API queries processed hourly.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={systemQueries}>
                    <defs>
                      <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgb(37, 99, 235)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="rgb(37, 99, 235)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#151C2C", border: "1px solid #1E293B", borderRadius: "16px", color: "#fff" }} />
                    <Area type="monotone" dataKey="requests" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Live log Terminal */}
        <div className="lg:col-span-1">
          <motion.div variants={itemVariants}>
            <Card className="bg-[#151C2C] border-slate-800 shadow-xl h-[334px] flex flex-col justify-between overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-850">
                <CardTitle className="text-white text-base font-bold flex items-center gap-1.5">
                  <TerminalIcon className="h-4.5 w-4.5 text-indigo-400" />
                  <span>Stdout Console</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">Live backend standard outputs stream.</CardDescription>
              </CardHeader>
              <CardContent className="bg-slate-950 p-4 font-mono text-[9px] text-slate-450 leading-relaxed overflow-y-auto h-[230px] flex-1 border-t border-slate-900">
                <div className="space-y-2">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-1 items-start">
                      <span className="text-slate-600 shrink-0 font-bold">[{log.time}]</span>
                      <span className={`${log.type === "WARN" ? "text-amber-500" : "text-blue-500"} shrink-0 font-bold`}>{log.type}:</span>
                      <span className="text-slate-300 font-medium">{log.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
