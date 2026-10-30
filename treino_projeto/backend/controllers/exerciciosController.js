import { pool } from "../database/conexao.js";

// Lista todos os exercícios cadastrados.
async function listarExercicios(req, res) {
    try {
        const [exercicios] = await pool.query("SELECT * FROM exercicios");
        res.status(200).json(exercicios);
    } catch (erro) {
        console.log("Erro ao listar exercícios:", erro);
        res.status(500).json({ mensagem: "Não foi possível listar os exercícios." });
    }
}

// Busca um exercício pelo id que vem na rota.
async function buscarExercicioPorId(req, res) {
    try {
        const id = req.params.id;
        const [exercicios] = await pool.query("SELECT * FROM exercicios WHERE id = ?", [id]);
        if (exercicios.length === 0) {
            return res.status(404).json({ mensagem: "Exercício não encontrado." });
        }
        res.status(200).json(exercicios[0]);
    } catch (erro) {
        console.log("Erro ao buscar exercício:", erro);
        res.status(500).json({ mensagem: "Não foi possível buscar o exercício." });
    }
}

// Cadastra um exercício novo no banco.
async function cadastrarExercicio(req, res) {
    try {
        const { nome, grupo_muscular, series, repeticoes } = req.body;
        if (!nome || !grupo_muscular || !series || !repeticoes) {
            return res.status(400).json({ mensagem: "Preencha todos os campos do exercício." });
        }
        const [resultado] = await pool.query(
            "INSERT INTO exercicios (nome, grupo_muscular, series, repeticoes) VALUES (?, ?, ?, ?)",
            [nome, grupo_muscular, series, repeticoes]
        );
        res.status(201).json({ mensagem: "Exercício cadastrado com sucesso.", id: resultado.insertId });
    } catch (erro) {
        console.log("Erro ao cadastrar exercício:", erro);
        res.status(500).json({ mensagem: "Não foi possível cadastrar o exercício." });
    }
}

// Atualiza um exercício existente, usando o id da rota.
async function atualizarExercicio(req, res) {
    try {
        const id = req.params.id;
        const { nome, grupo_muscular, series, repeticoes } = req.body;
        if (!nome || !grupo_muscular || !series || !repeticoes) {
            return res.status(400).json({ mensagem: "Preencha todos os campos do exercício." });
        }
        const [resultado] = await pool.query(
            "UPDATE exercicios SET nome = ?, grupo_muscular = ?, series = ?, repeticoes = ? WHERE id = ?",
            [nome, grupo_muscular, series, repeticoes, id]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Exercício não encontrado." });
        }
        res.status(200).json({ mensagem: "Exercício atualizado com sucesso." });
    } catch (erro) {
        console.log("Erro ao atualizar exercício:", erro);
        res.status(500).json({ mensagem: "Não foi possível atualizar o exercício." });
    }
}

// Exclui um exercício pelo id da rota.
async function excluirExercicio(req, res) {
    try {
        const id = req.params.id;
        const [resultado] = await pool.query("DELETE FROM exercicios WHERE id = ?", [id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Exercício não encontrado." });
        }
        res.status(200).json({ mensagem: "Exercício excluído com sucesso." });
    } catch (erro) {
        console.log("Erro ao excluir exercício:", erro);
        res.status(500).json({ mensagem: "Não foi possível excluir o exercício." });
    }
}

export { listarExercicios, buscarExercicioPorId, cadastrarExercicio, atualizarExercicio, excluirExercicio };