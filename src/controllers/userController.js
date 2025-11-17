const User = require('../models/User');

exports.createUser = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const newUser = new User({ email, password, role });
        await newUser.save();
        res.status(201).json({ message: 'Usuario creado exitosamente.' });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

exports.getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'medico' }).select('email _id');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

