import { Request, Response } from "express";
import CommentRepository from "../../repository/CommentRepository";
import ThreadRepository from "../../repository/ThreadRepository";
import AddedComment from "../../entities/AddedComment";
import CommentService from "../../service/CommentService";

describe("CommentService", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      app: {
        locals: {
          credential: {
            user: {
              id: 1,
            },
          },
        },
      } as any, // Menambahkan tipe 'any' untuk menghindari kesalahan tipe
      body: {},
      params: {
        threadId: "1",
        commentId: "1",
      },
    };

    res = {};
  });

  describe("addComment", () => {
    it("should return a failure response if thread is not found", async () => {
      // Arrange
      ThreadRepository.getThreadById = jest.fn().mockResolvedValue(null);

      // Act
      const service = new CommentService(req as Request, res as Response);
      const result = await service.addComment();

      // Assert
      expect(result).toEqual({
        statusCode: 404,
        status: "fail",
        message: "thread tidak ditemukan",
      });
      expect(ThreadRepository.getThreadById).toHaveBeenCalledWith(1);
    });

    it("should return a failure response if comment fails to be added", async () => {
      // Arrange
      const thread = {
        id: 1,
      };

      ThreadRepository.getThreadById = jest.fn().mockResolvedValue(thread);
      CommentRepository.addComment = jest.fn().mockResolvedValue(null);

      // Act
      const service = new CommentService(req as Request, res as Response);
      const result = await service.addComment();

      // Assert
      expect(result).toEqual({
        statusCode: 400,
        status: "fail",
        message: "thread gagal ditambahkan",
      });
      expect(ThreadRepository.getThreadById).toHaveBeenCalledWith(1);
      expect(CommentRepository.addComment).toHaveBeenCalledWith(1, 1, undefined);
    });

    it("should return a success response when a comment is added", async () => {
      // Arrange
      const thread = {
        id: 1,
      };

      const addedComment = {
        id: 1,
        comentar: "This is a comment",
        createdAt: new Date()
      };

      ThreadRepository.getThreadById = jest.fn().mockResolvedValue(thread);
      CommentRepository.addComment = jest.fn().mockResolvedValue(addedComment);

      // Act
      const service = new CommentService(req as Request, res as Response);
      const result = await service.addComment();

      // Assert
      expect(result).toEqual({
        statusCode: 201,
        status: "success",
        addedComment: new AddedComment(addedComment),
      });
      expect(ThreadRepository.getThreadById).toHaveBeenCalledWith(1);
      expect(CommentRepository.addComment).toHaveBeenCalledWith(1, 1, undefined);
    });
  });

  describe("deleteComment", () => {
    it("should return a failure response if thread is not found", async () => {
      // Arrange
      ThreadRepository.getThreadById = jest.fn().mockResolvedValue(null);

      // Act
      const service = new CommentService(req as Request, res as Response);
      const result = await service.deleteComment();

      // Assert
      expect(result).toEqual({
        statusCode: 404,
        status: "fail",
        message: "thread tidak ditemukan",
      });
      expect(ThreadRepository.getThreadById).toHaveBeenCalledWith(1);
    });

    it("should return a failure response if comment is not found", async () => {
      // Arrange
      const thread = {
        id: 1,
      };

      ThreadRepository.getThreadById = jest.fn().mockResolvedValue(thread);
      CommentRepository.getCommentById = jest.fn().mockResolvedValue(null);

      // Act
      const service = new CommentService(req as Request, res as Response);
      const result = await service.deleteComment();

      // Assert
      expect(result).toEqual({
        statusCode: 404,
        status: "fail",
        message: "comentar tidak ditemukan",
      });
      expect(ThreadRepository.getThreadById).toHaveBeenCalledWith(1);
      expect(CommentRepository.getCommentById).toHaveBeenCalledWith(1);
    });

    it("should return a failure response if user does not have access to delete the comment", async () => {
      // Arrange
      const thread = {
        id: 1,
      };

      const comment = {
        id: 1,
        user_id: 2,
        thread_id: 1,
      };

      ThreadRepository.getThreadById = jest.fn().mockResolvedValue(thread);
      CommentRepository.getCommentById = jest.fn().mockResolvedValue(comment);

      // Act
      const service = new CommentService(req as Request, res as Response);
      const result = await service.deleteComment();

      // Assert
      expect(result).toEqual({
        statusCode: 403,
        status: "fail",
        message: "anda tidak berhak mengakses resource ini",
      });
      expect(ThreadRepository.getThreadById).toHaveBeenCalledWith(1);
      expect(CommentRepository.getCommentById).toHaveBeenCalledWith(1);
    });

    it("should delete the comment and return a success response", async () => {
      // Arrange
      const thread = {
        id: 1,
      };

      const comment = {
        id: 1,
        user_id: 1,
        thread_id: 1,
      };

      ThreadRepository.getThreadById = jest.fn().mockResolvedValue(thread);
      CommentRepository.getCommentById = jest.fn().mockResolvedValue(comment);
      CommentRepository.deleteComment = jest.fn();

      // Act
      const service = new CommentService(req as Request, res as Response);
      const result = await service.deleteComment();

      // Assert
      expect(result).toEqual({
        statusCode: 201,
        status: "success",
        message: "comment berhasil hapus",
      });
      expect(ThreadRepository.getThreadById).toHaveBeenCalledWith(1);
      expect(CommentRepository.getCommentById).toHaveBeenCalledWith(1);
      expect(CommentRepository.deleteComment).toHaveBeenCalledWith(1);
    });
  });
});
