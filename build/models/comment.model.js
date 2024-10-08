"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comment = void 0;
const sequelize_1 = require("sequelize");
class Comment extends sequelize_1.Model {
    static associate;
}
exports.default = Comment;
const comment = (sequelize, DataTypes) => {
    Comment.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        postId: {
            type: DataTypes.UUID,
            allowNull: false
        },
    }, {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: 'Comment',
        tableName: 'comments',
    });
    Comment.associate = models => {
        Comment.belongsTo(models.User, {
            foreignKey: 'user_id',
            targetKey: 'id',
        });
        Comment.belongsTo(models.Post, {
            foreignKey: 'post_id',
            targetKey: 'id',
        });
    };
    return Comment;
};
exports.comment = comment;
