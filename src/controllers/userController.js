const User = require("../sql/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const sanitizeUser = (user) => {
    const data = user.toJSON ? user.toJSON() : user;
    const { password, ...safeUser } = data;
    return safeUser;
};

exports.create = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hash
        });

        res.status(201).json(sanitizeUser(user));
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({ message: "E-mail já cadastrado" });
        }
        next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] }
        });
        res.json(users);
    } catch (error) {
        next(error);
    }
};

exports.findById = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password"] }
        });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const { name, email, password } = req.body;
        const payload = {};

        if (name !== undefined) payload.name = name;
        if (email !== undefined) payload.email = email;
        if (password !== undefined) {
            payload.password = await bcrypt.hash(password, 10);
        }

        await user.update(payload);
        res.json(sanitizeUser(user));
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({ message: "E-mail já cadastrado" });
        }
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        await user.destroy();
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token });
    } catch (error) {
        next(error);
    }
};
