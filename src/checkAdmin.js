const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
dotenv.config();

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');
    
    const admins = await User.find({ roles: 'admin' });
    console.log(`\nUsuarios admin encontrados: ${admins.length}`);
    
    if (admins.length > 0) {
      admins.forEach((admin, index) => {
        console.log(`\nAdmin ${index + 1}:`);
        console.log('  ID:', admin._id);
        console.log('  Nombre:', admin.nombre);
        console.log('  Email:', admin.email);
        console.log('  Roles:', admin.roles);
        console.log('  Activo:', admin.activo);
      });
    } else {
      console.log('\n⚠️  No se encontraron usuarios admin en la base de datos');
    }
    
    const totalUsers = await User.countDocuments();
    console.log(`\nTotal de usuarios en la base de datos: ${totalUsers}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkAdmin();
