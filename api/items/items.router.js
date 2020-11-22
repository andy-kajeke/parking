const express = require('express');
const cors = require('cors');
const ItemRoute = express.Router();
const multer = require('multer');
const RandExp = require('randexp');
const crypto = require("crypto");
// const { checkToken } = require('../../auth/token.vaildation');
const ItemModel = require('./items.model');

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./item_photos");
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
})

const upload = multer({ storage: storage })
ItemRoute.use(cors());


/////////////////////////////////////Adding new products///////////////////////////////////////////
ItemRoute.post('/add_to_catalogue', (req, res) => {
    const today = new Date();
    const item_id = crypto.randomBytes(15).toString('hex');

    const itemData = {
        id: item_id,
        product_barcode: req.body.product_barcode,
        product_name: req.body.product_name,
        manufactured_date: req.body.manufactured_date,
        expiry_date: req.body.expiry_date,
        company_name: req.body.company_name,
        city: req.body.city,
        state: req.body.state,
        province: req.body.province,
        location: req.body.location,
        postal_address: req.body.postal_address,
        plot_number: req.body.plot_number,
        contact: req.body.contact,
        email: req.body.email,
        website: req.body.website,
        created_at: today
    }

    ItemModel.findOne({
            where: {
                product_barcode: req.body.product_barcode
            }
        })
        .then(item => {
            if (!item) {
                ItemModel.create(itemData)
                    .then(item => {
                        res.json({ message: item.product_name + ' added to the catalogue' });
                    })
                    .catch(err => {
                        res.send('error: ' + err);
                    })
            } else {
                res.json({ message: 'Barcode already exists..!!' });
            }
        })
        .catch(err => {
            res.send('error: ' + err);
        })
});

/////////////////////////////////////Get all items in shop/////////////////////////////////////////////////////
ItemRoute.get('/', (req, res) => {
    ItemModel.findAll().then(products => res.json({ products }));
});

/////////////////////////////////////Get item by id////////////////////////////////////////////////////////////
ItemRoute.get('/:id', (req, res) => {
    ItemModel.findAll({
        where: {
            id: req.params.id
        }
    }).then(products => res.json({ products }));
});

/////////////////////////////////////Get item by product barcode////////////////////////////////////////////////////////////
ItemRoute.get('/product/:product_barcode', (req, res) => {
    ItemModel.findAll({
        where: {
            product_barcode: req.params.product_barcode
        }
    }).then(products => res.json({ products }));
});

/////////////////////////////////////Update a item record by Id/////////////////////////////////////////////////
ItemRoute.put('/item/update-info/:item_code', (req, res) => {
    ItemModel.update({
        product_name: req.body.product_name,
        product_barcode: req.body.product_barcode
    }, {
        where: {
            product_barcode: req.params.product_barcode
        }
    }).then(user => res.json({
        message: 'Updated successfully'
    }))
});


module.exports = ItemRoute;