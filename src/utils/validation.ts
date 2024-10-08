import Joi from "joi";

//user schema
export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
})

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})


//post schema
export const createPostSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    imageURL: Joi.string(),
})


export const updatePostSchema = Joi.object({
    title: Joi.string(),
    content: Joi.string(),
    imageURL: Joi.string(),
})


//comment schema

export const createCommentSchema = Joi.object({
    content: Joi.string().required(),
})

export const updateCommentSchema = Joi.object({
    content: Joi.string().required(),
})

//like schema
export const createLikeSchema = Joi.object({
    postId: Joi.number().required(),
    commentId: Joi.number().required(),
})

