const Moto = require("../nosql/Moto");

exports.create = async (req, res, next) => {
    try {
        const moto = await Moto.create(req.body);
        res.status(201).json(moto);
    } catch (error) {
        next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const motos = await Moto.find();
        res.json(motos);
    } catch (error) {
        next(error);
    }
};

exports.findById = async (req, res, next) => {
    try {
        const moto = await Moto.findById(req.params.id);

        if (!moto) {
            return res.status(404).json({ message: "Moto não encontrada" });
        }

        res.json(moto);
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const moto = await Moto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!moto) {
            return res.status(404).json({ message: "Moto não encontrada" });
        }

        res.json(moto);
    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const moto = await Moto.findByIdAndDelete(req.params.id);

        if (!moto) {
            return res.status(404).json({ message: "Moto não encontrada" });
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
