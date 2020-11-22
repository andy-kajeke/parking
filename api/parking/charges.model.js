const Sequelize = require('sequelize');
const db = require('../../config/db_config');

module.exports = db.sequelize.define(
    'charges', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            //autoIncrement: true
        },
        charge_code: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.STRING
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }

    }, {
        timestamps: false
    }
);