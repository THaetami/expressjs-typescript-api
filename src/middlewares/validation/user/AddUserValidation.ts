import { check } from "express-validator";
import { usernameValidation } from "./UsernameValidation";
import { passwordValidation } from "./PasswordValidation";
import { userValidationRequest } from "./UserValidationRequest";
import UserRepository from "../../../repository/UserRepository";

const addUserValidation = [
    ...usernameValidation,
    ...passwordValidation,
    check('username')
        .custom(async (value, { req }) => {
            const user = await UserRepository.checkUsername(value);
            if (user) {
                throw new Error('username sudah digunakan.');
            }
            return true;
        }),
    userValidationRequest
]

export default addUserValidation;