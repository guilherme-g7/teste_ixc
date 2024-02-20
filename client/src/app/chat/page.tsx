"use client";
import io from "socket.io-client";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {format} from "date-fns";



interface IMessage {
    content: string;
    date: string;
    senderEmail: string;
}


axios.defaults.baseURL = 'http://localhost:4000'
export default function ChatPage() {
    let userEmail = '';

    if (typeof localStorage !== 'undefined') {
        userEmail = localStorage.getItem('email') || '';
    }
    const socket = io('http://localhost:4000', {
        auth: {
            email: userEmail
        }
    });

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [currentMessage, setCurrentMessage] = useState("");
    const [messages, setMessages] = useState<IMessage[]>([]);

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


    socket.on('connect', () =>{
        socket.on('messageReceived', async (mensagem: IMessage) => {
            setMessages((prevMessages: IMessage[]) => [...prevMessages, mensagem]);
        });
    });



    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (!selectedUser) {
                    console.error('Nenhum usuário selecionado para enviar mensagem');
                    return;
                }

                const response = await axios.get('/api/conversation/messages', {
                    params: {
                        userEmail: localStorage.getItem('email'),
                        userId2: selectedUser._id
                    }
                });

                setMessages(response.data);
            } catch (error) {
                console.error('Erro ao buscar mensagens:', error);
            }
        };

        fetchMessages();
    }, [selectedUser]);






    const handleUserClick = async (user: any) => {
        setSelectedUser(user);
        socket.emit('startConversation', user);
    };

    const sendMessage = () => {
        if (!selectedUser) {
            console.error('Nenhum usuário selecionado para enviar mensagem');
            return;
        }


        if (!currentMessage.trim()) {
            console.error('A mensagem está vazia');
            return;
        }

        socket.on("connect", () => {
            socket.emit('sendMessage', {
                recipient: selectedUser,
                content: currentMessage,
                sokectId: socket.id
            });
        });





        setCurrentMessage("");
    };


    return (
        <div className="flex flex-col h-screen">
            {/* Navbar */}
            <div className="p-4 flex justify-between">
                <span className="text-2xl font-semibold">Mensagens</span>
            </div>


            <div className="flex-grow flex">
                {/* Lista de Usuários */}
                <div className="flex-none w-1/4 bg-gray-200 border-r border-gray-300 overflow-y-auto">
                    <div className="p-4">
                        <div className="user-list">
                            <h2 className="mb-5 font-bold">Usuários</h2>
                            <ul className="space-y-2">
                                {users.map((user: any, index) => (
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
                                            <span
                                                className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.name}</span>
                                        </li>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Mensagens */}
                <div className="flex-grow p-4 overflow-y-auto flex flex-col bg-gray-100 relative">

                    {selectedUser ? (
                        <div className="p-4 w-full bg-white mb-4 rounded-lg flex items-center ">
                            <img
                                src="https://via.placeholder.com/50"
                                alt="5"
                                className="w-10 h-10 rounded-full"
                            />
                            <h2 className="ml-4">{selectedUser.name}</h2>
                        </div>
                    ) : null}
                    <ScrollArea className="h-[660px] rounded-md border scroll-align-bottom">
                        <ul className="space-y-4 flex-1 p-4">
                            {messages.map((message: IMessage, index: number) => (
                                <li key={index}
                                    className={`flex ${message.senderEmail === userEmail ? 'justify-end' : 'justify-start'}`}>
                                    <div className="flex items-start">
                                        <img
                                            src="https://via.placeholder.com/50x50.png?text=User+1"
                                            alt="5"
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div className="ml-3 bg-white rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                            </div>
                                            <p className="text-sm text-gray-600">{message.content}</p>
                                            <span className="text-xs text-gray-500">{message.date.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>
                    {/* Input de Mensagem */}

                    {selectedUser ? (
                        <div className="absolute bottom-4 left-4 right-4 flex items-center bg-white p-2 rounded">
                            <Input
                                type="text"
                                placeholder="Digite sua mensagem aqui"
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                                className="flex-1 appearance-none border-none text-gray-700 py-2 px-4 leading-tight rounded-l "
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        sendMessage();
                                    }
                                }}
                            />
                            <Button
                                onClick={sendMessage}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline">
                                Enviar
                            </Button>
                        </div>
                    ) : null}

                </div>
            </div>
        </div>
    );

}