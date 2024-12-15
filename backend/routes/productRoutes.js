const express = require("express");
const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../Controller/productController");

const router = express.Router();

router.route("/").get(getAllProducts).post(createProduct);
router
  .route("/:id")
  .get(getProductById)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = router;
