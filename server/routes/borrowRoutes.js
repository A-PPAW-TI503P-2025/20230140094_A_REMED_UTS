const express = require('express');
const router = express.Router();
const { isUser, isAdmin } = require('../middleware/authMiddleware');
const { borrowBook, getAllBorrowLogs } = require('../controllers/borrowController');

// Admin route - get all borrow logs
router.get('/logs', isAdmin, getAllBorrowLogs);

// User route - borrow book
router.post('/', isUser, borrowBook);

module.exports = router;
