import { Router } from "express";
import{createComment,getCommentsByPostId,updateComment,deleteComment} from '../controllers/comment.controller';
import{COMMENT_ROUTES}from '../constants/routes.constants';
import {verifyToken} from '../middleware/auth.middleware';
import {validateReq} from '../middleware/validation';
import{createCommentSchema,updateCommentSchema} from '../utils/validation';

const router= Router();

router.post(COMMENT_ROUTES.CREATE,verifyToken,validateReq(createCommentSchema),createComment);

router.get(COMMENT_ROUTES.GET_COMMENTS_BY_POST_ID,verifyToken,getCommentsByPostId);

router.put(COMMENT_ROUTES.UPDATE,verifyToken,validateReq(updateCommentSchema),updateComment);

router.delete(COMMENT_ROUTES.DELETE,verifyToken,deleteComment);

export default router;