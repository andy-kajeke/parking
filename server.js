require('dotenv').config();
var request = require('request');
const cronJob = require('node-cron');
const fetch = require('node-fetch');
const express = require('express');
const bodyParser = require('body-parser');
const BookingModel = require('./api/bookings/booking.model');
const cors = require('cors');
require('body-parser-xml')(bodyParser);
const app = express();

app.use(bodyParser.xml({
    limit: '1MB',   // Reject payload bigger than 1 MB
    xmlParseOptions: {
      normalize: true,     // Trim whitespace inside text nodes
      normalizeTags: true, // Transform tags to lowercase
      explicitArray: false // Only put nodes in array if >1
    }
}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(process.env.APP_PORT, () => {
    console.log('server is running at http://localhost:' + process.env.APP_PORT);
});

////////////////////////////////////Date and time//////////////////////////////////////////////////////////////
var date = new Date();
let today = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
var hours = date.getHours();
var minutes = date.getMinutes();
var seconds = date.getSeconds();
var ampm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12;
hours = hours ? hours : 12; // the hour '0' should be '12'
minutes = minutes < 10 ? '0' + minutes : minutes;

var currentTime = hours + ':' + minutes + ' ' + ampm;

/////////////////update parking_status in booking table//////////////////////////////////////////
var parkingStatus = cronJob.schedule('* * * * *', () => {
    
    // console.log('updating booking table every 6mins');
    // BookingModel.findOne({
    //     where: {
    //         created_at: today
    //     }
    // }).then(record => {
    //     if(record){
    //         BookingModel.update({
    //             parking_status: 'Expired' 
    //         }, {
    //             where: { 
    //                 created_at: today,
    //                 endTime: currentTime
    //             }
    //         }).then(() => {
    //             console.log('updated record');
    //         })
    //     }
    // })
});

cronJob.schedule('* * * * *', () => {
    parkingStatus.start();
});

const adminRouter = require('./api/admin/admin.router');
const appusersRouter = require('./api/app_users/appusers.router');
const geographicsRouter = require('./api/geographics/geographics.router');
const parkingRouter = require('./api/parking/parking.router');
const accountsRouter = require('./api/accounts/accounts.router');
const bookingsRouter = require('./api/bookings/bookings.router');
const calendarRouter = require('./api/calendar/calendar.router');

app.use('/webapi/adminuser', adminRouter);
app.use('/webapi/appuser/', appusersRouter);
app.use('/webapi/geographics', geographicsRouter);
app.use('/webapi/parking', parkingRouter);
app.use('/webapi/accounts', accountsRouter);
app.use('/webapi/bookings', bookingsRouter);
app.use('/webapi/calendar', calendarRouter);
app.use('/item_photo', express.static('item_photos/'));

