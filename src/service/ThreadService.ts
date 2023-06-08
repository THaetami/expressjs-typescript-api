const { v4: uuidv4 } = require('uuid');
import AddedThread from "../entities/AddedThread";
import { Request, Response } from "express";
import ThreadRepository from "../repository/ThreadRepository";
import GettedThread from "../entities/GettedThread";

class ThreadService {
    // credential: {
    //     id: Number,
    // };
    // body: Request['body'];
    // params: Request['params'];

    // constructor(req: Request, res: Response) {
    //     this.credential = req.app.locals.credential.user;
    //     this.body = req.body;
    //     this.params = req.params;
    // }
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

    async getThreads(page: number, limit: number): Promise<any> {
        console.log(page);
        console.log(limit);
        const threads = await ThreadRepository.getThreads(page, limit);
        return threads;
      }
    
    async addThread(): Promise<any> {
        const { title, body } = this.body;
        const slug = uuidv4();
        const id = this.credential.id;
        const result = await ThreadRepository.addThread(Number(id), slug, title, body);
        if (!result) {
            return { statusCode: 400, status: 'fail', message: 'thread gagal ditambahkan' };
        }
        return { statusCode: 201, status: 'success', addedThread: new AddedThread(result)};
    }

    async getThreadById(): Promise<any> {
        const { id: threadId } = this.params;
        const id = this.credential.id;
        const thread = await ThreadRepository.getThreadById(Number(threadId));

        if (!thread) {
            return { statusCode: 404, status: 'fail', message: 'thread tidak ditemukan' };
        }

        if (thread.user_id !== id) {
            return { statusCode: 403, status: 'fail', message: 'anda tidak berhak mengakses resource ini' };
        }

        return { statusCode: 200, status: 'success', thread: new GettedThread(thread)};
    }

    async updateThreadById(): Promise<any> {
        const { id: threadId } = this.params;
        const { title, body } = this.body;
        const id = this.credential.id;
        const thread = await ThreadRepository.getThreadById(Number(threadId));
        
        if (!thread) {
            return { statusCode: 404, status: 'fail', message: 'Thread tidak ditemukan' };
        }
      
        if (thread.user_id !== id) {
            return { statusCode: 403, status: 'fail', message: 'anda tidak berhak mengakses resource ini' };
        }

        await ThreadRepository.updateThread(thread.id, title, body)
        return { statusCode: 201, status: 'success', message: `thread yang berjudul ${thread.title}, berhasil diupdate`};
    }

    async deleteThreadById(): Promise<any> {
        const { id: threadId } = this.params;
        const id = this.credential.id;
        const thread = await ThreadRepository.getThreadById(Number(threadId));
        
        if (!thread) {
            return { statusCode: 404, status: 'fail', message: 'Thread tidak ditemukan' };
        }
      
        if (thread.user_id !== id) {
            return { statusCode: 403, status: 'fail', message: 'anda tidak berhak mengakses resource ini' };
        }

        await ThreadRepository.deleteThread(thread.id)
        return { statusCode: 201, status: 'success', message: `thread yang berjudul ${thread.title}, berhasil dihapus`};
    }

    
    async getThreadBySlug(): Promise<any> {
        const { slug } = this.params;
        const thread = await ThreadRepository.getThreadBySlug(slug);
        if (!thread) {
            return { statusCode: 404, status: 'fail', message: 'thread tidak ditemukan' };
        }
        return { statusCode: 200, status: 'success', thread: thread};
    }
}

export default ThreadService;