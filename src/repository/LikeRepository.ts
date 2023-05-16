const db = require('../db/models');

class LikeRepository {
    public static async checkLikesThread(user_id: number, thread_id: number) {
        try {
            const like = await db.like.findOne({ where: { user_id, thread_id }, paranoid: false });
            return like;
        } catch (err) {
            console.error(err);
        }
    }
    
    static async likeAdd(user_id: number, thread_id: number) {
        try {
            await db.like.create({ user_id, thread_id });
            const likeCount = await db.like.count({ where: { thread_id } });
            return likeCount;
        } catch (err) {
            console.error(err);
        }
    }

    public static async unlikeDelete(id: Number, thread_id: number) {
        try {
            await db.like.destroy({
                where: { id, thread_id },
            });

            const likeCount = await db.like.count({ where: { thread_id } });
            return likeCount;
        } catch (err) {
            console.error(err);
        }
    }

    public static async likeUpdate(id: number, thread_id: number) {
        try {
            await db.like.update(
                { deleted_at: null },
                { where: { id, thread_id}, paranoid: false },
            );

            const likeCount = await db.like.count({ where: { thread_id } });
            return likeCount;
        } catch (err) {
            console.error(err);
        }
    }

    public static async deleteLikeByUserId(user_id: Number) {
        try {
            await db.like.destroy({
                where: { user_id: user_id },
            });
        } catch (err) {
            console.error(err);
        }
    }

    public static async reactivateLike(user_id: number, deleted_at: string) {
        try {
            await db.like.update({ deleted_at: null }, { where: { user_id, deleted_at }, paranoid: false });
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

}

export default LikeRepository;