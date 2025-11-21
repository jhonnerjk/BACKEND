const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // Multi-rol: buscamos si ya existe algún usuario con rol admin en 'roles'.
    const existingAdmin = await User.findOne({ roles: 'admin' });
    if (existingAdmin) {
      console.log('Ya existe un admin:', existingAdmin.email);
      process.exit(0);
    }
    const admin = new User({
      nombre: 'Admin Principal',
      email: 'admin@example.com',
      password: 'Admin123!',
      roles: ['admin'],
      activo: true
    });
    await admin.save();
    console.log('Admin creado:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error('Error creando admin:', err.message);
    process.exit(1);
  }
}

run();