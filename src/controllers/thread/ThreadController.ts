import { Request, Response } from "express";
import IController from "./InterfaceController";
import ThreadService from "../../service/ThreadService";

class ThreadController implements IController {
    index = async (req: Request, res: Response): Promise<Response> => {
        const service: ThreadService = new ThreadService(req, res);
        const page: number = parseInt(req.query.page?.toString() || '1'); // Current page number
        const limit: number = parseInt(req.query.limit?.toString() || '10');
        const threads = await service.getThreads(page, limit);
        return res.status(200).json({ "status": "success", "threads": threads });
    }

    create = async (req: Request, res: Response): Promise<Response> => {
        const service: ThreadService = new ThreadService(req, res);
        const thread = await service.addThread();
        return res.status(thread.statusCode).json(thread);
    }

    show = async (req: Request, res: Response): Promise<Response> => {
        const service: ThreadService = new ThreadService(req, res);
        const thread = await service.getThreadByOwner();
        return res.status(thread.statusCode).json(thread);
    }

    update = async (req: Request, res: Response): Promise<Response> => {
        const service: ThreadService = new ThreadService(req, res);
        const thread = await service.updateThreadById();
        return res.status(thread.statusCode).json(thread);
    }

    delete = async (req: Request, res: Response): Promise<Response> => {
        const service: ThreadService = new ThreadService(req, res);
        const thread = await service.deleteThreadById();
        return res.status(thread.statusCode).json(thread);
    }

    detail = async (req: Request, res: Response): Promise<Response> => {
        const service: ThreadService = new ThreadService(req, res);
        const thread = await service.getThreadBySlug();
        return res.status(thread.statusCode).json(thread);
    }
}

export default new ThreadController();