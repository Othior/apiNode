const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
// const mysql = require("mysql")
const Thing = require("./models/Thing")

const app = express();

// connection a la db
mongoose.connect('mongodb+srv://dbUser:1234@cluster0.qpkqj.mongodb.net/dbtest1?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((ee) => console.log('Connexion à MongoDB échouée !',ee));

//
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

// create
app.post('/api/products', (req, res, next) => {
  console.log(req.headers)
  // delete req.body._id;
  const thing = new Thing({
    ...req.body
  });
  thing.save()
    .then(product => res.status(201).json({ product }))
    .catch(error => res.status(400).json({ error }));
});

// update
app.put('/api/products/:id', (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Modified!'}))
    .catch(error => res.status(400).json({ error }));
});

//delete
app.delete('/api/products/:id', (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Deleted!'}))
    .catch(error => res.status(400).json({ error }));
});

// read
app.get('/api/products/:id', (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(product => res.status(200).json({product}))
    .catch(error => res.status(404).json({ error }));
});

// list affichage
app.get('/api/products', (req, res, next) => {
    Thing.find()
    .then(products => res.status(200).json({products}))
    .catch( error => res.status(400).json(error))
});





module.exports = app;