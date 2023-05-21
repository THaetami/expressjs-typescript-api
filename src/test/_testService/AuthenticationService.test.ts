import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import AuthenticationService, { User } from '../../service/AuthenticationService';


jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthenticationService', () => {
  describe('passwordHash', () => {
    it('should hash the password', async () => {
      // Arrange
      const password = 'password123';
      const hashedPassword = 'hashedPassword';

      (hash as jest.Mock).mockResolvedValue(hashedPassword);

      // Act
      const result = await AuthenticationService.passwordHash(password);

      // Assert
      expect(result).toEqual(hashedPassword);
      expect(hash).toHaveBeenCalledWith(password, 10);
    });
  });

  describe('passwordCompare', () => {
    it('should compare the password', async () => {
      // Arrange
      const password = 'password123';
      const hashedPassword = 'hashedPassword';

      (compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await AuthenticationService.passwordCompare(password, hashedPassword);

      // Assert
      expect(result).toEqual(true);
      expect(compare).toHaveBeenCalledWith(password, hashedPassword);
    });
  });

  describe('generateToken', () => {
    it('should generate a token', () => {
      // Arrange
      const user: User = {
        id: 1,
        username: 'user123',
      };

      process.env.JWT_SECRET_KEY = 'secretKey';
      process.env.JWT_EXPIRES_IN = '1d';
      const token = 'generatedToken';

      (sign as jest.Mock).mockReturnValue(token);

      // Act
      const result = AuthenticationService.generateToken(user);

      // Assert
      expect(result).toEqual(token);
      expect(sign).toHaveBeenCalledWith({ user }, 'secretKey', { expiresIn: '1d' });
    });
  });

  describe('decodeToken', () => {
    it('should decode the token', () => {
      // Arrange
      const token = 'generatedToken';
      const secretKey = 'secretKey';
      const credential = { id: 1, username: 'user123' };

      process.env.JWT_SECRET_KEY = secretKey;
      (verify as jest.Mock).mockReturnValue(credential);

      // Act
      const result = AuthenticationService.decodeToken(token);

      // Assert
      expect(result).toEqual(credential);
      expect(verify).toHaveBeenCalledWith(token, secretKey);
    });
  });
});
