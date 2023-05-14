import { check } from 'express-validator';

export const usernameValidation = [
    check('username')
        .trim()
        .notEmpty()
        .withMessage('harus diisi.')
        .isAlphanumeric().withMessage('hanya alfanumerik.')
        .isLength({ min: 3 })
        .withMessage('minimal 3 karakter.'),
];