export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  age: number;
  gender: string;
  bloodType: string;
  height: string;
  weight: string;
  emergencyContact: EmergencyContact;
  consentGiven: boolean;
  createdAt: string;
}

export interface VitalSign {
  id: string;
  type: 'blood_pressure' | 'heart_rate' | 'blood_glucose' | 'weight' | 'oxygen_saturation' | 'temperature';
  value: string;
  unit: string;
  status: 'Normal' | 'Optimal' | 'Elevated' | 'High' | 'Low' | 'Stable' | 'Recorded';
  timestamp: string;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  prescriber?: string;
  active: boolean;
  refillDate?: string;
}

export interface Allergy {
  id: string;
  allergen: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Life-Threatening';
  reaction: string;
  diagnosedYear?: string;
}

export interface Appointment {
  id: string;
  providerName: string;
  specialty: string;
  facility: string;
  dateTime: string;
  type: 'In-Person' | 'Telehealth';
  reason: string;
  status: 'Requested' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt?: string;
}

export interface Habit {
  id: string;
  name: string;
  completed: boolean;
}

export interface WellnessData {
  waterIntakeGlasses: number;
  waterTargetGlasses: number;
  sleepHours: number;
  sleepQuality: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  steps: number;
  stepsTarget: number;
  mood: string;
  habits: Habit[];
  lastUpdated: string;
}

export interface ConditionInfo {
  id: string;
  title: string;
  category: string;
  overview: string;
  symptoms: string[];
  lifestyleRecommendations: string[];
  whenToSeeDoctor: string;
}

export interface PossibleCondition {
  condition: string;
  likelihood: string;
  description: string;
}

export interface SymptomTriageResult {
  triageLevel: string;
  urgencyColor: 'green' | 'blue' | 'orange' | 'red';
  isEmergency: boolean;
  emergencyDetails?: {
    flag: string;
    action: string;
    emergencyNumber: string;
  };
  summary?: string;
  recommendedTimeframe?: string;
  severityScore?: number;
  possibleExplanations: PossibleCondition[];
  followUpQuestions?: string[];
  redFlagsToWatch?: string[];
  nextSteps: string[];
  disclaimer: string;
}

export interface SymptomCheckRecord {
  id: string;
  timestamp: string;
  symptoms: string[];
  duration: string;
  severity: number;
  triageLevel: string;
  isEmergency?: boolean;
  summary: string;
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isAi?: boolean;
  isEmergency?: boolean;
  suggestedFollowUps?: string[];
}

export interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'laboratory';
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  emergencyPhone?: string | null;
  lat: number;
  lng: number;
  hasEmergencyRoom: boolean;
  operatingHours: string;
  hoursVerified: boolean;
  services: string[];
  rating: number;
  website?: string;
  distanceMiles?: number;
  distanceKm?: number;
  distanceLabel?: string;
}
