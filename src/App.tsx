import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const OSLayout = lazy(() => import("./layouts/OSLayout"));
const Profile = lazy(() => import("./pages/Profile"));
const DoctorPanel = lazy(() => import("./pages/DoctorPanel"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const TrainingDashboard = lazy(() => import("./pages/TrainingDashboard"));
const HealthRecords = lazy(() => import("./pages/HealthRecords"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RiskPlanner = lazy(() => import("./pages/RiskPlanner"));
const AccountManager = lazy(() => import("./pages/AccountManager"));
import { WorkspaceShell } from "./components/ui/workspace-shell";
import { Heart, Sparkles, Calendar, Activity, Users, Cpu } from "lucide-react";
const Risk = lazy(() => import("./pages/Risk"));
const Diet = lazy(() => import("./pages/Diet"));
const Chat = lazy(() => import("./pages/Chat"));
const DiseasePredictor = lazy(() => import("./pages/DiseasePredictor"));
const LearnExerciseAI = lazy(() => import("./pages/LearnExerciseAI"));
const MealPlanner = lazy(() => import("./pages/MealPlanner"));
const Ocr = lazy(() => import("./pages/Ocr"));
const DiseaseMetrics = lazy(() => import("./pages/DiseaseMetrics"));
const About = lazy(() => import("./pages/About"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Contact = lazy(() => import("./pages/Contact"));
const DoctorDashboard = lazy(() => import("./pages/DoctorDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const PatientRecords = lazy(() => import("./pages/PatientRecords"));
const HealthForm = lazy(() => import("./pages/HealthForm"));
const HealthAssessment = lazy(() => import("./pages/HealthAssessment"));
const AIChatbot = lazy(() => import("./pages/AIChatbot"));
const Care = lazy(() => import("./pages/Care"));
const Medications = lazy(() => import("./pages/Medications"));
const FamilyHealth = lazy(() => import("./pages/FamilyHealth"));
const Emergency = lazy(() => import("./pages/Emergency"));
const DoctorPatients = lazy(() => import("./pages/DoctorPatients"));
const DoctorCalendar = lazy(() => import("./pages/DoctorCalendar"));
const DoctorAnalytics = lazy(() => import("./pages/DoctorAnalytics"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminSystem = lazy(() => import("./pages/AdminSystem"));

// Protected route component
interface ProtectedRouteProps {
  element: React.ReactNode;
  requiredRole?: "user" | "doctor" | "admin";
}

const ProtectedRoute = ({ element, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Use local override role if set, otherwise fallback to auth context user role
  const activeRole = localStorage.getItem("hubActiveRole") || user?.role || "patient";
  const mappedActiveRole = activeRole === "user" ? "patient" : activeRole;
  
  // Check if user has required role (if specified)
  if (requiredRole) {
    const target = requiredRole === "user" ? "patient" : requiredRole;
    if (mappedActiveRole !== target) {
      return <Navigate to="/dashboard" />;
    }
  }
  
  return <>{element}</>;
};

const App = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="disease-predictor" element={<DiseasePredictor />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="login" element={<Login />} />
      <Route path="dashboard/login" element={<Navigate to="/login" />} />
      
      {/* OS Workspace Routes */}
      <Route element={<ProtectedRoute element={<OSLayout />} />}>
        {/* Patient Workspace */}
        <Route path="patient">
          <Route path="home" element={<Dashboard />} />
          <Route path="health" element={<HealthAssessment />} />
          <Route path="ai" element={<AIChatbot />} />
          <Route path="care" element={<Care />} />
          <Route path="medications" element={<Medications />} />
          <Route path="fitness" element={<TrainingDashboard />} />
          <Route path="nutrition" element={<MealPlanner />} />
          <Route path="records" element={<HealthRecords />} />
          <Route path="family" element={<FamilyHealth />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="settings" element={<AccountManager />} />
          <Route path="profile" element={<Profile />} />
          <Route index element={<Navigate to="/patient/home" replace />} />
        </Route>

        {/* Doctor Workspace */}
        <Route path="doctor">
          <Route path="queue" element={<DoctorPanel />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="calendar" element={<DoctorCalendar />} />
          <Route path="analytics" element={<DoctorAnalytics />} />
          <Route index element={<Navigate to="/doctor/queue" replace />} />
        </Route>

        {/* Admin Workspace */}
        <Route path="admin">
          <Route path="overview" element={<AdminPanel />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="system" element={<AdminSystem />} />
          <Route index element={<Navigate to="/admin/overview" replace />} />
        </Route>
        {/* Legacy Routes - Now wrapped in OSLayout so they share the dashboard style */}
        <Route path="profile" element={<Profile />} />
        <Route path="doctor-panel" element={<DoctorPanel />} />
        <Route path="health-records" element={<HealthRecords />} />
        <Route path="training-dashboard" element={<TrainingDashboard />} />
        <Route path="risk-planner" element={<RiskPlanner />} />
        <Route path="account" element={<AccountManager />} />
        <Route path="risk" element={<Risk />} />
        <Route path="diet" element={<Diet />} />
        <Route path="chat" element={<Chat />} />
        <Route path="ocr" element={<Ocr />} />
        <Route path="health-form" element={<HealthForm />} />
        <Route path="health-assessment" element={<HealthAssessment />} />
        <Route path="doctor" element={<DoctorDashboard />} />
        <Route path="admin-dashboard" element={<AdminDashboard />} />
        <Route path="patient-records" element={<PatientRecords />} />
      </Route>

      {/* Legacy Public / Redirect Routes */}
      <Route path="dashboard" element={<Navigate to="/patient/home" replace />} />
      <Route path="ocr/login" element={<Navigate to="/login" />} />
      <Route path="learn-exercise-ai" element={<LearnExerciseAI />} />
      <Route path="meal-planner" element={<MealPlanner />} />
      <Route path="disease-metrics" element={<DiseaseMetrics />} />
      <Route path="about" element={<About />} />
      <Route path="privacy" element={<Privacy />} />
      <Route path="terms" element={<Terms />} />
      <Route path="contact" element={<Contact />} />
      <Route path="auth/callback" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const AppWrapper = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          <AuthProvider>
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <App />
              <Toaster />
              <Sonner />
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default AppWrapper;
