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

// Create a new post
export const createPost = asyncHandler(async(req:MyUserRequest,res:Response,next:NextFunction)=>{
 const {title,content,imageURL} = req.body;

 const user = req.user;

 if(!user) {
    return next(new ApiError(401,ERROR_MESSAGES.USER_NOT_FOUND));
 }
 if(!title || !content || !imageURL) {
    return next(new ApiError(400,ERROR_MESSAGES.REQUIRED_FIELDS));
 }
 try {
 const newPost = await db.Post.create({
    title,
    content,
    imageURL,
    userId:user.id
 })
 const response = new ApiResponse(201,SUCCESS_MESSAGES.POST_CREATED);
 res.status(201).json(response);
 }catch (error) {
     console.error(ERROR_MESSAGES.SOMETHING_ERROR);
     return next(new ApiError(500,ERROR_MESSAGES.INTERNAL_SERVER_ERROR,[error]));
   }
})

// Get all posts with pagination
export const getPosts = asyncHandler(async(req:MyUserRequest,res:Response,next:NextFunction)=>{
    const user = req.user;
    if(!user) {
        return next(new ApiError(401,ERROR_MESSAGES.USER_NOT_FOUND));
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    try {
        const {rows:posts,count:totalPosts} = await db.Post.findAndCountAll({
            where: {
                userId:user.id
            },
            limit,
            offset
        });

        const totalPages = Math.ceil(totalPosts / limit);
        const response = new ApiResponse(200,{
            posts,
            pagination: {
                totalPosts,
                totalPages,
                currentPage: page,
                pageSize: limit
            }
        },SUCCESS_MESSAGES.POST_RETRIEVED);

        res.status(200).json(response);
    } catch(error) {
        console.error(ERROR_MESSAGES.SOMETHING_ERROR);
        return next(new ApiError(500,ERROR_MESSAGES.INTERNAL_SERVER_ERROR,[error]));
    }
})

// Get a single post by ID
export const getPostById = asyncHandler(async(req:MyUserRequest,res:Response,next:NextFunction)=>{
    try {
        const {id} = req.params;
        const post = await db.Post.findByPk(id)
        if(!post) {
            return next(new ApiError(400,ERROR_MESSAGES.POST_NOT_FOUND));
        }

        const response = new ApiResponse(200,{
            post
        },SUCCESS_MESSAGES.POST_RETRIEVED);
        res.status(200).json(response);
    } catch(error) {
        console.error(ERROR_MESSAGES.SOMETHING_ERROR);
        return next(new ApiError(500,ERROR_MESSAGES.INTERNAL_SERVER_ERROR,[error]));
    }
})

//update-post
export const updatePost = asyncHandler(async(req:MyUserRequest,res:Response,next:NextFunction)=>{
    const {id} = req.params;
    const {title,content,imageURL} = req.body;
    const user = req.user;
    if(!user) {
        return next(new ApiError(401,ERROR_MESSAGES.USER_NOT_FOUND))
    }
    try {
    const post = await db.Post.findByPk(id);
    if(!post) {
        return next(new ApiError(400,ERROR_MESSAGES.POST_NOT_FOUND));
    }
    if(post.userId != user.id) {
        return next(new ApiError(403,ERROR_MESSAGES.PERMISSION_DENIED))
    };
   const updatedPost = await db.Post.update({
    title,
    content,
    imageURL
   },{
    where: {id,userId:user.id,}
   });
   const response = new ApiResponse(200,SUCCESS_MESSAGES.POST_UPDATED);
   res.status(200).json(response);
} catch(error) {
    console.error(ERROR_MESSAGES.SOMETHING_ERROR);
    return next(new ApiError(500,ERROR_MESSAGES.INTERNAL_SERVER_ERROR,[error]));
}
})

//delete-post
export const deletePost = asyncHandler(async(req:MyUserRequest,res:Response,next:NextFunction)=>{
    const user = req.user;
    const {id} = req.params;
    if(!user) {
        return next(new ApiError(401,ERROR_MESSAGES.USER_NOT_FOUND))
    }
    try {
    const deletePost = await db.Post.destroy({
        where: {
            userId:user.id,
            id:id
        }
    });
    const affectedRows = Number(deletePost);
    if(affectedRows == 0) {
    return next(new ApiError(400,ERROR_MESSAGES.POST_NOT_FOUND));
    }
    const response = new ApiResponse(200,SUCCESS_MESSAGES.POST_DELETED);
    res.status(200).json(response);
}  catch(error) {
    console.error(ERROR_MESSAGES.SOMETHING_ERROR);
    return next(new ApiError(500,ERROR_MESSAGES.INTERNAL_SERVER_ERROR,[error]));
}
})

//getUserPost
export const getUserPost = asyncHandler(async(req:MyUserRequest,res:Response,next:NextFunction)=>{
    try {
        const {userId} = req.params;
        const post = await db.Post.findAll({
            where:{ userId }
        });
 
        res.status(200).json({userId,post});
    } catch (error) {
        console.error(ERROR_MESSAGES.SOMETHING_ERROR);
        return next(new ApiError(500,ERROR_MESSAGES.INTERNAL_SERVER_ERROR,[error]));
    }
})





