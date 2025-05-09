import { User } from "@/types/user"
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { type QueryClient } from "@tanstack/react-query"
import type { LoginData } from "@/schemas/auth"

async function fetchStaff(): Promise<User[]> {
    const res = await fetch('/api/users/staff', {
        credentials: 'include'
    })

    if (!res.ok) {
        throw new Error('Failed to fetch meals')
    }
    return await res.json()
}

async function deleteStaff(username: string): Promise<string> {
    const res = await fetch(`/api/users/${username}`,
        {
            credentials: "include",
            method: "DELETE"
        }
    )

    if (!res.ok) {
        throw new Error(JSON.stringify(await res.json()))
    }
    return username
}

async function addStaff(data: LoginData): Promise<User> {
    const res = await fetch(`/api/users/`,
        {
            credentials: "include",
            method: "POST",
            body: JSON.stringify(data)
        }
    )

    if (!res.ok) {
        throw new Error(JSON.stringify(await res.json()))
    }
    return await res.json()
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

export const staffLoader = (queryClient: QueryClient) => 
    async () => await queryClient.ensureQueryData(staffQueryOptions)

export const useStaffQuery = () => useQuery(staffQueryOptions)