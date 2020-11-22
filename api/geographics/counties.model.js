const Sequelize = require('sequelize');
const db = require('../../config/db_config');

module.exports = db.sequelize.define(
    'counties', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            //autoIncrement: true
        },
        county_code: {
            type: Sequelize.STRING
        },
        region_name: {
            type: Sequelize.STRING
        },
        district_name: {
            type: Sequelize.STRING
        },
        county_name: {
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