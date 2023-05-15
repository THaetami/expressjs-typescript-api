import BaseRoutes from "./base/BaseRouter";
import ThreadController from "../controllers/thread/ThreadController";
import { auth } from "../middlewares/AuthMiddleware";
import threadValidation from "../middlewares/validation/thread/ThreadValidation";


class ThreadRoutes extends BaseRoutes {
    public routes(): void {
        this.router.get('/', auth, ThreadController.index);
        this.router.post('/', auth, threadValidation, ThreadController.create);
        this.router.get('/:id', auth, ThreadController.show);
        this.router.put('/:id', auth, threadValidation, ThreadController.update);
        this.router.delete('/:id', auth,  ThreadController.delete);
        this.router.get('/detail/:slug', auth, ThreadController.detail);
    }
}

export default new ThreadRoutes().router;