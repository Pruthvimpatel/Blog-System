import { Router } from "express";
import userRoutes from '../routes/user.route';
import postRoutes from '../routes/post.route';
import commentRoutes from '../routes/comment.route';
import likeRoutes from '../routes/like.route';
import {BASE_API_ROUTES} from '../constants/routes.constants'
const router = Router();

router.use(BASE_API_ROUTES.USERS,userRoutes);
router.use(BASE_API_ROUTES.POSTS,postRoutes);
router.use(BASE_API_ROUTES.COMMENTS,commentRoutes);
router.use(BASE_API_ROUTES.LIKE,likeRoutes);
export default router;