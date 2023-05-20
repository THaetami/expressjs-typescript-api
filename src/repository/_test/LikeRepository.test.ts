const db = require('../../db/models');
import LikeRepository from '../LikeRepository';

jest.mock('../../db/models');

describe('LikeRepository', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('checkLikesThread', () => {
        it('should return a like if found', async () => {
            const user_id = 1;
            const thread_id = 1;
            const like = { id: 1, user_id, thread_id };
            db.like.findOne.mockResolvedValueOnce(like);

            const result = await LikeRepository.checkLikesThread(user_id, thread_id);

            expect(db.like.findOne).toHaveBeenCalledWith({ where: { user_id, thread_id }, paranoid: false });
            expect(result).toEqual(like);
        });

        it('should return null if like not found', async () => {
            const user_id = 1;
            const thread_id = 1;
            db.like.findOne.mockResolvedValueOnce(null);

            const result = await LikeRepository.checkLikesThread(user_id, thread_id);

            expect(db.like.findOne).toHaveBeenCalledWith({ where: { user_id, thread_id }, paranoid: false });
            expect(result).toBeNull();
        });

        it('should handle errors', async () => {
            const user_id = 1;
            const thread_id = 1;
            const error = new Error('Check likes thread error');
            db.like.findOne.mockRejectedValueOnce(error);
            console.error = jest.fn();

            const result = await LikeRepository.checkLikesThread(user_id, thread_id);

            expect(db.like.findOne).toHaveBeenCalledWith({ where: { user_id, thread_id }, paranoid: false });
            expect(console.error).toHaveBeenCalledWith(error);
            expect(result).toBeFalsy();
        });
    });

    describe('likeAdd', () => {
        it('should add a new like and return like count', async () => {
            const user_id = 1;
            const thread_id = 1;
            const likeCount = 1;
            db.like.create.mockResolvedValueOnce({});
            db.like.count.mockResolvedValueOnce(likeCount);

            const result = await LikeRepository.likeAdd(user_id, thread_id);

            expect(db.like.create).toHaveBeenCalledWith({ user_id, thread_id });
            expect(db.like.count).toHaveBeenCalledWith({ where: { thread_id } });
            expect(result).toEqual(likeCount);
        });

        it('should handle errors', async () => {
            const user_id = 1;
            const thread_id = 1;
            const error = new Error('Add like error');
            db.like.create.mockRejectedValueOnce(error);
            console.error = jest.fn();

            const result = await LikeRepository.likeAdd(user_id, thread_id);

            expect(db.like.create).toHaveBeenCalledWith({ user_id, thread_id });
            expect(console.error).toHaveBeenCalledWith(error);
            expect(result).toBeFalsy();
        });
    });

    describe('unlikeDelete', () => {
        it('should delete a like and return like count', async () => {
            const id = 1;
            const thread_id = 1;
            const likeCount = 0;
            db.like.destroy.mockResolvedValueOnce({});
            db.like.count.mockResolvedValueOnce(likeCount);

            const result = await LikeRepository.unlikeDelete(id, thread_id);

            expect(db.like.destroy).toHaveBeenCalledWith({ where: { id, thread_id } });
            expect(db.like.count).toHaveBeenCalledWith({ where: { thread_id } });
            expect(result).toEqual(likeCount);
        });

        it('should handle errors', async () => {
            const id = 1;
            const thread_id = 1;
            const error = new Error('Unlike delete error');
            db.like.destroy.mockRejectedValueOnce(error);
            console.error = jest.fn();

            const result = await LikeRepository.unlikeDelete(id, thread_id);

            expect(db.like.destroy).toHaveBeenCalledWith({ where: { id, thread_id } });
            expect(console.error).toHaveBeenCalledWith(error);
            expect(result).toBeFalsy();
        });
    });

    describe('likeUpdate', () => {
        it('should update a like and return like count', async () => {
            const id = 1;
            const thread_id = 1;
            const likeCount = 1;
            db.like.update.mockResolvedValueOnce({});
            db.like.count.mockResolvedValueOnce(likeCount);

            const result = await LikeRepository.likeUpdate(id, thread_id);

            expect(db.like.update).toHaveBeenCalledWith(
            { deleted_at: null },
            { where: { id, thread_id }, paranoid: false }
            );
            expect(db.like.count).toHaveBeenCalledWith({ where: { thread_id } });
            expect(result).toEqual(likeCount);
        });

        it('should handle errors', async () => {
            const id = 1;
            const thread_id = 1;
            const error = new Error('Like update error');
            db.like.update.mockRejectedValueOnce(error);
            console.error = jest.fn();

            const result = await LikeRepository.likeUpdate(id, thread_id);

            expect(db.like.update).toHaveBeenCalledWith(
            { deleted_at: null },
            { where: { id, thread_id }, paranoid: false }
            );
            expect(console.error).toHaveBeenCalledWith(error);
            expect(result).toBeFalsy();
        });
    });

    describe('deleteLikeByUserId', () => {
        it('should delete likes by user ID', async () => {
            const user_id = 1;
            db.like.destroy.mockResolvedValueOnce({});

            await LikeRepository.deleteLikeByUserId(user_id);

            expect(db.like.destroy).toHaveBeenCalledWith({ where: { user_id } });
        });

        it('should handle errors', async () => {
            const user_id = 1;
            const error = new Error('Delete like by user ID error');
            db.like.destroy.mockRejectedValueOnce(error);
            console.error = jest.fn();

            await LikeRepository.deleteLikeByUserId(user_id);

            expect(db.like.destroy).toHaveBeenCalledWith({ where: { user_id } });
            expect(console.error).toHaveBeenCalledWith(error);
        });
    });

    describe('reactivateLike', () => {
        it('should reactivate the like', async () => {
          const user_id = 1;
          const deleted_at = '2023-01-01';
          
          db.like.update = jest.fn().mockResolvedValue(undefined);
    
          await expect(LikeRepository.reactivateLike(user_id, deleted_at)).resolves.toBeUndefined();
    
          expect(db.like.update).toHaveBeenCalledWith({ deleted_at: null }, { where: { user_id, deleted_at }, paranoid: false });
        });
    
        it('should throw an error if reactivation fails', async () => {
          const user_id = 1;
          const deleted_at = '2023-01-01';
          const error = new Error('Reactivate like error');
    
          db.like.update = jest.fn().mockRejectedValue(error);
    
          await expect(LikeRepository.reactivateLike(user_id, deleted_at)).rejects.toThrow(error);
    
          expect(db.like.update).toHaveBeenCalledWith({ deleted_at: null }, { where: { user_id, deleted_at }, paranoid: false });
        });
      });
});
