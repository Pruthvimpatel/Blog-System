import Sequelize,{CreationOptional, ForeignKey, Model } from 'sequelize';
import db from '../sequelize-client'; 
import Employee from './employee.model'; 

interface AccessTokenModelCreationAttributes {
  tokenType: 'ACCESS' | 'RESET' | 'REFRESH';
  token: string;
  employeeId: string;
  expiredAt?: Date;
}

interface AccessTokenModelAttributes extends AccessTokenModelCreationAttributes {
  id: string;
}

class AccessToken extends Model<AccessTokenModelAttributes, AccessTokenModelCreationAttributes> implements AccessTokenModelAttributes {
  declare id: CreationOptional<string>;
  declare token: string;
  declare tokenType: 'ACCESS' | 'RESET' | 'REFRESH';
  declare employeeId: ForeignKey<Employee['id']>;
  declare expiredAt: CreationOptional<Date>;

  static associate: (models: typeof db) => void;
}

export const accessToken = (sequelize: Sequelize.Sequelize, DataTypes: typeof Sequelize.DataTypes) => {
  AccessToken.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      tokenType: {
        type: DataTypes.ENUM('ACCESS', 'RESET' , 'REFRESH'),
        defaultValue: 'ACCESS',
      },
      token: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      employeeId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'employee_id'
      },
      expiredAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      underscored: true,
      timestamps: true,
      modelName: 'AccessToken',
      tableName: 'access_tokens',
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ['employee_id', 'token'],
        },
      ],
    }
  );

  AccessToken.associate = models => {
    AccessToken.belongsTo(models.Employee, {
      foreignKey: 'employee_id',
      targetKey: 'id',
    });
  };

  return AccessToken;
};
