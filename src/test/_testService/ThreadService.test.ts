import { Response, Request } from "express";
import ThreadRepository from "../../repository/ThreadRepository";
import ThreadService from "../../service/ThreadService";
import UserService from "../../service/UserService";
import AddedThread from "../../entities/AddedThread";
import AuthenticationService from "../../service/AuthenticationService";
import GettedThread from "../../entities/GettedThread";
const { v4: uuidv4 } = require('uuid');

jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('mocked-slug'),
  }));

describe("ThreadService", () => {
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

    describe("getThreads", () => {
        it("should return threads from ThreadRepository", async () => {
            const threads = [
                {
                    "id": 1,
                    "title": "ramon",
                    "body": "tamon",
                    "slug": "32ca87ee-3759-4171-80af-51753a34f05d",
                    "updated_at": "2023-05-22T21:48:29.000Z",
                    "comment_count": 1,
                    "like_count": 1,
                    "user": {
                        "id": 2,
                        "username": "encih12"
                    }
                },
                {
                    "id": 2,
                    "title": "thread 3",
                    "body": "thread 3",
                    "slug": "0aeaf4e2-f37a-4027-8c4a-5736960fffff",
                    "updated_at": "2023-05-22T21:48:29.000Z",
                    "comment_count": 0,
                    "like_count": 0,
                    "user": {
                        "id": 2,
                        "username": "encih12"
                    }
                }
            ];
            ThreadRepository.getThreads = jest.fn().mockResolvedValue(threads);
            const threadService = new ThreadService(req as Request, res as Response);
            const result = await threadService.getThreads();
            expect(ThreadRepository.getThreads).toHaveBeenCalled();
            expect(result).toEqual(threads);
        });
    });

    describe("addThread", () => {
        it("should add a new thread and return success response", async () => {
          const title = "new thread";
          const id = 1;
          const body = "body new thread";
          const slug = uuidv4();
          const addedThread = { id, title, body, slug };
          const result = { statusCode: 201, status: "success", addedThread: new AddedThread(addedThread) };
    
          req.body = { title, body };
          ThreadRepository.addThread = jest.fn().mockResolvedValue(addedThread);
    
          const threadService = new ThreadService(req as Request, res as Response);
          const response = await threadService.addThread();
    
          expect(ThreadRepository.addThread).toHaveBeenCalledWith(id, slug, title, body);
          expect(response).toEqual(result);
        });
    
        it("should return fail response if add thread fails", async () => {
            const title = "new thread";
            const id = 1;
            const body = "body new thread";
            const slug = uuidv4();
    
          req.body = { title, body };
          ThreadRepository.addThread = jest.fn().mockResolvedValue(null);
    
          const threadService = new ThreadService(req as Request, res as Response);
          const response = await threadService.addThread();
    
          expect(ThreadRepository.addThread).toHaveBeenCalledWith(id, slug, title, body);
          expect(response).toEqual({ statusCode: 400, status: "fail", message: "thread gagal ditambahkan" });
        });
    });
    
    describe("getThreadById", () => {
    it("should return the thread with a success response if the thread is found and the user has access", async () => {
      const threadId: number = 1;
      const id = 1;
      const thread = {
        id: threadId,
        slug: "sample-slug",
        title: "Test Thread",
        body: "This is a test thread",
        user_id: id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      ThreadRepository.getThreadById = jest.fn().mockResolvedValue(thread);

      const expectedResponse = {
        statusCode: 200,
        status: "success",
        thread: new GettedThread(thread),
      };

      const threadService = new ThreadService(req as Request, res as Response);
      const response = await threadService.getThreadById();

      expect(ThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
      expect(response).toEqual(expectedResponse);
    });

    it("should return a not found response if the thread is not found", async () => {
      const threadId = 1;

      ThreadRepository.getThreadById = jest.fn().mockResolvedValue(null);

      const expectedResponse = {
        statusCode: 404,
        status: "fail",
        message: "thread tidak ditemukan",
      };

      const threadService = new ThreadService(req as Request, res as Response);
      const response = await threadService.getThreadById();

      expect(ThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
      expect(response).toEqual(expectedResponse);
    });

    it("should return a forbidden response if the user does not have access to the thread", async () => {
      const threadId = 1;
      const id = 2;
      const thread = {
        id: threadId,
        slug: "sample-slug",
        title: "Test Thread",
        body: "This is a test thread",
        user_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      ThreadRepository.getThreadById = jest.fn().mockResolvedValue(thread);

      const expectedResponse = {
        statusCode: 403,
        status: "fail",
        message: "anda tidak berhak mengakses resource ini",
      };

      const threadService = new ThreadService(req as Request, res as Response);
      const response = await threadService.getThreadById();

      expect(ThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
      expect(response).toEqual(expectedResponse);
    });
  });
});
