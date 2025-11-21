const User = require('../models/User');

exports.createUser = async (req, res) => {
    const { nombre, email, password, role, roles, activo } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Ya existe un usuario con ese email.' });
        }

        const allowedRoles = ['admin', 'gestor', 'docente'];
        let finalRoles = [];
        if (Array.isArray(roles) && roles.length > 0) {
            finalRoles = roles.filter(r => allowedRoles.includes(r));
            finalRoles = [...new Set(finalRoles)];
        } else if (role && allowedRoles.includes(role)) {
            finalRoles = [role];
        } else {
            finalRoles = ['docente'];
        }

        const newUser = new User({ nombre, email, password, roles: finalRoles, activo: activo !== undefined ? activo : true });
        await newUser.save();
        res.status(201).json({ message: 'Usuario creado exitosamente.', user: { _id: newUser._id, nombre: newUser.nombre, email: newUser.email, roles: newUser.roles, activo: newUser.activo } });
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
        const { role, roles, activo } = req.body;
        const updates = {};

        const allowedRoles = ['admin', 'gestor', 'docente'];
        if (Array.isArray(roles)) {
            let filtered = roles.filter(r => allowedRoles.includes(r));
            filtered = [...new Set(filtered)];
            if (filtered.length === 0) {
                return res.status(400).json({ message: 'Debe incluir al menos un rol válido.' });
            }
            updates.roles = filtered;
        } else if (role) {
            if (!allowedRoles.includes(role)) {
                return res.status(400).json({ message: 'Rol inválido.' });
            }
            updates.roles = [role];
        }
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
        const docentes = await User.find({ roles: 'docente', activo: true }).select('nombre email _id');
        res.json(docentes);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

