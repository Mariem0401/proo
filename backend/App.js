const express = require('express')
const App = express(); /*l'app est une instance d'express */
const fs = require('fs')
const dotenv =require('dotenv')
dotenv.config({path:"./config.env"});
const  mongoose =require('mongoose');
const path = require('path'); // Importer path pour gérer les chemins


const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
// Middleware pour parser les requêtes JSON
App.use(express.json());

// === Servir les fichiers statiques du dossier frontend ===
App.use(express.static(path.join(__dirname, "../frontend")));

const port = 7777 //num de port
App.listen(port,()=>{
    console.log(`App is running  on port ; ${port}...`)

}
); 
App.use('/users', userRoutes);
App.use("/products", productRoutes);
// connect to the data base 
const DB = process.env.DATABASE.replace("<db_password>",process.env.DATABASE_PASSWORD);
mongoose
.connect(DB)
.then((connection)=>{
    console.log("DB connected suc ");

})
.catch((err) => {
    console.log(err);
});