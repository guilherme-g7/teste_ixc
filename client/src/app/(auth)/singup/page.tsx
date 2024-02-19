"use client";
import {useEffect, useState} from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useForm } from "react-hook-form";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import {useRouter} from "next/navigation";
import {hash} from "bcryptjs";

axios.defaults.baseURL = 'http://localhost:5000'

const singUpSchema = z.object({
    name: z.string().min(1, { message: "Nome deve ter no mínimo 1 caractere" }),
    email: z.string().email({ message: "E-mail inválido" }),
    password: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    confirmPassword: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
});

export default function SignUp() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const { handleSubmit, formState: { errors }, control, watch } = useForm();

    const form = useForm<z.infer<typeof singUpSchema>>({
        resolver: zodResolver(singUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });


    async function onSubmit(data: z.infer<typeof singUpSchema>) {

        try {

            if (data.password !== data.confirmPassword) {
                alert('Senhas não correspondem!')
                return;
            }

            const response = await axios.post('/api/users/', {
                name: data.name,
                email: data.email,
                password: data.password
            });

            if (response.status >= 200 && response.status < 300) {
                console.log('Cadastro bem-sucedido:', response.data);
                alert('Usuário cadastrado com sucesso!');
                router.push("/login");
            } else {
                console.error('Erro ao fazer login:', response.statusText);
                alert('Erro ao enviar os dados. Por favor, tente novamente mais tarde.');
            }
        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
            alert('Erro ao enviar os dados. Por favor, tente novamente mais tarde.');
        }
    }

    const password = watch("password");
    const confirmPassword = watch("confirmPassword");

    return (
        <main className="flex flex-col items-center p-24 justify-between">
            <Card className="rounded-[50px] h-[780px] w-[630px] relative">
                <div className="mt-24 ml-24 mr-24 mb-3.5">
                    <CardHeader>
                        <CardTitle>Crie sua conta</CardTitle>
                        <CardDescription>Preencha os campos abaixo para criar uma nova conta</CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2' >
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name='name'
                                    rules={{ required: 'Nome é obrigatório' }}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Nome</FormLabel>
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
                                    name='email'
                                    rules={{ required: 'Email é obrigatório' }}
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
                                    rules={{ required: 'Senha é obrigatória' }}
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
                                <div className="mt-4"></div>
                                <FormField
                                    control={form.control}
                                    name='confirmPassword'
                                    rules={{
                                        required: 'Confirme sua senha',
                                        validate: value => value === watch("password") || 'As senhas não correspondem'
                                    }}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Confirmar Senha</FormLabel>
                                            <FormControl>
                                                <PasswordInput {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <Button className="rounded-full px-36 border-black ml-4" type="submit" variant="outline">
                                <b>Criar nova conta</b>
                            </Button>
                        </form>
                    </Form>
                </div>
            </Card>
        </main>
    );
}