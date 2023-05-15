import { Request, Response } from "express";
import CommentRepository from "../repository/CommentRepository";
import ThreadRepository from "../repository/ThreadRepository";
import AddedComment from "../entities/AddedComment";

class CommentService {
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
    
    async addComment(): Promise<any> {
        const { threadId } = this.params;
        const { comentar } = this.body;
        const id = this.credential.id;

        const thread = await ThreadRepository.getThreadById(Number(threadId));

        if (!thread) {
            return { statusCode: 404, status: 'fail', message: 'thread tidak ditemukan' };
        }

        const result = await CommentRepository.addComment(Number(id), thread.id, comentar);

        if (!result) {
            return { statusCode: 400, status: 'fail', message: 'thread gagal ditambahkan' };
        }
        return { statusCode: 201, status: 'success', addedComment: new AddedComment(result)};
    }

    async deleteComment(): Promise<any> {
        const { threadId, commentId } = this.params;
        const id = this.credential.id;

        const thread = await ThreadRepository.getThreadById(Number(threadId));

        if (!thread) {
            return { statusCode: 404, status: 'fail', message: 'thread tidak ditemukan' };
        }

        const comment = await CommentRepository.getCommentById(Number(commentId));

        if (!comment) {
            return { statusCode: 404, status: 'fail', message: 'comentar tidak ditemukan' };
        }

        if (id !== comment.user_id || thread.id !== comment.thread_id) {
            return { statusCode: 403, status: 'fail', message: 'anda tidak berhak mengakses resource ini' };
        }

        await CommentRepository.deleteComment(comment.id);

        return { statusCode: 201, status: 'success', message: 'comment berhasil hapus'};
    }
}

export default CommentService;