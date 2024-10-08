import { Request,Response,NextFunction } from "express";
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

//create comment
export const createComment = asyncHandler(async(req:MyUserRequest,res:Response,next:NextFunction)=>{
    console.log("createComment function called");

    const {content,postId} = req.body;
    const user = req.user;
    if(!user) {
        return next(new ApiError(401,ERROR_MESSAGES.USER_NOT_FOUND));
    }
    if(!content || !postId) {
        return next(new ApiError(400,ERROR_MESSAGES.REQUIRED_FIELDS));
    }

  const post = await db.Post.findByPk(postId);
  if(!post) {
    return next(new ApiError(400,ERROR_MESSAGES.POST_NOT_FOUND));
  }
    try {
        const newComment = await db.Comment.create({
            content,
            userId:user.id,
            postId:post.id
        });
        const response = new ApiResponse(201,{newComment},SUCCESS_MESSAGES.COMMENT_CREATED);
        res.status(201).json(response);
    } catch(error) {
        console.error(ERROR_MESSAGES.SOMETHING_ERROR);
        return next(new ApiError(500,ERROR_MESSAGES.INTERNAL_SERVER_ERROR,[error]));
    }
});

// Get All Comments for a Post
export const getCommentsByPostId = asyncHandler(async(req:MyUserRequest,res:Response,next:NextFunction)=>{
    const {postId} = req.params;

    try {
        const comments = await db.Comment.findAll({
            where:{
                postId
            },
            include:[{
                model: db.User,
                attributes: ['id','firstName','lastName','email']
            }],
        });

        res.status(200).json({comments});
    } catch(error) {
        console.error(ERROR_MESSAGES.SOMETHING_ERROR);
        return next(new ApiError(500,ERROR_MESSAGES.INTERNAL_SERVER_ERROR,[error]));
    }
})

//update-comment
export const updateComment = asyncHandler(async(req:MyUserRequest,res:Response,next:NextFunction)=>{
    const {id} = req.params;
    const {content} = req.body;
     const user = req.user;
     if(!user) {
        return next(new ApiError(400,ERROR_MESSAGES.USER_NOT_FOUND))
     }

     try {
        const comment = await db.Comment.findByPk(id);
        if(!comment) {
            return next(new ApiError(400,ERROR_MESSAGES.COMMENT_NOT_FOUND));
        }

        if(comment.userId !== user.id) {
            return next(new ApiError(400,ERROR_MESSAGES.PERMISSION_DENIED));
        }
        comment.content = content;
        await comment.save();
        const response = new ApiResponse(200, comment, SUCCESS_MESSAGES.COMMENT_UPDATED);
        res.status(200).json(response);
     } catch(error) {
        console.error(ERROR_MESSAGES.SOMETHING_ERROR, error);
        return next(new ApiError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, [error]));
     }
})

//delete-comment
export const deleteComment = asyncHandler(async(req:MyUserRequest,res:Response,next:NextFunction)=> {
    const user = req.user;
    const {id} = req.params;
    if(!user) {
        return next(new ApiError(401, ERROR_MESSAGES.USER_NOT_FOUND))
    }
    try {

      const comment = await db.Comment.findByPk(id);
      if(!comment) {
        return next(new ApiError(400, ERROR_MESSAGES.COMMENT_NOT_FOUND));

      }

      await comment.destroy();

      const response = new ApiResponse(200, {}, SUCCESS_MESSAGES.COMMENT_DELETED);
      res.status(200).json(response);
    }catch(error) {
        console.error(ERROR_MESSAGES.SOMETHING_ERROR, error);
        return next(new ApiError(500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, [error]));
    }
})