const express = require('express');
const postController = require('../controller/post.controller');

const router = express.Router()



// Category 
router.post("/add-category", postController.addCategory)
      .get("/category", postController.getCategory)
      .put("/category/:id", postController.updateCategory)
      .delete("/category/:id", postController.deleteCategory);

// Product 
router.post("/add-product", postController.addProduct)
      .get("/product", postController.getProduct)
      .put("/product/:id", postController.updateProduct)
      .delete("/product/:id", postController.deleteProduct);

// Contract
router.post("/add-contract", postController.addContract)
      .get("/contract", postController.getContract)
      .put("/contract/:id", postController.updateContract)
      .delete("/contract/:id", postController.deleteConract);

// Inventory
router.post("/add-inventory", postController.addInventory)
      .get("/inventory", postController.getInventory)
      .put("/inventory/:id", postController.updateInventory)
      .delete("/inventory/:id", postController.deleteInventory);
  
  

module.exports = router