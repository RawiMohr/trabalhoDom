import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../database/conexao.js";

// O cadastro público sempre cria aluno, mesmo se receber outro nível.
async function cadastrarUsuario(req, res) {
    try {
        const nome = typeof req.body.nome === "string" ? req.body.nome.trim() : "";
        const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
        const senha = typeof req.body.senha === "string" ? req.body.senha : "";

        if (nome.length < 2 || nome.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || senha.length < 6) {
            return res.status(400).json({ mensagem: "Informe nome, email válido e senha com pelo menos 6 caracteres." });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const [resultado] = await pool.query(
            "INSERT INTO usuarios (nome, email, senha, nivel) VALUES (?, ?, ?, 'aluno')",
            [nome, email, senhaHash]
        );

        res.status(201).json({ mensagem: "Cadastro realizado com sucesso.", id: resultado.insertId });
    } catch (erro) {
        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ mensagem: "Este email já está cadastrado." });
        }
        console.error("Erro ao cadastrar usuário:", erro);
        res.status(500).json({ mensagem: "Não foi possível realizar o cadastro." });
    }
}

// Usa a mesma resposta para email inexistente e senha incorreta.
async function fazerLogin(req, res) {
    try {
        const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
        const senha = typeof req.body.senha === "string" ? req.body.senha : "";
        const [usuarios] = await pool.query(
            "SELECT id, nome, email, senha, nivel FROM usuarios WHERE email = ?",
            [email]
        );

        if (usuarios.length === 0 || !(await bcrypt.compare(senha, usuarios[0].senha))) {
            return res.status(401).json({ mensagem: "Email ou senha inválidos." });
        }

        const usuario = usuarios[0];
        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome, nivel: usuario.nivel },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
        );

        res.status(200).json({
            mensagem: "Login realizado com sucesso.",
            token,
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, nivel: usuario.nivel }
        });
    } catch (erro) {
        console.error("Erro ao fazer login:", erro);
        res.status(500).json({ mensagem: "Não foi possível fazer login." });
    }
}

export { cadastrarUsuario, fazerLogin };
