const express = require('express');
const cors = require('cors');
const TenantRoute = express.Router();
const multer = require('multer');
const randomize = require('randomatic');
const nodemailer = require('nodemailer');
const crypto = require("crypto");
// const { checkToken } = require('../../auth/token.vaildation');
const TenantModel = require('./tenants.model');
const TenantBookingsModel = require('./tenantBookings.model');
const LandlordModel = require('../parking/parking.model');

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./tenant_photos");
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
})

const upload = multer({ storage: storage }).single('file')
TenantRoute.use(cors());

/////////////////////////////////////Adding new tenant//////////////////////////////////////////
TenantRoute.post('/register', upload, (req, res) => {
    const tenant_id = crypto.randomBytes(15).toString('hex');
    const TC = crypto.randomBytes(3).toString('hex').toUpperCase();

    var date = new Date();
    let today = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var currentTime = hours + ':' + minutes + ' ' + ampm + seconds;

    const tenantData = {
        id: tenant_id,
        landlord_code: req.body.landlord_code,
        tenant_code: 'T' + req.body.landlord_code + '-' + TC,
        tenant_name: req.body.tenant_name,
        contact: req.body.contact,
        email: req.body.email,
        tenant_photo: 'https://service.andstonsolutions.com/tenant_photo/' + req.file.originalname,
        created_at: today + ' ' + currentTime,
        updated_at: today + ' ' + currentTime
    }

    TenantModel.create(tenantData)
    .then(tenant => {
        res.json({ message: tenant.slot_name + ' reserved for ' + tenant.tenant_name });
    })
    .catch(err => {
        res.send('error: ' + err);
    })
});

/////////////////////////////////////Get all tenant booking ///////////////////////////////////////////////////////////////////////////
TenantRoute.get('/', (req, res) => {
    TenantModel.findAll({
        order: [
            ['tenant_name', 'ASC']
        ]
    }).then(tenants => res.json({ tenants }));
});

/////////////////////////////////////Get tenant booking by landlord_code and slot_name////////////////////////////////////////////////
TenantRoute.get('/all/:landlord_code', (req, res) => {
    TenantModel.findAll({
        where: {
            landlord_code: req.params.landlord_code
        },
        order: [
            ['tenant_name', 'ASC']
        ]
    }).then(tenants => res.json({ tenants }));
});

/////////////////////////////////////Adding new tenant//////////////////////////////////////////
TenantRoute.post('/reserve_parking', upload, (req, res) => {
    const tenant_id = crypto.randomBytes(15).toString('hex');
    const TC = crypto.randomBytes(3).toString('hex').toUpperCase();

    var date = new Date();
    let today = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var currentTime = hours + ':' + minutes + ' ' + ampm + seconds;

    const tenantBookingData = {
        id: tenant_id,
        landlord_code: req.body.landlord_code,
        tenant_code: req.body.tenant_code,
        tenant_name: req.body.tenant_name,
        slot_name: req.body.slot_name,
        amount: req.body.amount,
        receipt_id: req.body.receipt_id,
        month: req.body.month,
        year: req.body.year,
        contact: req.body.contact,
        email: req.body.email,
        tenant_photo: req.body.tenant_photo,
        created_at: today + ' ' + currentTime,
        updated_at: today + ' ' + currentTime
    }

    LandlordModel.findOne({
        where: {
            landlord_code: req.body.landlord_code
        }
    })
    .then(lord => {
        if(lord){
            TenantBookingsModel.findOne({
                where: {
                    slot_name: req.body.slot_name,
                    month: req.body.month,
                    year: req.body.year,
                }
            })
            .then(reservedSlot => {
                if(!reservedSlot){
                    TenantBookingsModel.create(tenantBookingData)
                    .then(tenant => {
                        //step 1
                        let transporter = nodemailer.createTransport({
                            host: 'andstonsolutions.com',
                            port: 465,
                            secure: true,
                            auth: {
                                user: process.env.EMAIL,
                                pass: process.env.PASSWORD
                            }
                        });
        
                        //step 2  
                        let mailOptions = {
                            from: process.env.EMAIL, 
                            to: user.email,
                            subject: 'Mi-space Tenant Parking Reservation',
                            text: 'Hello ' + reservedSlot.tenant_name + ', \nHope this finds you well, your monthly parking space reservation at ' + lord.property_name.toUpperCase() +' has been resolved successfully. \n\n'+ 
                            'Here are your parking space details. \nSlot Lable: ' + reservedSlot.slot_name + ' \n'+
                            'Month: '+ reservedSlot.month + '\nYear: '+ reservedSlot.year + '\n\nNote: This reservation is only vaild for one monthy '+
                            '\nThank you..!!'
                        }
                        //step 3 send confirmatiom email
                        transporter.sendMail(mailOptions, (err, data) => {
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log('Email sent..!!');
                                res.json({ 
                                    success: true,
                                    message: tenant.slot_name + ' reserved for ' + tenant.tenant_name 
                                });
                            }
                        })
                    })
                    .catch(err => {
                        res.send('error: ' + err);
                    })
                }
                else{
                    res.json({ message: 'Slot is already reserved for someone else' });
                }
            })
        }
        else{
            res.json({ message: 'Landlord doesnot exist' });
        }
    })
    
});

/////////////////////////////////////Get tenant booking by landlord_code and slot_name////////////////////////////////////////////////
TenantRoute.get('/reserve_parking/:landlord_code/:slot_name', (req, res) => {

    var date = new Date();
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    TenantBookingsModel.findOne({
        where: {
            landlord_code: req.params.landlord_code,
            slot_name: req.params.slot_name,
            month: monthNames[date.getMonth()],
            year: date.getFullYear()
        }
    }).then(reserved => res.json({ reserved }));
});


module.exports = TenantRoute;