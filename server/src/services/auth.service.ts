// auth.service.ts

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        let secret = process.env.JWT_SECRET || '';

        const token = jwt.sign({ id: user.id }, secret, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: 'Autenticação realizada com sucesso.', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Algo deu errado.' });
    }
};


export const logout = async (req: Request, res: Response) => {
    res.status(200).json({ message: 'Logout realizado com sucesso.' });
};