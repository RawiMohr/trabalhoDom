import { pool } from "../database/conexao.js";

function validarId(valor) {
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function camposObrigatoriosValidos(dados) {
    return Boolean(dados)
        && typeof dados.nome === "string" && dados.nome.trim() !== ""
        && typeof dados.grupo_muscular === "string" && dados.grupo_muscular.trim() !== ""
        && dados.series !== undefined && Number.isFinite(Number(dados.series))
        && dados.repeticoes !== undefined && Number.isFinite(Number(dados.repeticoes))
        && dados.carga_kg !== undefined && Number.isFinite(Number(dados.carga_kg))
        && validarId(dados.aluno_id) !== null;
}

// O aluno recebe a própria ficha; instrutor e admin podem filtrar por aluno.
async function listarExercicios(req, res) {
    try {
        let consulta = "SELECT e.id, e.nome, e.grupo_muscular, e.series, e.repeticoes, e.carga_kg, e.aluno_id, u.nome AS aluno_nome FROM exercicios e INNER JOIN usuarios u ON u.id = e.aluno_id";
        const valores = [];

        if (req.usuario.nivel === "aluno") {
            consulta += " WHERE e.aluno_id = ?";
            valores.push(req.usuario.id);
        } else if (req.query.aluno_id !== undefined) {
            const alunoId = validarId(req.query.aluno_id);
            if (!alunoId) {
                return res.status(400).json({ mensagem: "O filtro aluno_id precisa ser um inteiro positivo." });
            }
            consulta += " WHERE e.aluno_id = ?";
            valores.push(alunoId);
        }

        consulta += " ORDER BY e.id";
        const [exercicios] = await pool.query(consulta, valores);
        res.status(200).json(exercicios);
    } catch (erro) {
        console.error("Erro ao listar exercícios:", erro);
        res.status(500).json({ mensagem: "Não foi possível listar os exercícios." });
    }
}

async function buscarExercicioPorId(req, res) {
    try {
        const id = validarId(req.params.id);
        if (!id) {
            return res.status(400).json({ mensagem: "O id do exercício precisa ser um inteiro positivo." });
        }

        let consulta = "SELECT e.id, e.nome, e.grupo_muscular, e.series, e.repeticoes, e.carga_kg, e.aluno_id, u.nome AS aluno_nome FROM exercicios e INNER JOIN usuarios u ON u.id = e.aluno_id WHERE e.id = ?";
        const valores = [id];
        if (req.usuario.nivel === "aluno") {
            consulta += " AND e.aluno_id = ?";
            valores.push(req.usuario.id);
        }

        const [exercicios] = await pool.query(consulta, valores);
        if (exercicios.length === 0) {
            return res.status(404).json({ mensagem: "Exercício não encontrado." });
        }
        res.status(200).json(exercicios[0]);
    } catch (erro) {
        console.error("Erro ao buscar exercício:", erro);
        res.status(500).json({ mensagem: "Não foi possível buscar o exercício." });
    }
}

async function cadastrarExercicio(req, res) {
    try {
        const dados = req.body;
        if (!camposObrigatoriosValidos(dados)) {
            return res.status(400).json({ mensagem: "Preencha todos os campos válidos do exercício." });
        }

        const [resultado] = await pool.query(
            "INSERT INTO exercicios (nome, grupo_muscular, series, repeticoes, carga_kg, aluno_id) VALUES (?, ?, ?, ?, ?, ?)",
            [dados.nome.trim(), dados.grupo_muscular.trim(), Number(dados.series), Number(dados.repeticoes), Number(dados.carga_kg), validarId(dados.aluno_id)]
        );
        res.status(201).json({ mensagem: "Exercício cadastrado com sucesso.", id: resultado.insertId });
    } catch (erro) {
        console.error("Erro ao cadastrar exercício:", erro);
        res.status(500).json({ mensagem: "Não foi possível cadastrar o exercício." });
    }
}

async function atualizarExercicio(req, res) {
    try {
        const id = validarId(req.params.id);
        if (!id) {
            return res.status(400).json({ mensagem: "O id do exercício precisa ser um inteiro positivo." });
        }
        const dados = req.body;
        if (!camposObrigatoriosValidos(dados)) {
            return res.status(400).json({ mensagem: "Preencha todos os campos válidos do exercício." });
        }

        const [resultado] = await pool.query(
            "UPDATE exercicios SET nome = ?, grupo_muscular = ?, series = ?, repeticoes = ?, carga_kg = ?, aluno_id = ? WHERE id = ?",
            [dados.nome.trim(), dados.grupo_muscular.trim(), Number(dados.series), Number(dados.repeticoes), Number(dados.carga_kg), validarId(dados.aluno_id), id]
        );
        if (resultado.affectedRows === 0) {
            const [exercicios] = await pool.query("SELECT id FROM exercicios WHERE id = ?", [id]);
            if (exercicios.length === 0) {
                return res.status(404).json({ mensagem: "Exercício não encontrado." });
            }
        }
        res.status(200).json({ mensagem: "Exercício atualizado com sucesso." });
    } catch (erro) {
        console.error("Erro ao atualizar exercício:", erro);
        res.status(500).json({ mensagem: "Não foi possível atualizar o exercício." });
    }
}

async function excluirExercicio(req, res) {
    try {
        const id = validarId(req.params.id);
        if (!id) {
            return res.status(400).json({ mensagem: "O id do exercício precisa ser um inteiro positivo." });
        }
        const [resultado] = await pool.query("DELETE FROM exercicios WHERE id = ?", [id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Exercício não encontrado." });
        }
        res.status(200).json({ mensagem: "Exercício excluído com sucesso." });
    } catch (erro) {
        console.error("Erro ao excluir exercício:", erro);
        res.status(500).json({ mensagem: "Não foi possível excluir o exercício." });
    }
}

export { listarExercicios, buscarExercicioPorId, cadastrarExercicio, atualizarExercicio, excluirExercicio };
