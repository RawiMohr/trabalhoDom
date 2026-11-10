import { pool } from "../database/conexao.js";

function validarId(valor) {
    if ((typeof valor !== "number" && typeof valor !== "string") || String(valor).trim() === "") {
        return null;
    }
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
}

async function listarRegistros(req, res) {
    try {
        let consulta = "SELECT r.id, r.exercicio_id, r.aluno_id, r.carga_kg, DATE_FORMAT(r.data_registro, '%d/%m/%Y') AS data_registro, e.nome AS exercicio_nome, u.nome AS aluno_nome FROM registros_treino r INNER JOIN exercicios e ON e.id = r.exercicio_id INNER JOIN usuarios u ON u.id = r.aluno_id";
        const valores = [];

        if (req.usuario.nivel === "aluno") {
            consulta += " WHERE r.aluno_id = ?";
            valores.push(req.usuario.id);
        } else if (req.query.aluno_id !== undefined) {
            const alunoId = validarId(req.query.aluno_id);
            if (!alunoId) {
                return res.status(400).json({ mensagem: "O filtro aluno_id precisa ser um inteiro positivo." });
            }
            consulta += " WHERE r.aluno_id = ?";
            valores.push(alunoId);
        }

        consulta += " ORDER BY r.data_registro DESC, r.id DESC";
        const [registros] = await pool.query(consulta, valores);
        res.status(200).json(registros);
    } catch (erro) {
        console.error("Erro ao listar registros de treino:", erro);
        res.status(500).json({ mensagem: "Não foi possível listar os registros de treino." });
    }
}

async function registrarTreino(req, res) {
    try {
        const exercicioId = validarId(req.body?.exercicio_id);
        const carga = Number(req.body?.carga_kg);
        if (!exercicioId || req.body?.carga_kg === undefined || req.body?.carga_kg === null || String(req.body?.carga_kg).trim() === "" || !Number.isFinite(carga) || carga < 0 || carga > 500) {
            return res.status(400).json({ mensagem: "Informe um exercício válido e uma carga entre 0 e 500 kg." });
        }

        const [exercicios] = await pool.query(
            "SELECT id FROM exercicios WHERE id = ? AND aluno_id = ?",
            [exercicioId, req.usuario.id]
        );
        if (exercicios.length === 0) {
            return res.status(403).json({ mensagem: "Você só pode registrar treino em exercícios da sua ficha." });
        }

        await pool.query(
            "INSERT INTO registros_treino (exercicio_id, aluno_id, carga_kg, data_registro) VALUES (?, ?, ?, CURDATE())",
            [exercicioId, req.usuario.id, carga]
        );
        res.status(201).json({ mensagem: "Treino registrado com sucesso." });
    } catch (erro) {
        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ mensagem: "Este exercício já tem um registro hoje." });
        }
        console.error("Erro ao registrar treino:", erro);
        res.status(500).json({ mensagem: "Não foi possível registrar o treino." });
    }
}

export { listarRegistros, registrarTreino };
