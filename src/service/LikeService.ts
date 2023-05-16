import { Request, Response } from "express";
import ThreadRepository from "../repository/ThreadRepository";
import LikeRepository from "../repository/LikeRepository";

class  LikeService {
    credential: {
        id: Number,
    };
    body: Request['body'];
    params: Request['params'];

    constructor(req: Request, res: Response) {
        this.credential = req.app.locals.credential.user;
        this.body = req.body;
        this.params = req.params;
    }
    
    async likeUnlike(): Promise<any> {
        const { threadId } = this.params;
        const id = this.credential.id;

        const thread = await ThreadRepository.getThreadById(Number(threadId));

        if (!thread) {
            return { statusCode: 404, status: 'fail', message: 'thread tidak ditemukan' };
        }

        const like = await LikeRepository.checkLikesThread(Number(id), thread.id);
        if (!like) {
            const result = await LikeRepository.likeAdd(Number(id), thread.id);
            return { statusCode: 201, status: 'succes', message: 'like thread berhasil', likeCount: result };
        }

        if (like.deletedAt !== null) {
            const result = await LikeRepository.likeUpdate(like.id, thread.id);
            return { statusCode: 201, status: 'succes', message: 'like thread berhasil', likeCount: result };
        }

        const result = await LikeRepository.unlikeDelete(like.id, thread.id);
        return { statusCode: 201, status: 'succes', message: 'unlike thread berhasil', likeCount: result };

    }

}

export default LikeService;