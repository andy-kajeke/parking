const express = require('express');
const cors = require('cors');
const ParkingRoute = express.Router();
const multer = require('multer');
const cronJob = require('node-cron')
const fetch = require('node-fetch');
const crypto = require("crypto");
const randomize = require('randomatic');
const dateTime = require('node-datetime');
// const { checkToken } = require('../../auth/token.vaildation');
const ParkingModel = require('./parking.model');
const ParkingSlotsModel = require('./parking.slots.model');
const ChargeModel = require('./charges.model');
const BookingModel = require('../bookings/booking.model');
const AccountBalanceModel = require('../accounts/accountBalance.model');

ParkingRoute.use(cors());

////////////////////////////////////Date and time//////////////////////////////////////////////////////////////

/////////////////////////////////////Adding new landlord///////////////////////////////////////////
ParkingRoute.post('/landlord/register', (req, res) => {
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

    var landlordCode = randomize('0', 6);
    const parking_id = crypto.randomBytes(15).toString('hex');

    const parkingData = {
        id: parking_id,
        landlord_code: landlordCode,
        business_name: req.body.business_name,
        property_name: req.body.property_name,
        district: req.body.district,
        county: req.body.county,
        postal_address: req.body.postal_address,
        physical_address: req.body.physical_address,
        numberOfSlots: req.body.numberOfSlots,
        reservedSlots: req.body.reservedSlots,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        chargePerHour: req.body.chargePerHour,
        office_contact: req.body.office_contact,
        office_other_contact: req.body.office_other_contact,
        email: req.body.email,
        director_surname: req.body.director_surname,
        director_middle_name: req.body.director_middle_name,
        director_other_name: req.body.director_other_name,
        director_gender: req.body.director_gender,
        director_nationality: req.body.director_nationality,
        director_countryOfResidence: req.body.director_countryOfResidence,
        director_contact: req.body.director_contact,
        director_email: req.body.director_email,
        bank_name: req.body.bank_name,
        bank_branch: req.body.bank_branch,
        bank_account_name: req.body.bank_account_name,
        bank_account_number: req.body.bank_account_number,
        created_at: today + " " + currentTime,
        updated_at: today + " " + currentTime
    }

    const accountsData = {
        id: account_id,
        landlord_code: landlordCode,
        property_name: req.body.property_name,
        actual_balance: '0.00',
        commission: '0.00',
        available_balance: '0.00',
        created_at: today + ' ' + currentTime
    }

    ParkingModel.create(parkingData)
    .then(landlord => {
        res.json({ message: landlord.business_name + ' registered successfully' });

        AccountBalanceModel.create(accountsData)
    })
    .catch(err => {
        res.send('error: ' + err);
    })
});

/////////////////////////////////////Get all landloards/////////////////////////////////////////////////////
ParkingRoute.get('/landlords', (req, res) => {
    ParkingModel.findAll().then(landlords => res.json({ landlords }));
});

/////////////////////////////////////Get record by landloard_code////////////////////////////////////////////////////////////
ParkingRoute.get('/:landlord_code', (req, res) => {
    ParkingModel.findAll({
        where: {
            landlord_code: req.params.landlord_code
        }
    }).then(landlords => res.json({ landlords }));
});

/////////////////////////////////////Get record by district////////////////////////////////////////////////////////////
ParkingRoute.get('/district/:district', (req, res) => {
    ParkingModel.findAll({
        where: {
            district: req.params.district
        }
    }).then(landlords => res.json({ landlords }));
});

/////////////////////////////////////Get record by county////////////////////////////////////////////////////////////
ParkingRoute.get('/county/:county', (req, res) => {
    ParkingModel.findAll({
        where: {
            county: req.params.county
        }
    }).then(parkingSpaces => res.json({ parkingSpaces }));
});

/////////////////////////////////////Update a record by Id/////////////////////////////////////////////////
ParkingRoute.put('/update-info/:id', (req, res) => {
    ParkingModel.update({
        company_name: req.body.company_name,
        //product_barcode: req.body.product_barcode
    }, {
        where: {
            id: req.params.id
        }
    }).then(user => res.json({
        message: 'Updated successfully'
    }))
});

/////////////////////////////////////Adding new charge///////////////////////////////////////////
ParkingRoute.post('/charge/register', (req, res) => {
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

    var landlordCode = randomize('0', 4);
    const charge_id = crypto.randomBytes(15).toString('hex');

    const chargeData = {
        id: charge_id,
        charge_code: landlordCode,
        amount: req.body.amount,
        created_at: today,
        updated_at: today + " " + currentTime
    }

    ChargeModel.findOne({
            where: {
                amount: req.body.amount
            }
        })
        .then(landlord => {
            if (!landlord) {
                ChargeModel.create(chargeData)
                    .then(landlord => {
                        res.json({ message: landlord.amount + ' registered successfully' });
                    })
                    .catch(err => {
                        res.send('error: ' + err);
                    })
            } else {
                res.json({ message: 'Amount already exists..!!' });
            }
        })
        .catch(err => {
            res.send('error: ' + err);
        })
});

