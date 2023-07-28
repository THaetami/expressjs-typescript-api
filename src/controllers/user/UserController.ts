import { Request, Response } from "express";
import IController from "./InterfaceController";
import UserService from "../../service/UserService";


class UserController implements IController {
    index = async (req: Request, res: Response): Promise<Response> => {
        const service: UserService = new UserService(req, res);
        const page: number = parseInt(req.query.page?.toString() || '1'); // Current page number
        const limit: number = parseInt(req.query.limit?.toString() || '10');
        const users = await service.getUsers(page, limit);
        return res.status(200).json({ "status": "success", "users": users});
    }

    create = async (req: Request, res: Response): Promise<Response> => {
        const service: UserService = new UserService(req, res);
        const user = await service.addUser();
        return res.status(user.statusCode).json(user);
    }

    show = async (req: Request, res: Response): Promise<Response> => {
        const service: UserService = new UserService(req, res);
        const user = await service.getUser();
        return res.status(user.statusCode).json(user);
    }

    update = async (req: Request, res: Response): Promise<Response> => {
        const service: UserService = new UserService(req, res);
        const user = await service.updateUser();
        return res.status(user.statusCode).json(user);
    }

    delete = async (req: Request, res: Response): Promise<Response> => {
        const service: UserService = new UserService(req, res);
        const thread = await service.deleteUserById();
        return res.status(thread.statusCode).json(thread);
    }

    active = async (req: Request, res: Response): Promise<Response> => {
        const service: UserService = new UserService(req, res);
        const user = await service.activatedUser();
        return res.status(user.statusCode).json(user);
    }
}

export default new UserController();