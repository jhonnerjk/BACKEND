const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.log(err));

// Obtener el modelo User
const User = require('./src/models/User');

async function resetPasswords() {
    try {
        // Hashear las contraseñas
        const salt = await bcrypt.genSalt(10);
        const adminPass = await bcrypt.hash('admin123', salt);
        const medicoPass = await bcrypt.hash('medico123', salt);
        const recepPass = await bcrypt.hash('recep123', salt);
        
        // Actualizar cada usuario
        await User.updateOne({ email: 'admin@test.com' }, { password: adminPass });
        await User.updateOne({ email: 'medico@test.com' }, { password: medicoPass });
        await User.updateOne({ email: 'recepcionista@test.com' }, { password: recepPass });
        
        console.log('✅ Contraseñas actualizadas:');
        console.log('- admin@test.com → admin123');
        console.log('- medico@test.com → medico123');
        console.log('- recepcionista@test.com → recep123');
        
        mongoose.connection.close();
        console.log('\nConexión cerrada.');
    } catch (error) {
        console.error('Error:', error);
        mongoose.connection.close();
    }
}

resetPasswords();
