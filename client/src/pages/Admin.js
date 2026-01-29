import React, { useState, useEffect } from 'react';
import { booksAPI, borrowAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Admin.css';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('books'); // 'books' or 'logs'
    const [books, setBooks] = useState([]);
    const [borrowLogs, setBorrowLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        stock: 0,
    });

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        if (activeTab === 'logs') {
            fetchBorrowLogs();
        }
    }, [activeTab]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await booksAPI.getAll();
            setBooks(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch books');
        } finally {
            setLoading(false);
        }
    };

    const fetchBorrowLogs = async () => {
        try {
            setLoading(true);
            const response = await borrowAPI.getBorrowLogs();
            setBorrowLogs(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch borrow logs');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'stock' ? parseInt(value) || 0 : value,
        }));
    };

    const openAddModal = () => {
        setEditingBook(null);
        setFormData({ title: '', author: '', stock: 0 });
        setShowModal(true);
    };

    const openEditModal = (book) => {
        setEditingBook(book);
        setFormData({
            title: book.title,
            author: book.author,
            stock: book.stock,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.author.trim()) {
            toast.error('Title and author are required');
            return;
        }

        try {
            if (editingBook) {
                await booksAPI.update(editingBook.id, formData);
                toast.success('Book updated successfully!');
            } else {
                await booksAPI.create(formData);
                toast.success('Book added successfully!');
            }
            setShowModal(false);
            fetchBooks();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Operation failed');
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
            return;
        }

        try {
            await booksAPI.delete(id);
            toast.success('Book deleted successfully!');
            fetchBooks();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Delete failed');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="admin-page">
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1>Admin Panel</h1>
                        <p className="text-muted">Manage your library collection and view borrow logs</p>
                    </div>
                    {activeTab === 'books' && (
                        <button className="btn btn-primary" onClick={openAddModal}>
                            ➕ Add New Book
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'books' ? 'active' : ''}`}
                        onClick={() => setActiveTab('books')}
                    >
                        📚 Manage Books
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('logs')}
                    >
                        📋 Borrow Logs
                    </button>
                </div>

                {/* Books Tab Content */}
                {activeTab === 'books' && (
                    <>
                        {loading ? (
                            <div className="flex-center" style={{ minHeight: '300px' }}>
                                <div className="spinner"></div>
                            </div>
                        ) : (
                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Title</th>
                                            <th>Author</th>
                                            <th>Stock</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {books.map((book) => (
                                            <tr key={book.id}>
                                                <td>#{book.id}</td>
                                                <td className="book-title-cell">{book.title}</td>
                                                <td>{book.author}</td>
                                                <td>
                                                    <span
                                                        className={`stock-indicator ${book.stock > 0 ? 'in-stock' : 'out-of-stock'
                                                            }`}
                                                    >
                                                        {book.stock}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn-icon btn-edit"
                                                            onClick={() => openEditModal(book)}
                                                            title="Edit"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            className="btn-icon btn-delete"
                                                            onClick={() => handleDelete(book.id, book.title)}
                                                            title="Delete"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {books.length === 0 && (
                                    <div className="empty-state">
                                        <p>No books in the library yet</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* Borrow Logs Tab Content */}
                {activeTab === 'logs' && (
                    <>
                        {loading ? (
                            <div className="flex-center" style={{ minHeight: '300px' }}>
                                <div className="spinner"></div>
                            </div>
                        ) : (
                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Log ID</th>
                                            <th>User ID</th>
                                            <th>Book</th>
                                            <th>Borrow Date</th>
                                            <th>Location</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {borrowLogs.map((log) => (
                                            <tr key={log.id}>
                                                <td>#{log.id}</td>
                                                <td>
                                                    <span className="user-badge">User {log.userId}</span>
                                                </td>
                                                <td className="book-title-cell">
                                                    {log.book ? (
                                                        <>
                                                            <div className="log-book-title">{log.book.title}</div>
                                                            <div className="log-book-author">by {log.book.author}</div>
                                                        </>
                                                    ) : (
                                                        <span className="text-muted">Book not found</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className="date-badge">{formatDate(log.borrowDate)}</span>
                                                </td>
                                                <td>
                                                    <div className="location-cell">
                                                        <div className="coord-row">
                                                            <span className="coord-label">Lat:</span>
                                                            <span className="coord-value">{log.latitude.toFixed(6)}</span>
                                                        </div>
                                                        <div className="coord-row">
                                                            <span className="coord-label">Long:</span>
                                                            <span className="coord-value">{log.longitude.toFixed(6)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {borrowLogs.length === 0 && (
                                    <div className="empty-state">
                                        <p>No borrow logs yet</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* Add/Edit Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
                                <button className="close-btn" onClick={() => setShowModal(false)}>
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-input"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter book title"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Author *</label>
                                    <input
                                        type="text"
                                        name="author"
                                        className="form-input"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        placeholder="Enter author name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        className="form-input"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        min="0"
                                        placeholder="Enter stock quantity"
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingBook ? 'Update Book' : 'Add Book'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
