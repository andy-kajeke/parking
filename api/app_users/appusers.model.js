const Sequelize = require('sequelize');
const db = require('../../config/db_config');

module.exports = db.sequelize.define(
    'appusers', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            //autoIncrement: true
        },
        username: {
            type: Sequelize.STRING
        },
        gender: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        phone_number: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        reset_code: {
            type: Sequelize.STRING
        },
        created_at: {
            type: Sequelize.STRING
        },
        updated_at: {
            type: Sequelize.STRING
        }

    }, {
        timestamps: false
    }
);