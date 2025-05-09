import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/api/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { ChangePasswordData, changePasswordSchema } from "@/schemas/auth";
import { useNavigate } from "react-router-dom";
export function ChangePasswordPage() {

    const [isError, setError] = useState(false);
    const { changePassword } = useAuth();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof changePasswordSchema>>({
        resolver: zodResolver(changePasswordSchema),
    })

    const onSubmit = async (data: ChangePasswordData) => {
        setError(false);
        try {
            await changePassword(data);
            navigate(-1)

        } catch (e) {
            if (e instanceof Error) {
                if (e.message == "Unauthorized") {
                    setError(true);
                    return;
                }
            }
            throw e;
        }
    }

    return (
        <div className='w-screen flex h-screen items-center justify-center'>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name="old_password"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Old Password</FormLabel>
                    <FormControl>
                    <Input type="password" placeholder="Old Password" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                    <Input type="password" placeholder="New Password" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit">Change Password</Button>
            </form>
        </Form>
        {isError && <p className="text-red-500">Invalid password</p>}
    </div>
    )
}