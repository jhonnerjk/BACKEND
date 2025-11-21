const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
        type: [String],
        required: true,
        enum: ['admin', 'gestor', 'docente'],
        default: ['docente']
    },
    role: { type: String, enum: ['admin', 'gestor', 'docente'] },
    activo: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    if (this.role && (!this.roles || this.roles.length === 0)) {
        this.roles = [this.role];
        this.role = undefined;
    }
    if (Array.isArray(this.roles)) {
        this.roles = [...new Set(this.roles)];
        if (this.roles.length === 0) {
            this.roles = ['docente'];
        }
    }
    next();
});

userSchema.post('init', function (doc) {
    if (!doc.roles || doc.roles.length === 0) {
        if (doc.role) {
            doc.roles = [doc.role];
        }
    }
    if (Array.isArray(doc.roles)) {
        doc.roles = [...new Set(doc.roles)];
    }
});

userSchema.pre('validate', function (next) {
    if (Array.isArray(this.roles)) {
        this.roles = [...new Set(this.roles)];
    }
    next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;