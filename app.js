var express = require('express');
const mongoose = require('mongoose');

var app = express();
const cors = require('cors');
const connect = require('./models/db')
app.use(express.json({ limit: '5mb' }));

app.use(cors());
ObjectId = mongoose.Types.ObjectId;
const adminRoute = require('./routes/admin');
const productRoute = require('./routes/product');
app.use('/admin', adminRoute);
app.use('/products', productRoute);

app.listen(process.env.PORT || 4000,async (err) => {
    await connect()
    if (err) throw err
    console.log('> Ready on http://localhost:4000')
})