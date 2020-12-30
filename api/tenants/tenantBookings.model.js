const Sequelize = require('sequelize');
const db = require('../../config/db_config');

module.exports = db.sequelize.define(
    'tenantBookings', {
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
        slot_name: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.STRING
        },
        receipt_id: {
            type: Sequelize.STRING
        },
        month: {
            type: Sequelize.STRING
        },
        year: {
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