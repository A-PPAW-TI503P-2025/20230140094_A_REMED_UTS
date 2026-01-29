require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');
const borrowRoutes = require('./routes/borrowRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Library System API',
        version: '1.0.0',
        endpoints: {
            books: {
                getAll: 'GET /api/books',
                getById: 'GET /api/books/:id',
                create: 'POST /api/books (Admin)',
                update: 'PUT /api/books/:id (Admin)',
                delete: 'DELETE /api/books/:id (Admin)'
            },
            borrow: {
                borrowBook: 'POST /api/borrow (User)'
            }
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
