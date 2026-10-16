import mysql from "mysql2/promise";
import "dotenv/config";

// Cria um pool para reutilizar as conexões com o banco.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

// Confere se o banco está respondendo.
async function testarConexao() {
    let conexao;
    try {
        conexao = await pool.getConnection();
        await conexao.query("SELECT 1");
        console.log("Banco de dados conectado com sucesso");
    } catch (erro) {
        console.log("Erro ao conectar ao banco de dados:", erro.message);
    } finally {
        if (conexao) conexao.release();
    }
}

export { pool, testarConexao };
