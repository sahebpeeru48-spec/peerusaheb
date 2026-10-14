import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data for demo hackathon patient
const getInitialSeed = () => ({
  users: [
    {
      id: 'demo-user-123',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@healthai.demo',
      password: 'password123',
      role: 'patient',
      age: 34,
      gender: 'Female',
      bloodType: 'A+',
      height: '168 cm',
      weight: '64 kg',
      emergencyContact: {
        name: 'David Jenkins',
        relation: 'Spouse',
        phone: '+1 (555) 234-5678'
      },
      consentGiven: true,
      createdAt: new Date().toISOString()
    }
  ],
  vitals: {
    'demo-user-123': [
      { id: 'v1', type: 'blood_pressure', value: '120/78', unit: 'mmHg', status: 'Normal', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), notes: 'Resting morning reading' },
      { id: 'v2', type: 'heart_rate', value: '72', unit: 'bpm', status: 'Optimal', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), notes: 'Resting pulse' },
      { id: 'v3', type: 'blood_glucose', value: '94', unit: 'mg/dL', status: 'Normal', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), notes: 'Fasting glucose' },
      { id: 'v4', type: 'blood_pressure', value: '118/76', unit: 'mmHg', status: 'Normal', timestamp: new Date().toISOString(), notes: 'Post light jog' },
      { id: 'v5', type: 'weight', value: '64.0', unit: 'kg', status: 'Stable', timestamp: new Date().toISOString(), notes: 'BMI 22.7 (Healthy)' }
    ]
  },
  medications: {
    'demo-user-123': [
      { id: 'm1', name: 'Albuterol Inhaler (Ventolin)', dosage: '90 mcg, 2 puffs', frequency: 'As needed for wheezing/exercise', purpose: 'Mild Asthma', prescriber: 'Dr. Robert Chen, Pulmonology', active: true, refillDate: '2026-11-15' },
      { id: 'm2', name: 'Vitamin D3 & K2', dosage: '2000 IU', frequency: 'Once daily with breakfast', purpose: 'Bone & Immune support', prescriber: 'Self / Recommended by PCP', active: true, refillDate: '2026-12-01' }
    ]
  },
  allergies: {
    'demo-user-123': [
      { id: 'a1', allergen: 'Penicillin', severity: 'Severe', reaction: 'Hives, mild facial swelling', diagnosedYear: '2018' },
      { id: 'a2', allergen: 'Tree Nuts (Walnuts, Pecans)', severity: 'Moderate', reaction: 'Oral tingling, digestive upset', diagnosedYear: '2020' }
    ]
  },
  appointments: {
    'demo-user-123': [
      {
        id: 'apt-1',
        providerName: 'Dr. Robert Chen',
        specialty: 'Pulmonology & Respiratory Care',
        facility: 'Metropolitan Medical Center',
        dateTime: new Date(Date.now() + 86400000 * 4).toISOString(),
        type: 'In-Person',
        reason: 'Annual asthma review and spirometry checkup',
        status: 'Confirmed'
      },
      {
        id: 'apt-2',
        providerName: 'Dr. Elena Vance',
        specialty: 'General Practice / Preventive Care',
        facility: 'St. Jude Community Clinic',
        dateTime: new Date(Date.now() + 86400000 * 14).toISOString(),
        type: 'Telehealth',
        reason: 'Routine annual bloodwork review and wellness consultation',
        status: 'Requested'
      }
    ]
  },
  wellness: {
    'demo-user-123': {
      waterIntakeGlasses: 6,
      waterTargetGlasses: 8,
      sleepHours: 7.5,
      sleepQuality: 'Good',
      steps: 8420,
      stepsTarget: 10000,
      mood: 'Energized',
      habits: [
        { id: 'h1', name: 'Morning 15-min Stretch', completed: true },
        { id: 'h2', name: 'Take Daily Vitamin D', completed: true },
        { id: 'h3', name: 'Drink 2L Water', completed: false },
        { id: 'h4', name: 'No Screens 30m Before Bed', completed: false }
      ],
      lastUpdated: new Date().toISOString()
    }
  },
  symptomChecks: {
    'demo-user-123': [
      {
        id: 'sc-1',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        symptoms: ['Mild dry cough', 'Slight throat irritation'],
        duration: '2 days',
        severity: 3,
        triageLevel: 'Self-Care & Observation',
        summary: 'Likely mild seasonal viral irritation or allergic pharyngitis. No red flag symptoms detected.',
        recommendations: [
          'Stay well hydrated with warm fluids and herbal tea with honey',
          'Use saline nasal spray or humidifier at bedtime',
          'Monitor temperature if symptoms worsen or fever develops'
        ]
      }
    ]
  },
  chatHistory: {
    'demo-user-123': [
      {
        id: 'ch-1',
        role: 'user',
        text: 'What are the main warning signs of dehydration during hot weather?',
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      {
        id: 'ch-2',
        role: 'assistant',
        text: 'Common signs of mild to moderate dehydration include dry mouth, dark yellow or amber urine, fatigue, mild dizziness when standing, and headache.\n\nKey preventive measures:\n- Drink water steadily before feeling thirsty.\n- Consume electrolyte-rich fluids (coconut water or oral rehydration solutions) if sweating heavily.\n\n⚠️ Seek immediate medical care if you experience confusion, extreme lethargy, inability to keep fluids down, or cessation of sweating in hot conditions.',
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        isAi: true
      }
    ]
  }
});

