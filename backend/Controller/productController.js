const Product = require("../Model/productModel"); // Remplacez par le chemin vers votre modèle de produit
const APIFeatures = require("../utils/APIFeatures"); // Utilisez votre classe APIFeatures pour pagination, tri, etc.
// ajout produit 
exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({
      status: "success",
      data: { newProduct },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
// retourner tous les produits 
exports.getAllProducts = async (req, res) => {
    try {
      // Si une catégorie est spécifiée dans la requête, on filtre les produits par catégorie
      let filter = {};
      if (req.query.category) {
        filter.category = req.query.category;
      }
  
      const features = new APIFeatures(req.query, Product.find(filter))
        .pagination()
        .filter()
        .sort();
  
      const products = await features.query;
      res.status(200).json({
        status: "success",
        result: products.length,
        data: { products },
      });
    } catch (err) {
      res.status(400).json({
        status: "fail ",
        message: err,
      });
    }
  };
  

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Produit introuvable",
      });
    }
    res.status(200).json({
      status: "success",
      data: { product },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({
        status: "fail",
        message: "Produit introuvable",
      });
    }
    res.status(202).json({
      status: "success",
      data: { updatedProduct },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Produit introuvable",
      });
    }
    res.status(203).json({
      status: "success",
      message: "Produit supprimé avec succès",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
