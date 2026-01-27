import api from './api';

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface LoginResponse {
  sessionId: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/login', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.delete('/logout');
    localStorage.removeItem('adminSessionId');
  },

  async validateSession(): Promise<boolean> {
    try {
      const response = await api.get<{ valid: boolean }>('/validate');
      return response.data.valid;
    } catch {
      return false;
    }
  },
};
