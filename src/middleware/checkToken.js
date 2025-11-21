const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const autoHeader = req.header('Authorization');
    const token = autoHeader && autoHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado, no hay token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        if (!decoded.roles && decoded.role) {
            decoded.roles = [decoded.role];
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token no es valido.' });
    }
};

