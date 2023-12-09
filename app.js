
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const hashToAddress = {};
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/home', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/about', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.post('/createHash', (req, res) => {
  const { name, address, initialBalance } = req.body;
  const hash = crypto.createHash('sha256').update(name + address).digest('hex');
  hashToAddress[hash] = { name, address, balance: initialBalance };
  res.json({ hash });
  
});

app.post('/depositToHash', (req, res) => {
  const { hash, amount } = req.body;
  if (hashToAddress[hash]) {
    hashToAddress[hash].balance += parseInt(amount);
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Invalid hash' });
  }
});

app.post('/transferMoney', (req, res) => {
  const { fromHash, toHash, amount } = req.body;
  if (hashToAddress[fromHash] && hashToAddress[toHash] && hashToAddress[fromHash].balance >= amount) {
    hashToAddress[fromHash].balance -= parseInt(amount);
    hashToAddress[toHash].balance += parseInt(amount);
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Invalid hash or insufficient balance' });
  }
});

app.get('/checkBalance/:hash', (req, res) => {
  const { hash } = req.params;
  if (hashToAddress[hash]) {
    res.json({ balance: hashToAddress[hash].balance });
  } else {
    res.json({ success: false, message: 'Invalid hash' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
