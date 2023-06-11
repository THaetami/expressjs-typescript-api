import { Request, Response } from "express";
import CommentRepository from "../repository/CommentRepository";
import ThreadRepository from "../repository/ThreadRepository";
import AddedComment from "../entities/AddedComment";

class CommentService {
    credential: any;
    body: Request['body'];
    params: Request['params'];

    constructor(req: Request, res: Response) {
        if (req.app.locals.credential) {
            this.credential = req.app.locals.credential.user;
        } else {
            this.credential = null;
        }
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

        const comment = await CommentRepository.addComment(Number(id), thread.id, comentar);

        if (!comment) {
            return { statusCode: 400, status: 'fail', message: 'thread gagal ditambahkan' };
        }

        const comments = await CommentRepository.getCommentByThreadId(thread.id);

        return { statusCode: 201, status: 'success', comments: comments };
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

        const comments = await CommentRepository.getCommentByThreadId(thread.id);

        return { statusCode: 201, status: 'success', message: 'comment berhasil hapus', comments: comments};
    }

    async getCommentByThreadId(): Promise<any> {
        const { threadId } = this.params;

        const thread = await ThreadRepository.getThreadById(Number(threadId));

        if (!thread) {
            return { statusCode: 404, status: 'fail', 'message': 'thread tidak ditemukan' };
        }

        const comments = await CommentRepository.getCommentByThreadId(thread.id);
        
        return { statusCode: 200, status: 'success', comments: comments};
    }
}

export default CommentService;