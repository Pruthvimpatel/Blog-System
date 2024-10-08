import { Request,Response,NextFunction } from "express";
import bcrypt from 'bcrypt';
import ApiError from "../utils/api-error";
import ApiResponse from "../utils/api-response";
import asyncHandler from "../utils/async-handler";
import db from "../sequelize-client";
import {generateAccessToken,generateRefreshToken,generateResetToken} from "../utils/jwt.token";
import encryption from "../utils/encryption";
import User from "../models/user.model";
import {ERROR_MESSAGES,SUCCESS_MESSAGES} from '../constants/message';
import uploadOnCloudinary from '../utils/cloudinary';

import sequelize from "sequelize";


interface MyUserRequest extends Request{
    token?: string;
    user?: User;
  }

  //user-registration API
export const register = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {email, password, firstName, lastName} = req.body;
     if(!email || !password || !firstName || !lastName){
        return next(new ApiError(400,ERROR_MESSAGES.REQUIRED_FIELDS));
     }
     try {
     const newUser = await db.User.create({
        email,
        password,
        firstName,
        lastName
     });
    const response = new ApiResponse(201,SUCCESS_MESSAGES.USER_CREATED);
    res.status(201).json(response);
     } catch (error) {
     console.error(ERROR_MESSAGES.SOMETHING_ERROR);
     return next(new ApiError(500,ERROR_MESSAGES.SOMETHING_ERROR));
     }
}) 

//user-login API
export const login = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return next(new ApiError(400,ERROR_MESSAGES.EMAIL_PASSWORD_REQUIRED));
    }
   try {

   
    const user = await db.User.findOne({where:{email}});

    if(!user) {
        return next(new ApiError(400,ERROR_MESSAGES.USER_NOT_FOUND));
    }

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) {
        return next(new ApiError(400,ERROR_MESSAGES.INVALID_CREDENTIALS));
   }
   const accessToken = generateAccessToken({userId:user.id,email:user.email});
   const refreshToken = generateRefreshToken({userId:user.id});

   const encryptedAccessToken = encryption.encryptWithAES(accessToken);
   const encryptedRefreshToken = encryption.encryptWithAES(refreshToken);

 const token = await db.AccessToken.bulkCreate([
    {

        tokenType: 'ACCESS',
        token: encryptedAccessToken,
        userId: user.id,
        expiredAt: new Date(Date.now() + 60 * 60 * 1000),
    },
    {
        tokenType: 'REFRESH',
        token:encryptedRefreshToken,
        userId: user.id,
        expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }
   ]);
   const response = new ApiResponse(200,{accessToken,user},SUCCESS_MESSAGES.LOGIN_SUCCESS);
   res.status(200).json(response);
   }  catch (error) {
    console.error(ERROR_MESSAGES.SOMETHING_ERROR);
    return next(new ApiError(500,ERROR_MESSAGES.SOMETHING_ERROR));
   }
});

//user-logout API
export const logout  = asyncHandler(async(req:MyUserRequest,res:Response,next:NextFunction)=>{
   const token = req.token;
   if(!token) {
    return next(new ApiError(401,ERROR_MESSAGES.TOKEN_NOT_FOUND));
   }
   
   try {
    const  deleteToken = await db.AccessToken.destroy({
        where: {
            token,tokenType: 'ACCESS'
        }
    });

    if(deleteToken == 0) {
        return next(new ApiError(401,ERROR_MESSAGES.TOKEN_NOT_FOUND));
    }

    await db.AccessToken.destroy({
        where: {
            userId: req.user?.id,
            tokenType: 'REFRESH'
        }
    });

 const response = new ApiResponse(200,SUCCESS_MESSAGES.LOGOUT_SUCCESS);
  res.status(200).json(response);

   }catch (error) {
    console.error(ERROR_MESSAGES.SOMETHING_ERROR);
    return next(new ApiError(500,ERROR_MESSAGES.SOMETHING_ERROR));
   }
});

//upload profile photo

export const uploadProfile = asyncHandler(async(req:MyUserRequest, res: Response,next: NextFunction):Promise<void> => {
    const profilePicture = req.file?.path;
    const user = req.user;
  
    if (!user) {
      return next(new ApiError(404, ERROR_MESSAGES.USER_NOT_FOUND));
  }
  
  if(!profilePicture) {
    return next(new ApiError(404, ERROR_MESSAGES.FILE_REQUIRED));
  
  }
  
  try {
    const profile = await uploadOnCloudinary(profilePicture);
    if(!profile || !profile.url) {
      return next(new ApiError(404, ERROR_MESSAGES.PROFILE_UPLOAD_FAILED));
    }
  
    user.profilePicture = profile.url;
    await user.save();
  
    res.status(200).json(new ApiResponse(200,user,SUCCESS_MESSAGES.PROFILE_UPDATED_SUCCESSFULLY));
    return;
  } catch(error) {
    return next(new ApiError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR,[error]));
  }
  
  })



