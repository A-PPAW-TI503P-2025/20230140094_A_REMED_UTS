import React, { useState, useEffect } from 'react';
import { booksAPI } from '../services/api';
import './Home.css';

const Home = ({ setCurrentPage }) => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        availableBooks: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await booksAPI.getAll();
            const books = response.data.data;

            const totalBooks = books.length;
            const availableBooks = books.filter(book => book.stock > 0).length;

            setStats({ totalBooks, availableBooks });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-page">
            <div className="container">
                <div className="home-hero">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Welcome to <span className="text-primary">Library System</span>
                        </h1>
                        <p className="hero-description">
                            Manage your library with ease. Browse books, borrow with
                            geolocation tracking, and manage your collection all in one place.
                        </p>

                        <div className="hero-actions">
                            <button
                                className="btn btn-primary"
                                onClick={() => setCurrentPage('books')}
                            >
                                📚 Browse Books
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setCurrentPage('borrow')}
                            >
                                📖 Borrow a Book
                            </button>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="book-stack">
                            <div className="book-item book-1"></div>
                            <div className="book-item book-2"></div>
                            <div className="book-item book-3"></div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="stats-section">
                    <div className="stat-card">
                        <div className="stat-icon">📚</div>
                        <div className="stat-info">
                            <div className="stat-number">
                                {loading ? '...' : stats.totalBooks}
                            </div>
                            <div className="stat-label">TOTAL BOOKS</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <div className="stat-number">
                                {loading ? '...' : stats.availableBooks}
                            </div>
                            <div className="stat-label">AVAILABLE</div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="features-section">
                    <h2 className="section-title">Features</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🔍</div>
                            <h3 className="feature-title">Browse Books</h3>
                            <p className="feature-description">
                                Explore our collection of books with detailed information.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">📍</div>
                            <h3 className="feature-title">Geolocation</h3>
                            <p className="feature-description">
                                Borrow books with automatic location tracking for security.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">👨‍💼</div>
                            <h3 className="feature-title">Admin Panel</h3>
                            <p className="feature-description">
                                Manage your library collection with full CRUD operations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
