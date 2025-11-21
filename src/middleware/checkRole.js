function hasRole(userRoles, target) {
    if (!Array.isArray(userRoles)) return false;
    return userRoles.includes(target);
}

exports.isAdmin = (req, res, next) => {
    if (!hasRole(req.user.roles, 'admin')) {
        return res.status(403).json({ message: 'Acceso denegado, se requiere rol de administrador.' });
    }
    next();
};

exports.isGestor = (req, res, next) => {
    if (!hasRole(req.user.roles, 'gestor') && !hasRole(req.user.roles, 'admin')) {
        return res.status(403).json({ message: 'Acceso denegado, se requiere rol de gestor.' });
    }
    next();
};

exports.isDocente = (req, res, next) => {
    if (!hasRole(req.user.roles, 'docente')) {
        return res.status(403).json({ message: 'Acceso denegado, se requiere rol de docente.' });
    }
    next();
};

exports.requireAnyRole = (...roles) => {
    return (req, res, next) => {
        const userRoles = req.user.roles || [];
        const ok = roles.some(r => userRoles.includes(r));
        if (!ok) {
            return res.status(403).json({ message: 'Acceso denegado.' });
        }
        next();
    };
};
