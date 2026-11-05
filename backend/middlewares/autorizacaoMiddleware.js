// Confere se o nível guardado no token pode acessar a rota.
function autorizacaoMiddleware(...niveisPermitidos) {
    return function (req, res, next) {
        if (!req.usuario || !niveisPermitidos.includes(req.usuario.nivel)) {
            return res.status(403).json({ mensagem: "Você não tem permissão para esta ação." });
        }
        next();
    };
}

export default autorizacaoMiddleware;
