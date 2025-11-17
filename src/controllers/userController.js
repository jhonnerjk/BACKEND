const User = require('../models/User');

exports.createUser = async (req, res) => {
    const { nombre, email, password, role, activo } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Ya existe un usuario con ese email.' });
        }

        const newUser = new User({ nombre, email, password, role, activo: activo !== undefined ? activo : true });
        await newUser.save();
        res.status(201).json({ message: 'Usuario creado exitosamente.', user: { _id: newUser._id, nombre: newUser.nombre, email: newUser.email, role: newUser.role, activo: newUser.activo } });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { role, activo } = req.body;
        const updates = {};
        
        if (role) updates.role = role;
        if (activo !== undefined) updates.activo = activo;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.json({ message: 'Usuario actualizado exitosamente.', user });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

exports.getDocentes = async (req, res) => {
    try {
        const docentes = await User.find({ role: 'docente', activo: true }).select('nombre email _id');
        res.json(docentes);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

