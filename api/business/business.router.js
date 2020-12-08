const express = require('express');
const cors = require('cors');
const usersRoute = express.Router();
const jwt = require('jsonwebtoken');
const { genSaltSync, hashSync, compareSync } = require('bcryptjs');
const crypto = require("crypto");
const randomize = require('randomatic');
const dateTime = require('node-datetime');
const nodemailer = require('nodemailer');
const BusinessAdminModel = require('./business.model');
const salt = genSaltSync(10);
usersRoute.use(cors());

/////////////////////////////////////Allow new admin users to sign up///////////////////////////////////////////
usersRoute.post('/create_account', (req, res) => {
    const admin_id = crypto.randomBytes(20).toString('hex');

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

    const businessAdminData = {
        id: admin_id,
        property_name: req.body.property_name,
        landlord_code: req.body.landlord_code,
        email: req.body.email,
        password: hashSync(req.body.password, salt),
        reset_code: '',
        created_at: today + " " + currentTime,
        updated_at: today + " " + currentTime
    }

    BusinessAdminModel.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if (!user) {
            BusinessAdminModel.create(businessAdminData)
                .then(user => {

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
                        subject: 'Mi-space Account Opening Confirmation',
                        text: 'Hello ' + user.property_name + ', \nWelcome to Mi-space, your account has been created successfully. \n\n'+ 
                        'Here are your access credentials to mi-space portal. \nLink: https://mispace.andstonsolutions.com \n'+
                        'Email: '+ user.email + '\nPassword: '+ req.body.password + '\n\nNote: You are requested to change this password '+
                        'for security reasons just in case. \nThank you.'
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
                                message: user.property_name + ' Register' 
                            });
                        }
                    })
                })
                .catch(err => {
                    res.send('error: ' + err);
                })
        } else {
            res.json({ message: 'Email already exists' });
        }
    })
    .catch(err => {
        res.send('error: ' + err);
    })
});

/////////////////////////////////////Allow users to login on the portal/////////////////////////////////////////////////
usersRoute.post('/portal/login', (req, res) => {
    BusinessAdminModel.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(user => {
            if (user) {
                if (compareSync(req.body.password, user.password)) {
                    let token = jwt.sign(user.dataValues, process.env.SECURITY_KEY, {
                        expiresIn: "28d"
                    });
                    //res.send(token);
                    res.json({
                        is_user: true,
                        id: user.id,
                        property_name: user.property_name,
                        landlord_code: user.landlord_code,
                        email: user.email,
                        message: 'Logged in successfully',
                        userToken: token
                    });
                } else {
                    res.json({
                        is_user: false,
                        message: 'Email or password is incorrect'
                    });
                }
            } else {
                res.json({
                    is_user: false,
                    message: 'User does not exist'
                });
            }
        })
        .catch(err => {
            res.json({ error: err });
        });
});

/////////////////////////////////////Allow users to login on mobile gate/////////////////////////////////////////////////
usersRoute.post('/mobile_gate/login', (req, res) => {
    BusinessAdminModel.findOne({
            where: {
                landlord_code: req.body.landlord_code
            }
        })
        .then(user => {
            if (user) {
                res.json({
                    is_user: true,
                    id: user.id,
                    property_name: user.property_name,
                    landlord_code: user.landlord_code,
                    email: user.email,
                    message: 'Logged in successfully',
                });
            } else {
                res.json({
                    is_user: false,
                    message: 'Landlord does not exist'
                });
            }
        })
        .catch(err => {
            res.json({ error: err });
        });
});

/////////////////////////////////////Allow users to change passwords/////////////////////////////////////////////////
usersRoute.put('/change_password/:id', (req, res) => {
    const old_password = req.body.old_password;
    const new_password = hashSync(req.body.new_password, salt);

    BusinessAdminModel.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if (user) {
            if (compareSync(old_password, user.password)) {

                BusinessAdminModel.update({
                    password: new_password
                }, {
                    where: {email: req.body.email}
                })
                .then(() => {
                    res.json({
                        message: 'Password changed successfully'
                    })
                })
                .catch(err => {
                    res.json({ error: err });
                });

            } else {
                res.json({
                    message: 'Current password is incorrect'
                });
            }
        }
    })
    .catch(err => {
        res.json({ error: err });
    });
});

/////////////////////////////////////Allow users to rest passwords/////////////////////////////////////////////////
usersRoute.post('/forgot_password/', (req, res) => {
    var vaildationCode = randomize('0', 5);

    BusinessAdminModel.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if (user) {
            //step 1
            let transporter = nodemailer.createTransport({
                //service: 'andstonsolutions.com',
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
                subject: 'Rest Mi-space Account Password',
                text: 'Hello ' + user.username + ', \nYour request to reset password has been acknowledged by mi-space. Use this verification code'+
                ' '+ vaildationCode + ' to reset password'
            }

            //step 3
            transporter.sendMail(mailOptions, (err, data) => {
                if(err){
                    console.log(err);
                }
                else{
                    console.log('Email sent..!!');

                    BusinessAdminModel.update({
                        reset_code: vaildationCode
                    }, {
                        where: {email: req.body.email}
                    })
                    .then(() => {
                        res.json({
                            message: 'Email sent'
                        })
                    })
                }
            })
        }else{
            res.json({
                message: 'Email doesnot exit'
            })
        }
    })
    .catch(err => {
        res.json({ error: err });
    });
});

/////////////////////////////////////Allow users to rest passwords/////////////////////////////////////////////////
usersRoute.post('/reset_password/', (req, res) => {
    var vaildationCode = req.body.vaildation_code;
    var new_password = hashSync(req.body.new_password, salt);

    BusinessAdminModel.findOne({
        where: {
            email: req.body.email,
            reset_code: vaildationCode
        }
    })
    .then(user => {
        if (user) {
            BusinessAdminModel.update({
                password: new_password
            },{
                where: {email: req.body.email}
            })
            .then(() => {
                res.json({
                    message: 'Password has been reset successfully..'
                });
            })
        }else{
            res.json({
                message: 'Incorrent verification code. Check your email and try again..'
            });
        }
    })
    .catch(err => {
        res.json({ error: err });
    });
});

module.exports = usersRoute;






