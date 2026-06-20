const Car = require("../nosql/Car");

exports.create = async (req, res, next) => {
    try {
        const car = await Car.create(req.body);
        res.status(201).json(car);
    } catch (error) {
        next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (error) {
        next(error);
    }
};

exports.findById = async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: "Carro não encontrado" });
        }

        res.json(car);
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const car = await Car.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!car) {
            return res.status(404).json({ message: "Carro não encontrado" });
        }

        res.json(car);
    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);

        if (!car) {
            return res.status(404).json({ message: "Carro não encontrado" });
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
