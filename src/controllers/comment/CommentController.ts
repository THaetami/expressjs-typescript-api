import { Request, Response } from "express";
import IController from "./InterfaceController";
import CommentService from "../../service/CommentService";

class CommentController implements IController {
    create = async (req: Request, res: Response): Promise<Response> => {
        const service: CommentService = new CommentService(req, res);
        const comment = await service.addComment();
        return res.status(comment.statusCode).json(comment);
    }

    delete = async (req: Request, res: Response): Promise<Response> => {
        const service: CommentService = new CommentService(req, res);
        const comment = await service.deleteComment();
        return res.status(comment.statusCode).json(comment);
    }

}

export default new CommentController();