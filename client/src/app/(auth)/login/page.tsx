'use client';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";

import {PasswordInput} from "@/components/ui/password-input";
import axios from "axios";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {useEffect} from "react";
import io from "socket.io-client";


axios.defaults.baseURL = 'http://localhost:4000'

const loginSchema = z.object({
    email: z.string().email({message: "E-mail inválido"}),
    password: z.string().min(8, {message: "A senha deve ter pelo menos 8 caracteres"}),
    rememberMe: z.boolean(),
});

export default function Login() {
    const router = useRouter();
    const socket = io('http://localhost:4000');



    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false
        },
    });


    async function onSubmit(data: z.infer<typeof loginSchema>) {
        try {

            const response = await axios.post('/api/auth/login', {
                email: data.email,
                password: data.password
            });
            if (response.status === 200) {
                console.log(response.data)
                if (data.rememberMe) {
                    localStorage.setItem('accessToken', response.data.token);
                }
                localStorage.setItem("chatConnected", "true");
                localStorage.setItem('email', data.email);
                socket.emit('login', data.email);
                router.push('/chat', );
            } else {
                alert('Erro ao fazer login. Tente novamente mais tarde.');
            }
        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
            alert('Erro ao enviar os dados. Por favor, tente novamente mais tarde.');
        }
    }

    return (
        <main className="flex flex-col items-center p-24 justify-between">
            <Card className="rounded-[50px] h-[612px] w-[600px] relative">
                <div className="mt-24 ml-24 mr-24 mb-3.5">
                    <CardHeader>
                        <CardTitle>Acesse sua conta</CardTitle>
                        <CardDescription>Insira suas credencias para fazer login</CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>E-mail</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <div className="mt-4"></div>
                                <FormField
                                    control={form.control}
                                    name='password'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Senha</FormLabel>
                                            <FormControl>
                                                <PasswordInput {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <Button className="rounded-full px-36 border-black ml-4" type="submit" variant="outline">
                                <b>Acessar</b>
                                <ArrowRight className="ml-2 h-5 w-5"/>
                            </Button>
                        </form>
                    </Form>
                </div>

                <Link href="/singup">
                    <Button className="absolute w-full bg-purple-50 rounded-b-[50px] h-[90px] text-black mt-20 border-0" variant="outline">
                        <b>Criar uma nova conta</b>
                    </Button>
                </Link>

            </Card>
        </main>
    );
}
