import * as api from '@/shared/lib/api/api';

class UserService {
    async login(initData: string): Promise<{accessToken: string}> {
        const response = await api.$host.post('/auth/login', { initData });
        return response.data;
    }
}

export const userService = new UserService();