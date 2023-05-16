'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      like.belongsTo(models.user, {
        onDelete: 'CASCADE',
      });
      like.belongsTo(models.thread, {
        onDelete: 'CASCADE',
      });
    }
  }
  like.init({
    user_id: DataTypes.INTEGER,
    thread_id: DataTypes.INTEGER,
    deleted_at: {
        type: DataTypes.BOOLEAN,
        defaultValue: null
    },
  }, {
    sequelize,
    modelName: 'like',
    underscored: true,
    paranoid: true,
  });
  return like;
};