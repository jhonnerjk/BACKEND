exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado, se requiere rol de administrador.' });
    }
    next();
};

exports.isGestor = (req, res, next) => {
    if (req.user.role !== 'gestor' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado, se requiere rol de gestor.' });
    }
    next();
};

exports.isDocente = (req, res, next) => {
    if (req.user.role !== 'docente') {
        return res.status(403).json({ message: 'Acceso denegado, se requiere rol de docente.' });
    }
    next();
};

// Middleware que permite múltiples roles
exports.requireAnyRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acceso denegado.' });
        }
        next();
    };
};
