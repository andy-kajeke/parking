const Sequelize = require('sequelize');
const db = require('../../config/db_config');

module.exports = db.sequelize.define(
    'products', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            //autoIncrement: true
        },
        product_barcode: {
            type: Sequelize.STRING
        },
        product_name: {
            type: Sequelize.STRING
        },
        manufactured_date: {
            type: Sequelize.STRING
        },
        expiry_date: {
            type: Sequelize.STRING
        },
        company_name: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.STRING
        },
        state: {
            type: Sequelize.STRING
        },
        province: {
            type: Sequelize.STRING
        },
        location: {
            type: Sequelize.STRING
        },
        postal_address: {
            type: Sequelize.STRING
        },
        plot_number: {
            type: Sequelize.STRING
        },
        contact: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        website: {
            type: Sequelize.STRING
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }

    }, {
        timestamps: false
    }
);