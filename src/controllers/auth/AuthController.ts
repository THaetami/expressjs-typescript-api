import { Request, Response } from "express";
import IController from "./InterfaceController";
import UserRepository from "../../repository/UserRepository";
import AuthenticationService from "../../service/AuthenticationService";

class AuthController implements IController {
    index = async (req: Request, res: Response): Promise<Response> => {
        return res.json(req.app.locals.credential);
    }
    
    login = async (req: Request, res: Response): Promise<Response> => {
        let { username, password } = req.body;
        const user = await UserRepository.getUserByUsername(username);
        let compare = await AuthenticationService.passwordCompare(password, user.password)

        if (compare) {
            const token = AuthenticationService.generateToken({ id: user.id, username: user.username });
            return res.json({ 'token': token });
        }

        return res.status(401).send('unauthorized');
    }

    logout = async (req: Request, res: Response): Promise<Response> => {
        res.setHeader("Authorization", "");

        return res.json({ message: "Logout berhasil" });
    }
}

export default new AuthController();