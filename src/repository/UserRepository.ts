const db = require('../db/models');
import { omit } from 'lodash';

class UserRepository {
    static async getUsers() {
        try {
            const users = await db.user.findAll({
                paranoid: false,
                attributes: ['id', 'username', 'created_at', 'updated_at', 'deleted_at'],
                where: { is_admin: false }
            });
            return users;
        } catch (err) {
            console.error(err);
        }
    }

    static async getUserById(id: number) {
        try {
            const user = await db.user.findOne({ 
                where: { id: id },
                attributes: ['id', 'username', 'created_at', 'updated_at', 'deleted_at', 'is_admin'] 
            });
            return user ? user : false;
        } catch (err) {
            console.error(err);
        }
    }

    public static async deleteUser(id: number) {
        try {
            await db.user.destroy({
                where: { id: id },
            });
        } catch (err) {
            console.error(err);
        }
    }

    public static async addUser(username: string, password: string) {
        try {
            const user = await db.user.create({ username, password });
            return user ? user : false;
        } catch (err) {
            console.error(err);
        }
    }

    public static async getUserByUsername(username: string) {
        try {
            const user = await db.user.findOne({ where: { username } });
            return user;
        } catch (err) {
            console.error(err);
        }
    }

    public static async checkUsername(username: string) {
        try {
            const user = await db.user.findOne({ 
                where: { username }, 
                paranoid: false 
            });
            return omit(user.toJSON(), "password");
        } catch (err) {
            console.error(err);
        }
    }

    public static async updateUserById(id: Number, username: string, password?: string) {
        try {
            const updates: any = { username };
            if (password) {
                updates.password = password;
            }
            await db.user.update(updates, { where: { id } });
        } catch (err) {
            console.error(err);
        }
    }

    public static async reactivateUser(username: string) {
        try {
            await db.user.update({ deleted_at: null }, { where: { username }, paranoid: false });
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
      
}

export default UserRepository;