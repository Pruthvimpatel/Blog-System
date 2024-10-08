import { Router } from "express";
import{createPost,getPosts,getPostById,updatePost,deletePost} from '../controllers/post.controller';
import{POST_ROUTES}from '../constants/routes.constants';
import {verifyToken} from '../middleware/auth.middleware';
import {validateReq} from '../middleware/validation';
import {createPostSchema,updatePostSchema} from '../utils/validation';


const router=Router();

router.post(POST_ROUTES.CREATE,verifyToken,validateReq(createPostSchema),createPost);

router.get(POST_ROUTES.GET,verifyToken,getPosts);

router.get(POST_ROUTES.GET_BY_ID,verifyToken,getPostById);

router.put(POST_ROUTES.UPDATE,verifyToken,validateReq(updatePostSchema),updatePost);

router.delete(POST_ROUTES.DELETE,verifyToken,deletePost);

router.get(POST_ROUTES.GET_USERS_POSTS,verifyToken,getPosts);

export default router