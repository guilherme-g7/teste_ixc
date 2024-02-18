import UserModel, {IUser} from "../models/user.model";
import {Request, Response} from "express";

export const register = async (req: Request, res: Response) => {
    const user = mapToFrontendDataToUserModel(req.body)
    try {
        const newUser = new UserModel(user);
        await newUser.save();
        console.log('Novo usuário inserido com sucesso!');
    } catch (error) {
        console.error('Erro ao inserir novo usuário:', error);
    }
}

function mapToFrontendDataToUserModel(frontendData: any): IUser {
    // Aqui você pode mapear os dados recebidos do frontend para o formato esperado pelo UserModel
    const userModel: IUser = {
        name: frontendData.name,
        email: frontendData.email,
        password: frontendData.password,
        rememberMe: frontendData.rememberMe, // Certifique-se de que este campo esteja presente no frontendData
        emailVerified: false, // Defina o emailVerified como false por padrão, pois o usuário acabou de se registrar
        createdAt: new Date(), // Defina a data de criação como o momento atual
        lastLoginAt: null // Defina lastLoginAt como null inicialmente, pois o usuário ainda não fez login
    };

    return userModel;
}