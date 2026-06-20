const ClothingBrand = require("../nosql/ClothingBrand");

exports.create = async (req, res, next) => {
    try {
        const brand = await ClothingBrand.create(req.body);
        res.status(201).json(brand);
    } catch (error) {
        next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const brands = await ClothingBrand.find();
        res.json(brands);
    } catch (error) {
        next(error);
    }
};

exports.findById = async (req, res, next) => {
    try {
        const brand = await ClothingBrand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({ message: "Marca não encontrada" });
        }

        res.json(brand);
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const brand = await ClothingBrand.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!brand) {
            return res.status(404).json({ message: "Marca não encontrada" });
        }

        res.json(brand);
    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const brand = await ClothingBrand.findByIdAndDelete(req.params.id);

        if (!brand) {
            return res.status(404).json({ message: "Marca não encontrada" });
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