/////////////////////////////////////Get all charges/////////////////////////////////////////////////////
ParkingRoute.get('/charges/amount', (req, res) => {
    ChargeModel.findAll(
        {order : [
            ['amount', 'ASC']
        ]}
    ).then(amounts => res.json({ amounts }));
});

/////////////////////////////////////////Total duration for parking/////////////////////////////////////
ParkingRoute.post('/totalDurration', (req,res) => {

    var timeStart = new Date("01/01/2020 " + req.body.timeStart);
    var timeEnd = new Date("01/01/2020 " + req.body.timeEnd);

    var diff = (timeEnd - timeStart) / 60000; //dividing by seconds and milliseconds

    var minutes = diff % 60;
    var hours = (diff - minutes) / 60;
    console.log("total: "+hours +":"+minutes);

    res.json({
        hours: hours,
        minutes: minutes,
        totalDurration: hours +":"+minutes + " hr(s)"
    });
});

/////////////////////////////////////Adding new booking///////////////////////////////////////////
ParkingRoute.post('/book/now', (req, res) => {
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

    var bookingCode = randomize('0', 7);
    const booking_id = crypto.randomBytes(15).toString('hex');
    const ticket_id = crypto.randomBytes(3).toString('hex');

    const bookingData = {
        id: booking_id,
        user_id: req.body.user_id,
        booking_code: bookingCode,
        landlord_code: req.body.landlord_code,
        property_name: req.body.property_name,
        customer_name: req.body.customer_name,
        number_plate: req.body.number_plate,
        slot_ref: ticket_id.toUpperCase(),
        slot_name: req.body.slot_name,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        totalTime: req.body.totalTime,
        payment: req.body.payment,
        transactionId: '',
        payment_status: 'PENDING',
        parking_status: 'Free',
        contact: req.body.contact,
        email: req.body.email,
        month: monthNames[date.getMonth()], 
        year: date.getFullYear(),
        created_at: today,
        updated_at: today + " " + currentTime
    }

    BookingModel.create(bookingData)
    .then(booking => {
        res.json({
            bookingCode: booking.booking_code,
            slotLable: booking.slot_name,
            landlordCode: booking.landlord_code, 
            message: booking.property_name + ' parking booked successfully make payments'});
    })
    .catch(err => {
    res.send('error: ' + err);
    })
});

