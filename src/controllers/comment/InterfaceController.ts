import { Request, Response } from "express";

interface IController {
    create(req: Request, res: Response): Promise<Response>;
    delete(req: Request, res: Response): Promise<Response>;
}

export default IController;
