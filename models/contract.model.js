const mongoose = require('mongoose');
// const Product = require('./product.model');

const ContractSchema = new mongoose.Schema({
  contractNumber: {
    type: String,
    required: true,
    unique: true,
  },
  date: Date,
  listProducts: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      price: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
    },
  ],
});

   
module.exports = mongoose.model('Contract', ContractSchema);
