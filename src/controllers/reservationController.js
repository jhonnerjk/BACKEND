const Reservation = require('../models/Reservation');

exports.createReservation = async (req, res) => {
    const { recurso, fechaInicio, fechaFin, proposito } = req.body;
    try {
        if (new Date(fechaFin) <= new Date(fechaInicio)) {
            return res.status(400).json({ message: 'La fecha de fin debe ser posterior a la fecha de inicio.' });
        }

        const superposicion = await Reservation.findOne({
            recurso: recurso,
            estado: 'APROBADA',
            $or: [
                // La nueva reserva comienza durante una reserva existente
                { fechaInicio: { $lte: fechaInicio }, fechaFin: { $gt: fechaInicio } },
                // La nueva reserva termina durante una reserva existente
                { fechaInicio: { $lt: fechaFin }, fechaFin: { $gte: fechaFin } },
                // La nueva reserva engloba completamente una reserva existente
                { fechaInicio: { $gte: fechaInicio }, fechaFin: { $lte: fechaFin } }
            ]
        });

        if (superposicion) {
            return res.status(400).json({ 
                message: 'El recurso ya está reservado en ese horario.',
                conflicto: superposicion
            });
        }

        const newReservation = new Reservation({ 
            recurso, 
            solicitante: req.user.userId,
            fechaInicio, 
            fechaFin, 
            proposito 
        });
        await newReservation.save();
        res.status(201).json({ message: 'Reserva creada exitosamente. Pendiente de aprobación.', reservation: newReservation });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

exports.getAllReservations = async (req, res) => {
    try {
        const { estado, recurso } = req.query;
        let filter = {};
        
        if (Array.isArray(req.user.roles) && req.user.roles.includes('docente')) {
            filter.solicitante = req.user.userId;
        }
        
        if (estado) filter.estado = estado;
        if (recurso) filter.recurso = recurso;

        const reservations = await Reservation.find(filter)
            .populate('recurso', 'nombre tipo')
            .populate('solicitante', 'nombre email')
            .populate('aprobadoPor', 'nombre email')
            .sort({ createdAt: -1 });
        
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

exports.getMyReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ solicitante: req.user.userId })
            .populate('recurso', 'nombre tipo ubicacion')
            .populate('aprobadoPor', 'nombre')
            .sort({ createdAt: -1 });
        
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('recurso', 'nombre tipo capacidad ubicacion')
            .populate('solicitante', 'nombre email')
            .populate('aprobadoPor', 'nombre email');
        
        if (!reservation) {
            return res.status(404).json({ message: 'Reserva no encontrada.' });
        }

        if (Array.isArray(req.user.roles) && req.user.roles.includes('docente') && reservation.solicitante._id.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'No tienes permiso para ver esta reserva.' });
        }

        res.json(reservation);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

exports.updateReservationStatus = async (req, res) => {
    try {
        const { estado, motivoRechazo } = req.body;
        
        if (!['APROBADA', 'RECHAZADA'].includes(estado)) {
            return res.status(400).json({ message: 'Estado inválido. Use APROBADA o RECHAZADA.' });
        }

        if (estado === 'RECHAZADA' && !motivoRechazo) {
            return res.status(400).json({ message: 'Debe proporcionar un motivo de rechazo.' });
        }

        const reservation = await Reservation.findById(req.params.id);
        
        if (!reservation) {
            return res.status(404).json({ message: 'Reserva no encontrada.' });
        }

        if (reservation.estado !== 'PENDIENTE') {
            return res.status(400).json({ message: 'Solo se pueden aprobar/rechazar reservas pendientes.' });
        }

        if (estado === 'APROBADA') {
            const superposicion = await Reservation.findOne({
                _id: { $ne: reservation._id },
                recurso: reservation.recurso,
                estado: 'APROBADA',
                $or: [
                    { fechaInicio: { $lte: reservation.fechaInicio }, fechaFin: { $gt: reservation.fechaInicio } },
                    { fechaInicio: { $lt: reservation.fechaFin }, fechaFin: { $gte: reservation.fechaFin } },
                    { fechaInicio: { $gte: reservation.fechaInicio }, fechaFin: { $lte: reservation.fechaFin } }
                ]
            });

            if (superposicion) {
                return res.status(400).json({ message: 'No se puede aprobar. Existe conflicto de horario con otra reserva aprobada.' });
            }
        }

        reservation.estado = estado;
        reservation.aprobadoPor = req.user.userId;
        if (motivoRechazo) {
            reservation.motivoRechazo = motivoRechazo;
        }

        await reservation.save();
        res.json({ message: `Reserva ${estado.toLowerCase()} exitosamente.`, reservation });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

exports.updateReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        
        if (!reservation) {
            return res.status(404).json({ message: 'Reserva no encontrada.' });
        }

        if (Array.isArray(req.user.roles) && req.user.roles.includes('docente')) {
            if (reservation.solicitante.toString() !== req.user.userId) {
                return res.status(403).json({ message: 'No puedes modificar reservas de otros usuarios.' });
            }
            if (reservation.estado !== 'PENDIENTE') {
                return res.status(400).json({ message: 'Solo puedes modificar reservas pendientes.' });
            }
        }

        const { recurso, fechaInicio, fechaFin, proposito } = req.body;
        
        if (fechaInicio) reservation.fechaInicio = fechaInicio;
        if (fechaFin) reservation.fechaFin = fechaFin;
        if (proposito) reservation.proposito = proposito;
        if (recurso) reservation.recurso = recurso;

        await reservation.save();
        res.json({ message: 'Reserva actualizada exitosamente.', reservation });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        
        if (!reservation) {
            return res.status(404).json({ message: 'Reserva no encontrada.' });
        }

        if (Array.isArray(req.user.roles) && req.user.roles.includes('docente')) {
            if (reservation.solicitante.toString() !== req.user.userId) {
                return res.status(403).json({ message: 'No puedes eliminar reservas de otros usuarios.' });
            }
            if (reservation.estado !== 'PENDIENTE') {
                return res.status(400).json({ message: 'Solo puedes eliminar reservas pendientes.' });
            }
        }

        await Reservation.findByIdAndDelete(req.params.id);
        res.json({ message: 'Reserva eliminada exitosamente.' });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};


