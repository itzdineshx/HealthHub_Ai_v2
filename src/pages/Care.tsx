import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, User, Search, Video, Phone, 
  MapPin, Clock, Star, Heart, Check, Plus, MessageSquare, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
};

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  experience: string;
  image: string;
  availability: string;
  location: string;
  telehealth: boolean;
}

const mockDoctors: Doctor[] = [
  {
    id: "doc1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 124,
    experience: "12 years",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop",
    availability: "Today, 3:00 PM - 6:00 PM",
    location: "Care+ Hospital, Room 302",
    telehealth: true
  },
  {
    id: "doc2",
    name: "Dr. Robert Chen",
    specialty: "Pediatrician",
    rating: 4.8,
    reviews: 98,
    experience: "9 years",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop",
    availability: "Tomorrow, 9:00 AM - 12:00 PM",
    location: "General Health Clinic, Block B",
    telehealth: true
  },
  {
    id: "doc3",
    name: "Dr. Emily Williams",
    specialty: "Dermatologist",
    rating: 4.7,
    reviews: 84,
    experience: "15 years",
    image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=200&h=200&fit=crop",
    availability: "Monday, 2:00 PM - 5:00 PM",
    location: "Skins & Aesthetics, Suite 10",
    telehealth: false
  },
  {
    id: "doc4",
    name: "Dr. Marcus Vance",
    specialty: "Neurologist",
    rating: 4.9,
    reviews: 142,
    experience: "18 years",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
    availability: "Today, 5:30 PM",
    location: "Care+ Hospital, Room 410",
    telehealth: true
  }
];

