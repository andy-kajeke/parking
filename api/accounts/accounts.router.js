const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const AccountsRoute = express.Router();
const crypto = require("crypto");
const randomize = require('randomatic');
const WithdrawModel = require('./withdraws.model');
const AccountBalanceModel = require('./accountBalance.model')

AccountsRoute.use(cors());

////////////////////////////////////Date and time//////////////////////////////////////////////////////////////
var date = new Date();
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

let today = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);

var hours = date.getHours();
var minutes = date.getMinutes();
var seconds = date.getSeconds();
var ampm = hours >= 12 ? 'pm' : 'am';
hours = hours % 12;
hours = hours ? hours : 12; // the hour '0' should be '12'
minutes = minutes < 10 ? '0' + minutes : minutes;

var currentTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;

//////////////////////////////////Add withdraws//////////////////////////////////////////////////////////////////////
AccountsRoute.post('/withdraw/add', (req, res) => {
    const withdraw_id = crypto.randomBytes(15).toString('hex');

    let withdrawData = {
        id: withdraw_id,
        landlord_code: req.body.landlord_code,
        property_name: req.body.property_name,
        amount: req.body.amount,
        commission: req.body.commission,
        destination: req.body.destination,
        month: monthNames[date.getMonth()],
        year: date.getFullYear(),
        created_at: today
    }

    WithdrawModel.create(withdrawData)
    .then(amount => {
        res.json({message: amount.amount + ' registered to ' + amount.property_name})
    })
    .catch(err => {
        res.send(err);
    });
});

//////////////////////////////////Get all withdraws//////////////////////////////////////////////////////////////////////
AccountsRoute.get('/withdraws', (req, res) => {
    WithdrawModel.findAll().then(withdraws => {
        res.json({withdraws})
    });
});

//////////////////////////////////Get all withdraws by business code////////////////////////////////////////////////////////
AccountsRoute.get('/withdraws/:landlord_code', (req, res) => {
    WithdrawModel.findOne({
        where: {
            landlord_code: req.params.landlord_code,
        }
    }).then(withdraws => {
        res.json({withdraws})
    });
});

//////////////////////////////////Get all withdraws by business code////////////////////////////////////////////////////////
AccountsRoute.get('/withdraws/:landlord_code/:year', (req, res) => {
    WithdrawModel.findAll({
        where: {
            landlord_code: req.params.landlord_code,
            year: req.params.year
        }
    }).then(withdraws => {
        res.json({withdraws})
    });
});

module.exports = AccountsRoute;