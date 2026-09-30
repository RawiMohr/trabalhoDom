import express from "express";

import "dotenv/config";
import livrosRoutes from  "./routes/livrosRoutes.js";
import corsMiddleware from "./middlewares/corsMiddleware.js";
import {testarConexao} from "./database/conexao.js";


//cria aplicaçao
const app=express();
const PORT = process.env.PORT || 3000;

//midlleware
app.use(corsMiddleware);
app.use(express.json());

//rotas 
app.use("/livros", livrosRoutes);

//rota inicial 
app.get("/", function(req,res){
    res.status(200).json({mensagem: "api funcionando"})
});

async function iniciarServidor(){
    try{
        await testarConexao();
        app.listen(PORT, function(){
            console.log(`Servidor rodando em http//localhost:${PORT}`)
        })
    }catch (erro){
        console.log("nao foi possivel iniciar o server");
        console.log(erro.message)
    }
}
iniciarServidor();