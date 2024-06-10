const mongoose = require('mongoose');
const Contract = require('./contract.model');
const Product = require('./product.model');

const InventorySchema = new mongoose.Schema({
  contract: {
    // type: String,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: true,
  },
  product: {
    // type: String,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  uniqueNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{7}$/.test(v);
      },
      message: props => `${props.value} is not a valid unique number (7 digits)`,
    },
  },
});

module.exports = mongoose.model('Inventory', InventorySchema);
