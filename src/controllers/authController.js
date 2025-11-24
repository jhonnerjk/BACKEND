const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Registro: ahora acepta nombre y valida que el rol esté dentro de los permitidos.
exports.register = async (req, res) => {
    const { nombre, email, password, role } = req.body;
    try {
        if (!nombre || !email || !password) {
            return res.status(400).json({ message: 'nombre, email y password son obligatorios.' });
        }

        const allowedRoles = ['admin', 'gestor', 'docente'];
        const finalRole = (role && allowedRoles.includes(role)) ? role : 'docente';

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe.' });
        }

        const newUser = new User({ nombre, email, password, role: finalRole });
        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente.', user: { id: newUser._id, nombre: newUser.nombre, email: newUser.email, role: newUser.role } });
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

        const payload = { userId: user._id, role: user.role, nombre: user.nombre };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ 
            token,
            user: { id: user._id, nombre: user.nombre, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};