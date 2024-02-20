import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import {connectToDatabase} from "./database";
import cors from "cors";
import dotenv from 'dotenv';
import {Server, Socket} from "socket.io";
import http from 'http';
import {User} from "./models";
import Conversation, {IMessage} from "./models/conversation.model";
import {IUser} from "./models/user.model";
import mongoose, { Types  } from 'mongoose';
import {ObjectId} from "mongodb";
import {format} from "date-fns";


dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/datetime', (req, res) => {
    const currentDatetime = new Date();
    res.json({datetime: currentDatetime});
});

app.use('/', routes);

const users: { [key: string]: Socket } = {};

async function startServer() {
    try {
        await connectToDatabase().then(() => {
            const server = app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
            socketIOConfig(server)
        });

    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
}

startServer();

interface IUserWithId extends IUser {
    _id: string;
}

export function socketIOConfig(server: http.Server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });


    io.on('connection', (socket) => {
        socket.on('login', async (email: string) => {
            try {

                const user = await User.findOne({email});

                if (!user) {
                    console.log('Usuário não encontrado com o email:', email);
                    return;
                }
                users[user.id] = socket;
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
            }
        });


        socket.on('startConversation', async (otherUser: IUserWithId) => {
            try {

                const userEmail = socket.handshake.auth.email;
                const user = await User.findOne({email: userEmail});
                let userId = null
                if (user) {
                    userId = user._id;
                } else {
                    console.error('Usuário não encontrado com o email:', userEmail);
                }

                if (!otherUser._id) {
                    console.error('ID do outro usuário não fornecido.');
                    return;
                }


                let conversation = await Conversation.findOne({participants: {$all: [userId, otherUser._id]}});

                if (!conversation) {
                    conversation = new Conversation({
                        participants: [userId, otherUser._id],
                        messages: []
                    });
                    await conversation.save();
                }

                io.to(socket.id).emit("conversationStarted", conversation);

            } catch (error) {
                console.error('Erro ao iniciar a conversa:', error);

                io.to(socket.id).emit("conversationError", "Erro ao iniciar a conversa");
            }
        });


        socket.on('sendMessage', async (data: { recipient: IUserWithId, content: string }) => {
            try {
                const { recipient, content } = data;

                const userEmail = socket.handshake.auth.email;
                const user = await User.findOne({ email: userEmail });
                let senderId = null;
                if (user) {
                    senderId = user._id;
                } else {
                    console.error('Usuário não encontrado com o email:', userEmail);
                    return;
                }


                let conversation = await Conversation.findOne({
                    participants: { $all: [senderId, recipient._id] }
                });


                if (!conversation) {
                    console.error('Conversa não encontrada');
                    return;
                }


                const message: IMessage = {
                    sender: senderId,
                    content: content,
                    timestamp: new Date()
                };

                conversation.messages.push(message);
                await conversation.save();

                const retorno = {
                    name: user.name,
                    content: content,
                    date: format(new Date(), "'Hoje,' HH'h'mm"),
                    senderEmail: userEmail
                }

                io.to(socket.id).emit("messageReceived", retorno);

            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
                // Emite um evento de erro, se necessário
                io.to(socket.id).emit("messageError", "Erro ao enviar mensagem");
            }
        });

        socket.on('disconnect', () => {
            const userId = Object.keys(users).find(key => users[key] === socket);
            if (userId) {
                console.log('Usuário', userId, 'desconectado');
                delete users[userId];
            }
        });
    });
}