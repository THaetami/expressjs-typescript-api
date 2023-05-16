import { Request, Response } from "express";
import IController from "./InterfaceController";
import LikeService from "../../service/LikeService";

class LikeController implements IController {
    create = async (req: Request, res: Response): Promise<Response> => {
        const service: LikeService = new LikeService(req, res);
        const comment = await service.likeUnlike();
        return res.status(comment.statusCode).json(comment);
    }

}

export default new LikeController();