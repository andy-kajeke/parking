const express = require('express');
const cors = require('cors');
const usersRoute = express.Router();
const jwt = require('jsonwebtoken');
const { genSaltSync, hashSync, compareSync } = require('bcryptjs');
const crypto = require("crypto");
const randomize = require('randomatic');
const dateTime = require('node-datetime');
//const { checkToken } = require('../../auth/token.vaildation');
const AdminModel = require('./admin.model');
usersRoute.use(cors());

/////////////////////////////////////Allow new admin users to sign up///////////////////////////////////////////
usersRoute.post('/create_account', (req, res) => {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    const admin_id = crypto.randomBytes(20).toString('hex');
    const salt = genSaltSync(10);

    const adminData = {
        id: admin_id,
        username: req.body.username,
        email: req.body.email,
        password: hashSync(req.body.password, salt),
        created_at: today,
        updated_at: today
    }

    AdminModel.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if (!user) {
            AdminModel.create(adminData)
                .then(user => {
                    res.json({ status: user.username + ' registered' });
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
    AdminModel.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(user => {
            if (user) {
                if (compareSync(req.body.password, user.password)) {
                    let token = jwt.sign(user.dataValues, process.env.SECURITY_KEY, {
                        expiresIn: "14d"
                    });
                    res.send(token);
                    // res.json({
                    //     is_user: true,
                    //     id: user.id,
                    //     username: user.username,
                    //     email: user.email,
                    //     message: 'Logged in successfully',
                    //     userToken: token
                    // });
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

/////////////////////////////////////Allow admin to change passwords/////////////////////////////////////////////////
usersRoute.put('/admin/change_password/:id', (req, res) => {
    const old_password = req.body.old_password;
    const new_password = req.body.new_password;

    AdminModel.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if (user) {
            if (compareSync(old_password, user.password)) {

                AdminGpaidVendorModel.update({
                    password: hashSync(new_password, salt),
                    updated_at: today + " " + currentTime
                }, {
                    where: {
                        id: req.params.id
                    }
                })
                .then(user => res.json({
                    message: 'Password changed successfully'
                }));

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


module.exports = usersRoute;