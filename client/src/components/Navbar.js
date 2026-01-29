import React from 'react';
import './Navbar.css';

const Navbar = ({ currentPage, setCurrentPage, userRole, setUserRole }) => {
    const toggleRole = () => {
        setUserRole(userRole === 'admin' ? 'user' : 'admin');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    {/* Logo */}
                    <div className="navbar-brand" onClick={() => setCurrentPage('home')}>
                        <span className="brand-icon">📚</span>
                        <span className="brand-text">Library System</span>
                    </div>

                    {/* Navigation Links */}
                    <div className="navbar-links">
                        <button
                            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                            onClick={() => setCurrentPage('home')}
                        >
                            Home
                        </button>
                        <button
                            className={`nav-link ${currentPage === 'books' ? 'active' : ''}`}
                            onClick={() => setCurrentPage('books')}
                        >
                            Books
                        </button>
                        {userRole === 'admin' && (
                            <button
                                className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`}
                                onClick={() => setCurrentPage('admin')}
                            >
                                Admin
                            </button>
                        )}
                        {userRole === 'user' && (
                            <button
                                className={`nav-link ${currentPage === 'borrow' ? 'active' : ''}`}
                                onClick={() => setCurrentPage('borrow')}
                            >
                                Borrow
                            </button>
                        )}
                    </div>

                    {/* Role Switcher */}
                    <div className="navbar-role">
                        <span className="role-label">Role:</span>
                        <button className="role-badge" onClick={toggleRole}>
                            {userRole === 'admin' ? '👨‍💼 Admin' : '👤 User'}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
