import Sequelize, { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from '../sequelize-client';

export interface LikeModelCreationAttributes {
    userId: string;
    postId: string; 
    commentId: string;
}

export interface LikeModelAttributes extends LikeModelCreationAttributes {
    id: string;
}

export default class Like extends Model<InferAttributes<Like>, InferCreationAttributes<Like>> {
    declare id: CreationOptional<string>;
    declare userId: string;
    declare postId: string;   
    declare commentId: string;

    static associate: (models: typeof db) => void;
}

export const like = (sequelize: Sequelize.Sequelize, DataTypes: typeof Sequelize.DataTypes) => {
    Like.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            postId: {
                type: DataTypes.UUID,
                allowNull: true
            },
            commentId: {
                type: DataTypes.UUID,
                allowNull: true
            },
        },
        {
            sequelize,
            underscored: true,
            timestamps: true,
            modelName: 'Like',
            tableName: 'likes',
        }
    );

    Like.associate = models => {
        Like.belongsTo(models.User, {
            foreignKey: 'user_id',
            targetKey: 'id',
        });
        
        Like.belongsTo(models.Post, {
            foreignKey: 'post_id',
            targetKey: 'id',
        });

        Like.belongsTo(models.Comment, {
            foreignKey: 'comment_id',
            targetKey: 'id',
        });
    };

    return Like;
};
