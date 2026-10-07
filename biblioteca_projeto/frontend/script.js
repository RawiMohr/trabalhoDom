const botao = document.getElementById("btnBuscar");
const listaLivros = document.getElementById("listaLivros");
const mensagem = document.getElementById("mensagem");

const formulario = document.getElementById("formulario");
const campoTitulo = document.getElementById("titulo");
const campoAutor = document.getElementById("autor");
const campoAno = document.getElementById("ano");

let idEdicao = null;

botao.addEventListener("click", buscarLivros);
formulario.addEventListener("submit", salvarLivro);

async function salvarLivro(evento) {
    evento.preventDefault();
    if (idEdicao === null) {
        await cadastrarLivro();
    } else {
        await atualizarLivro(idEdicao);
    }
}

async function buscarLivros() {
    try {
        mensagem.textContent = "Buscando livros...";
        
        const resposta = await fetch("http://localhost:3000/livros");
        
        if (!resposta.ok) {
            throw new Error("Erro HTTP " + resposta.status);
        }
        
        const livros = await resposta.json();

        listaLivros.innerHTML = "";
        
        if (!Array.isArray(livros) || livros.length === 0) {
            mensagem.textContent = "Nenhum livro cadastrado.";
            return;
        }

        for (let i = 0; i < livros.length; i++) {
            listaLivros.innerHTML += `
                <tr>
                    <td>${livros[i].id}</td>
                    <td>${livros[i].titulo}</td>
                    <td>${livros[i].autor}</td>
                    <td>${livros[i].ano}</td>
                    <td><button onclick="editarLivro(${livros[i].id})">Editar</button></td>
                    <td><button onclick="excluirLivro(${livros[i].id})">Excluir</button></td>

                </tr>
            `;
        }

        mensagem.textContent = livros.length + " livros encontrados.";

    } catch (erro) {
        console.error(erro);
        mensagem.textContent = "Erro ao conectar com a API (veja se o backend está rodando na porta 3000).";
    }
}


async function cadastrarLivro() {
    try {
        const livro = {
            titulo: campoTitulo.value,
            autor: campoAutor.value,
            ano: campoAno.value
        };

        const resposta = await fetch("http://localhost:3000/livros", {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(livro)
        });

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const dados = await resposta.json();

        formulario.reset();
        await buscarLivros();

        mensagem.textContent = dados.mensagem || "Livro cadastrado com sucesso!";

    } catch (error) {
        mensagem.textContent = "Erro ao cadastrar livro";
        console.error("Não foi possível cadastrar o livro", error);
    }
}

async function editarLivro(id) {
    try {
        const resposta = await fetch("http://localhost:3000/livros/" + id);
        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }
        const livro = await resposta.json();

        campoTitulo.value = livro.titulo;
        campoAutor.value = livro.autor;
        campoAno.value = livro.ano;

        idEdicao = livro.id;
        mensagem.textContent = "Editando livro ID: " + livro.id;

    } catch (erro) {
        mensagem.textContent = "Não foi possível carregar o livro.";
        console.error("Não foi possível editar o livro", erro);
    }
}

async function atualizarLivro(id) {
    try {
        const livro = {
            titulo: campoTitulo.value,
            autor: campoAutor.value,
            ano: campoAno.value
        };

        const resposta = await fetch("http://localhost:3000/livros/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(livro)
        });

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const dados = await resposta.json();

        formulario.reset();
        idEdicao = null;
        await buscarLivros();

        mensagem.textContent = dados.mensagem || "Livro atualizado com sucesso!";

    } catch (error) {
        mensagem.textContent = "Erro ao atualizar livro";
        console.error("Não foi possível atualizar o livro", error);
    }
}
    async function atualizarLivro() {
        try{
            const livro = {titulo: campoTitulo.value, autor: campoAutor.value, ano:campoAno.value};
            console.log("livro atualizado", livro);

            const resposta = await fetch("hettp://localhost:300/livro/" + idEdicao, {method: "PUT", headers: {"Content-Type":"application/json"},
            body: JSON.stringify(livro)});
            if(!resposta.ok){
                throw new Error("Erro HTTP: "+ resposta.status);
            }
            const dados = await resposta.json();
            formulario.reset();
            idEdicao = null;
            botaoSalvar.textContent = "Cadastrar";
            await buscarLivros();

            mensagem.textContent = dados.mensagem
        }
        catch{
            mensagem.textContent="Não foi possivel editar o livro";
            console.log("Erro ao editar livro", erro);
        
        
    }}; 

    async function excluirLivro(req,res) {
        const confirmar = confirm("Deseja excluir esse livro");
        if(!confirmar){
            return;
        }
        try{
            const resposta = await fetch("http://localhost:3000/livros/"+id,{
                method: "DELETE"
            });
            if(!resposta.ok){
                throw new Error("Erro HTTP: ", resposta.status);
            }
            const dados = await resposta.json();
            await buscarLivros();
            mensagem.textContent = dados.mensagem;

        }catch(erro){
            mensagem.textContent="Não foi possivel excluir o livro";
            console.log("Erro ao excluir livro", erro);
        }
    }