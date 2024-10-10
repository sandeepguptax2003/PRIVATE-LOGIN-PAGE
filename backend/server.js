require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});