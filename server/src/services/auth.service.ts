// auth.service.ts

import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { compare } from 'bcryptjs';


export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        const match = await compare(password, user.password);
        if (!user || !match) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        let secret = process.env.JWT_SECRET || '';

        const token = jwt.sign({ nome: user.nome }, secret, {
            expiresIn: '1h',
        });

        await User.updateOne({ email }, { lastLoginAt: new Date() });

        res.status(200).json({ message: 'Autenticação realizada com sucesso.', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Algo deu errado.' });
    }
};


export const logout = async (req: Request, res: Response) => {
    res.status(200).json({ message: 'Logout realizado com sucesso.' });
};


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }

        res.status(200).json({ message: 'Token válido' });
    });
};
