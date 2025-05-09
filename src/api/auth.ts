import { LoginData, ChangePasswordData } from "@/schemas/auth";
import { useAuthStore } from "@/store/auth";
import type { User } from "@/types/user";

async function loginUser(data: LoginData): Promise<User> {
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })

    if (res.status == 401) {
        throw new Error("Unauthorized");
    }

    if (!res.ok) {
        throw new Error("Unexpected error happened")
    }
    return res.json()
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

        const res = await fetch('/api/user', {
            method: 'GET',
            headers: { "Content-Type": "application/json" },
        })

        if (!res.ok) {
            throw new Error("welp");
        }

        return await res.json();
    }

    const changePassword = async (data: ChangePasswordData) => {
        const res = await fetch('/api/account/password', {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })

        if (res.status == 401) {
            throw new Error("Unauthorized");
        }
        if (!res.ok) {
            throw new Error("Unexpected error happened")
        }
    }

  return {
    login,
    getUser,
    changePassword
  };
};
