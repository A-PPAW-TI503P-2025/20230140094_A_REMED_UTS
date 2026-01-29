const { Book } = require('../models');

// Get all books
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll({
            order: [['id', 'ASC']]
        });

        res.status(200).json({
            success: true,
            data: books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch books',
            message: error.message
        });
    }
};

// Get book by ID
const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch book',
            message: error.message
        });
    }
};

// Create new book (Admin only)
const createBook = async (req, res) => {
    try {
        const { title, author, stock } = req.body;

        // Validation
        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Title cannot be empty'
            });
        }

        if (!author || author.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Author cannot be empty'
            });
        }

        const book = await Book.create({
            title: title.trim(),
            author: author.trim(),
            stock: stock || 0
        });

        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: book
        });
    } catch (error) {
        // Handle Sequelize validation errors
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: error.errors.map(e => e.message)
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to create book',
            message: error.message
        });
    }
};

// Update book (Admin only)
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, stock } = req.body;

        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        // Validation
        if (title !== undefined && title.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Title cannot be empty'
            });
        }

        if (author !== undefined && author.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Author cannot be empty'
            });
        }

        // Update fields
        if (title !== undefined) book.title = title.trim();
        if (author !== undefined) book.author = author.trim();
        if (stock !== undefined) book.stock = stock;

        await book.save();

        res.status(200).json({
            success: true,
            message: 'Book updated successfully',
            data: book
        });
    } catch (error) {
        // Handle Sequelize validation errors
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: error.errors.map(e => e.message)
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to update book',
            message: error.message
        });
    }
};

// Delete book (Admin only)
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        await book.destroy();

        res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete book',
            message: error.message
        });
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};
