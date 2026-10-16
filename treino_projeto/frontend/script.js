const enderecoApi = "http://localhost:3000/exercicios";
const botaoBuscar = document.getElementById("btnBuscar");
const listaExercicios = document.getElementById("listaExercicios");
const mensagem = document.getElementById("mensagem");
const formulario = document.getElementById("formulario");
const campoNome = document.getElementById("nome");
const campoGrupo = document.getElementById("grupoMuscular");
const campoSeries = document.getElementById("series");
const campoRepeticoes = document.getElementById("repeticoes");
const botaoSalvar = document.getElementById("btnSalvar");
const botaoCancelar = document.getElementById("btnCancelar");

let idEdicao = null;

botaoBuscar.addEventListener("click", buscarExercicios);
formulario.addEventListener("submit", salvarExercicio);
botaoCancelar.addEventListener("click", cancelarEdicao);

// Lê a mensagem de erro enviada pela API.
async function lerMensagemErro(resposta) {
    const dados = await resposta.json();
    return dados.mensagem || "Não foi possível concluir a operação.";
}

// Busca todos os exercícios cadastrados.
async function buscarExercicios() {
    try {
        mensagem.textContent = "Buscando exercícios...";
        const resposta = await fetch(enderecoApi);

        if (!resposta.ok) {
            throw new Error(await lerMensagemErro(resposta));
        }

        const exercicios = await resposta.json();
        listaExercicios.innerHTML = "";

        if (exercicios.length === 0) {
            mensagem.textContent = "Nenhum exercício encontrado.";
            return;
        }

        exercicios.forEach(function (exercicio) {
            const linha = document.createElement("tr");
            const valores = [exercicio.id, exercicio.nome, exercicio.grupo_muscular, exercicio.series, exercicio.repeticoes];

            valores.forEach(function (valor) {
                const celula = document.createElement("td");
                celula.textContent = valor;
                linha.appendChild(celula);
            });

            const celulaAcoes = document.createElement("td");
            const botaoEditar = document.createElement("button");
            botaoEditar.type = "button";
            botaoEditar.textContent = "Editar";
            botaoEditar.className = "botao-editar";
            botaoEditar.addEventListener("click", function () {
                editarExercicio(exercicio.id);
            });

            const botaoExcluir = document.createElement("button");
            botaoExcluir.type = "button";
            botaoExcluir.textContent = "Excluir";
            botaoExcluir.className = "botao-excluir";
            botaoExcluir.addEventListener("click", function () {
                excluirExercicio(exercicio.id);
            });

            celulaAcoes.append(botaoEditar, botaoExcluir);
            linha.appendChild(celulaAcoes);
            listaExercicios.appendChild(linha);
        });

        mensagem.textContent = exercicios.length + " exercício(s) encontrado(s).";
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = erro.message || "Erro ao conectar com a API.";
    }
}

// Decide se o formulário vai cadastrar ou atualizar um exercício.
async function salvarExercicio(evento) {
    evento.preventDefault();
    if (idEdicao === null) {
        await cadastrarExercicio();
    } else {
        await atualizarExercicio();
    }
}

// Reúne os valores preenchidos no formulário.
function obterDadosFormulario() {
    return {
        nome: campoNome.value.trim(),
        grupo_muscular: campoGrupo.value.trim(),
        series: Number(campoSeries.value),
        repeticoes: Number(campoRepeticoes.value)
    };
}

// Envia um exercício novo para a API.
async function cadastrarExercicio() {
    try {
        mensagem.textContent = "Cadastrando exercício...";
        const resposta = await fetch(enderecoApi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obterDadosFormulario())
        });

        if (!resposta.ok) {
            throw new Error(await lerMensagemErro(resposta));
        }

        const dados = await resposta.json();
        formulario.reset();
        await buscarExercicios();
        mensagem.textContent = dados.mensagem;
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = erro.message || "Erro ao cadastrar exercício.";
    }
}

// Carrega os dados do exercício escolhido para edição.
async function editarExercicio(id) {
    try {
        const resposta = await fetch(enderecoApi + "/" + id);
        if (!resposta.ok) {
            throw new Error(await lerMensagemErro(resposta));
        }

        const exercicio = await resposta.json();
        campoNome.value = exercicio.nome;
        campoGrupo.value = exercicio.grupo_muscular;
        campoSeries.value = exercicio.series;
        campoRepeticoes.value = exercicio.repeticoes;
        idEdicao = exercicio.id;
        botaoSalvar.textContent = "Salvar alteração";
        botaoCancelar.hidden = false;
        mensagem.textContent = "Editando exercício ID " + exercicio.id + ".";
        formulario.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = erro.message || "Não foi possível carregar o exercício.";
    }
}

// Envia as mudanças do exercício selecionado.
async function atualizarExercicio() {
    try {
        const resposta = await fetch(enderecoApi + "/" + idEdicao, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obterDadosFormulario())
        });

        if (!resposta.ok) {
            throw new Error(await lerMensagemErro(resposta));
        }

        const dados = await resposta.json();
        cancelarEdicao();
        await buscarExercicios();
        mensagem.textContent = dados.mensagem;
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = erro.message || "Não foi possível atualizar o exercício.";
    }
}

// Pede confirmação e remove o exercício selecionado.
async function excluirExercicio(id) {
    if (!confirm("Deseja excluir este exercício?")) {
        return;
    }

    try {
        const resposta = await fetch(enderecoApi + "/" + id, { method: "DELETE" });
        if (!resposta.ok) {
            throw new Error(await lerMensagemErro(resposta));
        }

        const dados = await resposta.json();
        await buscarExercicios();
        mensagem.textContent = dados.mensagem;
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = erro.message || "Não foi possível excluir o exercício.";
    }
}

// Sai da edição e limpa os campos do formulário.
function cancelarEdicao() {
    formulario.reset();
    idEdicao = null;
    botaoSalvar.textContent = "Cadastrar";
    botaoCancelar.hidden = true;
}
