import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, Heart, Sparkles, Calendar, Pill, Activity, Apple,
  FileText, Users, AlertCircle, Settings, ChevronRight, Menu, X, Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: React.ComponentType<any>;
}

export default function OSLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const patientNav: NavItem[] = [
    { id: "home", path: "/patient/home", label: "Home", icon: Home },
    { id: "health", path: "/patient/health", label: "Health", icon: Heart },
    { id: "ai", path: "/patient/ai", label: "AI Assistant", icon: Sparkles },
    { id: "care", path: "/patient/care", label: "Care & Doctors", icon: Calendar },
    { id: "medications", path: "/patient/medications", label: "Medications", icon: Pill },
    { id: "fitness", path: "/patient/fitness", label: "Fitness", icon: Activity },
    { id: "nutrition", path: "/patient/nutrition", label: "Nutrition", icon: Apple },
    { id: "records", path: "/patient/records", label: "Records", icon: FileText },
    { id: "family", path: "/patient/family", label: "Family Health", icon: Users },
    { id: "emergency", path: "/patient/emergency", label: "Emergency", icon: AlertCircle },
    { id: "settings", path: "/patient/settings", label: "Settings", icon: Settings },
  ];

  // For this redesign, we focus purely on the patient experience as depicted in the UI
  const navItems = patientNav;
  const activeNavItem = navItems.find(item => location.pathname.startsWith(item.path)) || navItems[0];

  return (
    <div className="h-screen w-screen bg-[#0B0F19] text-slate-100 flex font-sans antialiased overflow-hidden select-none">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-[260px] h-full bg-[#0E1320] border-r border-slate-800/50 shrink-0 z-40 shadow-2xl shadow-black/50 relative">
        
        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto pt-6 px-3 space-y-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeNavItem.id === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                  isSelected 
                    ? "bg-[#2563EB] text-white shadow-lg shadow-blue-600/20 font-semibold" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <Icon className={`h-5 w-5 flex-shrink-0 ${isSelected ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                  <span className="text-sm tracking-wide">{item.label}</span>
                </div>
                {isSelected && <ChevronRight className="h-4 w-4 text-white/70" />}
              </Link>
            );
          })}
        </div>

        {/* Upgrade Banner */}
        <div className="px-4 py-2 mt-4">
          <div className="bg-gradient-to-br from-[#2E1E5F] to-[#1E1140] rounded-2xl p-5 border border-purple-500/20 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-20">
              <Sparkles className="h-12 w-12 text-purple-300" />
            </div>
            <div className="relative z-10 flex flex-col space-y-2.5">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <h4 className="text-sm font-bold text-white tracking-wide">Upgrade to Premium</h4>
              </div>
              <p className="text-[11px] text-purple-200/70 leading-relaxed font-medium">
                Unlock advanced insights, unlimited AI chats & more.
              </p>
              <Button className="w-full h-9 mt-2 bg-gradient-to-r from-[#9333EA] to-[#6366F1] hover:from-[#7E22CE] hover:to-[#4F46E5] text-white rounded-xl shadow-md border-none text-xs font-bold tracking-wide">
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 mb-2">
          <div className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-800/50 transition-colors cursor-pointer border border-transparent hover:border-slate-700/50">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 rounded-xl ring-2 ring-slate-800 shadow-sm">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" />
                <AvatarFallback className="bg-blue-600 text-white rounded-xl">D</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold text-white tracking-wide">Dinesh Kumar</span>
                <span className="text-[10px] text-slate-400 font-medium">View Profile</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </div>
        </div>
      </aside>

      {/* MOBILE TOP HEADER */}
      <header className="md:hidden absolute top-0 left-0 right-0 z-40 bg-[#0E1320] border-b border-slate-800/50 py-3 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-xl text-slate-300 hover:bg-slate-800">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-bold tracking-tight text-white">HealthHub</span>
        </div>
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" />
          <AvatarFallback>D</AvatarFallback>
        </Avatar>
      </header>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-[#0E1320] z-50 md:hidden flex flex-col p-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/50">
                <span className="font-bold text-white text-lg">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeNavItem.id === item.id;
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        isSelected ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800/50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-semibold">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT CANVAS */}
      <main className="flex-1 h-full overflow-y-auto relative pt-16 pb-20 md:pt-0 md:pb-0 bg-[#0B0F19]">
        <div className="max-w-[1600px] mx-auto w-full p-4 md:p-8 min-h-full">
          <Outlet />
        </div>
      </main>

      {/* MOBILE BOTTOM NAVBAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0E1320] border-t border-slate-800/50 py-2.5 px-4 flex items-center justify-around z-45 shadow-2xl backdrop-blur-lg bg-opacity-95">
        <Link 
          to="/patient/home" 
          className={`flex flex-col items-center justify-center space-y-1 transition-colors ${activeNavItem.id === "home" ? "text-[#2563EB]" : "text-slate-400 hover:text-white"}`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[9px] font-bold tracking-wide">Home</span>
        </Link>
        <Link 
          to="/patient/health" 
          className={`flex flex-col items-center justify-center space-y-1 transition-colors ${activeNavItem.id === "health" ? "text-[#2563EB]" : "text-slate-400 hover:text-white"}`}
        >
          <Heart className="h-5 w-5" />
          <span className="text-[9px] font-bold tracking-wide">Health</span>
        </Link>
        <Link 
          to="/patient/ai" 
          className={`flex flex-col items-center justify-center space-y-1 transition-colors ${activeNavItem.id === "ai" ? "text-[#2563EB]" : "text-slate-400 hover:text-white"}`}
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-[9px] font-bold tracking-wide">AI Chat</span>
        </Link>
        <Link 
          to="/patient/care" 
          className={`flex flex-col items-center justify-center space-y-1 transition-colors ${activeNavItem.id === "care" ? "text-[#2563EB]" : "text-slate-400 hover:text-white"}`}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-[9px] font-bold tracking-wide">Care</span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className={`flex flex-col items-center justify-center space-y-1 transition-colors ${isMobileMenuOpen ? "text-[#2563EB]" : "text-slate-400 hover:text-white"}`}
        >
          <Menu className="h-5 w-5" />
          <span className="text-[9px] font-bold tracking-wide">Menu</span>
        </button>
      </nav>

    </div>
  );
}
