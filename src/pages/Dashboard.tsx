import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Heart, Activity, Moon, Flame, Brain, CheckCircle2, Circle, Phone,
  Upload, ShieldAlert, MessageSquare, Pill, Settings, ChevronRight,
  Droplet, Utensils
} from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col xl:flex-row gap-6 w-full max-w-[1600px] mx-auto text-slate-100"
    >
      
      {/* MAIN CONTENT AREA */}
      <div className="flex-1 space-y-6">
        
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold flex items-center">
            Good Morning, {user?.name?.split(' ')[0] || "Dinesh"} <span className="ml-2">👋</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Here's your health summary for today</p>
        </motion.div>

        {/* TOP ROW: Health Score + Metric Cards */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-4">
          
          {/* Health Score Card */}
          <div className="bg-[#151C2C] rounded-2xl p-5 border border-slate-800 flex-shrink-0 w-full lg:w-[280px] flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-semibold text-slate-200">Health Score</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-white">87</span>
                  <span className="text-sm text-slate-400 ml-1">/100</span>
                </div>
                <div className="flex items-center mt-2 bg-emerald-500/10 px-2 py-1 rounded w-fit">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 mr-1" />
                  <span className="text-xs text-emerald-500 font-medium">Excellent</span>
                </div>
              </div>
              
              {/* Circular Progress Ring */}
              <div className="relative h-20 w-20">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Yellow segment */}
                  <path
                    className="text-amber-500"
                    strokeWidth="3.8"
                    strokeDasharray="25, 100"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Green segment */}
                  <path
                    className="text-emerald-500"
                    strokeWidth="3.8"
                    strokeDasharray="62, 100"
                    strokeDashoffset="-25"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-[11px] text-slate-400 leading-relaxed pr-4">
                You're doing great! Keep maintaining your healthy habits.
              </p>
              <button className="mt-4 text-xs font-semibold text-blue-500 flex items-center hover:text-blue-400 transition-colors">
                View Full Report <ChevronRight className="h-3 w-3 ml-1" />
              </button>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            
            {/* Heart Rate */}
            <div className="bg-[#151C2C] rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
              <Heart className="h-5 w-5 text-red-500 mb-2 fill-red-500/20" />
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1">Heart Rate</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold">72</span>
                  <span className="text-xs text-slate-400">bpm</span>
                </div>
              </div>
              <span className="text-xs text-emerald-500 mt-2">Normal</span>
            </div>

            {/* Sleep */}
            <div className="bg-[#151C2C] rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
              <Moon className="h-5 w-5 text-indigo-400 mb-2 fill-indigo-400/20" />
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1">Sleep</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold">7h 45m</span>
                </div>
              </div>
              <span className="text-xs text-indigo-400 mt-2">Good</span>
            </div>

            {/* Steps */}
            <div className="bg-[#151C2C] rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
              <Activity className="h-5 w-5 text-emerald-500 mb-2" />
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1">Steps</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold">8,432</span>
                </div>
              </div>
              <span className="text-xs text-slate-400 mt-2">Today</span>
            </div>

            {/* Calories */}
            <div className="bg-[#151C2C] rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
              <Flame className="h-5 w-5 text-orange-500 mb-2 fill-orange-500/20" />
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1">Calories</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold">1,248</span>
                </div>
              </div>
              <span className="text-xs text-slate-400 mt-2">Today</span>
            </div>

          </div>
        </motion.div>

        {/* AI Daily Brief Banner */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-[#0F172A] to-[#1E1B4B] border border-blue-900/30 rounded-2xl p-5 relative overflow-hidden shadow-lg shadow-blue-900/10">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center">
                AI Daily Brief
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center text-xs text-slate-300">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />
                  Your sleep quality improved by 12%
                </li>
                <li className="flex items-center text-xs text-blue-400 font-medium">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2" />
                  You have a workout scheduled at 6:00 PM
                </li>
                <li className="flex items-center text-xs text-orange-400 font-medium">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mr-2" />
                  Drink more water. You're 1.2L behind
                </li>
                <li className="flex items-center text-xs text-purple-400 font-medium">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2" />
                  Vitamin D supplement time: 10:00 AM
                </li>
              </ul>
            </div>
            <div className="hidden sm:flex items-center justify-center pr-8">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-[30px] opacity-20 animate-pulse" />
                <Brain className="h-16 w-16 text-blue-400 relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* MIDDLE ROW: Timeline + Health Overview */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-4">
          
          {/* Today's Timeline */}
          <div className="bg-[#151C2C] rounded-2xl p-5 border border-slate-800 w-full lg:w-[300px] shrink-0">
            <h3 className="text-sm font-semibold text-slate-200 mb-5">Today's Timeline</h3>
            
            <div className="relative pl-3 space-y-6">
              {/* Vertical line connecting nodes */}
              <div className="absolute left-[17px] top-2 bottom-2 w-px bg-slate-800" />
              
              {/* Event 1 */}
              <div className="relative flex items-start">
                <div className="absolute -left-1 text-[10px] text-slate-400 font-medium mt-0.5">08:00 AM</div>
                <div className="ml-14 flex items-center justify-center w-5 h-5 rounded-full border-[3px] border-[#151C2C] bg-emerald-500 z-10 mr-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
                <div className="flex-1 -mt-1">
                  <h4 className="text-xs font-semibold text-white">Vitamin D</h4>
                  <p className="text-[10px] text-slate-400">1 tablet</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              </div>
              
              {/* Event 2 */}
              <div className="relative flex items-start">
                <div className="absolute -left-1 text-[10px] text-slate-400 font-medium mt-0.5">10:30 AM</div>
                <div className="ml-14 flex items-center justify-center w-5 h-5 rounded-full border-[3px] border-[#151C2C] bg-emerald-500 z-10 mr-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
                <div className="flex-1 -mt-1">
                  <h4 className="text-xs font-semibold text-white">Morning Walk</h4>
                  <p className="text-[10px] text-slate-400">30 min</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              </div>

              {/* Event 3 */}
              <div className="relative flex items-start">
                <div className="absolute -left-1 text-[10px] text-slate-400 font-medium mt-0.5">01:00 PM</div>
                <div className="ml-14 flex items-center justify-center w-5 h-5 rounded-full border-[3px] border-[#151C2C] bg-emerald-500 z-10 mr-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
                <div className="flex-1 -mt-1">
                  <h4 className="text-xs font-semibold text-white">Lunch</h4>
                  <p className="text-[10px] text-slate-400">Eat healthy</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              </div>

              {/* Event 4 (Pending) */}
              <div className="relative flex items-start">
                <div className="absolute -left-1 text-[10px] text-slate-400 font-medium mt-0.5">06:00 PM</div>
                <div className="ml-14 flex items-center justify-center w-5 h-5 rounded-full border-[3px] border-[#151C2C] bg-blue-500 z-10 mr-3">
                  <div className="w-1.5 h-1.5 bg-[#151C2C] rounded-full" />
                </div>
                <div className="flex-1 -mt-1">
                  <h4 className="text-xs font-semibold text-white">Workout</h4>
                  <p className="text-[10px] text-slate-400">Strength Training</p>
                </div>
                <Circle className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
              </div>

              {/* Event 5 (Pending) */}
              <div className="relative flex items-start">
                <div className="absolute -left-1 text-[10px] text-slate-400 font-medium mt-0.5">09:30 PM</div>
                <div className="ml-14 flex items-center justify-center w-5 h-5 rounded-full border-[3px] border-[#151C2C] bg-slate-700 z-10 mr-3"></div>
                <div className="flex-1 -mt-1">
                  <h4 className="text-xs font-semibold text-slate-300">Sleep</h4>
                  <p className="text-[10px] text-slate-500">7-8 hours</p>
                </div>
                <Circle className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
              </div>

            </div>
          </div>

          {/* Health Overview Mini-charts */}
          <div className="bg-[#151C2C] rounded-2xl p-5 border border-slate-800 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-semibold text-slate-200">Health Overview</h3>
              <button className="text-[11px] text-blue-500 hover:text-blue-400 font-medium transition-colors">View All</button>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
              {/* BP Chart Box */}
              <div className="bg-slate-800/20 rounded-xl p-3 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 mb-1">Blood Pressure</p>
                  <p className="text-lg font-bold text-white leading-tight">120/80</p>
                  <p className="text-[9px] text-slate-500">mmHg</p>
                </div>
                <div className="h-10 mt-2 w-full flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,20 Q10,10 20,20 T40,25 T60,15 T80,20 T100,10" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>

              {/* Blood Sugar Box */}
              <div className="bg-slate-800/20 rounded-xl p-3 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 mb-1">Blood Sugar</p>
                  <p className="text-lg font-bold text-white leading-tight">98</p>
                  <p className="text-[9px] text-slate-500">mg/dL</p>
                </div>
                <div className="h-10 mt-2 w-full flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,15 Q20,25 40,15 T70,5 T100,15" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>

              {/* BMI Box */}
              <div className="bg-slate-800/20 rounded-xl p-3 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 mb-1">BMI</p>
                  <p className="text-lg font-bold text-white leading-tight">24.5</p>
                  <p className="text-[9px] text-emerald-500">Normal</p>
                </div>
                <div className="h-10 mt-2 w-full flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,25 Q15,10 30,20 T60,25 T90,15 T100,20" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>

              {/* Weight Box */}
              <div className="bg-slate-800/20 rounded-xl p-3 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 mb-1">Weight</p>
                  <p className="text-lg font-bold text-white leading-tight">65 <span className="text-xs font-normal">kg</span></p>
                  <p className="text-[9px] text-slate-500">-1.2 kg</p>
                </div>
                <div className="h-10 mt-2 w-full flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,10 Q25,25 50,15 T80,20 T100,10" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </motion.div>

        {/* BOTTOM ROW: Reports + Appointments */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-4">
          
          {/* Recent Reports */}
          <div className="bg-[#151C2C] rounded-2xl p-5 border border-slate-800 flex-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-200">Recent Reports</h3>
              <button className="text-[11px] text-blue-500 hover:text-blue-400 font-medium transition-colors">View All</button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 hover:bg-slate-800/30 rounded-xl transition-colors cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Complete Blood Count</p>
                    <p className="text-[10px] text-slate-400">12 May 2024</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] px-2 py-0.5 rounded text-emerald-500 border border-emerald-500/20">Normal</span>
                  <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-2 hover:bg-slate-800/30 rounded-xl transition-colors cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Thyroid Profile</p>
                    <p className="text-[10px] text-slate-400">08 May 2024</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] px-2 py-0.5 rounded text-emerald-500 border border-emerald-500/20">Normal</span>
                  <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2 hover:bg-slate-800/30 rounded-xl transition-colors cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Vitamin D Test</p>
                    <p className="text-[10px] text-slate-400">01 May 2024</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] px-2 py-0.5 rounded text-amber-500 border border-amber-500/20">Low</span>
                  <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-[#151C2C] rounded-2xl p-5 border border-slate-800 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-slate-200">Upcoming Appointments</h3>
                <button className="text-[11px] text-blue-500 hover:text-blue-400 font-medium transition-colors">View All</button>
              </div>
              
              <div className="bg-slate-800/30 rounded-xl p-4 flex items-center justify-between border border-slate-700/50">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop" alt="Dr. Sarah" className="w-10 h-10 rounded-full border border-slate-700 object-cover" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#151C2C]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">Dr. Sarah Johnson</p>
                    <p className="text-[10px] text-slate-400 mb-1">Cardiologist</p>
                    <div className="flex items-center space-x-2 text-[9px] text-slate-400">
                      <span className="flex items-center"><Calendar className="h-2.5 w-2.5 mr-1" /> 15 May 2024</span>
                      <span className="flex items-center"><Heart className="h-2.5 w-2.5 mr-1" /> Care+ Hospital</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl p-3 flex flex-col items-center justify-center border border-red-500/20 transition-colors">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 fill-red-500/20" />
                <span className="text-sm font-bold">Emergency SOS</span>
              </div>
              <span className="text-[10px] text-red-400/80 mt-1">Tap to call emergency</span>
            </button>
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-slate-200">AI Recommendations for You</h3>
            <button className="text-[11px] text-blue-500 hover:text-blue-400 font-medium transition-colors">View All</button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#151C2C] rounded-xl p-3 border border-slate-800 flex items-center space-x-3 cursor-pointer hover:bg-slate-800/50 transition-colors">
              <div className="h-9 w-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Droplet className="h-4 w-4 fill-blue-500/20" />
              </div>
              <div>
                <p className="text-[9px] text-slate-400">Increase</p>
                <p className="text-xs font-bold text-slate-200">Water Intake</p>
                <p className="text-[9px] text-slate-500">+2 glasses daily</p>
              </div>
            </div>

            <div className="bg-[#151C2C] rounded-xl p-3 border border-slate-800 flex items-center space-x-3 cursor-pointer hover:bg-slate-800/50 transition-colors">
              <div className="h-9 w-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Utensils className="h-4 w-4 fill-emerald-500/20" />
              </div>
              <div>
                <p className="text-[9px] text-slate-400">Add More</p>
                <p className="text-xs font-bold text-slate-200">Protein</p>
                <p className="text-[9px] text-slate-500">For muscle health</p>
              </div>
            </div>

            <div className="bg-[#151C2C] rounded-xl p-3 border border-slate-800 flex items-center space-x-3 cursor-pointer hover:bg-slate-800/50 transition-colors">
              <div className="h-9 w-9 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[9px] text-slate-400">Reduce</p>
                <p className="text-xs font-bold text-slate-200">Sugar Intake</p>
                <p className="text-[9px] text-slate-500">For better energy</p>
              </div>
            </div>

            <div className="bg-[#151C2C] rounded-xl p-3 border border-slate-800 flex items-center space-x-3 cursor-pointer hover:bg-slate-800/50 transition-colors">
              <div className="h-9 w-9 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Brain className="h-4 w-4 fill-indigo-500/20" />
              </div>
              <div>
                <p className="text-[9px] text-slate-400">Try</p>
                <p className="text-xs font-bold text-slate-200">Meditation</p>
                <p className="text-[9px] text-slate-500">For stress relief</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* RIGHT SIDEBAR (AI & Quick Actions) */}
      <motion.div variants={itemVariants} className="w-full xl:w-[320px] flex-shrink-0 flex flex-col space-y-6">
        
        {/* AI Assistant Chat Widget */}
        <div className="bg-[#151C2C] rounded-2xl border border-slate-800 flex flex-col h-[320px] overflow-hidden relative">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">AI Assistant</h3>
            <button className="text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-md transition-colors">
              New Chat
            </button>
          </div>
          
          <div className="p-4 flex-1 flex flex-col justify-end space-y-3 relative z-10">
            <div>
              <p className="text-sm font-semibold text-white mb-1">Hello {user?.name?.split(' ')[0] || "Dinesh"}! 👋</p>
              <p className="text-xs text-slate-400">How can I help you today?</p>
            </div>
            
            <div className="space-y-2 mt-4">
              <button className="w-full text-left bg-slate-800/50 hover:bg-slate-700/50 p-2.5 rounded-lg border border-slate-700/50 flex items-center space-x-2 transition-colors">
                <FileText className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-[11px] text-slate-300">Analyze my blood report</span>
              </button>
              <button className="w-full text-left bg-slate-800/50 hover:bg-slate-700/50 p-2.5 rounded-lg border border-slate-700/50 flex items-center space-x-2 transition-colors">
                <Apple className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px] text-slate-300">Suggest a diet plan</span>
              </button>
              <button className="w-full text-left bg-slate-800/50 hover:bg-slate-700/50 p-2.5 rounded-lg border border-slate-700/50 flex items-center space-x-2 transition-colors">
                <Activity className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-[11px] text-slate-300">Why am I feeling tired?</span>
              </button>
              <button className="w-full text-left bg-slate-800/50 hover:bg-slate-700/50 p-2.5 rounded-lg border border-slate-700/50 flex items-center space-x-2 transition-colors">
                <Flame className="h-3.5 w-3.5 text-orange-400" />
                <span className="text-[11px] text-slate-300">Best workout for weight loss</span>
              </button>
            </div>
          </div>
          
          {/* Faint background pattern */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
        </div>

        {/* Quick Actions */}
        <div className="bg-[#151C2C] rounded-2xl p-5 border border-slate-800 flex-1">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-semibold text-slate-200">Quick Actions</h3>
            <button className="text-[11px] text-blue-500 hover:text-blue-400 font-medium transition-colors">Customize</button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center p-3 hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors group">
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500/20 transition-colors mb-2">
                <Heart className="h-4 w-4" />
              </div>
              <span className="text-[9px] text-slate-300 font-medium text-center leading-tight">Health Check</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors group">
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 transition-colors mb-2">
                <MessageSquare className="h-4 w-4" />
              </div>
              <span className="text-[9px] text-slate-300 font-medium text-center leading-tight">AI Chat</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors group">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500/20 transition-colors mb-2">
                <Upload className="h-4 w-4" />
              </div>
              <span className="text-[9px] text-slate-300 font-medium text-center leading-tight">Upload Report</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors group">
              <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors mb-2">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="text-[9px] text-slate-300 font-medium text-center leading-tight">Book Doctor</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors group">
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500/20 transition-colors mb-2">
                <Pill className="h-4 w-4" />
              </div>
              <span className="text-[9px] text-slate-300 font-medium text-center leading-tight">Medications</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors group">
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500/20 transition-colors mb-2">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <span className="text-[9px] text-slate-300 font-medium text-center leading-tight">Emergency</span>
            </div>
          </div>
        </div>

      </motion.div>

    </motion.div>
  );
}
