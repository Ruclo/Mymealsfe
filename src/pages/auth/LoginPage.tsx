import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginData } from '@/schemas/auth';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import { useAuth } from '@/api/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types/user';
export function LoginPage() {
    const navigate = useNavigate();
    const {login} = useAuth();
    const [isError, setError] = useState(false);

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
        <div className="flex items-center flex-col justify-center h-screen">
            <div className="w-100">

            
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
            <Button type="submit">Submit</Button>
            </form>
        </Form>  
        </div>
        {isError && <div className="text-red-500">
            Unauthorized
        </div>}

      </div>
    )
}