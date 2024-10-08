import Sequelize, { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import bcrypt from "bcrypt";
import db from '../sequelize-client';


export interface CommentModelCreationAttributes {
    content: string;
}

export interface CommentModelAttribtes extends CommentModelCreationAttributes {
    id: string;
    userId: string;
    postId: string;
}

export default class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
    declare id: CreationOptional<string>;
    declare content: string;
    declare userId: CreationOptional<string>;
    declare postId: CreationOptional<string>;

    static associate: (models: typeof db) => void;


}

export const comment = (sequelize: Sequelize.Sequelize,DataTypes:typeof Sequelize.DataTypes)=>{
    Comment.init(
        {
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
        },
        {
            sequelize,
            underscored: true,
            timestamps: true,
            modelName: 'Comment',
            tableName: 'comments',
        }
    )
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