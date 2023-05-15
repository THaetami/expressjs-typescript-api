import BaseRoutes from "./base/BaseRouter";
import CommentController from "../controllers/comment/CommentController";
import { auth } from "../middlewares/AuthMiddleware";
import commentValidation from "../middlewares/validation/comment/CommentValidation";


class ThreadRoutes extends BaseRoutes {
    public routes(): void {
        this.router.post('/:threadId', auth, commentValidation, CommentController.create);
        this.router.delete('/:threadId/:commentId', auth, CommentController.delete);
    }
}

export default new ThreadRoutes().router;