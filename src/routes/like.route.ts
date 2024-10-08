import { Router } from "express";
import{createLike,getLikeByPostId,countLikesByPostId} from '../controllers/like.controller';
import{LIKE_ROUTES}from '../constants/routes.constants';
import {verifyToken} from '../middleware/auth.middleware';
import {validateReq} from '../middleware/validation';
import {createLikeSchema} from '../utils/validation';


const router=Router();

router.post(LIKE_ROUTES.CREATE_LIKE,verifyToken,validateReq(createLikeSchema),createLike);

router.get(LIKE_ROUTES.GET_BY_POST_ID,verifyToken,getLikeByPostId);

router.get(LIKE_ROUTES.COUNT_BY_POST_ID,verifyToken,countLikesByPostId);

export default router;
