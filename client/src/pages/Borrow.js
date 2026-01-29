import React, { useState, useEffect } from 'react';
import { booksAPI, borrowAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Borrow.css';

const Borrow = () => {
    const [books, setBooks] = useState([]);
    const [selectedBookId, setSelectedBookId] = useState('');
    const [userId, setUserId] = useState('1');
    const [location, setLocation] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [loadingBooks, setLoadingBooks] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await booksAPI.getAll();
            // Only show books with stock > 0
            const availableBooks = response.data.data.filter((book) => book.stock > 0);
            setBooks(availableBooks);
        } catch (error) {
            toast.error('Failed to fetch books');
        } finally {
            setLoadingBooks(false);
        }
    };

    const getLocation = () => {
        setLoadingLocation(true);

        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            setLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                toast.success('Location detected successfully!');
                setLoadingLocation(false);
            },
            (error) => {
                console.error('Geolocation error:', error);
                let errorMessage = 'Failed to get location. ';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Please allow location access.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Request timeout.';
                        break;
                    default:
                        errorMessage += 'Unknown error.';
                }

                toast.error(errorMessage);
                setLoadingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedBookId) {
            toast.error('Please select a book');
            return;
        }

        if (!location) {
            toast.error('Please allow location access first');
            return;
        }

        if (!userId) {
            toast.error('User ID is required');
            return;
        }

        try {
            setSubmitting(true);

            const borrowData = {
                bookId: parseInt(selectedBookId),
                latitude: location.latitude,
                longitude: location.longitude,
            };

            const response = await borrowAPI.borrowBook(borrowData, userId);

            toast.success(
                `Book borrowed successfully! Remaining stock: ${response.data.data.book.remainingStock}`
            );

            // Reset form
            setSelectedBookId('');
            setLocation(null);
            fetchBooks(); // Refresh book list
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to borrow book');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="borrow-page">
            <div className="container">
                <div className="borrow-container">
                    <div className="borrow-card">
                        <div className="card-header">
                            <h1>📖 Borrow a Book</h1>
                            <p className="text-muted">
                                Select a book and allow location access to borrow
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* User ID Input */}
                            <div className="form-group">
                                <label className="form-label">User ID *</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    placeholder="Enter your user ID"
                                    min="1"
                                    required
                                />
                            </div>

                            {/* Book Selection */}
                            <div className="form-group">
                                <label className="form-label">Select Book *</label>
                                {loadingBooks ? (
                                    <div className="flex-center" style={{ padding: '2rem' }}>
                                        <div className="spinner"></div>
                                    </div>
                                ) : (
                                    <select
                                        className="form-select"
                                        value={selectedBookId}
                                        onChange={(e) => setSelectedBookId(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Choose a book --</option>
                                        {books.map((book) => (
                                            <option key={book.id} value={book.id}>
                                                {book.title} by {book.author} (Stock: {book.stock})
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {!loadingBooks && books.length === 0 && (
                                    <p className="form-error">
                                        No books available for borrowing at the moment
                                    </p>
                                )}
                            </div>

                            {/* Geolocation Section */}
                            <div className="form-group">
                                <label className="form-label">Location *</label>
                                {!location ? (
                                    <button
                                        type="button"
                                        className="btn btn-secondary location-btn"
                                        onClick={getLocation}
                                        disabled={loadingLocation}
                                    >
                                        {loadingLocation ? (
                                            <>
                                                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                                                Detecting...
                                            </>
                                        ) : (
                                            <>
                                                📍 Allow Location Access
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <div className="location-info">
                                        <div className="location-success">
                                            ✅ Location detected successfully!
                                        </div>
                                        <div className="location-coords">
                                            <div className="coord-item">
                                                <span className="coord-label">Latitude:</span>
                                                <span className="coord-value">{location.latitude.toFixed(6)}</span>
                                            </div>
                                            <div className="coord-item">
                                                <span className="coord-label">Longitude:</span>
                                                <span className="coord-value">{location.longitude.toFixed(6)}</span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-secondary"
                                            onClick={getLocation}
                                            disabled={loadingLocation}
                                        >
                                            🔄 Refresh Location
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-submit"
                                    disabled={submitting || !location || !selectedBookId}
                                >
                                    {submitting ? (
                                        <>
                                            <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            📚 Borrow Book
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Info Section */}
                    <div className="info-section">
                        <div className="info-card">
                            <h3>📍 Why do we need your location?</h3>
                            <p>
                                Your location is recorded when you borrow a book for security
                                and tracking purposes. This helps us maintain our library
                                system and ensure book safety.
                            </p>
                        </div>
                        <div className="info-card">
                            <h3>📖 How to borrow?</h3>
                            <ol>
                                <li>Enter your User ID</li>
                                <li>Select a book from available options</li>
                                <li>Allow location access</li>
                                <li>Click "Borrow Book" to complete</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Borrow;
