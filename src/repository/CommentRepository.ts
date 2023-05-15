const db = require('../db/models');

class CommentRepository {
    static async addComment(user_id: number, thread_id: number, comentar: string) {
        try {
            const result = await db.comment.create({ user_id, thread_id, comentar });
            return result ? result : false;
        } catch (err) {
            console.error(err);
        }
    }

    public static async getCommentById(id: number) {
        try {
            const comment = await db.comment.findOne({ where: { id: id} });
            return comment ? comment : false;
        } catch (err) {
            console.error(err);
        }
    }

    public static async deleteComment(id: Number) {
        try {
            await db.comment.destroy({
                where: { id: id },
            });
        } catch (err) {
            console.error(err);
        }
    }

    public static async deleteCommentByUserId(user_id: Number) {
        try {
            await db.comment.destroy({
                where: { user_id: user_id },
            });
        } catch (err) {
            console.error(err);
        }
    }

    public static async reactivateComment(user_id: number, deleted_at: string) {
        try {
            await db.comment.update({ deleted_at: null }, { where: { user_id, deleted_at }, paranoid: false });
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

}

export default CommentRepository;