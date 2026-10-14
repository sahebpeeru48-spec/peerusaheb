import React, { createContext, useContext, useState, useEffect } from 'react';
import { VitalSign, Medication, Allergy, Appointment, WellnessData, SymptomCheckRecord, ChatMessage, ConditionInfo } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface HealthContextType {
  vitals: VitalSign[];
  medications: Medication[];
  allergies: Allergy[];
  appointments: Appointment[];
  wellness: WellnessData | null;
  symptomChecks: SymptomCheckRecord[];
  chatHistory: ChatMessage[];
  conditionsLibrary: ConditionInfo[];
  isLoading: boolean;
  refreshAllData: () => Promise<void>;
  addVital: (vital: Partial<VitalSign>) => Promise<VitalSign>;
  deleteVital: (id: string) => Promise<void>;
  addMedication: (med: Partial<Medication>) => Promise<Medication>;
  updateMedication: (id: string, updates: Partial<Medication>) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  addAllergy: (allergy: Partial<Allergy>) => Promise<Allergy>;
  deleteAllergy: (id: string) => Promise<void>;
  createAppointment: (appt: Partial<Appointment>) => Promise<Appointment>;
  updateAppointmentStatus: (id: string, status: string) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  incrementWater: () => Promise<void>;
  decrementWater: () => Promise<void>;
  toggleHabit: (habitId: string) => Promise<void>;
  updateWellness: (updates: Partial<WellnessData>) => Promise<void>;
  sendChatMessage: (text: string) => Promise<ChatMessage>;
  clearChat: () => Promise<void>;
  addSymptomCheckRecord: (record: SymptomCheckRecord) => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [vitals, setVitals] = useState<VitalSign[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [wellness, setWellness] = useState<WellnessData | null>(null);
  const [symptomChecks, setSymptomChecks] = useState<SymptomCheckRecord[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [conditionsLibrary, setConditionsLibrary] = useState<ConditionInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshAllData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [vitalsRes, medsRes, allergiesRes, apptsRes, wellnessRes, symptomsRes, chatRes] = await Promise.all([
        api.getVitals().catch(() => ({ vitals: [] })),
        api.getMedications().catch(() => ({ medications: [] })),
        api.getAllergies().catch(() => ({ allergies: [] })),
        api.getAppointments().catch(() => ({ appointments: [] })),
        api.getWellness().catch(() => ({ wellness: null, library: [] })),
        api.getSymptomHistory().catch(() => ({ checks: [] })),
        api.getChatHistory().catch(() => ({ history: [] }))
      ]);

      setVitals(vitalsRes.vitals || []);
      setMedications(medsRes.medications || []);
      setAllergies(allergiesRes.allergies || []);
      setAppointments(apptsRes.appointments || []);
      if (wellnessRes.wellness) setWellness(wellnessRes.wellness);
      if (wellnessRes.library) setConditionsLibrary(wellnessRes.library);
      setSymptomChecks(symptomsRes.checks || []);
      setChatHistory(chatRes.history || []);
    } catch (err) {
      console.error('Error refreshing health data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshAllData();
    } else {
      setVitals([]);
      setMedications([]);
      setAllergies([]);
      setAppointments([]);
      setWellness(null);
      setSymptomChecks([]);
      setChatHistory([]);
    }
  }, [user]);

  const addVital = async (vital: Partial<VitalSign>) => {
    const res = await api.addVital(vital);
    setVitals(prev => [res.vital, ...prev]);
    return res.vital;
  };

  const deleteVital = async (id: string) => {
    await api.deleteVital(id);
    setVitals(prev => prev.filter(v => v.id !== id));
  };

  const addMedication = async (med: Partial<Medication>) => {
    const res = await api.addMedication(med);
    setMedications(prev => [...prev, res.medication]);
    return res.medication;
  };

  const updateMedication = async (id: string, updates: Partial<Medication>) => {
    const res = await api.updateMedication(id, updates);
    setMedications(prev => prev.map(m => m.id === id ? res.medication : m));
  };

  const deleteMedication = async (id: string) => {
    await api.deleteMedication(id);
    setMedications(prev => prev.filter(m => m.id !== id));
  };

  const addAllergy = async (allergy: Partial<Allergy>) => {
    const res = await api.addAllergy(allergy);
    setAllergies(prev => [...prev, res.allergy]);
    return res.allergy;
  };

  const deleteAllergy = async (id: string) => {
    await api.deleteAllergy(id);
    setAllergies(prev => prev.filter(a => a.id !== id));
  };

  const createAppointment = async (appt: Partial<Appointment>) => {
    const res = await api.createAppointment(appt);
    setAppointments(prev => [res.appointment, ...prev]);
    return res.appointment;
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    const res = await api.updateAppointmentStatus(id, status);
    setAppointments(prev => prev.map(a => a.id === id ? res.appointment : a));
  };

  const deleteAppointment = async (id: string) => {
    await api.deleteAppointment(id);
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const incrementWater = async () => {
    const res = await api.incrementWater();
    setWellness(res.wellness);
  };

  const decrementWater = async () => {
    const res = await api.decrementWater();
    setWellness(res.wellness);
  };

  const toggleHabit = async (habitId: string) => {
    const res = await api.toggleHabit(habitId);
    setWellness(res.wellness);
  };

  const updateWellness = async (updates: Partial<WellnessData>) => {
    const res = await api.updateWellness(updates);
    setWellness(res.wellness);
  };

  const sendChatMessage = async (text: string) => {
    // Optimistic user message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    setChatHistory(prev => [...prev, tempUserMsg]);

    const res = await api.sendChatMessage(text);
    setChatHistory(prev => [...prev.filter(m => m.id !== tempUserMsg.id), res.userMessage, res.assistantMessage]);
    return res.assistantMessage;
  };

  const clearChat = async () => {
    await api.clearChatHistory();
    setChatHistory([]);
  };

  const addSymptomCheckRecord = (record: SymptomCheckRecord) => {
    setSymptomChecks(prev => [record, ...prev]);
  };

  return (
    <HealthContext.Provider
      value={{
        vitals,
        medications,
        allergies,
        appointments,
        wellness,
        symptomChecks,
        chatHistory,
        conditionsLibrary,
        isLoading,
        refreshAllData,
        addVital,
        deleteVital,
        addMedication,
        updateMedication,
        deleteMedication,
        addAllergy,
        deleteAllergy,
        createAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        incrementWater,
        decrementWater,
        toggleHabit,
        updateWellness,
        sendChatMessage,
        clearChat,
        addSymptomCheckRecord
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
