const Sequelize = require('sequelize');
const db = require('../../config/db_config');

module.exports = db.sequelize.define(
    'landloards', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            //autoIncrement: true
        },
        landlord_code: {
            type: Sequelize.STRING
        },
        business_name: {
            type: Sequelize.STRING
        },
        property_name: {
            type: Sequelize.STRING
        },
        district: {
            type: Sequelize.STRING
        },
        county: {
            type: Sequelize.STRING
        },
        postal_address: {
            type: Sequelize.STRING
        },
        physical_address: {
            type: Sequelize.STRING
        },
        numberOfSlots: {
            type: Sequelize.STRING
        },
        reservedSlots: {
            type: Sequelize.STRING
        },
        startTime: {
            type: Sequelize.STRING
        },
        endTime: {
            type: Sequelize.STRING
        },
        chargePerHour: {
            type: Sequelize.STRING
        },
        office_contact: {
            type: Sequelize.STRING
        },
        office_other_contact: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        director_surname: {
            type: Sequelize.STRING
        },
        director_middle_name: {
            type: Sequelize.STRING
        },
        director_other_name: {
            type: Sequelize.STRING
        },
        director_gender: {
            type: Sequelize.STRING
        },
        director_nationality: {
            type: Sequelize.STRING
        },
        director_countryOfResidence: {
            type: Sequelize.STRING
        },
        director_contact: {
            type: Sequelize.STRING
        },
        director_email: {
            type: Sequelize.STRING
        },
        bank_name: {
            type: Sequelize.STRING
        },
        bank_branch: {
            type: Sequelize.STRING
        },
        bank_account_name: {
            type: Sequelize.STRING
        },
        bank_account_number: {
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