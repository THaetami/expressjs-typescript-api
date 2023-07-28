import { Request, Response } from "express";
import UserRepository from "../repository/UserRepository";
import AuthenticationService from "./AuthenticationService";
import AddedUser from "../entities/AddedUser";
import ThreadRepository from "../repository/ThreadRepository";
import GettedUser from "../entities/GetttedUser";
import CommentRepository from "../repository/CommentRepository";
import LikeRepository from "../repository/LikeRepository";


class UserService {
    
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

    async getUsers(page: number, limit: number): Promise<any> {
        const users = await UserRepository.getUsers(page, limit)
        return users;
    }

    async addUser(): Promise<any> {
        const { username, password } = this.body;
        const hashedPassword: string = await AuthenticationService.passwordHash(password);
        const result = await UserRepository.addUser(username, hashedPassword);
        if (!result) {
            return { statusCode: 400, status: 'fail', message: 'user gagal ditambahkan' };
        }
        return { statusCode: 201, status: 'success', addedUser: new AddedUser(result)};
    }

    async getUser(): Promise<any> {
        const { id: userId } = this.params;
        const id = this.credential.id;
        const user = await UserRepository.getUserById(Number(userId));
        if (!user) {
            return { statusCode: 404, status: 'fail', message: 'user tidak ditemukan' };
        }

        if (user.id !== id) {
            return { statusCode: 403, status: 'fail', message: 'anda tidak berhak mengakses resource ini' };
        }
        return { statusCode: 200, status: 'success', user: new GettedUser(user)};
    }

    async updateUser(): Promise<any> {
        const { username, password } = this.body;
        const id = this.credential.id;

        const user = await UserRepository.getUserById(id);
        if (!user) {
            return { statusCode: 404, status: 'fail', message: 'user tidak ditemukan' };
        }

        const hashedPassword = password ? await AuthenticationService.passwordHash(password) : undefined;
        await UserRepository.updateUserById(user.id, username, hashedPassword);
        return { statusCode: 201, status: 'success', message: `profile ${user.username} berhasil diupdate`};
    }

    async deleteUserById(): Promise<any> {
        const { id } = this.params;
        const user = await UserRepository.getUserById(Number(id));
        
        if (!user) {
            return { statusCode: 404, status: 'fail', message: 'user tidak ditemukan' };
        }

        if (user.is_admin) {
            return { statusCode: 404, status: 'fail', message: 'user tidak ditemukan' };
        }
    
        await UserRepository.deleteUser(user.id);
        await ThreadRepository.deleteThreadByUserId(user.id);
        await CommentRepository.deleteCommentByUserId(user.id);
        await LikeRepository.deleteLikeByUserId(user.id);
        return { statusCode: 201, status: 'success', message: `user ${user.username}, berhasil dinonaktifkan`};
    }

    async activatedUser(): Promise<any> {
        const { username } = this.params;
        const user = await UserRepository.checkUsername(username);

        if (!user) {
            return { statusCode: 404, status: 'fail', message: 'user tidak ditemukan' };
        }
        
        if (user.deletedAt === null) {
            return { statusCode: 422, status: 'fail', message: 'user masih active' };
        }

        await UserRepository.reactivateUser(user.username);
        await ThreadRepository.reactivateThread(user.id, user.deletedAt);
        await CommentRepository.reactivateComment(user.id, user.deletedAt);
        await LikeRepository.reactivateLike(user.id, user.deletedAt);
        
        return { statusCode: 201, status: 'success', message: 'user berhasil diaktifkan'};
    }
}

export default UserService;