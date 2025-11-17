exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado, se requiere rol de administrador.' });
    }
    next();
};

exports.isReceptionist = (req, res, next) => {
    if (req.user.role !== 'recepcionista') {
        return res.status(403).json({ message: 'Acceso denegado, se requiere rol de recepcionista.' });
    }
    next();
};

exports.isMedico = (req, res, next) => {
    if (req.user.role !== 'medico') {
        return res.status(403).json({ message: 'Acceso denegado, se requiere rol de medico.' });
    }
    next();
};
