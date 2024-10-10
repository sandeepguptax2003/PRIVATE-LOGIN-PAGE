require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes for any requests starting with '/api/auth'
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
