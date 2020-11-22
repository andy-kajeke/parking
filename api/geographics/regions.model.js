const Sequelize = require('sequelize');
const db = require('../../config/db_config');

module.exports = db.sequelize.define(
    'regions', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            //autoIncrement: true
        },
        region_code: {
            type: Sequelize.STRING
        },
        region_name: {
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