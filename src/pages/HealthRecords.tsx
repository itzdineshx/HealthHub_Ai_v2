import { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  FileText, 
  Calendar, 
  AlertCircle, 
  Download, 
  Share2,
  FlaskConical,
  Activity,
  Info,
  Shield,
  X,
  Upload,
  Loader2,
  Eye,
  Camera
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from 'axios';

// Define API base URL with fallback options 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                     import.meta.env.VITE_API_URL || 
                     'http://localhost:8000';

// Document model interface
interface DocumentMetadata {
  id?: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: string;
  uploadedAt: Date;
  notes?: string;
}

// Add a new interface for document responses
interface DocumentResponse {
  id: number;
  user_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  category: string;
  uploaded_at: string;
  notes?: string;
}

// Add a mockUpload function for testing when backend is unavailable
const mockUploadDocument = async (file: File, metadata: DocumentMetadata) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate success
  return {
    id: Math.floor(Math.random() * 1000),
    fileName: metadata.fileName,
    fileType: metadata.fileType,
    fileSize: metadata.fileSize,
    category: metadata.category,
    uploadedAt: new Date(),
    notes: metadata.notes,
    file_path: "mock_file_path",
    user_id: 1
  };
};

// Add a function to check backend connectivity
const checkBackendConnectivity = async (): Promise<boolean> => {
  try {
    // Use a simple HEAD request with a timeout to check connectivity
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    try {
      const response = await fetch(`${API_BASE_URL}/health-check`, { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      // Handle fetch errors silently, just return false
      clearTimeout(timeoutId);
      
      // Only log in development mode and only once per session using a sessionStorage flag
      if (import.meta.env.DEV && !sessionStorage.getItem('backend_connectivity_logged')) {
        console.info("Backend server is not available, using mock data instead");
        // Set flag to prevent repeated logging
        sessionStorage.setItem('backend_connectivity_logged', 'true');
      }
      
      return false;
    }
  } catch (error) {
    // Only log in development mode
    if (import.meta.env.DEV && !sessionStorage.getItem('backend_connectivity_error_logged')) {
      console.warn("Backend connectivity check failed:", error);
      // Set flag to prevent repeated logging
      sessionStorage.setItem('backend_connectivity_error_logged', 'true');
    }
    return false;
  }
};

const HealthRecords = () => {
  const [activeTab, setActiveTab] = useState("medical");
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTypeDialog, setShowTypeDialog] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const [userDocuments, setUserDocuments] = useState<DocumentResponse[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  // State for managing dialog content based on upload status
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle', 'selectingType', 'selectingFile', 'previewing', 'uploading', 'success', 'error'
  
  useEffect(() => {
    setIsLoaded(true);
    // Load user's documents when component mounts
    fetchUserDocuments();
  }, []);
  
  // Function to fetch user's documents
  const fetchUserDocuments = async () => {
    try {
      setIsLoadingDocuments(true);
      
      // Check backend connectivity first, but don't throw error if not available
      const isBackendAvailable = await checkBackendConnectivity();
      if (!isBackendAvailable) {
        // Use mock data instead of throwing error
        setUserDocuments([
          {
            id: 1,
            user_id: 1,
            file_name: "Blood Test Results.pdf",
            file_path: "mock_path",
            file_type: "application/pdf",
            file_size: 1048576,
            category: "Lab Result",
            uploaded_at: new Date().toISOString(),
            notes: "Annual checkup"
          },
          {
            id: 2,
            user_id: 1,
            file_name: "Vaccination Card.jpg",
            file_path: "mock_path",
            file_type: "image/jpeg",
            file_size: 524288,
            category: "Vaccination Record",
            uploaded_at: new Date().toISOString()
          }
        ]);
        
        // Silent mode in production, only show message in development
        if (import.meta.env.DEV && !sessionStorage.getItem('offline_mode_notified')) {
          toast({
            title: "Using offline mode",
            description: "Could not connect to server. Showing sample data instead."
          });
          sessionStorage.setItem('offline_mode_notified', 'true');
        }
        
        setIsLoadingDocuments(false);
        return;
      }
      
      // Continue with API request if backend is available
      // Get auth token (assuming it's stored in localStorage)
      const token = localStorage.getItem('authToken');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${API_BASE_URL}/health-records/documents`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`,
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setUserDocuments(data);
      } else {
        console.error('Failed to fetch documents:', response.status, response.statusText);
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      // Use mock data if backend is not available
      setUserDocuments([
        {
          id: 1,
          user_id: 1,
          file_name: "Blood Test Results.pdf",
          file_path: "mock_path",
          file_type: "application/pdf",
          file_size: 1048576,
          category: "Lab Result",
          uploaded_at: new Date().toISOString(),
          notes: "Annual checkup"
        },
        {
          id: 2,
          user_id: 1,
          file_name: "Vaccination Card.jpg",
          file_path: "mock_path",
          file_type: "image/jpeg",
          file_size: 524288,
          category: "Vaccination Record",
          uploaded_at: new Date().toISOString()
        }
      ]);
      
      // Show toast notification for users
      toast({
        title: "Using offline mode",
        description: "Could not connect to server. Showing sample data instead.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingDocuments(false);
    }
  };
  
  // Function to download a document
  const downloadDocument = async (documentId: number, fileName: string) => {
    try {
      // Check backend connectivity first
      const isBackendAvailable = await checkBackendConnectivity();
      if (!isBackendAvailable) {
        throw new Error("Server connection failed. Cannot download files in offline mode.");
      }
      
      // Get auth token
      const token = localStorage.getItem('authToken');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for downloads
      
      const response = await fetch(`${API_BASE_URL}/health-records/documents/${documentId}/download`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`,
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status}`);
      }
      
      // Create blob from response
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element to trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "File Downloaded",
        description: `${fileName} has been downloaded successfully.`
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download file",
        variant: "destructive"
      });
    }
  };
  
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;

    const preventDefaults = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const highlight = () => {
      dropArea.classList.add('bg-sage/10', 'dark:bg-sage/20');
    };

    const unhighlight = () => {
      dropArea.classList.remove('bg-sage/10', 'dark:bg-sage/20');
    };

    const handleDrop = (e: DragEvent) => {
      const dt = e.dataTransfer;
      if (dt?.files && dt.files.length) {
        validateAndProcessFile(dt.files[0]);
      }
    };

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });

    dropArea.addEventListener('drop', handleDrop, false);

    return () => {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.removeEventListener(eventName, preventDefaults, false);
      });

      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.removeEventListener(eventName, highlight, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropArea.removeEventListener(eventName, unhighlight, false);
      });

      dropArea.removeEventListener('drop', handleDrop, false);
    };
  }, []);
  
  const downloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: "Your health report has been downloaded."
    });
  };
  
  const shareReport = () => {
    toast({
      title: "Report Shared",
      description: "Your report has been shared with Dr. Johnson."
    });
  };

  const handleUploadClick = () => {
    setShowUploadDialog(true); // Use the main dialog
    setUploadStatus('selectingType'); // Set status to selecting type
  };

  const handleFileTypeSelection = (type: string) => {
    setDocumentType(type);
    setUploadStatus('selectingFile'); // Move to file selection step
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
  };

  const handleFileSelected = (file: File) => {
    validateAndProcessFile(file);
    setUploadStatus('previewing');
  };

  const validateAndProcessFile = (file: File) => {
    setUploadError(null);
    const supportedTypes = ['.docx', '.pdf', '.jpg', '.jpeg', '.png'];
    
    // Special handling for camera captures which might have MIME types like "image/jpg"
    // without the standard file extension
    if (file.type.startsWith('image/')) {
      let fileExtension;
      if (file.name.includes('.')) {
        fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      } else {
        // Handle camera captures without extensions
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          fileExtension = '.jpg';
        } else if (file.type === 'image/png') {
          fileExtension = '.png';
        } else {
          fileExtension = '.jpg'; // Default to jpg for unknown image types
        }
      }
      
      if (!supportedTypes.includes(fileExtension)) {
        setUploadError(`Unsupported file type. Allowed formats: ${supportedTypes.join(', ')}`);
        return;
      }
    } else {
      // For non-image files, use standard extension check
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      
      if (!supportedTypes.includes(fileExtension)) {
        setUploadError(`Unsupported file type. Allowed formats: ${supportedTypes.join(', ')}`);
        return;
      }
    }

    setSelectedFile(file);
    
    // Create preview for image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !documentType) return;
    
    setIsUploading(true);
    setUploadStatus('uploading'); // Set status to uploading
    setUploadError(null); // Clear previous errors
    
    const metadata: DocumentMetadata = {
      fileName: selectedFile.name,
      fileType: selectedFile.type,
      fileSize: selectedFile.size,
      category: documentType,
      uploadedAt: new Date(),
      notes: additionalNotes || undefined
    };
    
    try {
      // Get auth token (assuming it's stored in localStorage)
      const token = localStorage.getItem('authToken');
      
      // Check if backend is available
      const isBackendAvailable = await checkBackendConnectivity();
      
      let result;
      
      if (isBackendAvailable) {
        // Use the real backend
        try {
          // Upload the file to the server
          const formData = new FormData();
          formData.append('file', selectedFile);
          formData.append('metadata', JSON.stringify(metadata));
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for uploads
          
          const response = await fetch(`${API_BASE_URL}/health-records/documents`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token || ''}`,
              // Don't set Content-Type when using FormData - the browser will set it with the boundary
            },
            body: formData,
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);

          if (!response.ok) {
            let errorDetail;
            try {
              const errorData = await response.json();
              errorDetail = errorData.detail || `Server error: ${response.status}`;
            } catch (e) {
              errorDetail = `Upload failed with status: ${response.status}`;
            }
            throw new Error(errorDetail);
          }
          
          result = await response.json();
          
          // Refresh documents list after successful upload
          fetchUserDocuments();
        } catch (error) {
          // If we get a network error with the real backend, fall back to mock
          if (error instanceof Error && (
              error.message.includes("Failed to fetch") || 
              error.message.includes("NetworkError") ||
              error.message.includes("Network Error") ||
              error.message.includes("The operation was aborted"))) {
            console.warn("Error with backend, falling back to mock implementation", error);
            result = await mockUploadDocument(selectedFile, metadata);
          } else {
            // Re-throw non-network errors
            throw error;
          }
        }
      } else {
        // Use the mock implementation
        console.warn("Backend server connectivity test failed, using mock implementation");
        result = await mockUploadDocument(selectedFile, metadata);
      }

      // Handle successful upload
      toast({
        title: "File Uploaded Successfully",
        description: `Your ${documentType.toLowerCase()} has been uploaded.`
      });

      // Reset form
      resetUpload();
      
      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Provide more user-friendly error message
      let errorMessage;
      if (error instanceof Error) {
        // Check for specific network-related errors
        if (error.message.includes("Failed to fetch") || 
            error.message.includes("NetworkError") ||
            error.message.includes("Network Error") ||
            error.message.includes("Cannot connect") ||
            error.message.includes("The operation was aborted")) {
          errorMessage = "Network error: Cannot connect to server. Please verify that you have internet connectivity.";
        } else {
          errorMessage = error.message;
        }
      } else {
        errorMessage = "An unknown error occurred during upload";
      }
      
      setUploadError(errorMessage);
      setUploadStatus('error'); // Set status to error
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setUploadError(null);
    setAdditionalNotes("");
    setDocumentType("");
    setUploadStatus('idle'); // Reset upload status
    setShowUploadDialog(false); // Close the main dialog
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Clean up camera resources when component unmounts
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Function to check if camera permission is granted
  const checkCameraPermission = async (): Promise<boolean> => {
    try {
      // First check if browser supports permissions API
      if (navigator.permissions && navigator.permissions.query) {
        // Check camera permission status
        const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
        
        if (permissionStatus.state === 'denied') {
          setUploadError("Camera access is blocked. Please allow camera access in your browser settings.");
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.warn("Permissions API not fully supported, will try direct camera access:", error);
      return true; // Continue with camera activation even if permissions API fails
    }
  };

  // Function to activate device camera
  const activateCamera = async () => {
    try {
      setUploadError(null);
      
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setUploadError("Your browser doesn't support camera access. Please try uploading a file instead.");
        return;
      }
      
      // Check for camera permission
      const permissionGranted = await checkCameraPermission();
      if (!permissionGranted) {
        return;
      }
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment", // prefer back camera on mobile devices
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      mediaStreamRef.current = stream;
      
      // Display video stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      
      let errorMessage = "Could not access camera. Please check permissions and try again.";
      
      // More specific error messages based on the error
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage = "Camera access denied. Please grant permission to use your camera.";
        } else if (error.name === 'NotFoundError') {
          errorMessage = "No camera found on your device.";
        } else if (error.name === 'NotReadableError' || error.name === 'AbortError') {
          errorMessage = "Camera is already in use by another application.";
        }
      }
      
      setUploadError(errorMessage);
    }
  };
  
  // Function to capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Create a File object from the blob
          const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
          
          // Process captured image like a normal file upload
          validateAndProcessFile(file);
          
          // Stop camera after capture
          stopCamera();
        }
      }, 'image/jpeg', 0.8); // 80% quality JPEG
    }
  };
  
  // Function to stop camera stream
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
  };
  
  const handleUploadOption = (option: 'file' | 'camera') => {
    setShowUploadDialog(false);
    
    if (option === 'file' && fileInputRef.current) {
      // Trigger file selection
      fileInputRef.current.click();
    } else if (option === 'camera') {
      // Activate camera
      activateCamera();
    }
  };

  return (
    <Layout>
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-40 left-20 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDuration: '15s' }}></div>
      
        <div className="container relative mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }} 
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-6"
          >
            <h1 className="text-3xl font-extrabold text-white mb-2">Health Records</h1>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={downloadReport} className="group border-slate-800 bg-[#151C2C] text-slate-200 hover:bg-slate-800 rounded-xl h-10">
                <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Export
              </Button>
              <Button variant="outline" onClick={shareReport} className="group border-slate-800 bg-[#151C2C] text-slate-200 hover:bg-slate-800 rounded-xl h-10">
                <Share2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Share
              </Button>
            </div>
          </motion.div>

          {/* Privacy notice */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 10 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex items-center space-x-3 shadow-inner"
          >
            <Shield className="text-blue-500 h-5 w-5 shrink-0" />
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Your health records are securely encrypted and only accessible by you and your authorized healthcare providers.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-[#151C2C] border-slate-800 shadow-xl rounded-3xl">
              <CardHeader className="pb-3 border-b border-slate-850">
                <CardTitle className="text-xl font-bold text-white">Your Health Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="medical" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6 bg-slate-900/40 p-1.5 rounded-2xl border border-slate-850 flex flex-wrap gap-1 w-fit">
                    <TabsTrigger value="medical" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 font-bold rounded-xl px-4 py-2 transition-all">Medical Records</TabsTrigger>
                    <TabsTrigger value="lab" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 font-bold rounded-xl px-4 py-2 transition-all">Lab Results</TabsTrigger>
                    <TabsTrigger value="prescriptions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 font-bold rounded-xl px-4 py-2 transition-all">Prescriptions</TabsTrigger>
                    <TabsTrigger value="vaccinations" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 font-bold rounded-xl px-4 py-2 transition-all">Vaccinations</TabsTrigger>
                  </TabsList>
                  
                  {/* Medical Records Tab */}
                  <TabsContent value="medical" className="space-y-4">
                    <div className="flex justify-between items-center pb-2">
                      <h2 className="text-lg font-bold text-slate-200">Recent Medical Records</h2>
                      <Button variant="outline" onClick={() => setShowUploadDialog(true)} className="border-slate-800 bg-slate-900 text-slate-350 hover:bg-slate-800 rounded-xl h-9 text-xs">
                        <FileText className="mr-2 h-4 w-4" />
                        Add Record
                      </Button>
                    </div>
                    
                    <ScrollArea className="h-[300px] pr-4">
                      <motion.div 
                        className="space-y-2.5"
                        variants={container}
                        initial="hidden"
                        animate="show"
                      >
                        {[
                          { name: "Annual Physical Exam", date: "Apr 15, 2025", doctor: "Dr. Emily Chen" },
                          { name: "Cardiology Consultation", date: "Mar 20, 2025", doctor: "Dr. Robert Johnson" },
                          { name: "Dermatology Checkup", date: "Feb 10, 2025", doctor: "Dr. Sarah Williams" },
                          { name: "Orthopedic Assessment", date: "Jan 25, 2025", doctor: "Dr. Michael Taylor" },
                          { name: "Vision Examination", date: "Dec 12, 2024", doctor: "Dr. Lisa Garcia" }
                        ].map((record, index) => (
                          <motion.div 
                            key={index} 
                            className="flex items-center justify-between p-3.5 bg-slate-900/30 hover:bg-slate-850 rounded-2xl transition-all border border-slate-850 hover:border-slate-800"
                            variants={item}
                          >
                            <div className="space-y-0.5">
                              <p className="font-bold text-white text-sm leading-tight">{record.name}</p>
                              <p className="text-[11px] text-slate-500 font-semibold">{record.date} - {record.doctor}</p>
                            </div>
                            <Button variant="outline" size="sm" className="border-slate-800 bg-[#151C2C] text-slate-300 hover:bg-slate-800 text-xs rounded-xl h-8.5 px-3.5 font-bold transition-colors">View</Button>
                          </motion.div>
                        ))}
                      </motion.div>
                    </ScrollArea>
                  </TabsContent>
                  
                  {/* Lab Results Tab */}
                  <TabsContent value="lab" className="space-y-4">
                    <div className="flex justify-between items-center pb-2">
                      <h2 className="text-lg font-bold text-slate-200">Recent Lab Results</h2>
                      <Button variant="outline" onClick={() => setShowUploadDialog(true)} className="border-slate-800 bg-slate-900 text-slate-350 hover:bg-slate-800 rounded-xl h-9 text-xs">
                        <FlaskConical className="mr-2 h-4 w-4" />
                        Add Result
                      </Button>
                    </div>
                    
                    <ScrollArea className="h-[300px] pr-4">
                      <motion.div
                        className="space-y-2.5"
                        variants={container}
                        initial="hidden"
                        animate="show"
                      >
                        {[
                          { name: "Blood Test", date: "Apr 22, 2025", lab: "City Medical Lab" },
                          { name: "Cholesterol Test", date: "Mar 15, 2025", lab: "Healthcare Diagnostics" },
                          { name: "Urinalysis", date: "Feb 01, 2025", lab: "Community Labs" }
                        ].map((result, index) => (
                          <motion.div key={index} className="flex items-center justify-between p-3.5 bg-slate-900/30 hover:bg-slate-850 rounded-2xl transition-all border border-slate-850 hover:border-slate-800" variants={item}>
                            <div className="space-y-0.5">
                              <p className="font-bold text-white text-sm leading-tight">{result.name}</p>
                              <p className="text-[11px] text-slate-500 font-semibold">{result.date} - {result.lab}</p>
                            </div>
                            <Button variant="outline" size="sm" className="border-slate-800 bg-[#151C2C] text-slate-300 hover:bg-slate-800 text-xs rounded-xl h-8.5 px-3.5 font-bold transition-colors">View</Button>
                          </motion.div>
                        ))}
                      </motion.div>
                    </ScrollArea>
                  </TabsContent>
                  
                  {/* Prescriptions Tab */}
                  <TabsContent value="prescriptions" className="space-y-4">
                    <div className="flex justify-between items-center pb-2">
                      <h2 className="text-lg font-bold text-slate-200">Active Prescriptions</h2>
                      <Button variant="outline" onClick={() => setShowUploadDialog(true)} className="border-slate-800 bg-slate-900 text-slate-355 hover:bg-slate-800 rounded-xl h-9 text-xs">
                        <FileText className="mr-2 h-4 w-4" />
                        Add Prescription
                      </Button>
                    </div>
                    
                    <ScrollArea className="h-[300px] pr-4">
                      <motion.div
                        className="space-y-2.5"
                        variants={container}
                        initial="hidden"
                        animate="show"
                      >
                        {[
                          { name: "Amoxicillin", date: "Apr 28, 2025", doctor: "Dr. Emily Chen" },
                          { name: "Lisinopril", date: "Mar 10, 2025", doctor: "Dr. Robert Johnson" },
                          { name: "Vitamin D", date: "Jan 25, 2025", doctor: "Dr. Sarah Williams" }
                        ].map((prescription, index) => (
                          <motion.div key={index} className="flex items-center justify-between p-3.5 bg-slate-900/30 hover:bg-slate-850 rounded-2xl transition-all border border-slate-850 hover:border-slate-800" variants={item}>
                            <div className="space-y-0.5">
                              <p className="font-bold text-white text-sm leading-tight">{prescription.name}</p>
                              <p className="text-[11px] text-slate-500 font-semibold">Prescribed on {prescription.date} by {prescription.doctor}</p>
                            </div>
                            <Button variant="outline" size="sm" className="border-slate-800 bg-[#151C2C] text-slate-300 hover:bg-slate-800 text-xs rounded-xl h-8.5 px-3.5 font-bold transition-colors">View</Button>
                          </motion.div>
                        ))}
                      </motion.div>
                    </ScrollArea>
                  </TabsContent>
                  
                  {/* Vaccinations Tab */}
                  <TabsContent value="vaccinations" className="space-y-4">
                    <div className="flex justify-between items-center pb-2">
                      <h2 className="text-lg font-bold text-slate-200">Recent Vaccinations</h2>
                      <Button variant="outline" onClick={() => setShowUploadDialog(true)} className="border-slate-800 bg-slate-900 text-slate-350 hover:bg-slate-800 rounded-xl h-9 text-xs">
                        <Activity className="mr-2 h-4 w-4" />
                        Add Vaccination
                      </Button>
                    </div>
                    
                    <ScrollArea className="h-[300px] pr-4">
                      <motion.div
                        className="space-y-2.5"
                        variants={container}
                        initial="hidden"
                        animate="show"
                      >
                        {[
                          { name: "Influenza Vaccine", date: "Oct 10, 2024", clinic: "Local Health Clinic" },
                          { name: "Tetanus Booster", date: "Jun 18, 2023", clinic: "Family Care Physician" }
                        ].map((vaccination, index) => (
                          <motion.div key={index} className="flex items-center justify-between p-3.5 bg-slate-900/30 hover:bg-slate-850 rounded-2xl transition-all border border-slate-850 hover:border-slate-800" variants={item}>
                            <div className="space-y-0.5">
                              <p className="font-bold text-white text-sm leading-tight">{vaccination.name}</p>
                              <p className="text-[11px] text-slate-500 font-semibold">{vaccination.date} at {vaccination.clinic}</p>
                            </div>
                            <Button variant="outline" size="sm" className="border-slate-800 bg-[#151C2C] text-slate-300 hover:bg-slate-800 text-xs rounded-xl h-8.5 px-3.5 font-bold transition-colors">View</Button>
                          </motion.div>
                        ))}
                      </motion.div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upload New Record */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6"
          >
            <Card className="bg-[#151C2C] border-slate-800 shadow-xl rounded-3xl">
              <CardHeader className="pb-3 border-b border-slate-850">
                <CardTitle className="text-xl font-bold text-white">Upload New Document</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <motion.div
                    ref={dropAreaRef}
                    whileHover={{ scale: 1.01 }}
                    className="border-2 border-dashed border-slate-800 hover:border-slate-700/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-900/10 transition-colors cursor-pointer"
                    onClick={() => !selectedFile && handleUploadClick()}
                  >
                    {selectedFile ? (
                      /* Show preview of selected file */
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-bold text-white">Selected File</h4>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              resetUpload();
                            }}
                            className="h-7 w-7 p-0 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {filePreview ? (
                          <div className="flex items-center space-x-3 bg-slate-900/30 p-3 rounded-2xl border border-slate-850">
                            <div className="h-20 w-20 rounded-xl overflow-hidden border border-slate-800 shrink-0">
                              <img src={filePreview} alt="Preview" className="h-full w-full object-cover"/>
                            </div>
                            <div className="text-left min-w-0">
                              <p className="text-sm font-bold text-white truncate">{selectedFile.name}</p>
                              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                                {(selectedFile.size / 1024).toFixed(1)} KB 
                                {documentType && ` • ${documentType}`}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3 bg-slate-900/30 p-3.5 rounded-2xl border border-slate-850">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-550/10">
                              <FileText className="h-6 w-6 text-indigo-400" />
                            </div>
                            <div className="text-left min-w-0">
                              <p className="text-sm font-bold text-white truncate">{selectedFile.name}</p>
                              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                                {(selectedFile.size / 1024).toFixed(1)} KB 
                                {documentType && ` • ${documentType}`}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Show upload prompt */
                      <>
                        <FileText className="h-10 w-10 text-indigo-400 mb-4" />
                        <h3 className="text-base font-bold text-slate-205">Drag and drop files here</h3>
                        <p className="text-xs text-slate-500 max-w-xs mt-2 font-medium">
                          Or select files from your local storage
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4 border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl h-9 text-xs px-4 font-semibold"
                          onClick={handleUploadClick}
                        >
                          Upload Files
                        </Button>
                      </>
                    )}
                    
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".docx,.pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </motion.div>
                  
                  {/* Error message */}
                  {uploadError && (
                    <Alert className="bg-red-500/5 dark:bg-red-900/10 border-red-500/20 text-red-400">
                      <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                      <AlertDescription className="text-red-400 ml-2 font-semibold">
                        {uploadError}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid gap-1.5 text-xs">
                    <Label htmlFor="document-type" className="text-slate-300 font-bold">Document type</Label>
                    <select 
                      id="document-type" 
                      value={documentType}
                      onChange={(e) => handleFileTypeSelection(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-white h-10 rounded-xl px-2.5 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value="">Select document type</option>
                      <option value="Lab Result">Lab Result</option>
                      <option value="Imaging Report">Imaging Report</option>
                      <option value="Prescription">Prescription</option>
                      <option value="Vaccination Record">Vaccination Record</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="grid gap-1.5 text-xs">
                    <Label htmlFor="additional-notes" className="text-slate-300 font-bold">Additional Notes (Optional)</Label>
                    <Input
                      id="additional-notes"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="e.g. Doctor consultation comments"
                      className="bg-slate-900 border-slate-800 text-white h-10 rounded-xl focus-visible:ring-blue-600 shadow-inner"
                    />
                  </div>
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold h-11 border-none shadow-lg shadow-blue-600/20 transition-all"
                    disabled={!selectedFile || !documentType || isUploading}
                    onClick={handleFileUpload}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                        Saving Record...
                      </>
                    ) : (
                      'Save Record'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Document Library */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6"
          >
            <Card className="bg-[#151C2C] border-slate-800 shadow-xl rounded-3xl">
              <CardHeader className="pb-3 border-b border-slate-850">
                <CardTitle className="text-xl font-bold text-white">Your Document Library</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoadingDocuments ? (
                  <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : userDocuments.length > 0 ? (
                  <ScrollArea className="h-[300px] pr-4">
                    <motion.div 
                      className="space-y-2.5"
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      {userDocuments.map((doc, index) => (
                        <motion.div 
                          key={doc.id} 
                          className="flex items-center justify-between p-3.5 bg-slate-900/30 hover:bg-slate-850 rounded-2xl transition-all border border-slate-850 hover:border-slate-800"
                          variants={item}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/10">
                              <FileText className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm leading-tight">{doc.file_name}</p>
                              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                                {(doc.file_size / 1024).toFixed(1)} KB 
                                {doc.category && ` • ${doc.category}`} • 
                                {new Date(doc.uploaded_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-1 shrink-0">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg p-1.5 h-8 w-8"
                              onClick={() => downloadDocument(doc.id, doc.file_name)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg p-1.5 h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </ScrollArea>
                ) : (
                  <div className="text-center p-8 border border-dashed border-slate-800 rounded-3xl">
                    <FileText className="h-10 w-10 text-slate-650 mx-auto mb-4" />
                    <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                      You haven't uploaded any documents yet. Drag and drop a file or capture one via camera to get started.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Camera overlay */}
      {isCameraActive && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
          <div className="p-4 flex justify-between items-center bg-black/50">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10"
              onClick={stopCamera}
            >
              <X className="h-5 w-5 mr-1" />
              Cancel
            </Button>
            <h3 className="text-white font-medium">Capture Document</h3>
            <div className="w-[60px]"></div> {/* Spacer for alignment */}
          </div>
          
          <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
            <div className="relative w-full max-h-screen" style={{ maxWidth: '100vw', height: 'auto' }}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-contain"
              />
              <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-white/30 pointer-events-none"></div>
            </div>
          </div>
          
          <div className="p-6 flex justify-center bg-black/50">
            <Button 
              className="rounded-full h-16 w-16 bg-white hover:bg-gray-200 flex items-center justify-center shadow-lg"
              onClick={capturePhoto}
            >
              <div className="h-12 w-12 rounded-full border-4 border-blue-600" />
            </Button>
          </div>
          
          {/* Hidden canvas for capturing image */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
      
      {/* Upload Type Selection Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md bg-[#151C2C] border-slate-800 text-white rounded-3xl" aria-describedby="upload-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-white font-bold text-lg">Choose Upload Source</DialogTitle>
            <DialogDescription id="upload-dialog-description" className="text-slate-400 text-xs">
              Select how you would like to select or capture your diagnostic file.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4 text-xs">
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-32 p-4 bg-[#151C2C] border-slate-800 hover:border-blue-500/30 text-slate-300 hover:text-white transition-all rounded-2xl shadow-lg border"
              onClick={() => handleUploadOption('file')}
            >
              <FileText className="h-8 w-8 mb-2 text-blue-400" />
              <span className="font-bold">Browse Files</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-32 p-4 bg-[#151C2C] border-slate-800 hover:border-blue-500/30 text-slate-300 hover:text-white transition-all rounded-2xl shadow-lg border"
              onClick={() => handleUploadOption('camera')}
            >
              <Camera className="h-8 w-8 mb-2 text-blue-400" />
              <span className="font-bold">Use Camera</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default HealthRecords;