/////////////////////////////////////Payments/////////////////////////////////////////////////////////
ParkingRoute.post('/deposit/payment/booking', (req, res) => {
    var business_code = '74983'; 
    var msisdn = req.body.msisdn;
    var amount = req.body.amount;
    var bookingCode = req.body.booking_code;
    var slotLable = req.body.slot_name;
    var landlordCode = req.body.landlord_code;

    let paymentData = {
        msisdn: msisdn,
        amount: amount,
        business_code: business_code
    };

    //http://vendors-gpaid.akhaninnovates.com

    if(res.statusCode == 200){
        fetch('http://vendors-gpaid.akhaninnovates.com/webapi/transaction/deposit', {
            method: 'POST',
            body: JSON.stringify(paymentData),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())  
        .then(response => {
            console.log(response) 
            res.send(response)

            if(response['message'] == 'Transaction is being processed'){ 
                BookingModel.findOne({
                    where: {
                        booking_code: bookingCode,
                        slot_name: slotLable,
                        landlord_code: landlordCode
                    }
                }).then(() => {
                    BookingModel.update({
                        transactionId: response['transactionId'],
                        payment: amount
                    },{
                        where: {
                            booking_code: bookingCode,  
                        }
                    })
                }) 
            }
        })
    }else{
        
    }
})

///////////////////////////////update from pay-leo/////////////////////////////////////////////////////
ParkingRoute.post('/deposit/payment/booking/update', (req, res, body) => {

    // Any request with an XML payload will be parsed
    // and a JavaScript object produced on req.body
    // corresponding to the request payload.
    console.log(req.body);
    var response = req.body;

    if(response['paymentStatus'] == 'receivePayment'){
        BookingModel.findOne({
            where: {
                transactionId : response['transactionId'],
                payment: response['amount']
            }
        }).then(() => {
            BookingModel.update({
                payment_status: 'SUCCESS',
                parking_status: 'Active'
            }, {
                where: {
                    transactionId : response['transactionId']
                }
            }).then(() => {});
        });
    }
    else if(response['paymentStatus'] == 'notifyFailedPayment'){
        BookingModel.findOne({
            where: {
                transactionId : response['transactionId'],
                payment: response['amount']
            }
        }).then(() => {
            BookingModel.update({
                payment_status: 'FAILED'
            }, {
                where: {
                    transactionId : response['transactionId']
                }
            }).then(() => {});
        });
    }
    else{
        console.log('Something went wrong');
    }

    res.status(200).end(); 
}); 

/////////////////////////////////////Get all bookings/////////////////////////////////////////////////////
ParkingRoute.get('/bookings/all', (req, res) => {
    BookingModel.findAll(
        {order : [
            ['updated_at', 'DESC']
        ]}
    ).then(bookings => res.json({ bookings }));
});

/////////////////////////////////////Get all bookings monthly value/////////////////////////////////////////////////////
ParkingRoute.get('/bookings/all/bookingsValue', (req, res) => {
    var date = new Date();
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    BookingModel.sum(
        'payment',
        {
            where: {
                payment_status: 'SUCCESS',
                month: monthNames[date.getMonth()], 
                year: date.getFullYear()
            }
        } 
    ).then(money => res.json({ money })); 
});

/////////////////////////////////////Get all bookings of a landlord/////////////////////////////////////////////////////
ParkingRoute.get('/bookings/all/landlord/:landlord_code', (req, res) => {
    BookingModel.findAll(
        {
            where: {
                landlord_code: req.params.landlord_code  
            }
        }
    ).then(bookings => res.json({ bookings }));
});

/////////////////////////////////////Get all bookings mothly value for landlords////////////////////////////////////////////////
ParkingRoute.get('/bookings/all/landlord/bookingsValue/:landlord_code', (req, res) => {
    var date = new Date();
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    BookingModel.sum(
        'payment',
        {
            where: {
                payment_status: 'SUCCESS',
                month: monthNames[date.getMonth()], 
                year: date.getFullYear()
            }
        }
    ).then(money => {
        res.json({ money });

        if(money == 0){
            AccountBalanceModel.update({
                actual_balance: '0.00',
                commission: '0.00',
                available_balance: '0.00'
            },{
                where: {landlord_code: req.params.landlord_code}
            });
        }else{
            var actual = money;
            var comm = (money) * (25 / 100);
            var available = actual - comm;

            AccountBalanceModel.update({ 
                actual_balance: actual,
                commission: comm,
                available_balance: available,
                created_at: today + ' ' + currentTime
            },{
                where: {landlord_code: req.params.landlord_code}
            });
        }
    });
});

/////////////////////////////////////Get all account balances/////////////////////////////////////////////////////
ParkingRoute.get('/bookings/all/value/accountBalances', (req, res) => {
    AccountBalanceModel.findAll({
        order : [
            ['created_at', 'DESC']
        ]
    }).then(accounts => res.json({ accounts }));
});

/////////////////////////////////////Get all bookings of a app users/////////////////////////////////////////////////////
ParkingRoute.get('/bookings/all/appusers/:user_id', (req, res) => {
    BookingModel.findAll(
        {
            where: {
            user_id: req.params.user_id,
            payment_status: 'SUCCESS' 
        },
        order : [
            ['updated_at', 'DESC']
        ]
    }
    ).then(bookings => res.json({ bookings }));
});

/////////////////////////////////////Get all bookings of a specific date///////////////////////////////////////////////////
ParkingRoute.get(`/bookings/all/today/:month`, (req, res) => {
    BookingModel.findAll(
        {where: {
            month: req.params.month,
            payment_status: 'SUCCESS' 
        }}
    ).then(bookings => res.json({ bookings }));
});

/////////////////////////////////////Get all bookings of a specific slot//////////////////////////////////////////////////
ParkingRoute.get(`/bookings/all/today/slot/:slot_name/:created_at`, (req, res) => {
    BookingModel.findAll(
        {where: {
            slot_name: req.params.slot_name,
            created_at: req.params.created_at,
            payment_status: 'SUCCESS' 
        }}
    ).then(bookings => res.json({ bookings }));
});

/////////////////////////////////////Adding new parking slots///////////////////////////////////////////
ParkingRoute.post('/parking_slots', (req, res) => {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');

    const slot_id = crypto.randomBytes(20).toString('hex');
    const slot_start = req.body.slot_start;
    const slot_end = req.body.slot_end;

    const slotData = {
        id: slot_id,
        landlord_code: req.body.landlord_code,
        slot_name: req.body.slot_name,
        slot_status: req.body.slot_status,
        parking_status: req.body.parking_status,
        created_at: today,
        updated_at: today
    }

    ParkingSlotsModel.create(slotData)
    .then(slot => {
        res.json({ message : 'Parking saved successfully.'});
    })
    .catch(err => {
    res.send('error: ' + err);
    })
});
/////////////////////////////////////Get all bookings/////////////////////////////////////////////////////
ParkingRoute.get('/space/slots/all', (req, res) => {
    ParkingSlotsModel.findAll(
        {
            order : [
            ['created_at', 'ASC']
        ]}
    ).then(slots => res.json({ slots }));
});

/////////////////////////////////////Get all free parking slots for a landlord/////////////////////////////////////
ParkingRoute.get('/space/slots/all/:landlord_code/:slot_status', (req, res) => {
    ParkingSlotsModel.findAll(
        {where: {
            landlord_code: req.params.landlord_code, 
            slot_status: req.params.slot_status
        },
        order : [
            ['created_at', 'ASC']
        ]}
    ).then(slots => res.json({ slots }));
});

module.exports = ParkingRoute;