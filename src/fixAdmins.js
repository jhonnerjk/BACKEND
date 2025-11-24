const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
dotenv.config();

async function fixAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB\n');

    const adminEmails = ['admin@example.com', 'juanAdmin@example.com'];
    
    for (const email of adminEmails) {
      const user = await User.findOne({ email });
      if (user) {
        user.roles = ['admin'];
        await user.save();
        console.log(`✓ Actualizado: ${email} -> roles: ['admin']`);
      } else {
        console.log(`✗ No encontrado: ${email}`);
      }
    }

    console.log('\n✅ Admins actualizados correctamente');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

fixAdmins();
