"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.post = void 0;
const sequelize_1 = require("sequelize");
class Post extends sequelize_1.Model {
    static associate;
}
exports.default = Post;
const post = (sequelize, DataTypes) => {
    Post.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        title: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        imageURL: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: 'Post',
        tableName: 'posts',
    });
    Post.associate = models => {
        Post.belongsTo(models.User, {
            foreignKey: 'user_id',
            targetKey: 'id',
        });
    };
    return Post;
};
exports.post = post;
