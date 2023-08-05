const { v4: uuidv4 } = require('uuid');
import AddedThread from "../entities/AddedThread";
import { Request, Response } from "express";
import ThreadRepository from "../repository/ThreadRepository";
import GettedThread from "../entities/GettedThread";
import UserRepository from "../repository/UserRepository";
import LikeRepository from "../repository/LikeRepository";

class ThreadService {
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

    async getThreadByOwner(): Promise<any> {
        const { slug: slug } = this.params;
        const id = this.credential.id;
        const thread = await ThreadRepository.getThreadBySlug(slug);

        if (!thread) {
            return { statusCode: 404, status: 'fail', message: 'thread tidak ditemukan' };
        }

        if (thread.user_id !== id) {
            return { statusCode: 403, status: 'fail', message: 'anda tidak berhak mengakses resource ini' };
        }

        return { statusCode: 200, status: 'success', thread: new GettedThread(thread)};
    }

    async getThreadByUsername(page: number, limit: number): Promise<any> {
        const { username } = this.params;
        const id = this.credential.id;

        const user = await UserRepository.getUserByUsername(username);

         if (!user) {
            return { statusCode: 404, status: 'fail', message: 'user tidak ditemukan' };
        }

        if (user.id !== id) {
            return { statusCode: 403, status: 'fail', message: 'anda tidak berhak mengakses resource ini' };
        }

        const thread = await ThreadRepository.getThreadByUserId(page, limit, user.id);

        return { statusCode: 200, status: 'success', threads: thread};
    }

    async getThreadByLikeUser(page: number, limit: number): Promise<any> {
        const { username } = this.params;
        const id = this.credential.id;

        const user = await UserRepository.getUserByUsername(username);

         if (!user) {
            return { statusCode: 404, status: 'fail', message: 'user tidak ditemukan' };
        }

        if (user.id !== id) {
            return { statusCode: 403, status: 'fail', message: 'anda tidak berhak mengakses resource ini' };
        }
        
        const likes = await LikeRepository.getThreadIdsByUserId(user.id);

        const thread = await ThreadRepository.getThreadByUserIdAndThreadId(page, limit, likes);

        return { statusCode: 200, status: 'success', threads: thread};
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

        const detailThread = await ThreadRepository.getDetailThread(thread.id);
        return { statusCode: 200, status: 'success', 'thread': detailThread};
    }
}

export default ThreadService;