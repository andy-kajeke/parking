const express = require('express');
const cors = require('cors');
const geographicsRoute = express.Router();
const jwt = require('jsonwebtoken');
const { genSaltSync, hashSync, compareSync } = require('bcryptjs');
const crypto = require("crypto");
const randomize = require('randomatic');
const dateTime = require('node-datetime');
//const { checkToken } = require('../../auth/token.vaildation');
const RegionModel = require('./regions.model');
const DistrictModel = require('./districts.model');
const CountyModel = require('./counties.model');
geographicsRoute.use(cors());

///////////////////////////////////////////////////Regions/////////////////////////////////////
geographicsRoute.post('/regions/create', (req, res) => {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var regionCode = randomize('0', 5);
    const region_id = crypto.randomBytes(15).toString('hex');

    const regionData = {
        id: region_id,
        region_code: regionCode,
        region_name: req.body.region_name,
        created_at: today,
        updated_at: today
    }

    RegionModel.create(regionData)
        .then(region => {
            res.json({ message: region.region_name + ' created successfully' });
        })
        .catch(err => {
            res.send('error: ' + err);
        })
});

geographicsRoute.get('/regions', (req, res) => {
    RegionModel.findAll(
        {order : [
            ['region_name', 'ASC']
        ]}
    ).then(regions => res.json({ regions }));
});

///////////////////////////////////////////////////Districts/////////////////////////////////////
geographicsRoute.post('/districts/create', (req, res) => {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var districtCode = randomize('0', 5);
    const district_id = crypto.randomBytes(15).toString('hex');

    const districtData = {
        id: district_id,
        region_name: req.body.region_name,
        district_code: districtCode,
        district_name: req.body.district_name,
        active_status: req.body.active_status,
        created_at: today,
        updated_at: today
    }

    DistrictModel.create(districtData)
        .then(district => {
            res.json({ message: district.district_name + ' created successfully' });
        })
        .catch(err => {
            res.send('error: ' + err);
        })
});

geographicsRoute.get('/districts', (req, res) => {
    DistrictModel.findAll(
        {order : [
            ['district_name', 'ASC']
        ]}
    ).then(districts => res.json({ districts }));
});

///////////////////////////////////////////////////Counties/////////////////////////////////////
geographicsRoute.post('/counties/create', (req, res) => {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var countyCode = randomize('0', 6);
    const county_id = crypto.randomBytes(15).toString('hex');

    const countyData = {
        id: county_id,
        county_code: countyCode,
        region_name: req.body.region_name,
        district_name: req.body.district_name,
        county_name: req.body.county_name,
        active_status: req.body.active_status,
        created_at: today,
        updated_at: today
    }

    CountyModel.create(countyData)
        .then(county => {
            res.json({ message: county.county_name + ' created successfully' });
        })
        .catch(err => {
            res.send('error: ' + err);
        })
});

geographicsRoute.get('/counties', (req, res) => {
    CountyModel.findAll(
        {order : [
            ['county_name', 'ASC']
        ]}
    ).then(counties => res.json({ counties }));
});


module.exports = geographicsRoute;