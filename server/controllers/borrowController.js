const { Book, BorrowLog } = require('../models');

// Borrow a book
const borrowBook = async (req, res) => {
    try {
        const { bookId, latitude, longitude } = req.body;
        const userId = req.userId; // From middleware

        // Validation
        if (!bookId) {
            return res.status(400).json({
                success: false,
                error: 'Book ID is required'
            });
        }

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                error: 'Geolocation (latitude and longitude) is required'
            });
        }

        // Check if book exists
        const book = await Book.findByPk(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        // Check if stock is available
        if (book.stock <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Book is out of stock'
            });
        }

        // Decrease stock
        book.stock -= 1;
        await book.save();

        // Create borrow log
        const borrowLog = await BorrowLog.create({
            userId: parseInt(userId),
            bookId: parseInt(bookId),
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            borrowDate: new Date()
        });

        res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data: {
                borrowLog,
                book: {
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    remainingStock: book.stock
                }
            }
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
            error: 'Failed to borrow book',
            message: error.message
        });
    }
};

// Get all borrow logs (Admin only)
const getAllBorrowLogs = async (req, res) => {
    try {
        const borrowLogs = await BorrowLog.findAll({
            include: [
                {
                    model: Book,
                    as: 'book',
                    attributes: ['id', 'title', 'author']
                }
            ],
            order: [['borrowDate', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: borrowLogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch borrow logs',
            message: error.message
        });
    }
};

module.exports = {
    borrowBook,
    getAllBorrowLogs
};
