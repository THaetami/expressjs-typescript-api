const db = require('../db/models');

class UserRepository {
    static async getUsers(page = 1, limit = 10) {
        try {
            const totalCount = await db.user.count({
                where: { is_admin: false },
                paranoid: false
            });
        
            const totalPages = Math.ceil(totalCount / limit);
        
            const currentPage = Math.max(1, Math.min(page, totalPages));
        
            const users = await db.user.findAll({
                attributes: ['id', 'username', 'created_at', 'updated_at', 'deleted_at'],
                where: { is_admin: false },
                offset: (currentPage - 1) * limit,
                limit: limit,
                paranoid: false
            });
        
            return {
                users,
                currentPage,
                totalPages,
                totalCount,
            };
        } catch (err) {
            console.error(err);
            throw err; 
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
            return user;
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