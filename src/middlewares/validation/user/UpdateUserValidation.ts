import { Request, Response, NextFunction } from 'express';
import { validationResult, check, ValidationChain } from 'express-validator';
import UserRepository from '../../../repository/UserRepository';
import { usernameValidation } from './UsernameValidation';
import { passwordValidation } from './PasswordValidation';

const usernameValidationRules: ValidationChain[] = [
  ...usernameValidation,
  check('username')
    .custom(async (value, { req }) => {
      const id = req.params?.id ?? "";
      const existingUser = await UserRepository.checkUsername(value);
      if (existingUser && existingUser.id !== id) {
        throw new Error('username sudah digunakan');
      }
      return true;
    }),
];

const passwordValidationRules: ValidationChain[] = [
  ...passwordValidation
];

export const updateUserValidation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.app.locals.credential.user.id;
    const user = await UserRepository.getUserById(Number(id));

    const { username, password } = req.body;

    const usernameValidationChain = username !== user.username ? usernameValidationRules : [];
    const passwordValidationChain = password.trim() ? passwordValidationRules : [];

    const validationChain = [...usernameValidationChain, ...passwordValidationChain];

    await Promise.all(validationChain.map(rule => rule.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
