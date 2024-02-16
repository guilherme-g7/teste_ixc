import { Request, Response, NextFunction } from 'express';

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado.');
};

export default errorHandler;