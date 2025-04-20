const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const redis = require('redis');
const { promisify } = require('util');

// Configuration
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/configurator';
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connexion à MongoDB établie'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Connexion à Redis
const redisClient = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT
});

redisClient.on('error', (err) => {
  console.error('Erreur Redis:', err);
});

redisClient.on('connect', () => {
  console.log('Connexion à Redis établie');
});

// Promisify Redis get and set
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Modèle de données
const Product = mongoose.model('Product', {
  name: String,
  type: { type: String, enum: ['mono-split', 'bi-split', 'tri-split', 'quad-split'] },
  power: Number, // en kW
  energyClass: String,
  price: Number,
  imageUrl: String,
  description: String,
});

const Option = mongoose.model('Option', {
  type: { type: String, enum: ['liaison'] },
  name: String,
  length: Number, // en mètres
  compatibleWith: [String], // types de climatiseurs compatibles
  price: Number,
});

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Récupérer tous les produits
app.get('/api/products', async (req, res) => {
  try {
    // Vérifier si les données sont en cache
    const cachedProducts = await getAsync('products');
    
    if (cachedProducts) {
      return res.json(JSON.parse(cachedProducts));
    }
    
    // Si pas en cache, récupérer depuis la base de données
    const products = await Product.find();
    
    // Stocker en cache pour 5 minutes (300 secondes)
    await setAsync('products', JSON.stringify(products), 'EX', 300);
    
    res.json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer un produit par ID
app.get('/api/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer toutes les options
app.get('/api/options', async (req, res) => {
  try {
    // Vérifier si les données sont en cache
    const cachedOptions = await getAsync('options');
    
    if (cachedOptions) {
      return res.json(JSON.parse(cachedOptions));
    }
    
    // Si pas en cache, récupérer depuis la base de données
    const options = await Option.find();
    
    // Stocker en cache pour 5 minutes (300 secondes)
    await setAsync('options', JSON.stringify(options), 'EX', 300);
    
    res.json(options);
  } catch (error) {
    console.error('Erreur lors de la récupération des options:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Calculer le prix selon la configuration
app.post('/api/configure', async (req, res) => {
  try {
    const { productId, optionIds } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'ID de produit requis' });
    }
    
    // Récupérer le produit
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    let totalPrice = product.price;
    const selectedOptions = [];
    
    // Calculer le prix des options si elles existent
    if (optionIds && optionIds.length > 0) {
      const options = await Option.find({ _id: { $in: optionIds } });
      
      for (const option of options) {
        // Vérifier la compatibilité
        if (option.compatibleWith.includes(product.type)) {
          totalPrice += option.price;
          selectedOptions.push(option);
        }
      }
    }
    
    res.json({
      product,
      options: selectedOptions,
      totalPrice,
    });
  } catch (error) {
    console.error('Erreur lors du calcul du prix:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur configurateur démarré sur le port ${PORT}`);
});