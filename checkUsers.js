const mongoose = require('mongoose');
require('dotenv').config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.log(err));

// Obtener el modelo User
const User = require('./src/models/User');

async function checkUsers() {
    try {
        const users = await User.find().select('email role');
        console.log('\n📋 Usuarios en la base de datos:');
        console.log('================================');
        users.forEach(user => {
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`ID: ${user._id}`);
            console.log('---');
        });
        console.log(`\nTotal de usuarios: ${users.length}`);
        
        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        mongoose.connection.close();
    }
}

checkUsers();
