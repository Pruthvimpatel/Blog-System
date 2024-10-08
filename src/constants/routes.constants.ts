
export const USER_ROUTES = {
    REGISTER: '/register',
    LOGIN: '/login',
    LOGOUT: '/logout',
    UPLOAD_PROFILE:'/upload-profile',

};

export const POST_ROUTES = {
    CREATE: '/create-post',
    GET: '/get-post',
    GET_BY_ID: '/get-post-by-id/:id',
    UPDATE: '/update-post/:id',
    DELETE: '/delete-post/:id',
    GET_USERS_POSTS: '/get-user-posts/:userId',
};

export const COMMENT_ROUTES = {
CREATE: '/create-comment',
GET: '/get-comments',
GET_COMMENTS_BY_POST_ID: '/get-comments-by-post-id/:postId',
UPDATE: '/update-comment/:id',
DELETE: '/delete-comment/:id',    
};

export const LIKE_ROUTES = {
    CREATE_LIKE: '/create-like',
    GET_BY_POST_ID: '/get-likes-by-post-id/:postId',
    COUNT_BY_POST_ID: '/count-likes-by-post-id/:postId',
};

export const BASE_API_ROUTES = {
    USERS: '/users',
    POSTS: '/posts',
    COMMENTS: '/comments',
    LIKE: '/likes',
};

export const REST_API_PREFIX = {
    API_V1:'/api/v1'
}