import { pool } from "../database/conexao.js";

// Confere os textos e os números recebidos pela API.
function validarExercicio(dados = {}) {
    const { nome, grupo_muscular, series, repeticoes } = dados || {};

    if (!nome || !grupo_muscular || series === undefined || repeticoes === undefined) {
        return "Preencha todos os campos do exercício.";
    }

    if (typeof nome !== "string" || typeof grupo_muscular !== "string") {
        return "Nome e grupo muscular devem ser textos.";
    }

    if (!nome.trim() || !grupo_muscular.trim()) {
        return "Nome e grupo muscular não podem ficar vazios.";
    }

    const numeroSeries = Number(series);
    const numeroRepeticoes = Number(repeticoes);
    if (!Number.isInteger(numeroSeries) || numeroSeries <= 0 || !Number.isInteger(numeroRepeticoes) || numeroRepeticoes <= 0) {
        return "Séries e repetições devem ser números inteiros maiores que zero.";
    }

    return null;
}

// Lista todos os exercícios cadastrados.
async function listarExercicios(req, res) {
    try {
        const [resultado] = await pool.query("SELECT * FROM exercicios");
        res.status(200).json(resultado);
    } catch (erro) {
        console.log("Erro ao listar exercícios:", erro);
        res.status(500).json({ mensagem: "Não foi possível listar os exercícios." });
    }
}

// Busca um exercício pelo identificador recebido na rota.
async function buscarExercicioPorId(req, res) {
    try {
        const [resultado] = await pool.query("SELECT * FROM exercicios WHERE id = ?", [req.params.id]);
        if (resultado.length === 0) {
            return res.status(404).json({ mensagem: "Exercício não encontrado." });
        }
        res.status(200).json(resultado[0]);
    } catch (erro) {
        console.log("Erro ao buscar exercício:", erro);
        res.status(500).json({ mensagem: "Não foi possível buscar o exercício." });
    }
}

// Cadastra um exercício novo no banco.
async function cadastrarExercicio(req, res) {
    try {
        const dados = req.body;
        const erroValidacao = validarExercicio(dados);
        if (erroValidacao) {
            return res.status(400).json({ mensagem: erroValidacao });
        }

        const { nome, grupo_muscular, series, repeticoes } = dados;
        const [resultado] = await pool.query(
            "INSERT INTO exercicios (nome, grupo_muscular, series, repeticoes) VALUES (?, ?, ?, ?)",
            [nome.trim(), grupo_muscular.trim(), Number(series), Number(repeticoes)]
        );
        res.status(201).json({ mensagem: "Exercício cadastrado com sucesso.", id: resultado.insertId });
    } catch (erro) {
        console.log("Erro ao cadastrar exercício:", erro);
        res.status(500).json({ mensagem: "Não foi possível cadastrar o exercício." });
    }
}

// Atualiza os dados de um exercício existente.
async function atualizarExercicio(req, res) {
    try {
        const dados = req.body;
        const erroValidacao = validarExercicio(dados);
        if (erroValidacao) {
            return res.status(400).json({ mensagem: erroValidacao });
        }

        const { nome, grupo_muscular, series, repeticoes } = dados;
        const [resultado] = await pool.query(
            "UPDATE exercicios SET nome = ?, grupo_muscular = ?, series = ?, repeticoes = ? WHERE id = ?",
            [nome.trim(), grupo_muscular.trim(), Number(series), Number(repeticoes), req.params.id]
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

// Remove um exercício pelo identificador recebido na rota.
async function excluirExercicio(req, res) {
    try {
        const [resultado] = await pool.query("DELETE FROM exercicios WHERE id = ?", [req.params.id]);
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
