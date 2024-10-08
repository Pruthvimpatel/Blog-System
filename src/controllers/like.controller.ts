import e, { Request,Response,NextFunction } from "express";
import ApiError from "../utils/api-error";
import ApiResponse from "../utils/api-response";
import asyncHandler from "../utils/async-handler";
import db from "../sequelize-client";
import User from "../models/user.model";
import {ERROR_MESSAGES,SUCCESS_MESSAGES} from '../constants/message';


interface MyUserRequest extends Request {
    token?: string;
    user?: User;
}

//create Like API
export const createLike = asyncHandler(async(req:MyUserRequest,res:Response,next:NextFunction)=> {
    const {postId,commentId} = req.body;
    const user = req.user; 

    if(!user) {
        return next(new ApiError(401, ERROR_MESSAGES.USER_NOT_FOUND));
    }

    try {
        const existingLike = await db.Like.findOne({
            where: {
                userId:user.id,
                postId,
                commentId
            }
        });

        if(existingLike) {
      return next(new ApiError(400,SUCCESS_MESSAGES.LIKE_ALREADY_EXISTS));
        }

        const newLike = await db.Like.create({
            userId: user.id,
            postId,
            commentId
        });
        const response = new ApiResponse(201, SUCCESS_MESSAGES.LIKE_CREATED);
        res.status(201).json(response);
    } catch(error) {
        console.error(ERROR_MESSAGES.SOMETHING_ERROR);
        return next(new ApiError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR,[error]));
    }
})

//getLikeByPost
export const getLikeByPostId = asyncHandler(async(req:MyUserRequest,res:Response,next:NextFunction) => {
  const {postId} = req.params;

  try {
    const likes = await db.Like.findAll({
        where: {
            postId
        }
    });

    res.status(200).json({likes});

  } catch(error) {
    console.error(ERROR_MESSAGES.SOMETHING_ERROR);
    return next(new ApiError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR,[error]));
  }
});


//count total number of likes on Posts
export const countLikesByPostId = asyncHandler(async(req:MyUserRequest,res:Response,next:NextFunction)=>{
    const {postId} = req.params;

    try {

        const count = await db.Like.count({
            where: {
                postId
            }
        });

        res.status(200).json({postId,likesCount: count});
    } catch(error) {
        console.error(ERROR_MESSAGES.SOMETHING_ERROR);
        return next(new ApiError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR,[error]));
    }
})