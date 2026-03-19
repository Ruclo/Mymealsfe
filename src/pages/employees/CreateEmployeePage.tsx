import {type LoginData, loginSchema } from "@/schemas/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAddStaff } from "@/api/users"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
export function CreateEmployeePage() {
    const addStaffMutation = useAddStaff()
    const navigate = useNavigate()

    const form = useForm<LoginData>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginData) => {
        console.log('muttaing')
        await addStaffMutation.mutateAsync(data)
        console.log('after')
        navigate(-1)
    }

    return (
        <div className="form-shell">
            <div className="text-center">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</div>
                <h2 className="display-serif form-title">Add a staff member</h2>
                <p className="form-subtitle mt-2">Create staff credentials for the dashboard.</p>
            </div>
            <div className="form-card">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                        <Input placeholder="Username" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="Password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button type="submit">Create staff</Button>
                </div>
                </form>
            </Form>
            </div>
        </div>
    )
}
