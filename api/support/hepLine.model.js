const Sequelize = require('sequelize');
const db = require('../../config/db_config');

module.exports = db.sequelize.define(
    'helpLines', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            //autoIncrement: true
        },
        number: {
            type: Sequelize.STRING
        },
        created_at: {
            type: Sequelize.STRING
        },  

    }, {
        timestamps: false
    }
);