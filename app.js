const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes.js');
const bookRoutes = require('./routes/bookRoutes.js');
const cartRoute = require('./routes/cartRoute.js');
const orderRoutes = require('./routes/orderRoutes.js');
const userRoutes = require('./routes/userRoutes.js')
const cookieParser = require('cookie-parser');

const app = express();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
// Global error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  });

// Use the routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoute); 
app.use('/api/order',orderRoutes);
app.use('/api/user',userRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
