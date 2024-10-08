import  { Router } from "express";
import{register,login,logout,uploadProfile} from '../controllers/user.controller';
import{USER_ROUTES}from '../constants/routes.constants';
import {verifyToken} from '../middleware/auth.middleware';
import {validateReq} from '../middleware/validation';
import {registerSchema,loginSchema} from '../utils/validation';
import upload from '../middleware/multer.middleware';

const router=Router();

router.post(USER_ROUTES.REGISTER,validateReq(registerSchema),register);

router.post(USER_ROUTES.LOGIN,validateReq(loginSchema),login);

router.post(USER_ROUTES.LOGOUT,verifyToken,logout)

router.post(USER_ROUTES.UPLOAD_PROFILE,verifyToken,upload.single('profilePicture'),uploadProfile);

export default router