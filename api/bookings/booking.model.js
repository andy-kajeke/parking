const Sequelize = require('sequelize');
const db = require('../../config/db_config');

module.exports = db.sequelize.define(
    'bookings', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            //autoIncrement: true
        },
        user_id: {
            type: Sequelize.STRING
        },
        booking_code: {
            type: Sequelize.STRING
        },
        landlord_code: {
            type: Sequelize.STRING
        },
        property_name: {
            type: Sequelize.STRING
        },
        customer_name: {
            type: Sequelize.STRING
        },
        number_plate: {
            type: Sequelize.STRING
        },
        slot_ref: {
            type: Sequelize.STRING
        },
        slot_name: {
            type: Sequelize.STRING
        },
        startTime: {
            type: Sequelize.STRING
        },
        endTime: {
            type: Sequelize.STRING
        },
        totalTime: {
            type: Sequelize.STRING
        },
        payment: {
            type: Sequelize.STRING
        },
        transactionId: {
            type: Sequelize.STRING
        },
        payment_status: {
            type: Sequelize.STRING
        },
        parking_status: {
            type: Sequelize.STRING
        },
        contact: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        month: {
            type: Sequelize.STRING
        },
        year: {
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