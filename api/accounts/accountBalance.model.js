const Sequelize = require('sequelize');
const db = require('../../config/db_config');

module.exports = db.sequelize.define(
    'accountBalances', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            //autoIncrement: true
        },
        landlord_code: {
            type: Sequelize.STRING
        },
        property_name: {
            type: Sequelize.STRING
        },
        actual_balance: {
            type: Sequelize.STRING
        },
        commission: {
            type: Sequelize.STRING
        },
        available_balance: {
            type: Sequelize.STRING
        },
        created_at: {
            type: Sequelize.STRING
        },  

    }, {
        timestamps: false
    }
);