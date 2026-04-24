const express = require('express');
const cors = require('cors');
const path = require('path');

require('./database/db');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const fundraisingRoutes = require('./routes/fundraisingRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');
const donationRoutes = require('./routes/donationRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/fundraisers', fundraisingRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;