import { Request, Response, NextFunction } from "express";
import { Result, ValidationError, validationResult } from "express-validator";

export const userValidationRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors);
    }

    next();
};