// Load or initialize store
class Database {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(content);
      }
    } catch (err) {
      console.warn('Could not read existing store file, initializing fresh store:', err.message);
    }
    const seed = getInitialSeed();
    this.save(seed);
    return seed;
  }

  save(data = this.data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write to store:', err.message);
    }
  }

  // Users
  getUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  createUser(userData) {
    const newUser = {
      id: userData.id || `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: 'patient',
      age: userData.age || 30,
      gender: userData.gender || 'Not specified',
      bloodType: userData.bloodType || 'O+',
      height: userData.height || '170 cm',
      weight: userData.weight || '68 kg',
      emergencyContact: userData.emergencyContact || { name: 'Emergency Contact', relation: 'Family', phone: '911' },
      consentGiven: true,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    
    // Initialize user collections
    this.data.vitals[newUser.id] = [];
    this.data.medications[newUser.id] = [];
    this.data.allergies[newUser.id] = [];
    this.data.appointments[newUser.id] = [];
    this.data.symptomChecks[newUser.id] = [];
    this.data.chatHistory[newUser.id] = [];
    this.data.wellness[newUser.id] = {
      waterIntakeGlasses: 0,
      waterTargetGlasses: 8,
      sleepHours: 7,
      sleepQuality: 'Good',
      steps: 0,
      stepsTarget: 10000,
      mood: 'Calm',
      habits: [
        { id: 'h1', name: 'Drink Morning Water', completed: false },
        { id: 'h2', name: 'Daily 20m Walk', completed: false }
      ],
      lastUpdated: new Date().toISOString()
    };
    
    this.save();
    return newUser;
  }

  updateUser(id, updates) {
    const user = this.getUserById(id);
    if (!user) return null;
    Object.assign(user, updates);
    this.save();
    return user;
  }

  // Vitals
  getVitals(userId) {
    return this.data.vitals[userId] || [];
  }

  addVital(userId, vital) {
    if (!this.data.vitals[userId]) this.data.vitals[userId] = [];
    const newVital = {
      id: `v-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...vital
    };
    this.data.vitals[userId].unshift(newVital);
    this.save();
    return newVital;
  }

  deleteVital(userId, vitalId) {
    if (!this.data.vitals[userId]) return false;
    this.data.vitals[userId] = this.data.vitals[userId].filter(v => v.id !== vitalId);
    this.save();
    return true;
  }

  // Medications
  getMedications(userId) {
    return this.data.medications[userId] || [];
  }

  addMedication(userId, med) {
    if (!this.data.medications[userId]) this.data.medications[userId] = [];
    const newMed = {
      id: `m-${Date.now()}`,
      active: true,
      ...med
    };
    this.data.medications[userId].push(newMed);
    this.save();
    return newMed;
  }

  updateMedication(userId, medId, updates) {
    if (!this.data.medications[userId]) return null;
    const med = this.data.medications[userId].find(m => m.id === medId);
    if (!med) return null;
    Object.assign(med, updates);
    this.save();
    return med;
  }

  deleteMedication(userId, medId) {
    if (!this.data.medications[userId]) return false;
    this.data.medications[userId] = this.data.medications[userId].filter(m => m.id !== medId);
    this.save();
    return true;
  }

  // Allergies
  getAllergies(userId) {
    return this.data.allergies[userId] || [];
  }

  addAllergy(userId, allergy) {
    if (!this.data.allergies[userId]) this.data.allergies[userId] = [];
    const newAllergy = {
      id: `a-${Date.now()}`,
      ...allergy
    };
    this.data.allergies[userId].push(newAllergy);
    this.save();
    return newAllergy;
  }

  deleteAllergy(userId, allergyId) {
    if (!this.data.allergies[userId]) return false;
    this.data.allergies[userId] = this.data.allergies[userId].filter(a => a.id !== allergyId);
    this.save();
    return true;
  }

  // Appointments
  getAppointments(userId) {
    return this.data.appointments[userId] || [];
  }

  createAppointment(userId, appt) {
    if (!this.data.appointments[userId]) this.data.appointments[userId] = [];
    const newAppt = {
      id: `apt-${Date.now()}`,
      status: 'Requested',
      createdAt: new Date().toISOString(),
      ...appt
    };
    this.data.appointments[userId].unshift(newAppt);
    this.save();
    return newAppt;
  }

  updateAppointmentStatus(userId, apptId, status) {
    if (!this.data.appointments[userId]) return null;
    const appt = this.data.appointments[userId].find(a => a.id === apptId);
    if (!appt) return null;
    appt.status = status;
    this.save();
    return appt;
  }

  deleteAppointment(userId, apptId) {
    if (!this.data.appointments[userId]) return false;
    this.data.appointments[userId] = this.data.appointments[userId].filter(a => a.id !== apptId);
    this.save();
    return true;
  }

  // Wellness
  getWellness(userId) {
    if (!this.data.wellness[userId]) {
      this.data.wellness[userId] = {
        waterIntakeGlasses: 0,
        waterTargetGlasses: 8,
        sleepHours: 7,
        sleepQuality: 'Good',
        steps: 0,
        stepsTarget: 10000,
        mood: 'Neutral',
        habits: [
          { id: 'h1', name: 'Drink 2L Water', completed: false },
          { id: 'h2', name: '20 min Physical Movement', completed: false }
        ],
        lastUpdated: new Date().toISOString()
      };
      this.save();
    }
    return this.data.wellness[userId];
  }

  updateWellness(userId, updates) {
    const current = this.getWellness(userId);
    this.data.wellness[userId] = {
      ...current,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    this.save();
    return this.data.wellness[userId];
  }

  // Symptom Checks
  getSymptomChecks(userId) {
    return this.data.symptomChecks[userId] || [];
  }

  addSymptomCheck(userId, check) {
    if (!this.data.symptomChecks[userId]) this.data.symptomChecks[userId] = [];
    const newCheck = {
      id: `sc-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...check
    };
    this.data.symptomChecks[userId].unshift(newCheck);
    this.save();
    return newCheck;
  }

  // Chat History
  getChatHistory(userId) {
    return this.data.chatHistory[userId] || [];
  }

  addChatMessage(userId, msg) {
    if (!this.data.chatHistory[userId]) this.data.chatHistory[userId] = [];
    const newMsg = {
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...msg
    };
    this.data.chatHistory[userId].push(newMsg);
    this.save();
    return newMsg;
  }

  clearChatHistory(userId) {
    this.data.chatHistory[userId] = [];
    this.save();
    return true;
  }

  // Privacy & Data Purge (GDPR requirement)
  deleteUserData(userId) {
    delete this.data.vitals[userId];
    delete this.data.medications[userId];
    delete this.data.allergies[userId];
    delete this.data.appointments[userId];
    delete this.data.symptomChecks[userId];
    delete this.data.chatHistory[userId];
    delete this.data.wellness[userId];
    this.data.users = this.data.users.filter(u => u.id !== userId);
    this.save();
    return true;
  }

  // Reset Demo User to fresh seed
  resetDemo() {
    this.data = getInitialSeed();
    this.save();
    return true;
  }
}

export const db = new Database();
