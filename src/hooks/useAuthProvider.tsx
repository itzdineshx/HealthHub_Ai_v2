import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import { User, UserRole, AuthProvider, GoogleProfile, AuthContextType } from "@/types/auth";
import { auth } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Here we map the Firebase User to our internal User structure
        // In a real app, you'd fetch the role and profile completion status from MongoDB
        const mappedUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          role: "patient", // Default, would come from DB
          provider: "email",
          profileCompleted: false
        };
        setUser(mappedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    // Ideally this also updates your MongoDB backend
    return updatedUser;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login Successful",
        description: "Welcome back to HealthHub AI!",
      });
      // Redirect logic based on role would happen here after fetching from DB
      navigate("/dashboard");
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
      return false;
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, you would also store the name in your MongoDB backend
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "Account Created",
        description: "Your account has been created successfully!",
      });
      navigate("/health-form");
      return true;
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign Up Failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
      return false;
    }
  };

  const loginWithProvider = async (provider: "google" | "microsoft", profile?: GoogleProfile): Promise<boolean> => {
    try {
      if (provider === "google") {
        const googleProvider = new GoogleAuthProvider();
        await signInWithPopup(auth, googleProvider);
        toast({
          title: "Login Successful",
          description: "Welcome to HealthHub AI!",
        });
        navigate("/dashboard");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast({
        title: "Authentication Failed",
        description: error.message || `Could not sign in with ${provider}.`,
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    user,
    isAuthenticated,
    login,
    signUp,
    loginWithProvider,
    logout,
    updateUser
  };
};
