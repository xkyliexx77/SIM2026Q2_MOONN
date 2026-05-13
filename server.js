const express = require('express');
const cors = require('cors');
const path = require('path');

require('./database/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const fundraisingRoutes = require('./routes/fundraisingRoutes');
const donationRoutes = require('./routes/donationRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'boundary')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/fundraisers', fundraisingRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'boundary', 'index.html'));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});