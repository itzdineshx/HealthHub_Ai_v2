import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Home, 
  Heart, 
  Sparkles, 
  Calendar, 
  User, 
  Users, 
  Video, 
  Activity, 
  ShieldAlert, 
  Cpu, 
  LayoutDashboard, 
  LogOut, 
  Bell, 
  Search, 
  Menu, 
  X, 
  ChevronsUpDown, 
  AlertTriangle, 
  CheckCircle2, 
  PhoneCall,
  MapPin,
  FileText,
  AlertOctagon,
  Brain,
  MessageSquare,
  Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types for navigation items
interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface WorkspaceLayoutProps {
  children?: React.ReactNode;
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  overrideRole?: "patient" | "doctor" | "admin";
}

export default function WorkspaceLayout({ 
  children, 
  activeTabId = "home", 
  onTabChange,
  overrideRole
}: WorkspaceLayoutProps) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Unified role state for review/testing
  const [activeRole, setActiveRole] = useState<"patient" | "doctor" | "admin">(() => {
    const stored = localStorage.getItem("hubActiveRole");
    if (stored === "patient" || stored === "doctor" || stored === "admin") {
      return stored;
    }
    if (user?.role === "doctor") return "doctor";
    if (user?.role === "admin") return "admin";
    return "patient";
  });

  // Sync role override
  useEffect(() => {
    if (overrideRole) {
      setActiveRole(overrideRole);
      localStorage.setItem("hubActiveRole", overrideRole);
    }
  }, [overrideRole]);

  // Sidebar expanded / collapsed for desktop/tablet
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSosSheet, setShowSosSheet] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRoleChange = (role: "patient" | "doctor" | "admin") => {
    setActiveRole(role);
    localStorage.setItem("hubActiveRole", role);
    setRoleSwitcherOpen(false);
    toast({
      title: "Role Switched",
      description: `Now viewing the dashboard as a ${role.toUpperCase()}`,
      className: "bg-medical-blue text-white border-none"
    });
    
    // Redirect appropriately
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "doctor") {
      navigate("/doctor-panel");
    } else {
      navigate("/dashboard");
    }
  };

  // Dynamic Navigation Items based on the Active Role
  const patientNav: NavItem[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "health", label: "Health Hub", icon: Heart },
    { id: "ai", label: "AI Copilot", icon: Sparkles },
    { id: "care", label: "Care Circle", icon: Calendar },
    { id: "profile", label: "Profile", icon: User }
  ];

  const doctorNav: NavItem[] = [
    { id: "home", label: "Overview", icon: LayoutDashboard },
    { id: "queue", label: "Patients Queue", icon: Users },
    { id: "ai", label: "Clinical AI", icon: Brain },
    { id: "consult", label: "Telehealth", icon: Video },
    { id: "schedule", label: "Schedule", icon: Calendar }
  ];

  const adminNav: NavItem[] = [
    { id: "home", label: "Admin Console", icon: LayoutDashboard },
    { id: "users", label: "User Directory", icon: Users },
    { id: "logs", label: "Security & Audits", icon: ShieldAlert },
    { id: "system", label: "System Health", icon: Cpu },
    { id: "settings", label: "Global Settings", icon: User }
  ];

  const getNavItems = () => {
    switch (activeRole) {
      case "doctor": return doctorNav;
      case "admin": return adminNav;
      default: return patientNav;
    }
  };

  const navItems = getNavItems();

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    setIsMobileMenuOpen(false);
  };

  const triggerSos = () => {
    setShowSosSheet(true);
    // Vibrate device if supported
    if ("vibrate" in navigator) {
      navigator.vibrate([100, 50, 100, 50, 300]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased overflow-x-hidden select-none">
      
      {/* BACKGROUND DECORATIVE GLOWS */}
      <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-medical-blue/10 blur-[120px] dark:bg-medical-blue/5 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-green/10 blur-[120px] dark:bg-emerald-green/5 animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[40%] right-[20%] w-[35%] h-[35%] rounded-full bg-ai-purple/10 blur-[100px] dark:bg-ai-purple/5 animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      {/* TOP HEADER (Mobile/Tablet and Desktop Search/Notification) */}
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/40 py-3 px-4 md:px-6 flex items-center justify-between">
        
        {/* Left: Branding */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-medical-blue to-info-cyan flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform duration-300">
              H
            </div>
            <span className="text-xl font-bold tracking-tight text-medical-blue flex items-center">
              HealthHub<span className="text-foreground dark:text-white font-medium ml-0.5">OS</span>
            </span>
          </Link>
        </div>

        {/* Center: Search (Desktop/Tablet Only) */}
        <div className="hidden md:flex max-w-md w-full mx-6 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Universal health search (e.g., Blood tests, Dr. Watson, BMI)..." 
            className="pl-9 bg-muted/30 border-border/40 focus-visible:ring-medical-blue rounded-full text-sm w-full transition-all duration-300 focus:bg-background"
          />
        </div>

        {/* Right: Notifications, Active Role badge, Avatar */}
        <div className="flex items-center space-x-3">
          
          {/* Emergency Alert (Only for patients/users, but visible globally for demo) */}
          <Button 
            onClick={triggerSos}
            variant="destructive" 
            className="bg-critical-red hover:bg-red-600 font-semibold px-3 py-1.5 h-auto text-xs sm:text-sm rounded-full flex items-center space-x-1.5 shadow-lg shadow-red-500/20"
          >
            <AlertOctagon className="h-4 w-4 animate-bounce" />
            <span>SOS</span>
          </Button>

          {/* Dev/Role Indicator Switcher Button */}
          <div className="relative">
            <Button
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              variant="outline"
              size="sm"
              className="border-medical-blue/30 text-medical-blue hover:bg-medical-blue/5 rounded-full text-xs font-semibold px-3 py-1 h-8 flex items-center space-x-1 bg-medical-blue/5"
            >
              <span>{activeRole.toUpperCase()}</span>
              <ChevronsUpDown className="h-3 w-3" />
            </Button>

            <AnimatePresence>
              {roleSwitcherOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-card border border-border shadow-xl rounded-xl p-1 z-50 text-sm overflow-hidden"
                >
                  <div className="px-2 py-1.5 text-xs text-muted-foreground font-semibold border-b border-border/50 mb-1">
                    Select Active Role Workspace
                  </div>
                  <button 
                    onClick={() => handleRoleChange("patient")}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${activeRole === "patient" ? "bg-medical-blue/10 text-medical-blue font-medium" : "hover:bg-muted"}`}
                  >
                    <span>Patient Console</span>
                    {activeRole === "patient" && <CheckCircle2 className="h-4 w-4 text-medical-blue" />}
                  </button>
                  <button 
                    onClick={() => handleRoleChange("doctor")}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${activeRole === "doctor" ? "bg-medical-blue/10 text-medical-blue font-medium" : "hover:bg-muted"}`}
                  >
                    <span>Doctor Portal</span>
                    {activeRole === "doctor" && <CheckCircle2 className="h-4 w-4 text-medical-blue" />}
                  </button>
                  <button 
                    onClick={() => handleRoleChange("admin")}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${activeRole === "admin" ? "bg-medical-blue/10 text-medical-blue font-medium" : "hover:bg-muted"}`}
                  >
                    <span>Hospital Admin</span>
                    {activeRole === "admin" && <CheckCircle2 className="h-4 w-4 text-medical-blue" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative rounded-full text-muted-foreground hover:bg-muted/50">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-warning-amber" />
          </Button>

          {/* Profile Avatar */}
          <Avatar className="h-8 w-8 ring-2 ring-border/20">
            <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* CORE WORKSPACE FRAME */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* DESKTOP SIDEBAR NAVIGATION */}
        <aside 
          className={`hidden md:flex flex-col border-r border-border/40 bg-card/40 backdrop-blur-sm transition-all duration-300 ${
            sidebarExpanded ? "w-64" : "w-20"
          }`}
        >
          {/* Navigation link lists */}
          <div className="flex-1 py-6 px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTabId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 group ${
                    isSelected 
                      ? "bg-medical-blue text-white shadow-md shadow-medical-blue/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                    isSelected ? "text-white" : "text-muted-foreground"
                  }`} />
                  {sidebarExpanded && (
                    <span className="text-sm font-semibold tracking-tight">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer inside sidebar */}
          <div className="p-3 border-t border-border/30">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {sidebarExpanded && <span className="text-sm font-semibold">Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* MOBILE MENU DRAWER (SLIDEOUT) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black z-40 md:hidden"
              />
              {/* Drawer Content */}
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.25 }}
                className="fixed top-0 bottom-0 left-0 w-72 bg-card border-r border-border z-50 md:hidden flex flex-col p-4 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-4 border-b border-border/40">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-medical-blue flex items-center justify-center text-white font-bold">H</div>
                    <span className="font-bold text-medical-blue text-lg">HealthHub OS</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-lg hover:bg-muted">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex-1 py-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isSelected = activeTabId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all ${
                          isSelected ? "bg-medical-blue text-white" : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-semibold">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-border/40">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="text-sm font-semibold">Logout</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MAIN WORKSPACE CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:p-6 lg:p-8 pb-24 md:pb-6">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>

        {/* FLOATING CONTEXT-AWARE AI CHAT DRAWER */}
        <div className="fixed bottom-20 md:bottom-6 right-6 z-30">
          <Button
            onClick={() => setShowAiPanel(!showAiPanel)}
            className="h-12 w-12 rounded-full bg-ai-purple hover:bg-violet-600 text-white shadow-xl shadow-ai-purple/20 flex items-center justify-center p-0 transition-transform duration-300 hover:scale-105 ai-glow relative"
          >
            <Sparkles className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-green border-2 border-background animate-pulse" />
          </Button>
        </div>

        {/* FLOATING AI ASSISTANT DRAWER PANEL */}
        <AnimatePresence>
          {showAiPanel && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              className="fixed bottom-36 md:bottom-20 right-6 w-[340px] sm:w-[400px] h-[500px] bg-card border border-border shadow-2xl rounded-2xl flex flex-col z-40 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-ai-purple to-medical-blue p-4 text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm leading-none">HealthHub Copilot</h3>
                    <span className="text-[10px] text-white/80 flex items-center mt-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-green mr-1.5" />
                      Context-Aware: {activeRole.toUpperCase()} mode
                    </span>
                  </div>
                </div>
                <button onClick={() => setShowAiPanel(false)} className="text-white/80 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Message threads mock */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-muted/10">
                <div className="flex justify-start">
                  <div className="bg-muted px-3 py-2 rounded-2xl rounded-tl-none text-xs max-w-[85%] leading-relaxed text-foreground">
                    Hello! I'm your AI Medical Copilot. I'm synchronizing automatically with your active <strong>{activeRole}</strong> workspace. Ask me anything about reports, scheduling, or medical codes.
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-ai-purple text-white px-3 py-2 rounded-2xl rounded-tr-none text-xs max-w-[85%] leading-relaxed shadow-sm">
                    {activeRole === "patient" 
                      ? "Can you summarize my latest blood test results?"
                      : activeRole === "doctor"
                      ? "Check interaction risk for Acetaminophen and Warfarin."
                      : "Show system API latency and user activity summary."
                    }
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-muted px-3 py-2 rounded-2xl rounded-tl-none text-xs max-w-[85%] leading-relaxed text-foreground space-y-2">
                    {activeRole === "patient" ? (
                      <>
                        <p>Based on your last uploaded report (June 28):</p>
                        <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px]">
                          <li><strong>BP:</strong> 122/81 mmHg (Optimal)</li>
                          <li><strong>LDL Cholesterol:</strong> 132 mg/dL (Borderline High)</li>
                          <li><strong>Recommendation:</strong> Consider decreasing saturated fats and follow up with Dr. Robert Johnson next week.</li>
                        </ul>
                      </>
                    ) : activeRole === "doctor" ? (
                      <>
                        <p className="font-semibold text-warning-amber flex items-center">
                          <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                          Moderate Clinical Caution:
                        </p>
                        <p className="text-[11px]">Acetaminophen used concurrently with Warfarin may increase the anticoagulant effect. Monitor INR levels closely if co-prescribed.</p>
                      </>
                    ) : (
                      <>
                        <p><strong>System Status Update:</strong> All systems normal. AI classification model is at 97.2% precision. Average database transaction response is 28ms.</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Input field */}
              <div className="p-3 border-t border-border flex items-center space-x-2 bg-card">
                <Input placeholder="Type message..." className="text-xs bg-muted/40 rounded-full h-9 flex-1" />
                <Button size="icon" className="h-9 w-9 bg-ai-purple hover:bg-violet-600 rounded-full">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-md border-t border-border/50 flex items-center justify-around py-2 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTabId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className="flex flex-col items-center justify-center w-12 py-1 group"
              >
                <div className={`p-1.5 rounded-xl transition-all duration-300 ${
                  isSelected ? "bg-medical-blue text-white shadow-md shadow-medical-blue/20" : "text-muted-foreground group-hover:text-foreground"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-[10px] mt-0.5 font-medium ${
                  isSelected ? "text-medical-blue font-semibold" : "text-muted-foreground"
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* SOS EMERGENCY SLIDE-UP BOTTOM SHEET */}
      <AnimatePresence>
        {showSosSheet && (
          <>
            {/* Modal Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSosSheet(false)}
              className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
            />
            {/* Modal Content */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl border-t border-border z-50 p-6 max-w-xl mx-auto shadow-2xl flex flex-col"
            >
              {/* Pull handle */}
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />

              <div className="flex items-center space-x-3 mb-4 text-critical-red">
                <AlertTriangle className="h-8 w-8 animate-pulse flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold tracking-tight">CRITICAL EMERGENCY HUB</h2>
                  <p className="text-xs text-muted-foreground">Emergency responders will receive your location and medical ID automatically.</p>
                </div>
              </div>

              {/* Medical Information Quick Card */}
              <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 mb-4 text-sm">
                <h4 className="font-semibold text-critical-red mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-1.5" />
                  Your Active Medical Passport
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-muted-foreground">Allergies: <span className="font-medium text-foreground">Penicillin, Nuts</span></div>
                  <div className="text-muted-foreground">Blood Type: <span className="font-medium text-foreground">O Positive</span></div>
                  <div className="text-muted-foreground">Emergency Contact: <span className="font-medium text-foreground">Jane Sharma (Wife)</span></div>
                  <div className="text-muted-foreground">Phone: <span className="font-medium text-foreground">+1 (555) 911-3820</span></div>
                </div>
              </div>

              {/* SOS Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <Button 
                  className="bg-critical-red hover:bg-red-600 text-white font-bold h-12 rounded-xl flex items-center justify-center space-x-2 text-sm"
                  onClick={() => {
                    toast({ title: "Dialing 911...", description: "Connecting with primary emergency dispatcher." });
                    setShowSosSheet(false);
                  }}
                >
                  <PhoneCall className="h-5 w-5" />
                  <span>Call Ambulance (911)</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-critical-red text-critical-red hover:bg-red-50 dark:hover:bg-red-500/10 font-bold h-12 rounded-xl flex items-center justify-center space-x-2 text-sm"
                  onClick={() => {
                    toast({ title: "Broadcasting Location...", description: "Location sent to close relatives and primary clinic." });
                    setShowSosSheet(false);
                  }}
                >
                  <MapPin className="h-5 w-5" />
                  <span>Broadcast GPS Location</span>
                </Button>
              </div>

              {/* Dismiss */}
              <Button 
                onClick={() => setShowSosSheet(false)} 
                variant="ghost" 
                className="w-full rounded-xl text-muted-foreground text-sm py-2 h-auto"
              >
                Cancel / Close Sheet
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
