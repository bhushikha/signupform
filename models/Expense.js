const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../util/database');

const Expense = sequelize.define('Expense', {
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    }
}, {
    tableName: 'expenses' // Specify the actual table name here
});


module.exports = Expense;