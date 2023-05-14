import { check } from 'express-validator';

export const passwordValidation = [
    check('password')
        .trim()
        .notEmpty().withMessage('harus diisi.')
        .isAlphanumeric().withMessage('hanya alfanumerik.')
        .isLength({ min: 6 }).withMessage('minimal 6 karakter.'),
];