import BaseRoutes from "./base/BaseRouter";
import LikeController from "../controllers/like/LikeController";
import { auth } from "../middlewares/AuthMiddleware";


class ThreadRoutes extends BaseRoutes {
    public routes(): void {
        this.router.post('/:threadId', auth, LikeController.create);
    }
}

export default new ThreadRoutes().router;