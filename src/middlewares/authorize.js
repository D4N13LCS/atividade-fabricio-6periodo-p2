const authorize = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Token não informado" });
    }

    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Acesso negado" });
    }

    next();
};

const authorizeSelfOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Token não informado" });
    }

    const isOwner = String(req.user.id) === String(req.params.id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "Acesso negado" });
    }

    next();
};

module.exports = { authorize, authorizeSelfOrAdmin };
