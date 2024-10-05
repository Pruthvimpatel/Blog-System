import Sequelize, { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from '../sequelize-client';


export interface DepartmentModelCreationAttributes {
    name: string;
    type: string;
}

export interface DepartmentModelAttribtes extends DepartmentModelCreationAttributes {
    id: string;
}

export default class Department extends Model<InferAttributes<Department>, InferCreationAttributes<Department>> {
    declare id: CreationOptional<string>;
    declare type: string;
    declare name: string;
    static associate: (models: typeof db) => void;

    
}

export const department = (sequelize: Sequelize.Sequelize,DataTypes:typeof Sequelize.DataTypes)=>{
    Department.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false
            },
        },
        {
            sequelize,
            underscored: true,
            timestamps: true,
            modelName: 'Department',
            tableName: 'department',
        }
    )

    return Department;
};