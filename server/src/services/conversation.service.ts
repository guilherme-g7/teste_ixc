import { Request, Response } from 'express';
import {format, isToday} from "date-fns";
import {User, Conversation} from "../models";



const formatarData = (timestamp: string) => {
    const data = new Date(timestamp);

    if (isNaN(data.getTime())) {
        throw new Error('Valor de tempo inválido: ' + timestamp);
    }

    if (isToday(data)) {
        return `Hoje, ${format(data, 'HH:mm')}`;
    } else {
        return format(data, 'dd/MM/yyyy, HH:mm');
    }
};

interface IReturn {
    name: string;
    content: string;
    date: string;
    senderEmail: string;
}

export const getConversationsAndMessages = async (req: Request, res: Response) => {
    try {
        const { userEmail, userId2 } = req.query;

        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const userId1 = user._id;

        let conversations = await Conversation.find({participants: {$all: [userId1, userId2]}});

        const mensagens: IReturn[] = [];

        await Promise.all(conversations.map(async (conversation: any) => {
            await Promise.all(conversation.messages.map(async (message: any) => {
                const userSender = await User.findOne({ _id: message.sender });

                mensagens.push({
                    name: userSender.name,
                    content: message.content,
                    date: formatarData(message.timestamp),
                    senderEmail: userSender.email
                });
            }));
        }));

        // Retorna as conversas e mensagens encontradas como resposta
        res.status(200).json(mensagens);
    } catch (error) {
        console.error('Erro ao buscar conversas e mensagens:', error);
        // Se ocorrer um erro, retorna uma mensagem de erro como resposta
        res.status(500).json({ error: 'Erro ao buscar conversas e mensagens' });
    }
};