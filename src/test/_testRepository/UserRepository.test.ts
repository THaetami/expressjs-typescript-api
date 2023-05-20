const db = require('../../db/models')
import UserRepository from "../../repository/UserRepository";

jest.mock('../../db/models', () => {
  const mockUser = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  return {
    user: mockUser,
  };
});

describe("UserRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsers", () => {
    test("should return list of users", async () => {
      const users = [
        { id: 1, username: "user1", created_at: new Date(), updated_at: new Date(), deleted_at: null },
        { id: 2, username: "user2", created_at: new Date(), updated_at: new Date(), deleted_at: null },
      ];

      db.user.findAll = jest.fn().mockResolvedValue(users);

      const result = await UserRepository.getUsers();

      expect(db.user.findAll).toHaveBeenCalledWith({
        paranoid: false,
        attributes: ["id", "username", "created_at", "updated_at", "deleted_at"],
        where: { is_admin: false },
      });
      expect(result).toEqual(users);
    });

    test("should handle error and log it", async () => {
      const error = new Error("Test error");
      console.error = jest.fn();

      db.user.findAll = jest.fn().mockRejectedValue(error);

      await UserRepository.getUsers();

      expect(db.user.findAll).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getUserById", () => {
    test("should return user by ID if found", async () => {
      const id = 1;
      const user = { id, username: "user1", created_at: new Date(), updated_at: new Date(), deleted_at: null };

      db.user.findOne = jest.fn().mockResolvedValue(user);

      const result = await UserRepository.getUserById(id);

      expect(db.user.findOne).toHaveBeenCalledWith({
        where: { id },
        attributes: ["id", "username", "created_at", "updated_at", "deleted_at", "is_admin"],
      });
      expect(result).toEqual(user);
    });

    test("should return false if user not found", async () => {
      const id = 1;

      db.user.findOne = jest.fn().mockResolvedValue(null);

      const result = await UserRepository.getUserById(id);

      expect(db.user.findOne).toHaveBeenCalledWith({
        where: { id },
        attributes: ["id", "username", "created_at", "updated_at", "deleted_at", "is_admin"],
      });
      expect(result).toBe(false);
    });

    test("should handle error and log it", async () => {
      const id = 1;
      const error = new Error("Test error");
      console.error = jest.fn();

      db.user.findOne = jest.fn().mockRejectedValue(error);

      await UserRepository.getUserById(id);

      expect(db.user.findOne).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  
  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      db.user.destroy = jest.fn().mockResolvedValueOnce(true);
      const id = 1;

      await UserRepository.deleteUser(id);

      expect(db.user.destroy).toHaveBeenCalledWith({ where: { id: id } });
    });

    it('should handle errors', async () => {
      const error = new Error('Delete user error');
      db.user.destroy = jest.fn().mockRejectedValueOnce(error);
      const id = 1;
      console.error = jest.fn();

      await UserRepository.deleteUser(id);

      expect(db.user.destroy).toHaveBeenCalledWith({ where: { id: id } });
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe('addUser', () => {
    it('should add a new user', async () => {
      const username = 'john';
      const password = 'password';
      const user = { id: 1, username: username, password: password };
      db.user.create = jest.fn().mockResolvedValueOnce(user);

      const result = await UserRepository.addUser(username, password);

      expect(db.user.create).toHaveBeenCalledWith({ username: username, password: password });
      expect(result).toEqual(user);
    });

    it('should handle errors', async () => {
      const username = 'john';
      const password = 'password';
      const error = new Error('Add user error');
      db.user.create = jest.fn().mockRejectedValueOnce(error);
      console.error = jest.fn();

      const result = await UserRepository.addUser(username, password);

      expect(db.user.create).toHaveBeenCalledWith({ username: username, password: password });
      expect(console.error).toHaveBeenCalledWith(error);
      expect(result).toBeFalsy();
    });
  });

  describe('getUserByUsername', () => {
    it('should get a user by username', async () => {
      const username = 'john';
      const user = { id: 1, username: username };
      db.user.findOne.mockResolvedValueOnce(user);

      const result = await UserRepository.getUserByUsername(username);

      expect(db.user.findOne).toHaveBeenCalledWith({ where: { username: username } });
      expect(result).toEqual(user);
    });

    it('should handle errors', async () => {
      const username = 'john';
      const error = new Error('Get user error');
      db.user.findOne.mockRejectedValueOnce(error);
      console.error = jest.fn();

      const result = await UserRepository.getUserByUsername(username);

      expect(db.user.findOne).toHaveBeenCalledWith({ where: { username: username } });
      expect(console.error).toHaveBeenCalledWith(error);
      expect(result).toBeFalsy();
    });
  });

  describe('checkUsername', () => {
    it('should check if a username exists', async () => {
      const username = 'john';
      const user = { id: 1, username: username };
      db.user.findOne.mockResolvedValueOnce(user);

      const result = await UserRepository.checkUsername(username);

      expect(db.user.findOne).toHaveBeenCalledWith({
        where: { username: username },
        paranoid: false,
      });
      expect(result).toEqual(user);
    });

    it('should handle errors', async () => {
      const username = 'john';
      const error = new Error('Get user error');
      db.user.findOne.mockRejectedValueOnce(error);
      console.error = jest.fn();

      const result = await UserRepository.checkUsername(username);

      expect(db.user.findOne).toHaveBeenCalledWith({
        where: { username: username },
        paranoid: false,
      });
      expect(console.error).toHaveBeenCalledWith(error);
      expect(result).toBeFalsy();
    });
  });

  describe('updateUserById', () => {
    it('should update a user by ID', async () => {
      const id = 1;
      const username = 'john';
      const password = 'newpassword';

      await UserRepository.updateUserById(id, username, password);

      expect(db.user.update).toHaveBeenCalledWith(
        { username: username, password: password },
        { where: { id: id } }
      );
    });

    it('should only update the username if password is not provided', async () => {
      const id = 1;
      const username = 'john';

      await UserRepository.updateUserById(id, username);

      expect(db.user.update).toHaveBeenCalledWith(
        { username: username },
        { where: { id: id } }
      );
    });

    it('should handle errors', async () => {
      const id = 1;
      const username = 'john';
      const password = 'newpassword';
      const error = new Error('Update user error');
      db.user.update.mockRejectedValueOnce(error);
      console.error = jest.fn();

      await UserRepository.updateUserById(id, username, password);

      expect(db.user.update).toHaveBeenCalledWith(
        { username: username, password: password },
        { where: { id: id } }
      );
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe('reactivateUser', () => {
    it('should reactivate a user', async () => {
      const username = 'john';

      await UserRepository.reactivateUser(username);

      expect(db.user.update).toHaveBeenCalledWith(
        { deleted_at: null },
        { where: { username: username }, paranoid: false }
      );
    });

    it('should handle errors', async () => {
      const username = 'john';
      const error = new Error('Reactivate user error');
      db.user.update.mockRejectedValueOnce(error);
      console.error = jest.fn();

      await expect(UserRepository.reactivateUser(username)).rejects.toThrow(error);

      expect(db.user.update).toHaveBeenCalledWith(
        { deleted_at: null },
        { where: { username: username }, paranoid: false }
      );
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });
});
