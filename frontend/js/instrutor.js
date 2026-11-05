const botaoBuscar = document.getElementById("btnBuscar");
const listaExercicios = document.getElementById("listaExercicios");
const mensagem = document.getElementById("mensagem");

const formulario = document.getElementById("formulario");
const campoNome = document.getElementById("nome");
const campoGrupo = document.getElementById("grupoMuscular");
const campoSeries = document.getElementById("series");
const campoRepeticoes = document.getElementById("repeticoes");
const botaoSalvar = document.getElementById("btnSalvar");

let idEdicao = null;

botaoBuscar.addEventListener("click", buscarExercicios);
formulario.addEventListener("submit", salvarExercicio);

// Decide se o formulário vai cadastrar um exercício novo ou atualizar um existente.
async function salvarExercicio(evento) {
    evento.preventDefault();
    if (idEdicao === null) {
        await cadastrarExercicio();
    } else {
        await atualizarExercicio();
    }
}

// Busca os exercícios na API (GET) e mostra na tabela.
async function buscarExercicios() {
    try {
        mensagem.textContent = "Buscando exercícios...";

        const resposta = await fetch("http://localhost:3000/exercicios");

        if (!resposta.ok) {
            throw new Error("Erro HTTP " + resposta.status);
        }

        const exercicios = await resposta.json();

        listaExercicios.innerHTML = "";

        if (exercicios.length === 0) {
            mensagem.textContent = "Nenhum exercício cadastrado.";
            return;
        }

        // Cria uma linha da tabela para cada exercício.
        for (let i = 0; i < exercicios.length; i++) {
            listaExercicios.innerHTML += `
                <tr>
                    <td>${exercicios[i].id}</td>
                    <td>${exercicios[i].nome}</td>
                    <td>${exercicios[i].grupo_muscular}</td>
                    <td>${exercicios[i].series}</td>
                    <td>${exercicios[i].repeticoes}</td>
                    <td>
                        <button class="botao-editar" onclick="editarExercicio(${exercicios[i].id})">Editar</button>
                        <button class="botao-excluir" onclick="excluirExercicio(${exercicios[i].id})">Excluir</button>
                    </td>
                </tr>
            `;
        }

        mensagem.textContent = exercicios.length + " exercícios encontrados.";
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = "Erro ao conectar com a API (veja se o backend está rodando na porta 3000).";
    }
}

// Envia um exercício novo para a API (POST).
async function cadastrarExercicio() {
    try {
        const exercicio = {
            nome: campoNome.value,
            grupo_muscular: campoGrupo.value,
            series: campoSeries.value,
            repeticoes: campoRepeticoes.value
        };

        const resposta = await fetch("http://localhost:3000/exercicios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(exercicio)
        });

        if (!resposta.ok) {
            throw new Error("Erro HTTP " + resposta.status);
        }

        const dados = await resposta.json();

        formulario.reset();
        await buscarExercicios();

        mensagem.textContent = dados.mensagem;
    } catch (erro) {
        mensagem.textContent = "Erro ao cadastrar exercício.";
        console.error("Não foi possível cadastrar o exercício", erro);
    }
}

// Busca um exercício pelo id (GET) e coloca os dados no formulário para editar.
async function editarExercicio(id) {
    try {
        const resposta = await fetch("http://localhost:3000/exercicios/" + id);

        if (!resposta.ok) {
            throw new Error("Erro HTTP " + resposta.status);
        }

        const exercicio = await resposta.json();

        campoNome.value = exercicio.nome;
        campoGrupo.value = exercicio.grupo_muscular;
        campoSeries.value = exercicio.series;
        campoRepeticoes.value = exercicio.repeticoes;

        idEdicao = exercicio.id;
        botaoSalvar.textContent = "Salvar alteração";
        mensagem.textContent = "Editando exercício ID: " + exercicio.id;
    } catch (erro) {
        mensagem.textContent = "Não foi possível carregar o exercício.";
        console.error("Não foi possível editar o exercício", erro);
    }
}

// Envia os dados alterados para a API (PUT), usando o id guardado em idEdicao.
async function atualizarExercicio() {
    try {
        const exercicio = {
            nome: campoNome.value,
            grupo_muscular: campoGrupo.value,
            series: campoSeries.value,
            repeticoes: campoRepeticoes.value
        };

        const resposta = await fetch("http://localhost:3000/exercicios/" + idEdicao, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(exercicio)
        });

        if (!resposta.ok) {
            throw new Error("Erro HTTP " + resposta.status);
        }

        const dados = await resposta.json();

        formulario.reset();
        idEdicao = null;
        botaoSalvar.textContent = "Cadastrar";
        await buscarExercicios();

        mensagem.textContent = dados.mensagem;
    } catch (erro) {
        mensagem.textContent = "Não foi possível atualizar o exercício.";
        console.error("Erro ao atualizar exercício", erro);
    }
}

// Pede confirmação e exclui o exercício na API (DELETE), usando o id da linha.
async function excluirExercicio(id) {
    const confirmar = confirm("Deseja excluir este exercício?");
    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch("http://localhost:3000/exercicios/" + id, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Erro HTTP " + resposta.status);
        }

        const dados = await resposta.json();

        await buscarExercicios();
        mensagem.textContent = dados.mensagem;
    } catch (erro) {
        mensagem.textContent = "Não foi possível excluir o exercício.";
        console.error("Erro ao excluir exercício", erro);
    }
}