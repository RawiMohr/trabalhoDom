import express from "express";
import "dotenv/config";
import exerciciosRoutes from "./routes/exerciciosRoutes.js";
import corsMiddleware from "./middlewares/corsMiddleware.js";
import { testarConexao } from "./database/conexao.js";
import authRoutes from "./routes/authRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import registrosRoutes from "./routes/registrosRoutes.js";

// Cria a aplicação e define a porta do servidor.
const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
    console.error("Configure JWT_SECRET no arquivo backend/.env antes de iniciar o servidor.");
    process.exit(1);
}

app.use(corsMiddleware);
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/exercicios", exerciciosRoutes);
app.use("/registros", registrosRoutes);

// Mostra uma mensagem simples para confirmar que a API está ativa.
app.get("/", function (req, res) {
    res.status(200).json({ mensagem: "api funcionando" });
});

// Testa o banco e inicia o servidor.
async function iniciarServidor() {
    await testarConexao();
    app.listen(PORT, function () {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}

iniciarServidor();
