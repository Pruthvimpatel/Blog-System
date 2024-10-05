import Sequelize, { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import bcrypt from "bcrypt";
import db from '../sequelize-client';


export interface EmployeeModelCreationAttributes {
    email: string;
    password: string;
}

export interface EmployeeModelAttribtes extends EmployeeModelCreationAttributes {
    id: string;
    firstName: string;
    lastName: string;
    departmentId: string
}

export default class Employee extends Model<InferAttributes<Employee>, InferCreationAttributes<Employee>> {
    declare id: CreationOptional<string>;
    declare email: string;
    declare password: string;
    declare firstName: CreationOptional<string>;
    declare lastName: CreationOptional<string>;
    declare departmentId: CreationOptional<string>

    static associate: (models: typeof db) => void;

    static async hashPassword(employee:Employee) {
        if(employee.password) {
            const salt = await bcrypt.genSalt(10);
            employee.password = await bcrypt.hash(employee.password,salt);
        }
    }
}

export const employee = (sequelize: Sequelize.Sequelize,DataTypes:typeof Sequelize.DataTypes)=>{
    Employee.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            email: {
                type: DataTypes.STRING,
                unique:true,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            departmentId: {
                type: DataTypes.UUID,
                allowNull: false,
            }
        },
        {
            sequelize,
            underscored: true,
            timestamps: true,
            modelName: 'Employee',
            tableName: 'employees',
            hooks:{
                beforeCreate:Employee.hashPassword,
                beforeUpdate:Employee.hashPassword,
            }
        }
    )

    return Employee;
};