const Resource = require('../models/Resource');

exports.createResource = async (req, res) => {
    const { nombre, tipo, capacidad, estado, descripcion, ubicacion } = req.body;
    try {
        const newResource = new Resource({ nombre, tipo, capacidad, estado, descripcion, ubicacion });
        await newResource.save();
        res.status(201).json({ message: 'Recurso creado exitosamente.', resource: newResource });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

exports.getAllResources = async (req, res) => {
    try {
        const { tipo, estado } = req.query;
        let filter = {};
        
        if (tipo) filter.tipo = tipo;
        if (estado) filter.estado = estado;

        const resources = await Resource.find(filter);
        res.json(resources);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

exports.getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Recurso no encontrado.' });
        }
        res.json(resource);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

exports.updateResource = async (req, res) => {
    const { nombre, tipo, capacidad, estado, descripcion, ubicacion } = req.body;
    try {
        const resource = await Resource.findByIdAndUpdate(
            req.params.id,
            { nombre, tipo, capacidad, estado, descripcion, ubicacion },
            { new: true, runValidators: true }
        );
        if (!resource) {
            return res.status(404).json({ message: 'Recurso no encontrado.' });
        }
        res.json({ message: 'Recurso actualizado exitosamente.', resource });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

exports.deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Recurso no encontrado.' });
        }
        res.json({ message: 'Recurso eliminado exitosamente.' });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};
