import { Request, Response } from "express";
import ThreadRepository from "../../repository/ThreadRepository";
import LikeRepository from "../../repository/LikeRepository";
import LikeService from "../../service/LikeService";

describe("LikeService", () => {
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
      } as any,
      body: {},
      params: {
        threadId: "1",
      },
    };

    res = {};
  });


  describe("likeUnlike", () => {
    it("should return a failure response if thread is not found", async () => {
      // Arrange
      ThreadRepository.getThreadById = jest.fn().mockResolvedValue(null);

      // Act
      const service = new LikeService(req as Request, res as Response);
      const result = await service.likeUnlike();

      // Assert
      expect(result).toEqual({
        statusCode: 404,
        status: "fail",
        message: "thread tidak ditemukan",
      });
      expect(ThreadRepository.getThreadById).toHaveBeenCalledWith(1);
    });

    it("should return a success response when liking a thread", async () => {
      // Arrange
      const thread = {
        id: 1,
      };

      ThreadRepository.getThreadById = jest.fn().mockResolvedValue(thread);
      LikeRepository.checkLikesThread = jest.fn().mockResolvedValue(null);
      LikeRepository.likeAdd = jest.fn().mockResolvedValue(1);

      // Act
      const service = new LikeService(req as Request, res as Response);
      const result = await service.likeUnlike();

      // Assert
      expect(result).toEqual({
        statusCode: 201,
        status: "success",
        message: "like thread berhasil",
        likeCount: 1,
      });
      expect(ThreadRepository.getThreadById).toHaveBeenCalledWith(1);
      expect(LikeRepository.checkLikesThread).toHaveBeenCalledWith(1, 1);
      expect(LikeRepository.likeAdd).toHaveBeenCalledWith(1, 1);
    });

    it("should return a success response when unliking a thread", async () => {
      // Arrange
      const thread = {
        id: 1,
      };

      const like = {
        id: 1,
        deletedAt: null,
      };

      ThreadRepository.getThreadById = jest.fn().mockResolvedValue(thread);
      LikeRepository.checkLikesThread = jest.fn().mockResolvedValue(like);
      LikeRepository.unlikeDelete = jest.fn().mockResolvedValue(0);

      // Act
      const service = new LikeService(req as Request, res as Response);
      const result = await service.likeUnlike();

      // Assert
      expect(result).toEqual({
        statusCode: 201,
        status: "success",
        message: "unlike thread berhasil",
        likeCount: 0,
      });
      expect(ThreadRepository.getThreadById).toHaveBeenCalledWith(1);
      expect(LikeRepository.checkLikesThread).toHaveBeenCalledWith(1, 1);
      expect(LikeRepository.unlikeDelete).toHaveBeenCalledWith(1, 1);
    });

    it("should return a success response when updating a liked thread", async () => {
      // Arrange
      const thread = {
        id: 1,
      };

      const like = {
        id: 1,
        deletedAt: new Date(),
      };

      ThreadRepository.getThreadById = jest.fn().mockResolvedValue(thread);
      LikeRepository.checkLikesThread = jest.fn().mockResolvedValue(like);
      LikeRepository.likeUpdate = jest.fn().mockResolvedValue(1);

      // Act
      const service = new LikeService(req as Request, res as Response);
      const result = await service.likeUnlike();

      // Assert
      expect(result).toEqual({
        statusCode: 201,
        status: "success",
        message: "like thread berhasil",
        likeCount: 1,
      });
      expect(ThreadRepository.getThreadById).toHaveBeenCalledWith(1);
      expect(LikeRepository.checkLikesThread).toHaveBeenCalledWith(1, 1);
      expect(LikeRepository.likeUpdate).toHaveBeenCalledWith(1, 1);
    });
  });
});
