import { Sequelize } from "../db/models";
const db = require('../db/models');

class ThreadRepository {

    static async getThreads() {
        try {
            const threads = await db.thread.findAll({
                include: [
                    {
                        model: db.user,
                        attributes: ['id', 'username']
                    },
                    {
                        model: db.comment,
                        attributes: []
                    }
                ],
                attributes: [
                    'id',
                    'title',
                    'body',
                    'slug',
                    'updated_at',
                    [Sequelize.fn('COUNT', Sequelize.col('comments.id')), 'comment_count']
                ],
                subQuery: false,
                group: ['thread.id', 'user.id']
            });
            return threads;
        } catch (err) {
            console.error(err);
        }
    }
    
    
    static async addThread(user_id: number, slug: string, title: string, body: string) {
        try {
            const result = await db.thread.create({ user_id, slug, title, body });
            return result ? result : false;
        } catch (err) {
            console.error(err);
        }
    }

    static async getThreadBySlug(slug: string) {
        try {
            const thread = await db.thread.findOne({
                include: [
                    {
                        model: db.user,
                        attributes: ['id', 'username']
                    },
                    {
                        model: db.comment,
                        attributes: ['id', 'comentar', 'created_at'],
                        include: {
                            model: db.user,
                            attributes: ['id', 'username']
                        }
                    }
                ],
                attributes: ['id', 'title', 'body', 'slug', 'updated_at'],
                where: { slug }
            });
            return thread ? thread : false;
        } catch (err) {
            console.error(err);
        }
    }

    public static async getThreadById(id: number) {
        try {
            const thread = await db.thread.findOne({ where: { id: id} });
            return thread ? thread : false;
        } catch (err) {
            console.error(err);
        }
    }

    public static async updateThread(id: Number, title: string, body: string) {
        try {
            await db.thread.update(
                { title, body },
                { where: { id: id } }
            );
        } catch (err) {
            console.error(err);
        }
    }

    public static async deleteThread(id: Number) {
        try {
            await db.thread.destroy({
                where: { id: id },
            });
        } catch (err) {
            console.error(err);
        }
    }

    public static async deleteThreadByUserId(user_id: Number) {
        try {
            await db.thread.destroy({
                where: { user_id: user_id },
            });
        } catch (err) {
            console.error(err);
        }
    }

    
    public static async reactivateThread(user_id: number, deleted_at: string) {
        try {
            await db.thread.update({ deleted_at: null }, { where: { user_id, deleted_at }, paranoid: false });
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

}

export default ThreadRepository;