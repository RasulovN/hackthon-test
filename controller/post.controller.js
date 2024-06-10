const Category = require("../models/category.model");
const Contract = require("../models/contract.model");
const Inventory = require("../models/inventory.model");
const Product = require("../models/product.model");

class PostController {
  // Add
  async addCategory(req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json("Hamma maydon to'ldirliishi kerak!");
      }
      const category = new Category(req.body);
      const categoryDb = await Category.find({ name });
      for (const nameDB of categoryDb) {
        if (nameDB.name === name) {
          return res
            .status(400)
            .json(
              `Bunday: ${category.name} Kategorya mavjud, katolog bir xil bo'lishi mumkin emas!`
            );
        }
      }
      await category.save();
      res.status(200).json(category);
    } catch (error) {
      res.status(500).send(error);
      console.log(error);
    }
  }
  async addProduct(req, res) {
    try {
      const { name, category, model, price } = req.body;
      if (!model || !price || !name || name === "") {
        return res.status(400).json("Iltimos, maydonlarni to'ldiring.");
      }
      if (name.length < 3 || name.length > 50) {
        return res
          .status(400)
          .json("Nomi 3 dan 50 belgidan iborat bo'lishi kerak");
      }
      const foundProduct = await Product.find({ name, category, model, price });
      for (const founProDB of foundProduct) {
        if (
          founProDB.name === name ||
          founProDB.model === model ||
          founProDB.price === price ||
          founProDB.category === category
        ) {
          return res
            .status(400)
            .json("Hamma harkteristikasi bir xil mahsulot qo'sha olmaysiz.");
        }
      }
      const foundCategory = await Category.findOne({ name: category });
      if (!foundCategory) {
        return res.status(404).json("Kategoriya topilmadi");
      }

      const newProduct = new Product({
        name,
        model,
        price,
        category: foundCategory.name,
      });

      await newProduct.save();
      res.status(201).json("Mahsulot qo'shildi");
    } catch (error) {
      // console.log(error);
      res.status(500).send(error);
    }
  }

  async addContract(req, res) {
    try {
      const { contractNumber, listProducts } = req.body;

      const foundContract = await Contract.find();
      if (!contractNumber || !listProducts) {
        return res.status(400).json("Iltimos, maydonlarni to'ldiring");
      }
      if (contractNumber === "" || listProducts === "") {
        return res
          .status(400)
          .json("Maydonlarni bo'sh bo'lishi mumkin emas, to'ldiring");
      }
      for (const productItem of listProducts) {
        // bu yerda productItem.quantity ni manfiy va 01  qiymati uchun shart yuq -1 01 001 kabi qiymatlar test qilinmasin
        if (!productItem.product || !productItem.quantity) {
          return res
            .status(400)
            .json("Maydonlarni bo'sh bo'lishi mumkin emas, to'ldiring");
        }
        if (
          productItem.product.length !== 24 ||
          productItem.product.length !== 24
        ) {
          return res
            .status(404)
            .json(
              `Product: ${productItem.product} to'liq emas, 24 ta simvoldan kam yoki ko'p bo'lishi mumkin emas`
            );
        }
      }
      for (const foundNumber of foundContract) {
        if (foundNumber.contractNumber === contractNumber) {
          return res
            .status(400)
            .json(
              "Bunday nomli Contract mavjud, Contract nomi bir birga o'xshamasligi kerak"
            );
        }
      }

      const contract = new Contract({
        contractNumber: contractNumber,
        listProducts: [],
      });

      for (const productItem of listProducts) {
        const productDB = await Product.findById(productItem.product);

        if (productDB) {
          if (productDB.price) {
            contract.listProducts.push({
              product: productItem.product,
              price: productDB.price,
              quantity: productItem.quantity,
            });
          } else {
            return res
              .status(404)
              .json(`Mahsulot narxi topilmadi: ${productItem.product}`);
          }
        } else {
          return res
            .status(404)
            .json(`Mahsulot topilmadi: ${productItem.product}`);
        }
      }

      await contract.save();

      res.status(200).json(contract);
    } catch (error) {
      // console.log(error);
      res.status(500).send(error);
    }
  }
  async addInventory(req, res) {
    try {
      // const { contract, product }  = req.body;
      const contract = req.body.contract;
      const product = req.body.product;

      // Agar contract va product ma'lumotlari to'liq emas yoki 24 ta simvoldan kam yoki teng bo'lsa
      if (!contract || contract.length !== 24) {
        return res
          .status(400)
          .json(
            `Contract: ${contract} to'liq emas yoki 24 ta simvoldan kam yoki teng bo'lishi mumkin emas`
          );
      }
      if (!product || product.length !== 24) {
        return res
          .status(400)
          .json(
            `Product: ${product} to'liq emas yoki 24 ta simvoldan kam yoki teng bo'lishi mumkin emas`
          );
      }

      const foundContract = await Contract.findById(contract);
      const foundProduct = await Product.findById(product);
      // Contract va Product topilmaganda
      if (!foundContract) {
        return res.status(404).json(`Bunday ${contract} contract topilmadi`);
      }
      if (!foundProduct) {
        return res.status(404).json(`Bunday ${product} product topilmadi`);
      }

      if (!foundContract.id === contract) {
        return res.status(404).json("Berilgan kontrakt mos emas");
      }
      if (!foundProduct.id === product) {
        return res.status(404).json("Berilgan product mos emas topilmadi");
      }
      function generateRandomNumber() {
        const randomNumber = Math.floor(Math.random() * 10000000);
        return String(randomNumber).padStart(7, "0");
      }

      const randomNumber = generateRandomNumber();

      const inventory = new Inventory({
        contract: foundContract._id,
        product: foundProduct._id,
        uniqueNumber: randomNumber,
      });

      await inventory.save();

      res.status(200).json(inventory);
    } catch (error) {
      // console.log('error:', error);
      res.status(500).send(error);
    }
  }

  // GET

  async getCategory(req, res) {
    try {
      const category = await Category.find();
      res.status(200).json(category);
    } catch (error) {
      res.status(500).send(error);
    }
  }
  async getProduct(req, res) {
    try {
      const product = await Product.find();
      res.status(200).json(product);
    } catch (error) {
      res.status(500).send(error);
    }
  }
  async getContract(req, res) {
    try {
      const contracts = await Contract.find();
      res.status(200).json(contracts);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getInventory(req, res) {
    try {
      const inventory = await Inventory.find();
      res.status(200).json(inventory);
    } catch (error) {
      res.status(500).send(error);
    }
  }
  // Update
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) {
        return res.status(400).json("Hamma maydon to'ldirliishi kerak!");
      }
      const category = new Category(req.body);
      const categoryDb = await Category.find({ name });
      for (const nameDB of categoryDb) {
        if (nameDB.name === name) {
          return res
            .status(400)
            .json(
              `Bunday: ${category.name} Kategorya mavjud, katolog bir xil bo'lishi mumkin emas!`
            );
        }
      }
      const updatedCategory = await Category.findByIdAndUpdate(id, body);

      if (!updatedCategory) {
        return res.status(404).json("Kategoriya topilmadi");
      }

      res.status(200).json("Kategoriya yangilandi");
    } catch (error) {
      res.status(500).send(error);
      // console.log(error);
    }
  }
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const body = req.body;
      const { name, category, model, price } = req.body;
      if (!id || id.length !== 24 || id.length !== 24) {
        return res
          .status(404)
          .json(
            "ID to'liq emas, 24 ta simvoldan kam yoki ko'p bo'lishi mumkin emas"
          );
      }
      if (!body || !model || !price || !name) {
        return res.status(400).json("Iltimos, maydonlarni to'ldiring.");
      }
      if (name.length < 3 || name.length > 50) {
        return res
          .status(400)
          .json("Nomi 3 dan 50 belgidan iborat bo'lishi kerak");
      }
      const foundProduct = await Product.find({ name, category, model, price });
      for (const founProDB of foundProduct) {
        if (
          founProDB.name === name ||
          founProDB.model === model ||
          founProDB.price === price ||
          founProDB.category === category
        ) {
          return res
            .status(400)
            .json("Hamma harkteristikasi bir xil mahsulot qo'sha olmaysiz.");
        }
      }
      // Kategoriya nomini bazadan topish
      const foundCategory = await Category.findOne({ name: category });
      if (!foundCategory) {
        return res.status(404).json("Kategorya mos kelmadi");
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, body, {
        new: true,
      });

      if (!updatedProduct) {
        return res.status(404).json("Product topilmadi");
      }

      res.status(200).json("Product yangilandi");
    } catch (error) {
      res.status(500).send(error);
    }
  }
  async updateContract(req, res) {
    try {
      const { id } = req.params;
      const { contractNumber, listProducts } = req.body;
      const foundContract = await Contract.find();
      if (!id || id.length !== 24 || id.length !== 24) {
        return res
          .status(404)
          .json(
            "ID to'liq emas, 24 ta simvoldan kam yoki ko'p bo'lishi mumkin emas"
          );
      }
      if (!contractNumber || !listProducts) {
        return res.status(400).json("Iltimos, maydonlarni to'ldiring");
      }
      if (contractNumber === "" || !listProducts === "") {
        return res
          .status(400)
          .json("Maydonlarni bo'sh bo'lishi mumkin emas, to'ldiring");
      }
      for (const productItem of listProducts) {
        // bu yerda productItem.quantity ni manfiy va 01  qiymati uchun shart yuq -1 01 001 kabi qiymatlar test qilinmasin
        if (!productItem.product || !productItem.quantity) {
          return res
            .status(400)
            .json("Maydonlarni bo'sh bo'lishi mumkin emas, to'ldiring");
        }
        if (
          productItem.product.length !== 24 ||
          productItem.product.length !== 24
        ) {
          return res
            .status(404)
            .json(
              `Product: ${productItem.product} to'liq emas, 24 ta simvoldan kam yoki ko'p bo'lishi mumkin emas`
            );
        }
        const productDB = await Product.findById(productItem.product);
        console.log(productDB);
        if (!productDB) {
          return res
            .status(404)
            .json(`Bunday Product: ${productItem.product} mavjud emas`);
        }
      }
      for (const foundNumber of foundContract) {
        if (foundNumber.contractNumber === contractNumber) {
          return res
            .status(400)
            .json(
              "Bunday nomli Contract mavjud contract nomi bir birga o'xshamasligi kerak"
            );
        }
      }
      const updatedContract = await Contract.findByIdAndUpdate(id, req.body);
      if (!updatedContract) {
        return res.status(404).json("Contract topilmadi");
      }

      res.status(200).json("Contract yangilandi");
    } catch (error) {
      res.status(500).send(error);
      // console.log(error);
    }
  }
  async updateInventory(req, res) {
    try {
      const { id } = req.params;
      const body = req.body;
      const { contract, product } = req.body;
      if (!id || id.length !== 24 || id.length !== 24) {
        return res
          .status(404)
          .json(
            "ID to'liq emas, 24 ta simvoldan kam yoki ko'p bo'lishi mumkin emas"
          );
      }
      if (!contract || contract.length !== 24) {
        return res
          .status(404)
          .json(
            "Contract to'liq emas, 24 ta simvoldan kam yoki teng bo'lishi mumkin emas"
          );
      }
      if (!product || product.length !== 24) {
        return res
          .status(404)
          .json(
            "Product to'liq emas, 24 ta simvoldan kam yoki teng bo'lishi mumkin emas"
          );
      }
      // Contract va Product modeldan ID larni aniqlash
      const foundContract = await Contract.findById(contract);
      const foundProduct = await Product.findById(product);
      console.log(foundContract);
      // Contract va Product topilmaganda
      if (!foundContract) {
        return res.status(404).json(`Bunday: ${contract} contract topilmadi`);
      }
      if (!foundProduct) {
        return res.status(404).json(`Bunday: ${product} product topilmadi`);
      }

      // Contract va Product ID larining mos kelishi tekshiriladi
      // if (!foundContract.id === contract) {
      //     return res.status(404).json("Berilgan kontrakt mos emas");
      // }

      // if (!foundProduct.id === product) {
      //     return res.status(404).json("Berilgan product mos emas topilmadi");
      // }

      const updatedInventory = await Inventory.findByIdAndUpdate(id, body);

      if (!updatedInventory) {
        return res.status(404).json("Inventory topilmadi");
      }

      res.status(200).json("Inventory yangilandi");
    } catch (error) {
      res.status(500).send(error);
      // console.log(error);
    }
  }

  // Delete
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      // ID checkni front bilan bog'lasa tekshirish kerak emas hostni toxtatibquygani uchun qo'shdim
      if (!id || id.length !== 24 || id.length !== 24) {
        return res
          .status(404)
          .json(
            "ID to'liq emas, 24 ta simvoldan kam yoki ko'p bo'lishi mumkin emas"
          );
      }
      const delCat = await Category.findByIdAndDelete(req.params.id);
      if (!delCat) {
        return res.status(404).json("Kategoriya topilmadi");
      }
      res.status(200).json("Category o'chirildi");
    } catch (error) {
      res.status(500).send(error);
    }
  }
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      if (!id || id.length !== 24 || id.length !== 24) {
        return res
          .status(404)
          .json(
            "ID to'liq emas, 24 ta simvoldan kam yoki ko'p bo'lishi mumkin emas"
          );
      }
      const delProduct = await Product.findByIdAndDelete(req.params.id);
      if (!delProduct) {
        return res.status(404).json("Product topilmadi");
      }
      res.status(200).json("Product o'chirildi");
    } catch (error) {
      res.status(500).send(error);
    }
  }
  async deleteConract(req, res) {
    try {
      const { id } = req.params;
      if (!id || id.length !== 24 || id.length !== 24) {
        return res
          .status(404)
          .json(
            "ID to'liq emas, 24 ta simvoldan kam yoki ko'p bo'lishi mumkin emas"
          );
      }
      const delContract = await Contract.findByIdAndDelete(req.params.id);
      if (!delContract) {
        return res.status(404).json("Contract topilmadi");
      }
      res.status(200).json("Contract o'chirildi");
    } catch (error) {
      res.status(500).send(error);
    }
  }
  async deleteInventory(req, res) {
    try {
      const { id } = req.params;
      if (!id || id.length !== 24 || id.length !== 24) {
        return res
          .status(404)
          .json(
            "ID to'liq emas, 24 ta simvoldan kam yoki ko'p bo'lishi mumkin emas"
          );
      }
      const delInventory = await Inventory.findByIdAndDelete(req.params.id);
      if (!delInventory) {
        return res.status(404).json("Inventory topilmadi");
      }
      res.status(200).json("Inventory o'chirildi");
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = new PostController();
