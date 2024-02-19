"use client";
import io from "socket.io-client";

import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {LogOut, User} from "lucide-react";
import React, {useEffect, useState} from "react";
import axios from "axios";


axios.defaults.baseURL = 'http://localhost:5000'
export default function ChatPage() {
    let userEmail = ''; // Inicializa a variável com um valor padrão vazio

    // Verifica se localStorage está definido antes de acessá-lo
    if (typeof localStorage !== 'undefined') {
        userEmail = localStorage.getItem('email') || '';
    }
    const socket = io('http://localhost:5000', {
        auth: {
            email: userEmail
        }
    });

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userEmail = localStorage.getItem('email');
                if (!userEmail) {
                    console.error('Email não encontrado no localStorage');
                    return;
                }

                const response = await axios.get(`/api/users/${userEmail}`, {
                    params: {
                        email: userEmail
                    }
                });

                setUsers(response.data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        };


        fetchUsers();
    }, []);


    const handleUserClick = (user) => {
        setSelectedUser(user);

        // Enviar uma mensagem ao servidor para iniciar a conversa com o usuário selecionado
        socket.emit('startConversation', {user});
    };

    const messages = [
        {
            id: 1,
            sender: 'Você',
            message: 'Sim e você?',
            time: 'Hoje, 8h30',
            status: 'Online'
        },
        {
            id: 2,
            sender: 'Cláudia',
            message: 'Oi... Tudo bem?',
            time: 'Hoje, 8h30',
            status: 'Online'
        },
        {
            id: 3,
            sender: 'Brenda',
            message: 'Eu não estou sabendo de nada. Deve ter algo errado.',
            time: 'Hoje, 8h30',
            status: ''
        }
    ];


    return (
        <div className="flex flex-col h-screen">
            {/* Navbar */}
            <div className="p-4 flex justify-between">
                <span className="text-2xl font-semibold">Mensagens</span>
                <div className="flex items-center space-x-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                                <User/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem>
                                <LogOut className="mr-2 h-4 w-4"/>
                                <span>Sair</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>


            <div className="flex-grow flex">
                {/* Lista de Usuários */}
                <div className="flex-none w-1/4 bg-gray-200 border-r border-gray-300 overflow-y-auto">
                    <div className="p-4">
                        <div className="user-list">
                            <h2 className="mb-5 font-bold">Usuários</h2>
                            <ul className="space-y-2">
                                {users.map((user, index) => (
                                    <div key={index} onClick={() => handleUserClick(user)}
                                         className="cursor-pointer rounded-lg overflow-hidden">
                                        <li
                                            className={`flex items-center space-x-2 p-2 hover:bg-gray-100 ${selectedUser === user ? 'bg-blue-100' : ''}`}
                                        >
                                            <img
                                                src="https://via.placeholder.com/50"
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user.name}
            </span>
                                        </li>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Mensagens */}
                <div className="flex-grow p-4 overflow-y-auto flex flex-col bg-gray-100 relative">
                    <ul className="space-y-4 flex-1">
                        {messages.map((message) => (
                            <li key={message.id}
                                className={`flex ${message.sender === 'Você' ? 'justify-end' : 'justify-start'}`}>
                            <div className="flex items-start">
                                    <img
                                        src="https://via.placeholder.com/50x50.png?text=User+1"
                                        alt={message.sender}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="ml-3 bg-white rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                {message.sender}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{message.message}</p>
                                        <span className="text-xs text-gray-500">{message.time}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {/* Input de Mensagem */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center bg-white p-2 rounded">
                        <input
                            type="text"
                            placeholder="Digite sua mensagem aqui"
                            className="flex-1 appearance-none bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 rounded-l"
                        />
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline">
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}