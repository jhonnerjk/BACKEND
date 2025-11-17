const mongoose = require('mongoose');
require('dotenv').config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.log(err));

// Obtener el modelo User
const User = require('./src/models/User');

async function updateRoles() {
    try {
        // Actualizar todos los usuarios que tengan role 'administrador' a 'admin'
        const result = await User.updateMany(
            { role: 'administrador' },
            { $set: { role: 'admin' } }
        );
        
        console.log(`${result.modifiedCount} usuarios actualizados de 'administrador' a 'admin'`);
        
        // Mostrar todos los usuarios actualizados
        const users = await User.find().select('email role');
        console.log('\nUsuarios en la base de datos:');
        users.forEach(user => {
            console.log(`- ${user.email}: ${user.role}`);
        });
        
        mongoose.connection.close();
        console.log('\nActualización completada. Conexión cerrada.');
    } catch (error) {
        console.error('Error al actualizar roles:', error);
        mongoose.connection.close();
    }
}

updateRoles();
