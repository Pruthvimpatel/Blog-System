import Sequelize, { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from '../sequelize-client';
import User from './user.model'; 


export interface PostModelCreationAttributes {
    title: string;
    content: string;
    imageURL: string;
}

export interface PostModelAttribtes extends PostModelCreationAttributes {
    id: string;
    userId: string;
}

export default class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
    declare id: CreationOptional<string>;
    declare title: string;
    declare content: string;
    declare userId: CreationOptional<string>;
    declare imageURL: CreationOptional<string | null>

    static associate: (models: typeof db) => void;


}

export const post = (sequelize: Sequelize.Sequelize,DataTypes:typeof Sequelize.DataTypes)=>{
    Post.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            title: {
                type: DataTypes.STRING,
                unique:true,
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
        },
        {
            sequelize,
            underscored: true,
            timestamps: true,
            modelName: 'Post',
            tableName: 'posts',
        }
    )

    Post.associate = models => {
        Post.belongsTo(models.User, {
          foreignKey: 'user_id',
          targetKey: 'id',
        });
      };
    
    return Post;
};