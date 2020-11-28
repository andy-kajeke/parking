const express = require('express');
const cors = require('cors');
const usersRoute = express.Router();
const jwt = require('jsonwebtoken');
const { genSaltSync, hashSync, compareSync } = require('bcryptjs');
const crypto = require("crypto");
const randomize = require('randomatic');
const dateTime = require('node-datetime');
const nodemailer = require('nodemailer'); 
const AppusersModel = require('./appusers.model');
const salt = genSaltSync(10);
usersRoute.use(cors());

/////////////////////////////////////Allow new admin users to sign up///////////////////////////////////////////
usersRoute.post('/create_account', (req, res) => {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    const admin_id = crypto.randomBytes(20).toString('hex');

    const appusersData = {
        id: admin_id,
        username: req.body.username,
        gender: req.body.gender,
        email: req.body.email,
        phone_number: req.body.phone_number,
        password: hashSync(req.body.password, salt),
        reset_code: '',
        created_at: today,
        updated_at: today
    }

    AppusersModel.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if (!user) {
            AppusersModel.create(appusersData)
                .then(user => {
                    res.json({ 
                        success: true,
                        message: user.username + ' welcome to Mi-space, you can now login' 
                    });
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

/////////////////////////////////////Allow users to login/////////////////////////////////////////////////
usersRoute.post('/login', (req, res) => {
    AppusersModel.findOne({
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
                        username: user.username,
                        email: user.email,
                        phone_number: user.phone_number,
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

/////////////////////////////////////Allow users to change passwords/////////////////////////////////////////////////
usersRoute.put('/change_password/:id', (req, res) => {
    const old_password = req.body.old_password;
    const new_password = hashSync(req.body.new_password, salt);

    AppusersModel.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if (user) {
            if (compareSync(old_password, user.password)) {

                AppusersModel.update({
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

    AppusersModel.findOne({
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
                subject: 'Rest mi-space account password',
                text: 'Hello ' + user.username + ', \nYour request to reset password has been acknowledged by mi-space. Use this vaildation code'+
                ' '+ vaildationCode + ' to reset password'
            }

            //step 3
            transporter.sendMail(mailOptions, (err, data) => {
                if(err){
                    console.log(err);
                }
                else{
                    console.log('Email sent..!!');

                    AppusersModel.update({
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

    AppusersModel.findOne({
        where: {
            email: req.body.email,
            reset_code: vaildationCode
        }
    })
    .then(user => {
        if (user) {
            AppusersModel.update({
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
                message: 'Incorrent vaildation code. Check your email and try again..'
            });
        }
    })
    .catch(err => {
        res.json({ error: err });
    });
});

//////////////////////////////////Get all app users////////////////////////////////////////////
usersRoute.get('/', (req, res) => {
    AppusersModel.findAll().then((app_users) => {
        res.json({app_users});
    })
})

module.exports = usersRoute;