const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('DB Active');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64f4bee6922d515ee7cc20eb',
  };

  next();
});

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
