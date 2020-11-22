const Sequelize = require('sequelize');
const db = require('../../config/db_config');

module.exports = db.sequelize.define(
    'parkingSlots', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            //autoIncrement: true
        },
        landlord_code: {
            type: Sequelize.STRING
        },
        slot_name: {
            type: Sequelize.STRING
        },
        slot_status: {
            type: Sequelize.STRING
        },
        parking_status: {
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