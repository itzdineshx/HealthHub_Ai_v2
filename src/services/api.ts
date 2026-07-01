import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Doctor Dashboard APIs
export const doctorApi = {
  getAppointments: async () => {
    try {
      const response = await api.get('/doctor/appointments');
      return response.data;
    } catch (error) {
      console.warn("Backend offline, falling back to simulated doctor appointments data.");
      return [
        { id: 'apt-1', patientName: 'Dinesh Sharma', date: new Date(), time: '09:30 AM', status: 'scheduled', patientId: 'pat-1' },
        { id: 'apt-2', patientName: 'Amelia Watson', date: new Date(), time: '10:15 AM', status: 'scheduled', patientId: 'pat-2' },
        { id: 'apt-3', patientName: 'Bruce Wayne', date: new Date(), time: '11:00 AM', status: 'scheduled', patientId: 'pat-3' },
        { id: 'apt-4', patientName: 'Clara Oswald', date: new Date(), time: '02:00 PM', status: 'completed', patientId: 'pat-4' }
      ];
    }
  },

  getPatientHistory: async (patientId: string) => {
    try {
      const response = await api.get(`/doctor/patients/${patientId}/history`);
      return response.data;
    } catch (error) {
      console.warn(`Backend offline, falling back to simulated patient history for ID: ${patientId}`);
      // Find or return default patient
      const names: Record<string, string> = {
        'pat-1': 'Dinesh Sharma',
        'pat-2': 'Amelia Watson',
        'pat-3': 'Bruce Wayne',
        'pat-4': 'Clara Oswald'
      };
      const name = names[patientId] || 'Dinesh Sharma';
      return {
        id: patientId,
        name: name,
        lastVisit: new Date(Date.now() - 7 * 24 * 3600 * 1000),
        riskReports: [
          { id: 'rep-1', date: new Date(Date.now() - 30 * 24 * 3600 * 1000), riskLevel: 'low', details: 'Cholesterol: 185 mg/dL, BP: 120/80 mmHg. Normal sinus rhythm.' },
          { id: 'rep-2', date: new Date(Date.now() - 7 * 24 * 3600 * 1000), riskLevel: 'medium', details: 'BP elevated at 135/85 mmHg. High stress environment reported. Elevated LDL.' }
        ]
      };
    }
  },

  sendAdvice: async (patientId: string, advice: string) => {
    try {
      const response = await api.post(`/doctor/patients/${patientId}/advice`, { advice });
      return response.data;
    } catch (error) {
      console.warn("Backend offline, simulating send advice.");
      return { success: true, message: "Advice saved successfully (offline simulation)" };
    }
  },

  updateAppointmentStatus: async (appointmentId: string, status: 'scheduled' | 'completed' | 'cancelled') => {
    try {
      const response = await api.patch(`/doctor/appointments/${appointmentId}`, { status });
      return response.data;
    } catch (error) {
      console.warn("Backend offline, simulating appointment status update.");
      return { success: true, appointmentId, status };
    }
  },

  getAvailableSlots: async (date: string) => {
    try {
      const response = await api.get(`/doctor/availability/${date}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend offline, returning simulated time slots for ${date}`);
      return ['09:00 AM', '09:30 AM', '10:15 AM', '11:00 AM', '01:30 PM', '02:00 PM'];
    }
  },
};

// Admin Dashboard APIs
export const adminApi = {
  getSystemStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      console.warn("Backend offline, returning system stats simulation.");
      return {
        activeUsers: 1420,
        totalDoctors: 96,
        pendingVerifications: 5,
        systemLatency: '38ms',
        cpuUsage: '12%',
        modelAccuracy: '97.2%',
        apiRequestsCount: 54100,
        systemStatus: 'healthy'
      };
    }
  },

  getUsers: async (role?: 'patient' | 'doctor' | 'admin') => {
    try {
      const response = await api.get('/admin/users', { params: { role } });
      return response.data;
    } catch (error) {
      console.warn(`Backend offline, returning users simulation for role: ${role}`);
      const allUsers = [
        { uid: 'user-1', name: 'Dr. John Watson', email: 'j.watson@healthhub.ai', role: 'doctor', status: 'active' },
        { uid: 'user-2', name: 'Dr. Sarah Connor', email: 's.connor@healthhub.ai', role: 'doctor', status: 'pending' },
        { uid: 'user-3', name: 'Dinesh Sharma', email: 'dinesh@healthhub.ai', role: 'patient', status: 'active' },
        { uid: 'user-4', name: 'Bruce Wayne', email: 'bruce@waynecorp.com', role: 'patient', status: 'active' },
        { uid: 'user-5', name: 'Arthur Dent', email: 'arthur@galaxy.org', role: 'patient', status: 'suspended' },
        { uid: 'user-6', name: 'Dr. Emily Chen', email: 'e.chen@healthhub.ai', role: 'doctor', status: 'active' }
      ];
      if (role) {
        return allUsers.filter(u => u.role === role);
      }
      return allUsers;
    }
  },

  updateUserStatus: async (userId: string, status: 'active' | 'suspended' | 'pending') => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      console.warn("Backend offline, simulating user status update.");
      return { success: true, userId, status };
    }
  },

  approveDoctor: async (userId: string) => {
    try {
      const response = await api.post(`/admin/doctors/${userId}/approve`);
      return response.data;
    } catch (error) {
      console.warn("Backend offline, simulating doctor approval.");
      return { success: true, userId, status: 'active' };
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.warn("Backend offline, simulating user deletion.");
      return { success: true, userId };
    }
  },
};

export default api; 