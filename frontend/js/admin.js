const usuarioAdmin = exigirNivel(["admin"]);
const corpoUsuarios = document.getElementById("listaUsuarios");
const mensagemUsuarios = document.getElementById("mensagem");

if (usuarioAdmin) {
    document.getElementById("usuarioNome").textContent = usuarioAdmin.nome;
    document.getElementById("usuarioNivel").textContent = usuarioAdmin.nivel;
    document.getElementById("btnSair").addEventListener("click", sair);
    carregarUsuarios();
}

async function carregarUsuarios() {
    try {
        const usuarios = await requisicao("/usuarios");
        corpoUsuarios.replaceChildren();
        for (const usuario of usuarios) {
            const linha = document.createElement("tr");
            for (const valor of [usuario.nome, usuario.email]) {
                const celula = document.createElement("td");
                celula.textContent = valor;
                linha.appendChild(celula);
            }

            const celulaNivel = document.createElement("td");
            const seletorNivel = document.createElement("select");
            for (const nivel of ["aluno", "instrutor", "admin"]) {
                const opcao = document.createElement("option");
                opcao.value = nivel;
                opcao.textContent = nivel;
                opcao.selected = usuario.nivel === nivel;
                seletorNivel.appendChild(opcao);
            }
            celulaNivel.appendChild(seletorNivel);
            linha.appendChild(celulaNivel);

            const celulaAcao = document.createElement("td");
            const botaoSalvarNivel = document.createElement("button");
            botaoSalvarNivel.type = "button";
            botaoSalvarNivel.textContent = "Salvar";
            botaoSalvarNivel.addEventListener("click", function () {
                salvarNivel(usuario.id, seletorNivel.value);
            });
            celulaAcao.appendChild(botaoSalvarNivel);
            linha.appendChild(celulaAcao);
            corpoUsuarios.appendChild(linha);
        }
        mensagemUsuarios.textContent = usuarios.length + " usuários encontrados.";
    } catch (erro) {
        mensagemUsuarios.textContent = erro.message || "Não foi possível carregar os usuários.";
    }
}

async function salvarNivel(id, nivel) {
    try {
        const dados = await requisicao("/usuarios/" + id + "/nivel", {
            method: "PUT",
            body: JSON.stringify({ nivel })
        });
        mensagemUsuarios.textContent = dados.mensagem;
        await carregarUsuarios();
    } catch (erro) {
        mensagemUsuarios.textContent = erro.message || "Não foi possível alterar o nível.";
    }
}
