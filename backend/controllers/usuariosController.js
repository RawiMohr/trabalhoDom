import { pool } from "../database/conexao.js";

// Nunca seleciona a coluna de senha para as respostas de usuários.
async function listarUsuarios(req, res) {
    try {
        const [usuarios] = await pool.query(
            "SELECT id, nome, email, nivel, data_criacao FROM usuarios ORDER BY nome"
        );
        res.status(200).json(usuarios);
    } catch (erro) {
        console.error("Erro ao listar usuários:", erro);
        res.status(500).json({ mensagem: "Não foi possível listar os usuários." });
    }
}

async function listarAlunos(req, res) {
    try {
        const [alunos] = await pool.query(
            "SELECT id, nome, email FROM usuarios WHERE nivel = 'aluno' ORDER BY nome"
        );
        res.status(200).json(alunos);
    } catch (erro) {
        console.error("Erro ao listar alunos:", erro);
        res.status(500).json({ mensagem: "Não foi possível listar os alunos." });
    }
}

async function alterarNivel(req, res) {
    try {
        const id = Number(req.params.id);
        const nivel = req.body?.nivel;
        const niveis = ["aluno", "instrutor", "admin"];

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ mensagem: "O id do usuário precisa ser um inteiro positivo." });
        }
        if (!niveis.includes(nivel)) {
            return res.status(400).json({ mensagem: "Escolha aluno, instrutor ou admin." });
        }
        if (id === req.usuario.id) {
            return res.status(409).json({ mensagem: "Você não pode alterar o próprio nível de acesso." });
        }

        const [resultado] = await pool.query("UPDATE usuarios SET nivel = ? WHERE id = ?", [nivel, id]);
        if (resultado.affectedRows === 0) {
            const [usuarios] = await pool.query("SELECT id FROM usuarios WHERE id = ?", [id]);
            if (usuarios.length === 0) {
                return res.status(404).json({ mensagem: "Usuário não encontrado." });
            }
        }

        res.status(200).json({ mensagem: "Nível do usuário atualizado com sucesso." });
    } catch (erro) {
        console.error("Erro ao alterar nível:", erro);
        res.status(500).json({ mensagem: "Não foi possível alterar o nível do usuário." });
    }
}

export { listarUsuarios, listarAlunos, alterarNivel };
