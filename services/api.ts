import { User, VitalSign, Medication, Allergy, Appointment, WellnessData, SymptomTriageResult, SymptomCheckRecord, ChatMessage, Facility, ConditionInfo } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('healthai_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async register(data: Partial<User> & { password: string }): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async loginDemo(): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/demo`, { method: 'POST' });
    return handleResponse(res);
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // Chat
  async getChatHistory(): Promise<{ history: ChatMessage[] }> {
    const res = await fetch(`${API_BASE}/chat/history`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async sendChatMessage(text: string): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage }> {
    const res = await fetch(`${API_BASE}/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ text })
    });
    return handleResponse(res);
  },

  async clearChatHistory(): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/chat/history`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // Symptoms
  async analyzeSymptoms(data: {
    symptoms: string[];
    duration: string;
    severity: number;
    ageGroup?: string;
    preExistingConditions?: string;
    additionalDetails?: string;
  }): Promise<{ result: SymptomTriageResult; savedRecord?: SymptomCheckRecord }> {
    const res = await fetch(`${API_BASE}/symptoms/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async getSymptomHistory(): Promise<{ checks: SymptomCheckRecord[] }> {
    const res = await fetch(`${API_BASE}/symptoms/history`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // Facilities
  async searchFacilities(params: {
    query?: string;
    type?: string;
    emergencyOnly?: boolean;
    lat?: number;
    lng?: number;
  }): Promise<{ total: number; referenceCenter: { lat: number; lng: number }; facilities: Facility[]; verifiedNotice: string }> {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.set('query', params.query);
    if (params.type) searchParams.set('type', params.type);
    if (params.emergencyOnly) searchParams.set('emergencyOnly', 'true');
    if (params.lat) searchParams.set('lat', String(params.lat));
    if (params.lng) searchParams.set('lng', String(params.lng));

    const res = await fetch(`${API_BASE}/facilities/search?${searchParams.toString()}`);
    return handleResponse(res);
  },

  // Records
  async getHealthSummary(): Promise<any> {
    const res = await fetch(`${API_BASE}/records/summary`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async getVitals(): Promise<{ vitals: VitalSign[] }> {
    const res = await fetch(`${API_BASE}/records/vitals`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async addVital(vital: Partial<VitalSign>): Promise<{ vital: VitalSign }> {
    const res = await fetch(`${API_BASE}/records/vitals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(vital)
    });
    return handleResponse(res);
  },

  async deleteVital(id: string): Promise<void> {
    await fetch(`${API_BASE}/records/vitals/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
  },

  async getMedications(): Promise<{ medications: Medication[] }> {
    const res = await fetch(`${API_BASE}/records/medications`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async addMedication(med: Partial<Medication>): Promise<{ medication: Medication }> {
    const res = await fetch(`${API_BASE}/records/medications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(med)
    });
    return handleResponse(res);
  },

  async updateMedication(id: string, updates: Partial<Medication>): Promise<{ medication: Medication }> {
    const res = await fetch(`${API_BASE}/records/medications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates)
    });
    return handleResponse(res);
  },

  async deleteMedication(id: string): Promise<void> {
    await fetch(`${API_BASE}/records/medications/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
  },

  async getAllergies(): Promise<{ allergies: Allergy[] }> {
    const res = await fetch(`${API_BASE}/records/allergies`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async addAllergy(allergy: Partial<Allergy>): Promise<{ allergy: Allergy }> {
    const res = await fetch(`${API_BASE}/records/allergies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(allergy)
    });
    return handleResponse(res);
  },

  async deleteAllergy(id: string): Promise<void> {
    await fetch(`${API_BASE}/records/allergies/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
  },

  // Appointments
  async getAppointments(): Promise<{ appointments: Appointment[] }> {
    const res = await fetch(`${API_BASE}/appointments`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async createAppointment(data: Partial<Appointment>): Promise<{ appointment: Appointment }> {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateAppointmentStatus(id: string, status: string): Promise<{ appointment: Appointment }> {
    const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  async deleteAppointment(id: string): Promise<void> {
    await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
  },

  // Wellness
  async getWellness(): Promise<{ wellness: WellnessData; library: ConditionInfo[] }> {
    const res = await fetch(`${API_BASE}/wellness`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async incrementWater(): Promise<{ wellness: WellnessData }> {
    const res = await fetch(`${API_BASE}/wellness/water/increment`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async decrementWater(): Promise<{ wellness: WellnessData }> {
    const res = await fetch(`${API_BASE}/wellness/water/decrement`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async toggleHabit(habitId: string): Promise<{ wellness: WellnessData }> {
    const res = await fetch(`${API_BASE}/wellness/habit/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ habitId })
    });
    return handleResponse(res);
  },

  async updateWellness(updates: Partial<WellnessData>): Promise<{ wellness: WellnessData }> {
    const res = await fetch(`${API_BASE}/wellness/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates)
    });
    return handleResponse(res);
  },

  // User Profile & Privacy
  async updateProfile(updates: Partial<User>): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/user/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates)
    });
    return handleResponse(res);
  },

  async purgeAllData(): Promise<void> {
    await fetch(`${API_BASE}/user/purge`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
  },

  async resetDemo(): Promise<void> {
    await fetch(`${API_BASE}/user/reset-demo`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
  }
};
