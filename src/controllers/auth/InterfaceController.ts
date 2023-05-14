import { Request, Response } from "express";

interface IController {
    index(req: Request, res: Response): Promise<Response>;
    login(req: Request, res: Response): Promise<Response>;
    logout(req: Request, res: Response): Promise<Response>;
}

export default IController;
