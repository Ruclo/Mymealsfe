import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginData } from '@/schemas/auth';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import { useAuth } from '@/api/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types/user';
export function LoginPage() {
    const navigate = useNavigate();
    const {login} = useAuth();
    const [isError, setError] = useState(false);
    const [adminCredentials, setAdminCredentials] = useState<{username: string; password: string} | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loadCredentials = async () => {
            try {
                const res = await fetch('/api/admin/credentials', { credentials: 'include' });
                if (!res.ok) {
                    return;
                }
                const data = await res.json();
                if (isMounted && data?.username && data?.password) {
                    setAdminCredentials({ username: data.username, password: data.password });
                }
            } catch {
                // ignore
            }
        };
        loadCredentials();
        return () => {
            isMounted = false;
        };
    }, []);

    const onSubmit = async (data: LoginData) => {
        setError(false);
        try {
            const user = await login(data);
            navigate((await user).role == UserRole.Admin ? '/admin' : '/staff')
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
  
    const form = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
    })

    return (
        <div className="form-shell">
            <div className="text-center">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Staff</div>
                <h2 className="display-serif form-title">Log in</h2>
                <p className="form-subtitle mt-2">Use your staff credentials to continue.</p>
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
                    <Button type="submit">Sign in</Button>
                </div>
                </form>
            </Form>  
            {adminCredentials && (
                <div className="mt-6 rounded-2xl border border-border bg-white/70 p-4 text-xs text-muted-foreground">
                    <div className="font-semibold text-foreground">Admin credentials</div>
                    <div className="mt-1 font-mono">
                        {adminCredentials.username} / {adminCredentials.password}
                    </div>
                </div>
            )}
            {isError && <div className="mt-4 text-sm text-red-500">
                Unauthorized
            </div>}

          </div>
        </div>
    )
}
