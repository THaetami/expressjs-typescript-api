'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      comment.belongsTo(models.user);
      comment.belongsTo(models.thread)
    }
  }
  comment.init({
    user_id: DataTypes.INTEGER,
    thread_id: DataTypes.INTEGER,
    comentar: DataTypes.TEXT,
    deleted_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'comment',
    underscored: true,
    paranoid: true,
  });
  return comment;
};