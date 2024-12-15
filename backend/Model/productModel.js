const mongoose = require("mongoose");
const validator =require('validator');
const bcrypt = require ('bcryptjs');
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom du produit est obligatoire"],
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "Le prix du produit est obligatoire"],
  },
  category: {
    type: String,
    required: [true, "La catégorie du produit est obligatoire"],
    enum: ["PC", "Smartphone", "Smartwatch", "Accessoire","Smart Tv" ,"Autre"], // Définir les catégories autorisées
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
