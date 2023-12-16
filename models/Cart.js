const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
userId:mongoose.Schema.Types.ObjectId,
 products : Array
}
,
{
    timestamps : true
});

const Product = mongoose.model('cart', newSchema);

module.exports = Product;
