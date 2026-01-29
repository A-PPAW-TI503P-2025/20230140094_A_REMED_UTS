import React, { useState, useEffect } from 'react';
import { booksAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Books.css';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await booksAPI.getAll();
            setBooks(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch books');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBooks = books.filter(
        (book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="books-page">
            <div className="container">
                <div className="page-header">
                    <h1>Browse Books</h1>
                    <p className="text-muted">
                        Explore our collection of {books.length} books
                    </p>
                </div>

                {/* Search Bar */}
                <div className="search-section">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="🔍 Search by title or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex-center" style={{ minHeight: '300px' }}>
                        <div className="spinner"></div>
                    </div>
                )}

                {/* Books Grid */}
                {!loading && filteredBooks.length > 0 && (
                    <div className="books-grid">
                        {filteredBooks.map((book) => (
                            <div
                                key={book.id}
                                className="book-card"
                                onClick={() => setSelectedBook(book)}
                            >
                                <div className="book-cover">
                                    <div className="book-spine"></div>
                                    <div className="book-icon">📖</div>
                                </div>
                                <div className="book-info">
                                    <h3 className="book-title">{book.title}</h3>
                                    <p className="book-author">by {book.author}</p>
                                    <div className="book-footer">
                                        <div
                                            className={`stock-badge ${book.stock > 0 ? 'in-stock' : 'out-of-stock'
                                                }`}
                                        >
                                            {book.stock > 0
                                                ? `${book.stock} available`
                                                : 'Out of stock'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredBooks.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">📚</div>
                        <h3>No books found</h3>
                        <p className="text-muted">
                            {searchTerm
                                ? 'Try a different search term'
                                : 'No books in the library yet'}
                        </p>
                    </div>
                )}

                {/* Book Detail Modal */}
                {selectedBook && (
                    <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
                        <div
                            className="modal-content book-detail-modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2>Book Details</h2>
                                <button
                                    className="close-btn"
                                    onClick={() => setSelectedBook(null)}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="book-detail-content">
                                <div className="detail-cover">
                                    <div className="detail-book-icon">📖</div>
                                </div>
                                <div className="detail-info">
                                    <h3>{selectedBook.title}</h3>
                                    <p className="detail-author">by {selectedBook.author}</p>
                                    <div className="detail-meta">
                                        <div className="meta-item">
                                            <span className="meta-label">Book ID:</span>
                                            <span className="meta-value">#{selectedBook.id}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Stock:</span>
                                            <span
                                                className={`meta-value ${selectedBook.stock > 0
                                                        ? 'text-success'
                                                        : 'text-error'
                                                    }`}
                                            >
                                                {selectedBook.stock} copies
                                            </span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Status:</span>
                                            <span
                                                className={`status-badge ${selectedBook.stock > 0 ? 'available' : 'unavailable'
                                                    }`}
                                            >
                                                {selectedBook.stock > 0 ? 'Available' : 'Unavailable'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Books;
