const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
dotenv.config();

async function migrateRoles() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');

    const users = await User.find({});
    console.log(`\nEncontrados ${users.length} usuarios para migrar\n`);

    for (const user of users) {
      if (!user.roles || user.roles.length === 0) {
        if (user.role) {
          user.roles = [user.role];
          user.role = undefined;
          await user.save();
          console.log(`✓ Migrado: ${user.email} -> roles: ${JSON.stringify(user.roles)}`);
        } else {
          user.roles = ['docente'];
          await user.save();
          console.log(`✓ Default: ${user.email} -> roles: ['docente']`);
        }
      } else {
        console.log(`- Ya migrado: ${user.email} -> roles: ${JSON.stringify(user.roles)}`);
      }
    }

    console.log('\n✅ Migración completada');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en migración:', err.message);
    process.exit(1);
  }
}

migrateRoles();
