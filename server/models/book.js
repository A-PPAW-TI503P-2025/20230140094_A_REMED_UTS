'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Book has many BorrowLogs
      Book.hasMany(models.BorrowLog, {
        foreignKey: 'bookId',
        as: 'borrowLogs'
      });
    }
  }
  Book.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title cannot be empty'
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Author cannot be empty'
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Stock cannot be negative'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};