'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.thread, { 
        onDelete: 'CASCADE',
        foreignKey: 'user_id'
      });
      user.hasMany(models.comment, {
        onDelete: 'CASCADE',
        foreignKey: 'user_id'
      });
      user.hasMany(models.like, {
        onDelete: 'CASCADE',
        foreignKey: 'user_id'
      });
    }
  }
  user.init({
    username: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: 'Username already exists'
        },
    },
    password: DataTypes.STRING,
    deleted_at: DataTypes.DATE,
    is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    expried_token: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'user',
    underscored: true,
    paranoid: true,
  });
  return user;
};