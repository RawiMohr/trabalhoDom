import jwt from "jsonwebtoken";

// Valida o token Bearer e deixa os dados do usuário disponíveis nas rotas.
function autenticacaoMiddleware(req, res, next) {
    const autorizacao = req.headers.authorization;
    if (!autorizacao || !autorizacao.startsWith("Bearer ")) {
        return res.status(401).json({ mensagem: "Faça login para continuar." });
    }

    const token = autorizacao.slice(7);
    try {
        const dados = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = { id: dados.id, nome: dados.nome, nivel: dados.nivel };
        next();
    } catch (erro) {
        return res.status(401).json({ mensagem: "Token inválido ou expirado." });
    }
}

export default autenticacaoMiddleware;
