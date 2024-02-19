import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import {connectToDatabase} from "./database";
import cors from "cors";
import dotenv from 'dotenv';
import {Server, Socket} from "socket.io";
import http from 'http';
import {User} from "./models";
import Conversation from "./models/conversation.model";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/datetime', (req, res) => {
    const currentDatetime = new Date();
    res.json({ datetime: currentDatetime });
});

app.use('/', routes);

const users: { [key: string]: Socket } = {};

async function startServer() {
    try {
        await connectToDatabase().then(()=>{
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

export function socketIOConfig(server: http.Server){
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });


    io.on('connection', (socket) => {
        socket.on('login', async (email: string) => {
            try {

                const user = await User.findOne({ email });

                if (!user) {
                    console.log('Usuário não encontrado com o email:', email);
                    return;
                }
                console.log('Usuário', user.name, 'conectado');
                users[user.id] = socket;
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
            }
        });


        socket.on('startConversation', async (otherUserId: string) => {
            try {

                const userEmail = socket.handshake.auth.email;
                const user = await User.findOne({ userEmail });
                let userId = null
                if (user) {
                    // Agora você tem o ID do usuário
                    userId = user._id;
                } else {
                    console.error('Usuário não encontrado com o email:', userEmail);
                }

                if (!otherUserId) {
                    console.error('ID do outro usuário não fornecido.');
                    return;
                }

                let conversation = await Conversation.findOne({ participants: { $all: [userId, otherUserId] } });

                if (!conversation) {
                    conversation = new Conversation({
                        participants: [userId, otherUserId],
                        messages: []
                    });
                    await conversation.save();
                }

                // Emite um evento para o cliente para informar sobre a nova conversa
                io.to(socket.id).emit("conversationStarted", conversation);

            } catch (error) {
                console.error('Erro ao iniciar a conversa:', error);
                // Emite um evento de erro, se necessário
                io.to(socket.id).emit("conversationError", "Erro ao iniciar a conversa");
            }
        });


        socket.on('sendMessage', async (data: { senderId: string, recipientId: string, message: string }) => {
            const { senderId, recipientId, message } = data;
            console.log('Mensagem recebida:', message);

            // Verificar se o destinatário está online e enviar a mensagem
            if (users[recipientId]) {
                users[recipientId].emit('messageReceived', { senderId, message });
            } else {
                console.log('Usuário', recipientId, 'não está online');
                // Você pode lidar com esta situação de acordo com suas necessidades, como enviar uma notificação ou armazenar a mensagem para entrega posterior.
            }
        });



        socket.on('disconnect', () => {
            // Encontrar e remover o usuário desconectado
            const userId = Object.keys(users).find(key => users[key] === socket);
            if (userId) {
                console.log('Usuário', userId, 'desconectado');
                delete users[userId];
            }
        });
    });
}