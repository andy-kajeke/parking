const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const BookingsRoute = express.Router();
const crypto = require("crypto");
const randomize = require('randomatic');
const BookingModel = require('./booking.model')

BookingsRoute.use(cors());

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

//////////////////////////////////Get all by month and year//////////////////////////////////////////////////////////////////////
BookingsRoute.get('/:month/:year', (req, res) => {
    BookingModel.findAll(
        {
            where: {
                month: req.params.month,
                year: req.params.year
            }
        }
    ).then(bookings => {
        res.json({bookings})
    });
});

//////////////////////////////////Get all by year//////////////////////////////////////////////////////////////////////
BookingsRoute.get('/:year', (req, res) => {
    BookingModel.findAll(
        {
            where: {
                year: req.params.year
            }
        }
    ).then(bookings => {
        res.json({bookings})
    });
});

//////////////////////////////////Get all by landlord_code, month and year/////////////////////////////////////////////////////////
BookingsRoute.get('/:landlord_code/:month/:year', (req, res) => {
    BookingModel.findAll(
        {
            where: {
                landlord_code: req.params.landlord_code,
                month: req.params.month,
                year: req.params.year
            }
        }
    ).then(bookings => {
        res.json({bookings})
    });
});

//////////////////////////////////Get all by landlord_code and year/////////////////////////////////////////////////////////
BookingsRoute.get('/:landlord_code/:year/all/bookings', (req, res) => {
    BookingModel.findAll(
        {
            where: {
                landlord_code: req.params.landlord_code,
                year: req.params.year
            }
        }
    ).then(bookings => {
        res.json({bookings})
    });
});

module.exports = BookingsRoute;