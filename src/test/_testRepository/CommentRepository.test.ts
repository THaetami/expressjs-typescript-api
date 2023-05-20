const db = require('../../db/models');
import CommentRepository from "../../repository/CommentRepository";

jest.mock('../../db/models', () => {
  const mockComment = {
    create: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn(),
  };

  return {
    comment: mockComment,
  };
});

describe('CommentRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addComment', () => {
    it('should add a new comment', async () => {
      const user_id = 1;
      const thread_id = 1;
      const comentar = 'This is a comment';
      const comment = { id: 1, user_id, thread_id, comentar };
      db.comment.create.mockResolvedValueOnce(comment);

      const result = await CommentRepository.addComment(user_id, thread_id, comentar);

      expect(db.comment.create).toHaveBeenCalledWith({ user_id, thread_id, comentar });
      expect(result).toEqual(comment);
    });

    it('should handle errors', async () => {
      const user_id = 1;
      const thread_id = 1;
      const comentar = 'This is a comment';
      const error = new Error('Add comment error');
      db.comment.create.mockRejectedValueOnce(error);
      console.error = jest.fn();

      const result = await CommentRepository.addComment(user_id, thread_id, comentar);

      expect(db.comment.create).toHaveBeenCalledWith({ user_id, thread_id, comentar });
      expect(console.error).toHaveBeenCalledWith(error);
      expect(result).toBeFalsy();
    });
  });

  describe('getCommentById', () => {
    it('should return a comment by ID if found', async () => {
      const id = 1;
      const comment = { id, user_id: 1, thread_id: 1, commentar: 'This is a comment' };
      db.comment.findOne.mockResolvedValueOnce(comment);

      const result = await CommentRepository.getCommentById(id);

      expect(db.comment.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(comment);
    });

    it('should return false if comment not found', async () => {
      const id = 1;
      db.comment.findOne.mockResolvedValueOnce(null);

      const result = await CommentRepository.getCommentById(id);

      expect(db.comment.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toBeFalsy();
    });

    it('should handle errors', async () => {
      const id = 1;
      const error = new Error('Get comment error');
      db.comment.findOne.mockRejectedValueOnce(error);
      console.error = jest.fn();

      const result = await CommentRepository.getCommentById(id);

      expect(db.comment.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(console.error).toHaveBeenCalledWith(error);
      expect(result).toBeFalsy();
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment by ID', async () => {
      const id = 1;

      await CommentRepository.deleteComment(id);

      expect(db.comment.destroy).toHaveBeenCalledWith({ where: { id } });
    });

    it('should handle errors', async () => {
      const id = 1;
      const error = new Error('Delete comment error');
      db.comment.destroy.mockRejectedValueOnce(error);
      console.error = jest.fn();

      await CommentRepository.deleteComment(id);

      expect(db.comment.destroy).toHaveBeenCalledWith({ where: { id } });
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteCommentByUserId', () => {
    it('should delete comments by user ID', async () => {
      const user_id = 1;

      await CommentRepository.deleteCommentByUserId(user_id);

      expect(db.comment.destroy).toHaveBeenCalledWith({ where: { user_id } });
    });

    it('should handle errors', async () => {
      const user_id = 1;
      const error = new Error('Delete comment by user ID error');
      db.comment.destroy.mockRejectedValueOnce(error);
      console.error = jest.fn();

      await CommentRepository.deleteCommentByUserId(user_id);

      expect(db.comment.destroy).toHaveBeenCalledWith({ where: { user_id } });
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe('reactivateComment', () => {
    it('should reactivate a comment', async () => {
      const user_id = 1;
      const deleted_at = '2023-05-20';

      await CommentRepository.reactivateComment(user_id, deleted_at);

      expect(db.comment.update).toHaveBeenCalledWith({ deleted_at: null }, { where: { user_id, deleted_at }, paranoid: false });
    });

    it('should handle errors', async () => {
      const user_id = 1;
      const deleted_at = '2023-05-20';
      const error = new Error('Reactivate comment error');
      db.comment.update.mockRejectedValueOnce(error);
      console.error = jest.fn();

      await expect(CommentRepository.reactivateComment(user_id, deleted_at)).rejects.toThrow(error);

      expect(db.comment.update).toHaveBeenCalledWith({ deleted_at: null }, { where: { user_id, deleted_at }, paranoid: false });
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });
});

