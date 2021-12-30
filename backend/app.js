const express = require('express') /* IMPORTE LES PACKAGES */
const stripe = require('./routes/stripe')
/* const webhook = require('./routes/webhook') */

const app = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

/* app.use('/api', webhook) */ // positionner avant express.json parce que nous voulons du express.raw CONF README

app.use(express.json())

app.get('/', (req, res) => res.send('Success!!!'))

app.use('/api/stripe', stripe)

module.exports = app 