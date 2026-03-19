import { User } from "@/types/user"
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { LoginData } from "@/schemas/auth"
import { apiRequest } from "@/api/client"

async function fetchStaff(): Promise<User[]> {
    return await apiRequest<User[]>('/api/users/staff')
}

async function deleteStaff(username: string): Promise<string> {
    await apiRequest<void>(`/api/users/${username}`, { method: "DELETE" })
    return username
}

async function addStaff(data: LoginData): Promise<User> {
    return await apiRequest<User>('/api/users', { method: "POST", json: data })
}

export const useDeleteStaff = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteStaff,
        onSuccess: (deletedUsername) => {
            queryClient.setQueryData(['staff'], (old: User[] | undefined) => {
                if (!old) return [];
                return old.filter(e => e.username != deletedUsername)
            })
        }
    })
}

export function useAddStaff() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: addStaff,
      onSuccess: (newEmp) => {
        queryClient.setQueryData(['staff'], (old: User[] = []) => [...old, newEmp]);
      },
    });
}


const staffQueryOptions = queryOptions({
    queryKey: ['staff'],
    queryFn: () => fetchStaff()
})

export const useStaffQuery = () => useQuery(staffQueryOptions)
