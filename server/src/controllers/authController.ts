// authController.ts

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

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: 'Autenticação realizada com sucesso.', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Algo deu errado.' });
    }
};

export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'Email já cadastrado.' });
        }

        const user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Algo deu errado.' });
    }
};