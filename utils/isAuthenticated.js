exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {  // Use Passport's built-in method for checking authentication
        return next();
    } else {
        return res.status(401).json({ success: false, message: "Unauthorized: Please log in first" });
    }
};
