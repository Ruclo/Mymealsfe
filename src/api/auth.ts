import { LoginData, ChangePasswordData } from "@/schemas/auth";
import { useAuthStore } from "@/store/auth";
import type { User } from "@/types/user";
import { apiRequest, ApiError } from "@/api/client";

async function loginUser(data: LoginData): Promise<User> {
    try {
        return await apiRequest<User>('/api/login', { method: 'POST', json: data })
    } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
            throw new Error("Unauthorized");
        }
        throw e;
    }
}


export const useAuth = () => {
    const { user, setUser } = useAuthStore();
    
    const login = async (data: LoginData) => {
        const user = await loginUser(data);
        console.log(user)
        setUser(user);
        return user;
    }

    const getUser = async () => {
        if (user != null) {
            return user;
        }

        return await apiRequest<User>('/api/me', { method: 'GET' })
    }

    const changePassword = async (data: ChangePasswordData) => {
        try {
            await apiRequest<void>('/api/account/password', { method: 'PUT', json: data })
        } catch (e) {
            if (e instanceof ApiError && e.status === 401) {
                throw new Error("Unauthorized");
            }
            throw e;
        }
    }

    const logout = async () => {
        await apiRequest<void>('/api/logout', { method: 'POST' })
        setUser(null)
    }

  return {
    login,
    getUser,
    changePassword,
    logout
  };
};
