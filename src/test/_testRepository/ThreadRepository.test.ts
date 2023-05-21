import { Sequelize } from '../../db/models';
import ThreadRepository from '../../repository/ThreadRepository';
const db = require('../../db/models');

jest.mock('../../db/models');

describe('ThreadRepository', () => {
  afterEach(() => {
    jest.resetAllMocks(); // Reset mocks after each test
  });

  describe('getThreads', () => {
    it('should retrieve threads with user, comment, and like information', async () => {
      const findAllMock = jest.spyOn(db.thread, 'findAll').mockResolvedValueOnce([
        {
          id: 1,
          title: 'Thread 1',
          body: 'Body 1',
          slug: 'thread-1',
          updated_at: new Date(),
          user: { id: 1, username: 'user1' },
          comments: [],
          likes: [],
        },
        {
          id: 2,
          title: 'Thread 2',
          body: 'Body 2',
          slug: 'thread-2',
          updated_at: new Date(),
          user: { id: 2, username: 'user2' },
          comments: [],
          likes: [],
        },
      ]);

      const threads = await ThreadRepository.getThreads();

      expect(findAllMock).toHaveBeenCalledWith({
        include: [
          {
            model: db.user,
            attributes: ['id', 'username'],
          },
          {
            model: db.comment,
            attributes: [],
          },
          {
            model: db.like,
            attributes: [],
          },
        ],
        attributes: [
          'id',
          'title',
          'body',
          'slug',
          'updated_at',
          [Sequelize.fn('COUNT', Sequelize.col('comments.id')), 'comment_count'],
          [Sequelize.fn('COUNT', Sequelize.col('likes.id')), 'like_count'],
        ],
        subQuery: false,
        group: ['thread.id', 'user.id'],
      });
      expect(threads).toEqual([
        {
          id: 1,
          title: 'Thread 1',
          body: 'Body 1',
          slug: 'thread-1',
          updated_at: expect.any(Date),
          user: { id: 1, username: 'user1' },
          comments: [],
          likes: [],
        },
        {
          id: 2,
          title: 'Thread 2',
          body: 'Body 2',
          slug: 'thread-2',
          updated_at: expect.any(Date),
          user: { id: 2, username: 'user2' },
          comments: [],
          likes: [],
        },
      ]);
    });

    it('should handle errors', async () => {
      const errorMock = new Error('Database error');
      jest.spyOn(db.thread, 'findAll').mockRejectedValueOnce(errorMock);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const threads = await ThreadRepository.getThreads();

      expect(consoleErrorSpy).toHaveBeenCalledWith(errorMock);
      expect(threads).toBeUndefined();
    });
  });

  describe('addThread', () => {
    it('should create a new thread', async () => {
      const createMock = jest.spyOn(db.thread, 'create').mockResolvedValueOnce({
        id: 1,
        title: 'New Thread',
        body: 'New Body',
      });
  
      const result = await ThreadRepository.addThread(1, 'new-thread', 'New Thread', 'New Body');
  
      expect(createMock).toHaveBeenCalledWith({
        user_id: 1,
        slug: 'new-thread',
        title: 'New Thread',
        body: 'New Body',
      });
      expect(result).toEqual({ id: 1, title: 'New Thread', body: 'New Body' });
    });
  
    it('should handle errors', async () => {
      const errorMock = new Error('Database error');
      jest.spyOn(db.thread, 'create').mockRejectedValueOnce(errorMock);
  
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  
      const result = await ThreadRepository.addThread(1, 'new-thread', 'New Thread', 'New Body');
  
      expect(consoleErrorSpy).toHaveBeenCalledWith(errorMock);
      expect(result).toBeUndefined();
    });
  
    it('should return false when result is falsy', async () => {
      const createMock = jest.spyOn(db.thread, 'create').mockResolvedValueOnce(null); // or any falsy value
      console.error = jest.fn();
  
      const result = await ThreadRepository.addThread(1, 'new-thread', 'New Thread', 'New Body');
  
      expect(createMock).toHaveBeenCalledWith({
        user_id: 1,
        slug: 'new-thread',
        title: 'New Thread',
        body: 'New Body',
      });
      expect(console.error).not.toHaveBeenCalled();
      expect(result).toBeFalsy();
    });
  });
  
  describe('getThreadBySlug', () => {
    it('should return a thread by slug', async () => {
      const findOneMock = jest.spyOn(db.thread, 'findOne').mockResolvedValueOnce({
        id: 1,
        title: 'Thread 1',
        body: 'Body 1',
      });
  
      const thread = await ThreadRepository.getThreadBySlug('thread-slug');
  
      expect(findOneMock).toHaveBeenCalledWith({
        include: [
          {
            model: db.user,
            attributes: ['id', 'username'],
          },
          {
            model: db.comment,
            attributes: ['id', 'comentar', 'created_at'],
            include: {
              model: db.user,
              attributes: ['id', 'username'],
            },
          },
          {
            model: db.like,
            attributes: [],
          },
        ],
        attributes: [
          'id',
          'title',
          'body',
          'slug',
          'updated_at',
          [Sequelize.fn('COUNT', Sequelize.col('likes.id')), 'like_count'],
        ],
        subQuery: false,
        where: { slug: 'thread-slug' },
        group: ['thread.id'],
      });
      expect(thread).toEqual({ id: 1, title: 'Thread 1', body: 'Body 1' });
    });
  
    it('should handle errors', async () => {
      const errorMock = new Error('Database error');
      jest.spyOn(db.thread, 'findOne').mockRejectedValueOnce(errorMock);
  
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  
      const thread = await ThreadRepository.getThreadBySlug('thread-slug');
  
      expect(consoleErrorSpy).toHaveBeenCalledWith(errorMock);
      expect(thread).toBeUndefined();
    });
  
    it('should return false when thread is falsy', async () => {
      const findOneMock = jest.spyOn(db.thread, 'findOne').mockResolvedValueOnce(null); // or any falsy value
      console.error = jest.fn();
  
      const thread = await ThreadRepository.getThreadBySlug('thread-slug');
  
      expect(findOneMock).toHaveBeenCalledWith({
        include: [
          {
            model: db.user,
            attributes: ['id', 'username'],
          },
          {
            model: db.comment,
            attributes: ['id', 'comentar', 'created_at'],
            include: {
              model: db.user,
              attributes: ['id', 'username'],
            },
          },
          {
            model: db.like,
            attributes: [],
          },
        ],
        attributes: [
          'id',
          'title',
          'body',
          'slug',
          'updated_at',
          [Sequelize.fn('COUNT', Sequelize.col('likes.id')), 'like_count'],
        ],
        subQuery: false,
        where: { slug: 'thread-slug' },
        group: ['thread.id'],
      });
      expect(console.error).not.toHaveBeenCalled();
      expect(thread).toBeFalsy();
    });
  });
  

  describe('getThreadById', () => {
    it('should return the thread with the specified ID', async () => {
      // Mock the thread data and the database findOne method
      const threadId = 1;
      const expectedThread = { id: threadId, title: 'Thread 1', body: 'Body 1' };
      db.thread.findOne = jest.fn().mockResolvedValue(expectedThread);

      // Call the getThreadById method
      const thread = await ThreadRepository.getThreadById(threadId);

      // Assertions
      expect(db.thread.findOne).toHaveBeenCalledTimes(1);
      expect(db.thread.findOne).toHaveBeenCalledWith({ where: { id: threadId } });
      expect(thread).toEqual(expectedThread);
    });

    it('should return false if the thread with the specified ID is not found', async () => {
      // Mock the database findOne method to return null
      const threadId = 999; // Assuming this ID doesn't exist
      db.thread.findOne = jest.fn().mockResolvedValue(null);

      // Call the getThreadById method
      const thread = await ThreadRepository.getThreadById(threadId);

      // Assertions
      expect(db.thread.findOne).toHaveBeenCalledTimes(1);
      expect(db.thread.findOne).toHaveBeenCalledWith({ where: { id: threadId } });
      expect(thread).toBe(false);
    });

    it('should handle errors and log them to the console', async () => {
      // Mock the database findOne method to throw an error
      const threadId = 1;
      const expectedError = new Error('Database error');
      db.thread.findOne = jest.fn().mockRejectedValue(expectedError);

      // Mock the console.error method to capture the error
      console.error = jest.fn();

      // Call the getThreadById method
      const thread = await ThreadRepository.getThreadById(threadId);

      // Assertions
      expect(db.thread.findOne).toHaveBeenCalledTimes(1);
      expect(db.thread.findOne).toHaveBeenCalledWith({ where: { id: threadId } });
      expect(thread).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(expectedError);
    });
  });

  describe('updateThread', () => {
    it('should update the thread with the specified ID', async () => {
      // Mock the thread update method
      const threadId = 1;
      const updatedTitle = 'Updated Title';
      const updatedBody = 'Updated Body';
      db.thread.update = jest.fn().mockResolvedValue([1]); // Mock that 1 row was affected

      // Call the updateThread method
      await ThreadRepository.updateThread(threadId, updatedTitle, updatedBody);

      // Assertions
      expect(db.thread.update).toHaveBeenCalledTimes(1);
      expect(db.thread.update).toHaveBeenCalledWith(
        { title: updatedTitle, body: updatedBody },
        { where: { id: threadId } }
      );
    });

    it('should handle errors and log them to the console', async () => {
      // Mock the thread update method to throw an error
      const threadId = 1;
      const updatedTitle = 'Updated Title';
      const updatedBody = 'Updated Body';
      const expectedError = new Error('Database error');
      db.thread.update = jest.fn().mockRejectedValue(expectedError);

      // Mock the console.error method to capture the error
      console.error = jest.fn();

      // Call the updateThread method
      await ThreadRepository.updateThread(threadId, updatedTitle, updatedBody);

      // Assertions
      expect(db.thread.update).toHaveBeenCalledTimes(1);
      expect(db.thread.update).toHaveBeenCalledWith(
        { title: updatedTitle, body: updatedBody },
        { where: { id: threadId } }
      );
      expect(console.error).toHaveBeenCalledWith(expectedError);
    });
  });

  describe('deleteThread', () => {
    it('should delete the thread with the specified ID', async () => {
      // Mock the thread destroy method
      const threadId = 1;
      db.thread.destroy = jest.fn().mockResolvedValue(1); // Mock that 1 row was affected

      // Call the deleteThread method
      await ThreadRepository.deleteThread(threadId);

      // Assertions
      expect(db.thread.destroy).toHaveBeenCalledTimes(1);
      expect(db.thread.destroy).toHaveBeenCalledWith({
        where: { id: threadId },
      });
    });

    it('should handle errors and log them to the console', async () => {
      // Mock the thread destroy method to throw an error
      const threadId = 1;
      const expectedError = new Error('Database error');
      db.thread.destroy = jest.fn().mockRejectedValue(expectedError);

      // Mock the console.error method to capture the error
      console.error = jest.fn();

      // Call the deleteThread method
      await ThreadRepository.deleteThread(threadId);

      // Assertions
      expect(db.thread.destroy).toHaveBeenCalledTimes(1);
      expect(db.thread.destroy).toHaveBeenCalledWith({
        where: { id: threadId },
      });
      expect(console.error).toHaveBeenCalledWith(expectedError);
    });
  });

  describe('deleteThreadByUserId', () => {
    it('should delete all threads associated with the specified user ID', async () => {
      // Mock the thread destroy method
      const userId = 1;
      db.thread.destroy = jest.fn().mockResolvedValue(2); // Mock that 2 rows were affected

      // Call the deleteThreadByUserId method
      await ThreadRepository.deleteThreadByUserId(userId);

      // Assertions
      expect(db.thread.destroy).toHaveBeenCalledTimes(1);
      expect(db.thread.destroy).toHaveBeenCalledWith({
        where: { user_id: userId },
      });
    });

    it('should handle errors and log them to the console', async () => {
      // Mock the thread destroy method to throw an error
      const userId = 1;
      const expectedError = new Error('Database error');
      db.thread.destroy = jest.fn().mockRejectedValue(expectedError);

      // Mock the console.error method to capture the error
      console.error = jest.fn();

      // Call the deleteThreadByUserId method
      await ThreadRepository.deleteThreadByUserId(userId);

      // Assertions
      expect(db.thread.destroy).toHaveBeenCalledTimes(1);
      expect(db.thread.destroy).toHaveBeenCalledWith({
        where: { user_id: userId },
      });
      expect(console.error).toHaveBeenCalledWith(expectedError);
    });
  });

  describe('reactivateThread', () => {
    it('should reactivate a thread by setting the deleted_at field to null', async () => {
      // Mock the thread update method
      const userId = 1;
      const deletedAt = '2023-05-20 12:00:00';
      db.thread.update = jest.fn().mockResolvedValue([1]); // Mock that 1 row was affected

      // Call the reactivateThread method
      await ThreadRepository.reactivateThread(userId, deletedAt);

      // Assertions
      expect(db.thread.update).toHaveBeenCalledTimes(1);
      expect(db.thread.update).toHaveBeenCalledWith(
        { deleted_at: null },
        { where: { user_id: userId, deleted_at: deletedAt }, paranoid: false }
      );
    });

    it('should handle errors, log them to the console, and rethrow the error', async () => {
      // Mock the thread update method to throw an error
      const userId = 1;
      const deletedAt = '2023-05-20 12:00:00';
      const expectedError = new Error('Database error');
      db.thread.update = jest.fn().mockRejectedValue(expectedError);

      // Mock the console.error method to capture the error
      console.error = jest.fn();

      // Call the reactivateThread method and catch the error
      let caughtError;
      try {
        await ThreadRepository.reactivateThread(userId, deletedAt);
      } catch (error) {
        caughtError = error;
      }

      // Assertions
      expect(db.thread.update).toHaveBeenCalledTimes(1);
      expect(db.thread.update).toHaveBeenCalledWith(
        { deleted_at: null },
        { where: { user_id: userId, deleted_at: deletedAt }, paranoid: false }
      );
      expect(console.error).toHaveBeenCalledWith(expectedError);
      expect(caughtError).toEqual(expectedError);
    });
  });
});
