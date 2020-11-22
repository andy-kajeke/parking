const Sequelize = require('sequelize');
const db = require('../../config/db_config');

module.exports = db.sequelize.define(
    'districts', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            //autoIncrement: true
        },
        region_name: {
            type: Sequelize.STRING
        },
        district_code: {
            type: Sequelize.STRING
        },
        district_name: {
            type: Sequelize.STRING
        },
        active_status: {
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