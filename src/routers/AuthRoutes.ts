import BaseRoutes from "./base/BaseRouter";
import loginUserValidation from "../middlewares/validation/auth/LoginUserValidation";
import AuthController from "../controllers/auth/AuthController";
import { auth } from "../middlewares/AuthMiddleware";


class AuthRoutes extends BaseRoutes {
    public routes(): void {
        this.router.get('/', auth, AuthController.index);
        this.router.post('/', loginUserValidation, AuthController.login);
        this.router.delete('/:id', auth, AuthController.logout);
    }
}

export default new AuthRoutes().router;