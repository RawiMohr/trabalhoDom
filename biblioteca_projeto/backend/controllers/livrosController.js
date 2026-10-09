import { pool } from "../database/conexao.js"

async function listarLivros(req, res) {
    try {
        const [livros] = await pool.query("SELECT * FROM livros");
        res.status(200).json(livros)
    }
    catch (erro) {
        console.log("erro ao buscar livros", erro);
        res.status(500).json({ mensagem: "erro ao buscar livros" })
    }

}
async function buscarLivrosId(req, res) {
    try {
        const id = req.params.id;

        const [livros] = await pool.query("SELECT * FROM livros WHERE id = ?", [id]);
        if(livros.length === 0){
            return res.status(404).json("livro n encontrado")
        }
        res.status(200).json(livros[0]);
    }
    catch (erro) {
        console.log("erro ao buscar livros", erro);
        res.status(500).json({ mensagem: "erro ao buscar livros" })
    }

}

async function cadastrarLivro(req, res) {
    try {
        const { titulo, autor, ano } = req.body;
        if (!titulo || !autor || !ano) {
            return res.status(400).json({ mensagem: "Preencha todos os campos" });
        }
        const [resultado] = await pool.query("INSERT into livros (titulo, autor, ano) values(?, ?, ?)", [titulo, autor, ano])
        res.status(201).json({ mensagem: "Livro adicionado com sucesso!", id: resultado.insertId });

    }
    catch (erro) {
        console.log("erro ao inserir livro", erro);
        res.status(500).json({ mensagem: "erro ao inserir livros" })
    }
}


async function atualizarLivro(req, res) {
    try {
        const id = req.params.id;
        const { titulo, autor, ano } = req.body;
        if (!titulo || !autor || !ano) {
            return res.status(400).json({ mensagem: "preencha os campos" });
        }
        const [resultado] = await pool.query("UPDATE livros SET titulo = ?, autor = ?, ano =? WHERE id=?", [titulo, autor, ano, id])
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "livro nao encontrado" })
        }
        res.status(200).json({ mensagem: "livro atualizado" })


    } catch (erro) {
        console.log("Erro ao atualizar livro")
        res.status(500).json({ mensagem: "erro ao atualizar livro" })
    }

}



async function excluirLivro(req,res) {
    try{
        const id = req.params.id;
        const [resultado] = await pool.query("DELETE FROM livros WHERE id = ?",[id]);
        if (resultado.affectedRows ===0){
            return res.status(404).json({mensagem: "livro nao encontrado"})
        } return res.status(200).json({mensagem: "livro excluído com sucesso"})


    }   catch(erro){
        console.log("erro ao escluir livro", +erro);
        res.status(500).json({mensagem: "erro ao excluir o livro"})

    } 
}

export { listarLivros, cadastrarLivro, atualizarLivro, buscarLivrosId, excluirLivro};
