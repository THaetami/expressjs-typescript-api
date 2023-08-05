import { check } from "express-validator";
import { usernameValidation } from "../user/UsernameValidation";
import { passwordValidation } from "../user/PasswordValidation";
import { userValidationRequest } from "../user/UserValidationRequest";
import UserRepository from "../../../repository/UserRepository";

const loginUserValidation = [
    ...usernameValidation,
    ...passwordValidation,
    check('username')
        .custom(async (value, { req }) => {
            const user = await UserRepository.getUserByUsername(value);
            if (!user) {
                throw new Error('akun tidak terdaftar.');
            }
            return true;
        }),
    userValidationRequest
]

export default loginUserValidation;