import UserModel, {IUser} from "../models/user.model";
import {Request, Response} from "express";
import {User} from "../models";

export const register = async (req: Request, res: Response) => {

    try {
        const newUser = new UserModel(req.body);
        await newUser.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao inserir novo usuário:', error);
        res.status(500).json({ error: 'Erro ao registrar o usuário.' });
    }
}

export const getUsers = async(req: Request, res: Response) =>{
    try {
        console.log(req.params)
        const loggedInUserEmail = req.params.email;

        const loggedInUser = await User.findOne({ email: loggedInUserEmail });

        if (!loggedInUser) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }


        const users = await User.find({ email: { $ne: loggedInUserEmail } });

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Algo deu errado.' });
    }
}