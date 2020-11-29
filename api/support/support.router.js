const express = require('express');
const cors = require('cors');
const SupportRoute = express.Router();
const jwt = require('jsonwebtoken');
const { genSaltSync, hashSync, compareSync } = require('bcryptjs');
const crypto = require("crypto");
const randomize = require('randomatic');
const dateTime = require('node-datetime');
const nodemailer = require('nodemailer'); 
const HelpLineModel = require('./hepLine.model');
const salt = genSaltSync(10);

SupportRoute.use(cors());

////////////////////////////////////Date and time//////////////////////////////////////////////////////////////
var date = new Date();
let today = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);

var hours = date.getHours();
var minutes = date.getMinutes();
var seconds = date.getSeconds();
var ampm = hours >= 12 ? 'pm' : 'am';
hours = hours % 12;
hours = hours ? hours : 12; // the hour '0' should be '12'
minutes = minutes < 10 ? '0' + minutes : minutes;

var currentTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;

/////////////////////////////////////Allow admins to add calender year///////////////////////////////////////////
SupportRoute.post('/helpLine/add', (req, res) => {
    const year_id = crypto.randomBytes(14).toString('hex');

    const helpLineData = {
        id: year_id,
        number: req.body.number,
        created_at: today + " " + currentTime
    }

    HelpLineModel.create(helpLineData)
    .then(() => {
        res.json({ status: 'Registered' });
    })
    .catch(err => {
        res.send('error: ' + err);
    })
});

/////////////////////////////////////Get help lines/////////////////////////////////////////////////////////
SupportRoute.get('/helpLine', (req, res) => {
    HelpLineModel.findAll().then(helpLineNumber => res.json({ helpLineNumber }));
});

module.exports = SupportRoute;

