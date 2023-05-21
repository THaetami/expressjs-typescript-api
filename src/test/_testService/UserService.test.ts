import { Request, Response } from "express";
import UserRepository from "../../repository/UserRepository";
import AuthenticationService from "../../service/AuthenticationService";
import AddedUser from "../../entities/AddedUser";
import ThreadRepository from "../../repository/ThreadRepository";
import GettedUser from "../../entities/GetttedUser";
import CommentRepository from "../../repository/CommentRepository";
import LikeRepository from "../../repository/LikeRepository";
import UserService from "../../service/UserService";

describe("UserService", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {} as Response;
    req.app = {} as any;
    req.app.locals = {} as any;
  });

  describe("constructor", () => {
    it("should initialize credential, body, and params properties", () => {
      const user = { id: 1 };
      req.app.locals.credential = { user };
      const userService = new UserService(req, res);
      expect(userService.credential).toEqual(user);
      expect(userService.body).toEqual(req.body);
      expect(userService.params).toEqual(req.params);
    });

    it("should set credential to null if req.app.locals.credential is not defined", () => {
      const userService = new UserService(req, res);
      expect(userService.credential).toBeNull();
    });
  });

  describe("getUsers", () => {
    it("should return users from UserRepository", async () => {
      const users = [{ id: 1, username: "user1" }, { id: 2, username: "user2" }];
      UserRepository.getUsers = jest.fn().mockResolvedValue(users);
      const userService = new UserService(req, res);
      const result = await userService.getUsers();
      expect(UserRepository.getUsers).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe("addUser", () => {
    it("should add a new user and return success response", async () => {
      const username = "newuser";
      const password = "password";
      const hashedPassword = "hashedPassword";
      const addedUser = { id: 1, username };
      const result = { statusCode: 201, status: "success", addedUser: new AddedUser(addedUser) };

      req.body = { username, password };
      AuthenticationService.passwordHash = jest.fn().mockResolvedValue(hashedPassword);
      UserRepository.addUser = jest.fn().mockResolvedValue(addedUser);

      const userService = new UserService(req, res);
      const response = await userService.addUser();

      expect(AuthenticationService.passwordHash).toHaveBeenCalledWith(password);
      expect(UserRepository.addUser).toHaveBeenCalledWith(username, hashedPassword);
      expect(response).toEqual(result);
    });

    it("should return fail response if adding user fails", async () => {
      const username = "newuser";
      const password = "password";

      req.body = { username, password };
      UserRepository.addUser = jest.fn().mockResolvedValue(null);

      const userService = new UserService(req, res);
      const response = await userService.addUser();

      expect(UserRepository.addUser).toHaveBeenCalledWith(username, expect.any(String));
      expect(response).toEqual({ statusCode: 400, status: "fail", message: "user gagal ditambahkan" });
    });
  });

  describe("getUser", () => {
    it("should return the user if found and authenticated user matches", async () => {
        const userId = "1";
        const id = 1;
        const user = { id, username: "user1" };
        const gettedUser = new GettedUser(user as { id: number, username: string, createdAt: Date });
        req.params = { id: userId };
        req.app.locals.credential = { id: id as number };
        UserRepository.getUserById = jest.fn().mockResolvedValue(user);
      
        const userService = new UserService(req, res);
        userService.credential = req.app.locals.credential; // Memberikan nilai pada properti credential
      
        const response = await userService.getUser();
      
        expect(UserRepository.getUserById).toHaveBeenCalledWith(Number(userId));
        expect(response).toEqual({ statusCode: 200, status: "success", user: gettedUser });
    });
      
    it("should return fail response if user is not found", async () => {
        const userId = "1";
        const user = null; // Simulasikan user yang tidak ditemukan
        req.params = { id: userId };
        req.app.locals.credential = null; // Set credential sebagai null
        UserRepository.getUserById = jest.fn().mockResolvedValue(user);
      
        const userService = new UserService(req, res);
        userService.credential = req.app.locals.credential || {}; // Assign credential sebagai objek kosong jika null
      
        const response = await userService.getUser();
      
        expect(UserRepository.getUserById).toHaveBeenCalledWith(Number(userId));
        expect(response).toEqual({ statusCode: 404, status: "fail", message: "user tidak ditemukan" });
    });
      

    it("should return fail response if authenticated user does not match", async () => {
        const userId = "1";
        const id = 1;
        const authenticatedUserId = 2; // User yang terautentikasi dengan ID yang berbeda
        const user = { id, username: "user1" };
        req.params = { id: userId };
        req.app.locals.credential = { id: authenticatedUserId }; // Mengatur authenticated user ID yang berbeda
        UserRepository.getUserById = jest.fn().mockResolvedValue(user);
      
        const userService = new UserService(req, res);
        userService.credential = req.app.locals.credential; // Memberikan nilai pada properti credential
      
        const response = await userService.getUser();
      
        expect(UserRepository.getUserById).toHaveBeenCalledWith(Number(userId));
        expect(response).toEqual({ statusCode: 403, status: "fail", message: "anda tidak berhak mengakses resource ini" });
    });
      
  });

  describe("updateUser", () => {
    it("should update the username, password and return success response", async () => {
        const id = 1;
        const user = { id, username: "user1" };
        const updatedUsername = "updated_user1";
        const updatedPassword = "hashedPassword";
        req.body = { username: updatedUsername, password: updatedPassword };
        req.app.locals.credential = { id }; // Mengatur credential dengan ID yang valid
        UserRepository.getUserById = jest.fn().mockResolvedValue(user);
        UserRepository.updateUserById = jest.fn().mockResolvedValue(undefined);
      
        const userService = new UserService(req, res);
        userService.credential = req.app.locals.credential; // Memberikan nilai pada properti credential
      
        const response = await userService.updateUser();
      
        expect(UserRepository.getUserById).toHaveBeenCalledWith(id);
        expect(UserRepository.updateUserById).toHaveBeenCalledWith(id, updatedUsername, updatedPassword);
        expect(response).toEqual({ statusCode: 201, status: "success", message: `profile ${user.username} berhasil diupdate` });
    });

    it("should update the username and return success response", async () => {
        const id = 1;
        const user = { id, username: "user1" };
        const updatedUsername = "updated_user1";
        const updatedPassword = undefined;

        req.body = { username: updatedUsername, password: updatedPassword };
        req.app.locals.credential = { id }; // Mengatur credential dengan ID yang valid
        UserRepository.getUserById = jest.fn().mockResolvedValue(user);
        UserRepository.updateUserById = jest.fn().mockResolvedValue(undefined);
      
        const userService = new UserService(req, res);
        userService.credential = req.app.locals.credential; // Memberikan nilai pada properti credential
      
        const response = await userService.updateUser();
      
        expect(UserRepository.getUserById).toHaveBeenCalledWith(id);
        expect(UserRepository.updateUserById).toHaveBeenCalledWith(id, updatedUsername, updatedPassword);
        expect(response).toEqual({ statusCode: 201, status: "success", message: `profile ${user.username} berhasil diupdate` });
    });
      
    it("should return fail response if user is not found", async () => {
        const id = 1;
        const user = null;
        const updatedUsername = "updated_user1";
        const updatedPassword = "updated_password";
        req.body = { username: updatedUsername, password: updatedPassword };
        req.app.locals.credential = { id }; // Mengatur credential dengan ID yang valid
        UserRepository.getUserById = jest.fn().mockResolvedValue(user);
      
        const userService = new UserService(req, res);
        userService.credential = req.app.locals.credential; // Memberikan nilai pada properti credential
      
        const response = await userService.updateUser();
      
        expect(UserRepository.getUserById).toHaveBeenCalledWith(id);
        expect(response).toEqual({ statusCode: 404, status: "fail", message: "user tidak ditemukan" });
    });  
  });

  describe("deleteUserById", () => {
    it("should delete the user and associated data and return success response", async () => {
      const userId = "1";
      const user = { id: 1, username: "user1", is_admin: false };

      req.params = { id: userId };
      UserRepository.getUserById = jest.fn().mockResolvedValue(user);
      UserRepository.deleteUser = jest.fn();
      ThreadRepository.deleteThreadByUserId = jest.fn();
      CommentRepository.deleteCommentByUserId = jest.fn();
      LikeRepository.deleteLikeByUserId = jest.fn();

      const userService = new UserService(req, res);
      const response = await userService.deleteUserById();

      expect(UserRepository.getUserById).toHaveBeenCalledWith(Number(userId));
      expect(UserRepository.deleteUser).toHaveBeenCalledWith(user.id);
      expect(ThreadRepository.deleteThreadByUserId).toHaveBeenCalledWith(user.id);
      expect(CommentRepository.deleteCommentByUserId).toHaveBeenCalledWith(user.id);
      expect(LikeRepository.deleteLikeByUserId).toHaveBeenCalledWith(user.id);
      expect(response).toEqual({ statusCode: 201, status: "success", message: `user ${user.username}, berhasil dinonaktifkan` });
    });

    it("should return fail response if user is not found", async () => {
      const userId = "1";
      req.params = { id: userId };
      UserRepository.getUserById = jest.fn().mockResolvedValue(null);

      const userService = new UserService(req, res);
      const response = await userService.deleteUserById();

      expect(UserRepository.getUserById).toHaveBeenCalledWith(Number(userId));
      expect(response).toEqual({ statusCode: 404, status: "fail", message: "user tidak ditemukan" });
    });

    it("should return fail response if user is an admin", async () => {
      const userId = "1";
      const user = { id: 1, username: "user1", is_admin: true };

      req.params = { id: userId };
      UserRepository.getUserById = jest.fn().mockResolvedValue(user);

      const userService = new UserService(req, res);
      const response = await userService.deleteUserById();

      expect(UserRepository.getUserById).toHaveBeenCalledWith(Number(userId));
      expect(response).toEqual({ statusCode: 404, status: "fail", message: "user tidak ditemukan" });
    });
  });

  describe("activatedUser", () => {
    it("should return fail response if user is not found", async () => {
      const username = "user1";
      req.params = { username };

      UserRepository.checkUsername = jest.fn().mockResolvedValue(null);

      const userService = new UserService(req, res);
      const response = await userService.activatedUser();

      expect(UserRepository.checkUsername).toHaveBeenCalledWith(username);
      expect(response).toEqual({
        statusCode: 404,
        status: "fail",
        message: "user tidak ditemukan",
      });
    });

    it("should return fail response if user is still active", async () => {
      const username = "user1";
      const user = { username, deletedAt: null };
      req.params = { username };

      UserRepository.checkUsername = jest.fn().mockResolvedValue(user);

      const userService = new UserService(req, res);
      const response = await userService.activatedUser();

      expect(UserRepository.checkUsername).toHaveBeenCalledWith(username);
      expect(response).toEqual({
        statusCode: 422,
        status: "fail",
        message: "user masih active",
      });
    });

    it("should reactivate the user and associated data and return success response", async () => {
        const id: number = 1;
        const username: string = "user1";
        const deletedAt: Date = new Date();
        const user = { id, username, deletedAt };
        req.params = { username };

        UserRepository.checkUsername = jest.fn().mockResolvedValue(user);
        UserRepository.reactivateUser = jest.fn().mockResolvedValue(undefined);
        ThreadRepository.reactivateThread = jest.fn().mockResolvedValue(undefined);
        CommentRepository.reactivateComment = jest.fn().mockResolvedValue(undefined);
        LikeRepository.reactivateLike = jest.fn().mockResolvedValue(undefined);

        const userService = new UserService(req, res);
        const response = await userService.activatedUser();

        expect(UserRepository.checkUsername).toHaveBeenCalledWith(username);
        expect(UserRepository.reactivateUser).toHaveBeenCalledWith(username);
        expect(ThreadRepository.reactivateThread).toHaveBeenCalledWith(user.id, user.deletedAt);
        expect(CommentRepository.reactivateComment).toHaveBeenCalledWith(user.id, user.deletedAt);
        expect(LikeRepository.reactivateLike).toHaveBeenCalledWith(user.id, user.deletedAt);
        expect(response).toEqual({
            statusCode: 201,
            status: "success",
            message: "user berhasil diaktifkan",
        });
    });
  });
});
