import { pool } from "../database/conexao.js";

function validarId(valor) {
    if ((typeof valor !== "number" && typeof valor !== "string") || String(valor).trim() === "") {
        return null;
    }
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function numeroValido(valor) {
    return valor !== undefined && valor !== null && String(valor).trim() !== "" && Number.isFinite(Number(valor));
}

// Confere campos e limites antes de salvar uma ficha.
function validarExercicio(dados) {
    if (!dados || typeof dados.nome !== "string" || dados.nome.trim().length < 2 || dados.nome.trim().length > 100) {
        return "O nome deve ter entre 2 e 100 caracteres.";
    }
    if (typeof dados.grupo_muscular !== "string" || dados.grupo_muscular.trim().length < 2 || dados.grupo_muscular.trim().length > 50) {
        return "O grupo muscular deve ter entre 2 e 50 caracteres.";
    }
    if (!numeroValido(dados.series) || !Number.isInteger(Number(dados.series)) || Number(dados.series) < 1 || Number(dados.series) > 10) {
        return "As séries devem ser um número inteiro de 1 a 10.";
    }
    if (!numeroValido(dados.repeticoes) || !Number.isInteger(Number(dados.repeticoes)) || Number(dados.repeticoes) < 1 || Number(dados.repeticoes) > 100) {
        return "As repetições devem ser um número inteiro de 1 a 100.";
    }
    if (!numeroValido(dados.carga_kg) || Number(dados.carga_kg) < 0 || Number(dados.carga_kg) > 500) {
        return "A carga deve estar entre 0 e 500 kg.";
    }
    if (!validarId(dados.aluno_id)) {
        return "Selecione um aluno válido para a ficha.";
    }
    return null;
}

async function alunoValido(alunoId) {
    const [alunos] = await pool.query("SELECT id FROM usuarios WHERE id = ? AND nivel = 'aluno'", [alunoId]);
    return alunos.length > 0;
}

// O aluno recebe só a própria ficha; instrutor e admin podem filtrar por aluno.
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

        const [exercicios] = await pool.query(
            "SELECT e.id, e.nome, e.grupo_muscular, e.series, e.repeticoes, e.carga_kg, e.aluno_id, u.nome AS aluno_nome FROM exercicios e INNER JOIN usuarios u ON u.id = e.aluno_id WHERE e.id = ?",
            [id]
        );
        if (exercicios.length === 0) {
            return res.status(404).json({ mensagem: "Exercício não encontrado." });
        }
        if (req.usuario.nivel === "aluno" && exercicios[0].aluno_id !== req.usuario.id) {
            return res.status(403).json({ mensagem: "Esta ficha pertence a outro aluno." });
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
        const erroValidacao = validarExercicio(dados);
        if (erroValidacao) {
            return res.status(400).json({ mensagem: erroValidacao });
        }
        const alunoId = validarId(dados.aluno_id);
        if (!(await alunoValido(alunoId))) {
            return res.status(400).json({ mensagem: "A ficha precisa pertencer a um usuário com nível aluno." });
        }

        const [quantidade] = await pool.query("SELECT COUNT(*) AS total FROM exercicios WHERE aluno_id = ?", [alunoId]);
        if (quantidade[0].total >= 15) {
            return res.status(409).json({ mensagem: "O aluno já tem o limite de 15 exercícios na ficha." });
        }

        const [resultado] = await pool.query(
            "INSERT INTO exercicios (nome, grupo_muscular, series, repeticoes, carga_kg, aluno_id) VALUES (?, ?, ?, ?, ?, ?)",
            [dados.nome.trim(), dados.grupo_muscular.trim(), Number(dados.series), Number(dados.repeticoes), Number(dados.carga_kg), alunoId]
        );
        res.status(201).json({ mensagem: "Exercício cadastrado com sucesso.", id: resultado.insertId });
    } catch (erro) {
        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ mensagem: "Esse exercício já existe na ficha do aluno." });
        }
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
        const [atuais] = await pool.query("SELECT id, aluno_id FROM exercicios WHERE id = ?", [id]);
        if (atuais.length === 0) {
            return res.status(404).json({ mensagem: "Exercício não encontrado." });
        }

        const dados = req.body;
        const erroValidacao = validarExercicio(dados);
        if (erroValidacao) {
            return res.status(400).json({ mensagem: erroValidacao });
        }
        const alunoId = validarId(dados.aluno_id);
        if (!(await alunoValido(alunoId))) {
            return res.status(400).json({ mensagem: "A ficha precisa pertencer a um usuário com nível aluno." });
        }

        if (alunoId !== atuais[0].aluno_id) {
            const [quantidade] = await pool.query("SELECT COUNT(*) AS total FROM exercicios WHERE aluno_id = ?", [alunoId]);
            if (quantidade[0].total >= 15) {
                return res.status(409).json({ mensagem: "O aluno já tem o limite de 15 exercícios na ficha." });
            }
        }

        await pool.query(
            "UPDATE exercicios SET nome = ?, grupo_muscular = ?, series = ?, repeticoes = ?, carga_kg = ?, aluno_id = ? WHERE id = ?",
            [dados.nome.trim(), dados.grupo_muscular.trim(), Number(dados.series), Number(dados.repeticoes), Number(dados.carga_kg), alunoId, id]
        );
        res.status(200).json({ mensagem: "Exercício atualizado com sucesso." });
    } catch (erro) {
        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ mensagem: "Esse exercício já existe na ficha do aluno." });
        }
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
