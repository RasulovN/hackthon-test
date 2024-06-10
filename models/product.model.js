const mongoose = require('mongoose');
const Category = require('./category.model');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  // quantity: {
  //   type: Number,
  //   required: true
  // },
  category: {
    type: String,
    ref: 'Category',
    default: 'Unselect',
    required: true,
  },
});

module.exports = mongoose.model('Product', ProductSchema);
