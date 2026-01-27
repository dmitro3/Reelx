import api from './api';

export interface GameStats {
  totalGames: number;
  soloGames: number;
  pvpGames: number;
  upgradeGames: number;
  totalRake: number;
  totalRTP: number;
  totalTurnover: number;
  period: {
    from: string;
    to: string;
  };
}

export interface GameFilters {
  from?: string;
  to?: string;
  type?: 'solo' | 'pvp' | 'upgrade';
}

export const gamesService = {
  async getStats(filters?: GameFilters): Promise<GameStats> {
    const response = await api.get<GameStats>('/games/stats', { params: filters });
    return response.data;
  },

  async getGames(filters?: GameFilters) {
    const response = await api.get('/games', { params: filters });
    return response.data;
  },
};
