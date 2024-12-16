const express = require("express");
const {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
} = require("../Controller/productController");
const { protectionMW, howCanDo } = require("../Controller/authController");

const router = express.Router();

// Routes pour les produits
router
    .route("/")
    .get(protectionMW, getAllProducts) // Accessible par tous les utilisateurs connectés
    .post(protectionMW, howCanDo("admin"), createProduct); // Accessible uniquement aux administrateurs

router
    .route("/:id")
    .get(protectionMW, getProductById) // Accessible par tous les utilisateurs connectés
    .patch(protectionMW, howCanDo("admin"), updateProduct) // Accessible uniquement aux administrateurs
    .delete(protectionMW, howCanDo("admin"), deleteProduct); // Accessible uniquement aux administrateurs

module.exports = router;
