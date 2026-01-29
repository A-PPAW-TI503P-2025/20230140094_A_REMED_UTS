import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Books API
export const booksAPI = {
    // Public endpoints
    getAll: () => api.get('/books'),
    getById: (id) => api.get(`/books/${id}`),

    // Admin endpoints
    create: (bookData, role = 'admin') =>
        api.post('/books', bookData, {
            headers: { 'x-user-role': role }
        }),

    update: (id, bookData, role = 'admin') =>
        api.put(`/books/${id}`, bookData, {
            headers: { 'x-user-role': role }
        }),

    delete: (id, role = 'admin') =>
        api.delete(`/books/${id}`, {
            headers: { 'x-user-role': role }
        }),
};

// Borrow API
export const borrowAPI = {
    borrowBook: (borrowData, userId, role = 'user') =>
        api.post('/borrow', borrowData, {
            headers: {
                'x-user-role': role,
                'x-user-id': userId
            }
        }),

    // Admin endpoint
    getBorrowLogs: (role = 'admin') =>
        api.get('/borrow/logs', {
            headers: { 'x-user-role': role }
        }),
};

export default api;
