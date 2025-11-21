const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Registro: ahora acepta nombre y valida que el rol esté dentro de los permitidos.
exports.register = async (req, res) => {
    const { nombre, email, password, role, roles } = req.body;
    try {
        if (!nombre || !email || !password) {
            return res.status(400).json({ message: 'nombre, email y password son obligatorios.' });
        }

        const allowedRoles = ['admin', 'gestor', 'docente'];
        let finalRoles = [];
        if (Array.isArray(roles) && roles.length > 0) {
            finalRoles = roles.filter(r => allowedRoles.includes(r));
        } else if (role && allowedRoles.includes(role)) {
            finalRoles = [role];
        } else {
            finalRoles = ['docente'];
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe.' });
        }

        const newUser = new User({ nombre, email, password, roles: finalRoles });
        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente.', user: { id: newUser._id, nombre: newUser.nombre, email: newUser.email, roles: newUser.roles } });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado.' });
        }

        if (!user.activo) {
            return res.status(403).json({ message: 'Usuario inactivo. Contacte al administrador.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta.' });
        }

        const payload = { userId: user._id, roles: user.roles, role: user.roles ? user.roles[0] : user.role, nombre: user.nombre };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ 
            token,
            user: { id: user._id, nombre: user.nombre, email: user.email, roles: user.roles }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};