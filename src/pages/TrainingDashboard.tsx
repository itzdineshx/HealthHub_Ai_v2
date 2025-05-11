import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dumbbell, 
  Heart, 
  Target, 
  Calendar, 
  Clock, 
  Users, 
  PlayCircle,
  Bookmark,
  Share2,
  Timer,
  ChevronRight,
  Star,
  Award,
  BarChart,
  Activity,
  Check,
  MoveHorizontal,
  ArrowRight,
  Download,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TrainingDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("fitness"); // 'fitness' or 'gym'

  // State for Workout Plan Generator inputs
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [availableEquipment, setAvailableEquipment] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [workoutFrequency, setWorkoutFrequency] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatorError, setGeneratorError] = useState<string | null>(null);

  // Gemini API Key - Should be loaded securely (e.g., from environment variables)
  // IMPORTANT: Do NOT hardcode your API key here in a production app!
  // For demonstration, we'll use a placeholder. You need to load this
  // securely in your actual application build process.
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Function to generate workout plan using Gemini API
  const generateWorkoutPlan = async () => {
    if (!fitnessGoal || !workoutDuration || !workoutFrequency) {
      setGeneratorError("Please fill in all required fields: Fitness Goal, Time per Workout, and Workouts per Week.");
      return;
    }

    if (!GEMINI_API_KEY) {
        setGeneratorError("Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your environment variables.");
        return;
    }

    setIsGenerating(true);
    setGeneratedPlan(null);
    setGeneratorError(null);

    const prompt = `Generate a personalized workout plan.\nGoal: ${fitnessGoal}\nEquipment Available: ${availableEquipment || 'Any/None'}\nTime per Workout: ${workoutDuration} minutes\nWorkouts per Week: ${workoutFrequency}\n\nProvide a plan with specific exercises, sets, reps, and rest times, formatted clearly.`;

    try {
        // Replace with your actual backend endpoint or Gemini API call setup
        // This is a placeholder assuming a backend endpoint /api/generate-workout
        const response = await axios.post('/api/generate-workout', {
            prompt: prompt
        }, {
            headers: {
                // In a real application, you would send the API key securely from your backend
                // Or handle authentication to your backend which then uses the key
                'Authorization': `Bearer ${GEMINI_API_KEY}` // Example (for demonstration, use backend in production)
            }
        });
        
        // Assuming the API response contains the generated text in response.data.plan
        if (response.data && response.data.plan) {
            setGeneratedPlan(response.data.plan);
        } else if (response.data && response.data.text) { // Handle potential different response structure
             setGeneratedPlan(response.data.text);
        } else {
            setGeneratorError("Received an unexpected response from the API.");
        }

    } catch (error) {
        console.error("Error generating workout plan:", error);
        if (axios.isAxiosError(error)) {
             if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                setGeneratorError(`API Error: ${error.response.status} - ${error.response.data?.detail || error.message}`);
            } else if (error.request) {
                // The request was made but no response was received
                setGeneratorError("API Error: No response received from server.");
            } else {
                // Something happened in setting up the request that triggered an Error
                setGeneratorError(`API Error: ${error.message}`);
            }
        } else {
            setGeneratorError("An unexpected error occurred while generating the plan.");
        }
    } finally {
        setIsGenerating(false);
    }
  };

  // State and functions from FitnessTrainer.tsx will go here
  const saveWorkout = (name: string) => {
    toast({
      title: "Workout Saved",
      description: `"${name}" has been saved to your library.`
    });
  };
  
  const bookClass = (name: string) => {
    toast({
      title: "Class Booked",
      description: `You've successfully booked the "${name}" class.`
    });
  };

  // State and functions from GymTraining.tsx will go here
   const markComplete = (exercise: string) => {
    toast({
      title: "Exercise Completed",
      description: `"${exercise}" marked as completed!`
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-forest dark:text-sage-light">Training Dashboard</h1>
          {/* Buttons for saving, scheduling, starting workout will go here, conditionally rendered based on tab */}
        </div>

        <Tabs defaultValue="fitness" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="fitness">Fitness Workouts</TabsTrigger>
            <TabsTrigger value="gym">Gym Training</TabsTrigger>
          </TabsList>
          
          {/* Fitness Workouts Tab Content */}
          <TabsContent value="fitness">
            {/* Content from FitnessTrainer.tsx */}
             {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Activity</p>
                  <h4 className="text-2xl font-bold">4/7 days</h4>
                </div>
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '57%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Calories Burned</p>
                  <h4 className="text-2xl font-bold">1,248</h4>
                </div>
                <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                  <BarChart className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-green-500 text-xs font-medium">↑ 12%</span>
                <span className="text-xs text-muted-foreground ml-1">from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Workout Minutes</p>
                  <h4 className="text-2xl font-bold">185</h4>
                </div>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <Timer className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-green-500 text-xs font-medium">↑ 8%</span>
                <span className="text-xs text-muted-foreground ml-1">from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Heart Health</p>
                  <h4 className="text-2xl font-bold">Good</h4>
                </div>
                <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xs text-muted-foreground">Average HR: 72 BPM</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workout Library */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-forest">Workout Library</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="recommended">
              <TabsList className="mb-6">
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="beginner">Beginner</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recommended" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Morning Cardio Blast",
                      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500",
                      level: "Beginner",
                      duration: "20 min",
                      category: "Cardio",
                      trainer: "Sarah Fit"
                    },
                    {
                      title: "Full Body Strength",
                      image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=500",
                      level: "Intermediate",
                      duration: "35 min",
                      category: "Strength",
                      trainer: "Mike Power"
                    },
                    {
                      title: "Gentle Yoga Flow",
                      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
                      level: "All Levels",
                      duration: "30 min",
                      category: "Yoga",
                      trainer: "Emma Peace"
                    },
                    {
                      title: "Evening Cool Down Stretch",
                      image: "https://images.unsplash.com/photo-1580027245061-ded245400416?w=500",
                      level: "Beginner",
                      duration: "15 min",
                      category: "Flexibility",
                      trainer: "Sarah Fit"
                    },
                    {
                      title: "Lunch Break HIIT",
                      image: "https://images.unsplash.com/photo-1552667460-9c8e2536be60?w=500",
                      level: "Intermediate",
                      duration: "20 min",
                      category: "HIIT",
                      trainer: "Alex Strong"
                    }
                  ].map((workout, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="relative">
                        <AspectRatio ratio={16/9}>
                          <img
                            src={workout.image}
                            alt={workout.title}
                            className="object-cover w-full h-full"
                          />
                        </AspectRatio>
                        <Button size="sm" className="absolute top-2 right-2" variant="outline" onClick={() => saveWorkout(workout.title)}>
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-1">{workout.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="mr-3">{workout.duration}</span>
                          <Target className="h-4 w-4 mr-1" />
                          <span>{workout.level}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback>{workout.trainer.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{workout.trainer}</span>
                          </div>
                          <Button size="sm">
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <Button variant="outline">
                    View All Workouts
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="trending">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "HIIT Challenge",
                      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=500",
                      level: "Advanced",
                      duration: "25 min",
                      category: "HIIT",
                      trainer: "Alex Strong"
                    },
                    {
                      title: "Dance Cardio Party",
                      image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=500",
                      level: "Beginner",
                      duration: "40 min",
                      category: "Dance",
                      trainer: "Jessica Move"
                    },
                    {
                      title: "Core Crusher",
                      image: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=500",
                      level: "Intermediate",
                      duration: "15 min",
                      category: "Core",
                      trainer: "Chris Abs"
                    },
                   {
                     title: "Yoga for Flexibility",
                     image: "https://images.unsplash.com/photo-1537368910025-7108c17052ae?w=500", // Using a similar image
                     level: "Beginner",
                     duration: "30 min",
                     category: "Yoga",
                     trainer: "Ben Calm"
                   },
                   {
                     title: "Outdoor Running Basics",
                     image: "https://images.unsplash.com/photo-1550345151-d2b148e9a51d?w=500",
                     level: "Beginner",
                     duration: "25 min",
                     category: "Cardio",
                     trainer: "Chloe Pace"
                   }
                  ].map((workout, index) => (
                     <Card key={index} className="overflow-hidden">
                      <div className="relative">
                         <AspectRatio ratio={16/9}>
                          <img
                            src={workout.image}
                            alt={workout.title}
                            className="object-cover w-full h-full"
                          />
                        </AspectRatio>
                        <Button size="sm" className="absolute top-2 right-2" variant="outline" onClick={() => saveWorkout(workout.title)}>
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-1">{workout.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="mr-3">{workout.duration}</span>
                          <Target className="h-4 w-4 mr-1" />
                          <span>{workout.level}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback>{workout.trainer.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{workout.trainer}</span>
                          </div>
                          <Button size="sm">
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                 <div className="flex justify-center">
                  <Button variant="outline">
                    View All Trending Workouts
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

               <TabsContent value="beginner">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Intro to Strength",
                      image: "https://images.unsplash.com/photo-1576618148400-a1c40611847f?w=500",
                      level: "Beginner",
                      duration: "30 min",
                      category: "Strength",
                      trainer: "Anna Start"
                    },
                    {
                      title: "Easy Riser Yoga",
                      image: "https://images.unsplash.com/photo-1537368910025-7108c17052ae?w=500",
                      level: "Beginner",
                      duration: "20 min",
                      category: "Yoga",
                      trainer: "Ben Calm"
                    },
                    {
                      title: "Basic Cardio",
                      image: "https://images.unsplash.com/photo-1565084892176-5f5a839f67a9?w=500",
                      level: "Beginner",
                      duration: "20 min",
                      category: "Cardio",
                      trainer: "Chloe Pace"
                    },
                   {
                     title: "Bodyweight Fundamentals",
                     image: "https://images.unsplash.com/photo-1603879950137-ed4df904ad33?w=500",
                     level: "Beginner",
                     duration: "25 min",
                     category: "Strength",
                     trainer: "Anna Start"
                   },
                   {
                     title: "Mindful Stretching",
                     image: "https://images.unsplash.com/photo-1547122785-ac4b0a871a60?w=500",
                     level: "Beginner",
                     duration: "15 min",
                     category: "Flexibility",
                     trainer: "Emma Peace"
                   }
                  ].map((workout, index) => (
                     <Card key={index} className="overflow-hidden">
                      <div className="relative">
                         <AspectRatio ratio={16/9}>
                          <img
                            src={workout.image}
                            alt={workout.title}
                            className="object-cover w-full h-full"
                          />
                        </AspectRatio>
                        <Button size="sm" className="absolute top-2 right-2" variant="outline" onClick={() => saveWorkout(workout.title)}>
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-1">{workout.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="mr-3">{workout.duration}</span>
                          <Target className="h-4 w-4 mr-1" />
                          <span>{workout.level}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback>{workout.trainer.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{workout.trainer}</span>
                          </div>
                          <Button size="sm">
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                 <div className="flex justify-center">
                  <Button variant="outline">
                    View All Beginner Workouts
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="advanced">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Advanced Strength",
                      image: "https://images.unsplash.com/photo-1534368959876-ea520f66675e?w=500",
                      level: "Advanced",
                      duration: "60 min",
                      category: "Strength",
                      trainer: "Derek Lift"
                    },
                    {
                      title: "Pro HIIT",
                      image: "https://images.unsplash.com/photo-1534368959876-ea520f66675e?w=500", // Using the same image for now
                      level: "Advanced",
                      duration: "30 min",
                      category: "HIIT",
                      trainer: "Alex Strong"
                    },
                    {
                      title: "Power Yoga",
                      image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=500",
                      level: "Advanced",
                      duration: "45 min",
                      category: "Yoga",
                      trainer: "Emma Peace"
                    },
                   {
                     title: "Olympic Lifting Prep",
                     image: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=500", // Using a similar image
                     level: "Advanced",
                     duration: "75 min",
                     category: "Weightlifting",
                     trainer: "Mike Power"
                   },
                   {
                     title: "Marathon Training Run",
                     image: "https://images.unsplash.com/photo-1509439716784-fd777631cb6c?w=500",
                     level: "Advanced",
                     duration: "90 min",
                     category: "Cardio",
                     trainer: "Chloe Pace"
                   }
                  ].map((workout, index) => (
                     <Card key={index} className="overflow-hidden">
                      <div className="relative">
                        <AspectRatio ratio={16/9}>
                          <img
                            src={workout.image}
                            alt={workout.title}
                            className="object-cover w-full h-full"
                          />
                        </AspectRatio>
                        <Button size="sm" className="absolute top-2 right-2" variant="outline" onClick={() => saveWorkout(workout.title)}>
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-1">{workout.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="mr-3">{workout.duration}</span>
                          <Target className="h-4 w-4 mr-1" />
                          <span>{workout.level}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback>{workout.trainer.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{workout.trainer}</span>
                          </div>
                          <Button size="sm">
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                 <div className="flex justify-center">
                  <Button variant="outline">
                    View All Advanced Workouts
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

          {/* Workout Plan Generator Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-forest">Workout Plan Generator (AI Powered)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">Generate a personalized workout plan based on your goals, available equipment, and time.</p>
                {/* Input fields for user preferences will go here */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal">Fitness Goal</Label>
                    <Input id="goal" placeholder="e.g., Build muscle, Lose weight, Improve stamina" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="equipment">Available Equipment</Label>
                    <Input id="equipment" placeholder="e.g., Dumbbells, Resistance bands, None" value={availableEquipment} onChange={(e) => setAvailableEquipment(e.target.value)} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="duration">Time per Workout (minutes)</Label>
                    <Input id="duration" type="number" placeholder="e.g., 30, 45, 60" value={workoutDuration} onChange={(e) => setWorkoutDuration(e.target.value)} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="frequency">Workouts per Week</Label>
                    <Input id="frequency" type="number" placeholder="e.g., 3, 4, 5" value={workoutFrequency} onChange={(e) => setWorkoutFrequency(e.target.value)} />
                  </div>
                </div>
                <Button className="w-full" onClick={generateWorkoutPlan} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Plan'
                  )}
                </Button>
                
                 {/* Display Generated Plan or Error */}
                 {generatedPlan && (
                   <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md whitespace-pre-wrap text-sm text-foreground">
                     <h4 className="text-lg font-semibold mb-2 text-forest dark:text-sage-light">Generated Workout Plan:</h4>
                     {generatedPlan}
                   </div>
                 )}
                
                 {generatorError && (
                   <Alert variant="destructive" className="mt-4">
                     <AlertCircle className="h-4 w-4" />
                     <AlertDescription>{generatorError}</AlertDescription>
                   </Alert>
                 )}
              </div>
            </CardContent>
          </Card>
          </TabsContent>

          {/* Gym Training Tab Content */}
          <TabsContent value="gym">
            {/* Content from GymTraining.tsx */}
             {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Workouts</p>
                  <h4 className="text-2xl font-bold">3/5</h4>
                </div>
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Weight Lifted</p>
                  <h4 className="text-2xl font-bold">12,450 lbs</h4>
                </div>
                <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-green-500 text-xs font-medium">↑ 8%</span>
                <span className="text-xs text-muted-foreground ml-1">from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Workout Time</p>
                  <h4 className="text-2xl font-bold">3.5 hours</h4>
                </div>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-green-500 text-xs font-medium">↑ 12%</span>
                <span className="text-xs text-muted-foreground ml-1">from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Training Streak</p>
                  <h4 className="text-2xl font-bold">14 days</h4>
                </div>
                <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-red-500" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xs text-muted-foreground">Keep it up!</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Training Plan */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-forest">Current Training Plan</CardTitle>
                <p className="text-sm text-muted-foreground">Strength Building - Intermediate</p>
              </div>
              <div className="flex items-center mt-2 md:mt-0">
                <div className="mr-4">
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="font-medium">Week 4 of 12</p>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-forest h-2 rounded-full" style={{ width: '33%' }}></div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="today">
              <TabsList className="mb-6">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="thisWeek">This Week</TabsTrigger>
                <TabsTrigger value="overview">Plan Overview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="today" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Day 24: Chest & Triceps</h3>
                  <Button size="sm">
                    Start Workout
                    <PlayCircle className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {[
                    {
                      name: "Barbell Bench Press",
                      sets: 4,
                      reps: "8-10",
                      rest: "90 sec",
                      weight: "135 lbs",
                      completed: false
                    },
                    {
                      name: "Incline Dumbbell Press",
                      sets: 3,
                      reps: "10-12",
                      rest: "60 sec",
                      weight: "45 lbs",
                      completed: false
                    },
                    {
                      name: "Cable Flyes",
                      sets: 3,
                      reps: "12-15",
                      rest: "60 sec",
                      weight: "25 lbs",
                      completed: false
                    },
                    {
                      name: "Tricep Pushdowns",
                      sets: 4,
                      reps: "10-12",
                      rest: "60 sec",
                      weight: "50 lbs",
                      completed: false
                    },
                    {
                      name: "Overhead Tricep Extension",
                      sets: 3,
                      reps: "12-15",
                      rest: "60 sec",
                      weight: "30 lbs",
                      completed: false
                    },
                    {
                      name: "Dips",
                      sets: 3,
                      reps: "As many reps as possible",
                      rest: "60 sec",
                      weight: "Bodyweight",
                      completed: false
                    }
                  ].map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-sage-light/10 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{exercise.name}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <span className="font-medium text-forest mr-1">{exercise.sets}</span> sets
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-forest mr-1">{exercise.reps}</span> reps
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{exercise.rest}</span>
                          </div>
                          <div className="flex items-center">
                            <Dumbbell className="h-3 w-3 mr-1" />
                            <span>{exercise.weight}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant={exercise.completed ? "default" : "outline"} 
                        size="sm"
                        className="ml-4"
                        onClick={() => markComplete(exercise.name)}
                      >
                        {exercise.completed ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Completed
                          </>
                        ) : "Mark Complete"}
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="thisWeek">
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-md font-semibold">Monday - Chest & Triceps</CardTitle>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center"><Dumbbell className="h-4 w-4 mr-1" /> 6 exercises</div>
                        <div className="flex items-center"><Clock className="h-4 w-4 mr-1" /> ~50 min</div>
                        <div className="flex items-center"><Target className="h-4 w-4 mr-1" /> Strength</div>
                      </div>
                    </CardContent>
                  </Card>

                   <Card>
                    <CardHeader className="py-3">
                       <div className="flex justify-between items-center">
                        <CardTitle className="text-md font-semibold">Wednesday - Back & Biceps</CardTitle>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                     <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center"><Dumbbell className="h-4 w-4 mr-1" /> 7 exercises</div>
                        <div className="flex items-center"><Clock className="h-4 w-4 mr-1" /> ~55 min</div>
                        <div className="flex items-center"><Target className="h-4 w-4 mr-1" /> Strength</div>
                      </div>
                    </CardContent>
                  </Card>

                   <Card>
                    <CardHeader className="py-3">
                       <div className="flex justify-between items-center">
                        <CardTitle className="text-md font-semibold">Friday - Legs & Shoulders</CardTitle>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                     <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center"><Dumbbell className="h-4 w-4 mr-1" /> 8 exercises</div>
                        <div className="flex items-center"><Clock className="h-4 w-4 mr-1" /> ~65 min</div>
                        <div className="flex items-center"><Target className="h-4 w-4 mr-1" /> Strength/Hypertrophy</div>
                      </div>
                    </CardContent>
                  </Card>

                   <Card>
                    <CardHeader className="py-3">
                       <div className="flex justify-between items-center">
                        <CardTitle className="text-md font-semibold">Saturday - Optional Cardio/Active Recovery</CardTitle>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                     <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center"><Activity className="h-4 w-4 mr-1" /> Light jog or stretching</div>
                        <div className="flex items-center"><Clock className="h-4 w-4 mr-1" /> ~30-45 min</div>
                        <div className="flex items-center"><Target className="h-4 w-4 mr-1" /> Recovery</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="overview">
                <div className="space-y-4">
                  <p className="text-muted-foreground">This 12-week intermediate strength building plan focuses on hitting each major muscle group twice per week with a mix of compound and isolation exercises. The plan includes progressive overload principles and deload weeks.</p>
                  <h4 className="text-md font-semibold">Plan Goals:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Increase overall strength by 10-15%</li>
                    <li>Build muscle mass in target areas</li>
                    <li>Improve lifting form and technique</li>
                    <li>Enhance cardiovascular health</li>
                  </ul>
                  <h4 className="text-md font-semibold mt-4">Workout Schedule:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Monday: Push (Chest, Triceps, Shoulders)</li>
                    <li>Tuesday: Pull (Back, Biceps)</li>
                    <li>Wednesday: Legs & Abs</li>
                    <li>Thursday: Rest or Active Recovery</li>
                    <li>Friday: Full Body or Upper/Lower Split</li>
                    <li>Saturday: Optional Cardio or Rest</li>
                    <li>Sunday: Rest</li>
                  </ul>
                   <div className="flex justify-center mt-6">
                    <Button variant="outline">
                      Download Full Plan PDF
                      <Download className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TrainingDashboard; 