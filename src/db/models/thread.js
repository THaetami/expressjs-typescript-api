'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class thread extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      thread.belongsTo(models.user, { 
        onDelete: 'CASCADE',
      })
    }
  }
  thread.init({
    user_id: DataTypes.INTEGER,
    slug: DataTypes.STRING,
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    deleted_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'thread',
    underscored: true,
    paranoid: true,
  });
  return thread;
};