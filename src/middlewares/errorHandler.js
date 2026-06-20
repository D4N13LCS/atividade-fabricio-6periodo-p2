const isProduction = process.env.NODE_ENV === "production";

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    console.error(err);

    const status = err.status || err.statusCode || 500;
    const response = {
        message: isProduction && status === 500
            ? "Erro interno do servidor"
            : err.message || "Erro interno do servidor"
    };

    if (!isProduction && err.stack) {
        response.stack = err.stack;
    }

    res.status(status).json(response);
};

module.exports = errorHandler;
