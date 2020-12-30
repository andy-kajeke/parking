const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const BookingsRoute = express.Router();
const crypto = require("crypto");
const randomize = require('randomatic');
const BookingModel = require('./booking.model')

BookingsRoute.use(cors());

//////////////////////////////////Get all by month and year//////////////////////////////////////////////////////////////////////
BookingsRoute.get('/:month/:year', (req, res) => {
    BookingModel.findAll(
        {
            where: {
                month: req.params.month,
                year: req.params.year,
                payment_status: 'SUCCESS',
            },
            order: [
                ['updated_at', 'ASC']
            ]
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
                year: req.params.year,
                payment_status: 'SUCCESS'
            },
            order: [
                ['updated_at', 'ASC']
            ]
        }
    ).then(bookings => {
        res.json({bookings})
    });
});

//////////////////////////////////Get all by landlord_code//////////////////////////////////////////////////////////////////////
BookingsRoute.get('/all/landlord/success/:landlord_code', (req, res) => {
    var date = new Date();
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    BookingModel.findAll(
        {
            where: {
                landlord_code: req.params.landlord_code,
                payment_status: 'SUCCESS',
                month: monthNames[date.getMonth()],
                year: date.getFullYear()
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
                year: req.params.year,
                payment_status: 'SUCCESS'
            },
            order: [
                ['created_at', 'ASC']
            ]
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
                year: req.params.year,
                payment_status: 'SUCCESS'
            },
            order: [
                ['month', 'ASC']
            ]
        }
    ).then(bookings => {
        res.json({bookings})
    });
});

module.exports = BookingsRoute;