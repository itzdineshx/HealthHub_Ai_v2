import React from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from "recharts";
import { 
  Activity, Users, Clock, Award, Star, TrendingUp, 
  ShieldCheck, AlertCircle, Heart, ChevronRight 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
};

const chartData = [
  { month: "Jan", patients: 95, ratings: 4.8 },
  { month: "Feb", patients: 110, ratings: 4.9 },
  { month: "Mar", patients: 125, ratings: 4.7 },
  { month: "Apr", patients: 140, ratings: 4.9 },
  { month: "May", patients: 135, ratings: 4.8 },
  { month: "Jun", patients: 155, ratings: 4.9 }
];

export default function DoctorAnalytics() {
  const stats = [
    { title: "Total Consultations", value: "760", subtitle: "↑ 12% from last month", icon: Users, color: "text-blue-500 bg-blue-500/10" },
    { title: "Satisfaction Index", value: "4.9/5", subtitle: "99.2% positive reviews", icon: Star, color: "text-amber-500 bg-amber-500/10" },
    { title: "Avg. Visit Duration", value: "18.5m", subtitle: "-1.5m optimization", icon: Clock, color: "text-purple-500 bg-purple-500/10" },
    { title: "E-Prescriptions Sent", value: "624", subtitle: "100% digital compliance", icon: Award, color: "text-emerald-500 bg-emerald-500/10" }
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
              Practice Analytics
            </h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Track clinical patient consultations throughput trends, monitor patient satisfaction indexing, and verify practice compliance statistics.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-blue-600/10 border border-blue-500/10 px-4 py-2 rounded-xl">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <span className="text-xs font-bold text-blue-400 uppercase">Q2 2026 Audit</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="bg-[#151C2C] border-slate-800 hover:border-slate-700/80 hover:shadow-lg transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.title}</span>
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                <span className="text-[10px] text-emerald-400 font-bold mt-1.5 block">{stat.subtitle}</span>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Patient Volume trend */}
        <motion.div variants={itemVariants}>
          <Card className="bg-[#151C2C] border-slate-800 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base font-bold flex items-center gap-1.5">
                <Users className="h-4.5 w-4.5 text-blue-400" />
                <span>Patient Consultations Volume</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">Total patient visits mapped monthly.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(37, 99, 235)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="rgb(37, 99, 235)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#151C2C", border: "1px solid #1E293B", borderRadius: "16px", color: "#fff" }} />
                  <Area type="monotone" dataKey="patients" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ratings index */}
        <motion.div variants={itemVariants}>
          <Card className="bg-[#151C2C] border-slate-800 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base font-bold flex items-center gap-1.5">
                <Star className="h-4.5 w-4.5 text-amber-500" />
                <span>Patient Satisfaction Index</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">Average feedback ratings tracked monthly.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis domain={[4.0, 5.0]} stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#151C2C", border: "1px solid #1E293B", borderRadius: "16px", color: "#fff" }} />
                  <Line type="monotone" dataKey="ratings" stroke="#F59E0B" strokeWidth={3} dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
}
