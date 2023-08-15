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

            const expiresDate = new Date();
            expiresDate.setHours(expiresDate.getHours() + 1);

            await UserRepository.updateExpriedToken(expiresDate, user.id);

            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                expires: expiresDate,
            });
            return res.json({ 
                'message': 'login sukses',
            });
        }

        return res.status(401).send('unauthorized');
    }

    logout = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;
        const credential = req.app.locals.credential.user.id;

        if (id != credential) {
            return res.status(401).json({ 
                'message': 'unauthorized',
            });
        }
        const expiresDate = new Date();

        await UserRepository.updateExpriedToken(expiresDate, Number(id));
        res.setHeader("Authorization", "");
        res.clearCookie('token');
        return res.json({ message: "Logout berhasil" });
    }
}

export default new AuthController();