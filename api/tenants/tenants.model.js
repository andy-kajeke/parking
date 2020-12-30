const Sequelize = require('sequelize');
const db = require('../../config/db_config');

module.exports = db.sequelize.define(
    'tenants', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            //autoIncrement: true
        },
        landlord_code: {
            type: Sequelize.STRING
        },
        tenant_code: {
            type: Sequelize.STRING
        },
        tenant_name: {
            type: Sequelize.STRING
        },
        contact: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        tenant_photo: {
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