export default function Care() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingType, setBookingType] = useState<"in-person" | "video">("video");
  const [appointments, setAppointments] = useState([
    {
      id: "app1",
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "2026-07-05",
      time: "10:30 AM",
      type: "Video",
      status: "Confirmed",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop"
    }
  ]);

  const filteredDoctors = mockDoctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsBookingOpen(true);
  };

  const submitBooking = () => {
    if (!bookingDate || !bookingTime) {
      toast({
        title: "Incomplete details",
        description: "Please select both a date and time for your appointment.",
        variant: "destructive"
      });
      return;
    }

    const newAppointment = {
      id: "app-" + Math.random().toString(36).substring(2),
      doctorName: selectedDoctor?.name || "",
      specialty: selectedDoctor?.specialty || "",
      date: bookingDate,
      time: bookingTime,
      type: bookingType === "video" ? "Video" : "In-Person",
      status: "Confirmed",
      image: selectedDoctor?.image || ""
    };

    setAppointments([...appointments, newAppointment]);
    setIsBookingOpen(false);
    setBookingDate("");
    setBookingTime("");
    
    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${selectedDoctor?.name} has been successfully scheduled.`
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
              Care Circle
            </h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Book real-time clinical visits, access instant remote diagnostics, and collaborate with your medical providers seamlessly.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="shrink-0">
            <Button className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] text-white shadow-lg shadow-blue-500/20 rounded-2xl px-6 h-12 text-sm font-bold tracking-wide border-none flex items-center gap-2">
              <Video className="h-4.5 w-4.5 text-emerald-300 animate-pulse" />
              <span>Instant Telemedicine</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Doctors list */}
        <div className="xl:col-span-2 space-y-6">
          <motion.div variants={itemVariants} className="relative flex items-center bg-[#151C2C] border border-slate-800 rounded-2xl px-4 py-1.5 focus-within:border-blue-500/50 transition-colors shadow-inner">
            <Search className="text-slate-500 h-5 w-5 mr-2 shrink-0" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search specialists by name, symptom or department..."
              className="bg-transparent border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder-slate-500 h-10 w-full"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-bold text-slate-200 pl-1">Available Specialists</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDoctors.map((doc) => (
                <motion.div 
                  key={doc.id}
                  whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="bg-[#151C2C] border-slate-800 hover:border-blue-500/30 transition-all flex flex-col justify-between overflow-hidden shadow-lg h-full hover:shadow-[0_0_30px_rgba(37,99,235,0.08)]">
                    <CardHeader className="p-5 flex flex-row items-start gap-4 space-y-0">
                      <Avatar className="h-16 w-16 rounded-2xl border border-slate-700/60 shadow-md">
                        <AvatarImage src={doc.image} className="object-cover" />
                        <AvatarFallback className="bg-slate-800 text-white">{doc.name[4]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-extrabold text-white text-base leading-snug">{doc.name}</h4>
                        <p className="text-xs text-blue-400 font-bold tracking-wide uppercase">{doc.specialty}</p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-0.5">
                          <span className="flex items-center text-amber-500 font-semibold">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 mr-0.5" /> 
                            {doc.rating}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span>{doc.reviews} reviews</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="px-5 pb-5 pt-0 space-y-2.5 text-xs text-slate-350">
                      <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-500 shrink-0" /> <span>Experience: {doc.experience}</span></div>
                      <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-500 shrink-0" /> <span className="truncate">{doc.location}</span></div>
                      <div className="flex items-center gap-2 bg-slate-900/30 p-2 rounded-xl border border-slate-850"><CalendarIcon className="h-4 w-4 text-blue-400 shrink-0" /> <span className="font-medium text-slate-300">Next availability: {doc.availability}</span></div>
                    </CardContent>

                    <CardFooter className="bg-slate-900/40 px-5 py-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                      <div>
                        {doc.telehealth ? (
                          <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold"><Video className="h-3 w-3" /> Telehealth</span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-slate-400 bg-slate-800 border border-slate-700/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Clinic Only</span>
                        )}
                      </div>
                      <Button onClick={() => handleBookAppointment(doc)} size="sm" className="bg-[#2563EB] hover:bg-blue-500 text-white rounded-xl font-bold h-9 px-4 text-xs transition-colors border-none shadow-md">
                        Book Visit
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
              {filteredDoctors.length === 0 && (
                <div className="col-span-2 text-center py-12 border-2 border-dashed border-slate-800 rounded-3xl">
                  <p className="text-sm text-slate-500">No medical specialists found matching your search.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right 1 Col: Appointments and Teleconsult */}
        <div className="space-y-6">
          
          {/* Scheduled Appointments */}
          <motion.div variants={itemVariants} className="bg-[#151C2C] border border-slate-800 rounded-3xl p-5 shadow-xl">
            <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center justify-between">
              <span>My Appointments</span>
              <span className="text-[10px] px-2.5 py-0.5 bg-blue-600/10 border border-blue-500/10 text-blue-400 rounded-full font-bold uppercase tracking-wider">{appointments.length} Active</span>
            </h3>

            <div className="space-y-3">
              <AnimatePresence>
                {appointments.map((app) => (
                  <motion.div 
                    key={app.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-slate-900/50 border border-slate-850 rounded-2xl p-4 flex items-start justify-between gap-3 hover:border-slate-800 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 rounded-xl border border-slate-800">
                        <AvatarImage src={app.image} className="object-cover" />
                        <AvatarFallback>D</AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-white leading-tight">{app.doctorName}</p>
                        <p className="text-[10px] text-blue-400 font-medium">{app.specialty}</p>
                        <div className="flex flex-col gap-1 text-[10px] text-slate-400 pt-2.5">
                          <span className="flex items-center"><CalendarIcon className="h-3 w-3 text-slate-500 mr-1.5" /> {app.date}</span>
                          <span className="flex items-center"><Clock className="h-3 w-3 text-slate-500 mr-1.5" /> {app.time} ({app.type})</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between h-full min-h-[75px]">
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-extrabold">{app.status}</span>
                      <button className="text-[10px] text-red-400 hover:text-red-300 font-bold transition-colors mt-4" onClick={() => {
                        setAppointments(appointments.filter(a => a.id !== app.id));
                        toast({ title: "Appointment Cancelled", description: "Your appointment has been removed." });
                      }}>Cancel</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {appointments.length === 0 && (
                <div className="text-center py-8 border border-dashed border-slate-800 rounded-2xl">
                  <p className="text-xs text-slate-500">No upcoming consultations scheduled.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Telemedicine Promo */}
          <motion.div 
            variants={itemVariants} 
            className="bg-gradient-to-br from-[#1E1B4B] via-[#111827] to-[#030712] border border-blue-900/30 rounded-3xl p-6 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-600/20 transition-all duration-500" />
            <div className="relative z-10 space-y-3.5">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Video className="h-4.5 w-4.5 text-blue-400" />
                Virtual Care Hub
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Connect instantly with an available medical officer for prescription approvals, lab results analysis, or urgent counsel.
              </p>
              <Button size="sm" className="w-full bg-[#2563EB] hover:bg-blue-500 text-white rounded-xl font-bold h-10 border-none transition-colors shadow-md">
                Launch Instant Consult
              </Button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="bg-[#151C2C] border-slate-800 text-white max-w-sm rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-bold">Book Consultation</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs mt-1">
              Select your preferences for consultation with {selectedDoctor?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-350 font-bold">Select Date</label>
              <Input 
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white h-10 rounded-xl focus-visible:ring-blue-600 shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-355 font-bold">Select Time</label>
              <Input 
                type="time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white h-10 rounded-xl focus-visible:ring-blue-600 shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-350 font-bold">Consultation Mode</label>
              <div className="grid grid-cols-2 gap-2.5">
                <Button 
                  type="button" 
                  variant={bookingType === "video" ? "default" : "outline"} 
                  onClick={() => setBookingType("video")}
                  className={`h-10 text-xs rounded-xl font-semibold ${bookingType === "video" ? "bg-blue-600 hover:bg-blue-500 text-white" : "border-slate-800 text-slate-300 hover:bg-slate-800 bg-transparent"}`}
                >
                  <Video className="h-4 w-4 mr-1.5 shrink-0" /> Video Call
                </Button>
                <Button 
                  type="button" 
                  variant={bookingType === "in-person" ? "default" : "outline"} 
                  onClick={() => setBookingType("in-person")}
                  className={`h-10 text-xs rounded-xl font-semibold ${bookingType === "in-person" ? "bg-blue-600 hover:bg-blue-500 text-white" : "border-slate-800 text-slate-300 hover:bg-slate-800 bg-transparent"}`}
                >
                  <MapPin className="h-4 w-4 mr-1.5 shrink-0" /> Clinic Visit
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="ghost" onClick={() => setIsBookingOpen(false)} className="text-slate-400 hover:text-white hover:bg-slate-800 h-10 rounded-xl text-xs">
              Cancel
            </Button>
            <Button onClick={submitBooking} className="bg-blue-600 hover:bg-blue-500 text-white h-10 rounded-xl text-xs font-bold px-5">
              Schedule Visit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
