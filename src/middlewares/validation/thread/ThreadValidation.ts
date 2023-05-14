import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

const addThreadValidation = [
    check('title')
        .trim()
        .notEmpty().withMessage('harus diisi.'),
    check('body')
        .trim()
        .notEmpty().withMessage('harus diisi.'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(422).json(errors);
        }

        return next();
    }
];

export default addThreadValidation;