
const Cart = require('../Model/panierModel');
const Product = require('../Model/productModel');

// Ajouter un produit au panier
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Vérifie si le produit existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    // Trouve ou crée un panier pour l'utilisateur
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Vérifie si le produit est déjà dans le panier
    const existingItem = cart.items.find((item) => item.product.equals(productId));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    // Recalcule le prix total
    cart.totalPrice = cart.items.reduce((total, item) => {
      const itemPrice = product.price * item.quantity;
      return total + itemPrice;
    }, 0);

    await cart.save();
    res.status(200).json({ status: 'success', data: cart });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

// Récupérer le panier de l'utilisateur
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Panier vide' });
    }
    res.status(200).json({ status: 'success', data: cart });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

// Mettre à jour la quantité d'un article dans le panier
exports.updateCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Panier introuvable' });
    }

    const item = cart.items.find((item) => item.product.equals(productId));
    if (!item) {
      return res.status(404).json({ message: 'Produit introuvable dans le panier' });
    }

    item.quantity = quantity;
    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.product.price, 0);

    await cart.save();
    res.status(200).json({ status: 'success', data: cart });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

// Supprimer un article du panier
exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Panier introuvable' });
    }

    cart.items = cart.items.filter((item) => !item.product.equals(productId));
    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.product.price, 0);

    await cart.save();
    res.status(200).json({ status: 'success', data: cart });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

// Vider le panier
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.status(200).json({ status: 'success', message: 'Panier vidé avec succès' });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};
