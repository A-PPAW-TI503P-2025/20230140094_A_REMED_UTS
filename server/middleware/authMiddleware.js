// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    const role = req.headers['x-user-role'];

    if (role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            error: 'Access denied. Admin only.'
        });
    }
};

// Middleware to check if user is authenticated as user
const isUser = (req, res, next) => {
    const role = req.headers['x-user-role'];
    const userId = req.headers['x-user-id'];

    if (role === 'user' && userId) {
        req.userId = userId; // Attach userId to request object
        next();
    } else {
        return res.status(403).json({
            error: 'Access denied. User authentication required.'
        });
    }
};

module.exports = { isAdmin, isUser };
