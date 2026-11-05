const usuarioInstrutor = exigirNivel(["instrutor", "admin"]);
const corpoExercicios = document.getElementById("listaExercicios");
const mensagemExercicios = document.getElementById("mensagem");
const formularioExercicio = document.getElementById("formularioExercicio");
const seletorAluno = document.getElementById("alunoId");
const filtroAluno = document.getElementById("filtroAluno");
const botaoSalvar = document.getElementById("btnSalvar");
const botaoCancelar = document.getElementById("btnCancelar");
let exerciciosAtuais = [];
let idEdicao = null;

if (usuarioInstrutor) {
    document.getElementById("usuarioNome").textContent = usuarioInstrutor.nome;
    document.getElementById("usuarioNivel").textContent = usuarioInstrutor.nivel;
    document.getElementById("btnSair").addEventListener("click", sair);
    document.getElementById("btnBuscar").addEventListener("click", buscarExercicios);
    filtroAluno.addEventListener("change", buscarExercicios);
    formularioExercicio.addEventListener("submit", salvarExercicio);
    botaoCancelar.addEventListener("click", cancelarEdicao);
    carregarAlunos();
}

async function carregarAlunos() {
    try {
        const alunos = await requisicao("/usuarios/alunos");
        seletorAluno.replaceChildren();
        filtroAluno.replaceChildren();

        const opcaoTodos = document.createElement("option");
        opcaoTodos.value = "";
        opcaoTodos.textContent = "Todos os alunos";
        filtroAluno.appendChild(opcaoTodos);

        for (const aluno of alunos) {
            const opcaoFormulario = document.createElement("option");
            opcaoFormulario.value = aluno.id;
            opcaoFormulario.textContent = aluno.nome;
            seletorAluno.appendChild(opcaoFormulario);

            const opcaoFiltro = document.createElement("option");
            opcaoFiltro.value = aluno.id;
            opcaoFiltro.textContent = aluno.nome;
            filtroAluno.appendChild(opcaoFiltro);
        }

        await buscarExercicios();
    } catch (erro) {
        mensagemExercicios.textContent = erro.message || "Não foi possível carregar os alunos.";
    }
}

async function buscarExercicios() {
    try {
        const alunoId = filtroAluno.value;
        const caminho = alunoId ? "/exercicios?aluno_id=" + encodeURIComponent(alunoId) : "/exercicios";
        exerciciosAtuais = await requisicao(caminho);
        corpoExercicios.replaceChildren();

        for (const exercicio of exerciciosAtuais) {
            const linha = document.createElement("tr");
            for (const valor of [exercicio.aluno_nome, exercicio.nome, exercicio.grupo_muscular, exercicio.series, exercicio.repeticoes, exercicio.carga_kg]) {
                const celula = document.createElement("td");
                celula.textContent = valor;
                linha.appendChild(celula);
            }

            const celulaAcoes = document.createElement("td");
            const botaoEditar = document.createElement("button");
            botaoEditar.type = "button";
            botaoEditar.className = "botao-editar";
            botaoEditar.textContent = "Editar";
            botaoEditar.addEventListener("click", function () { editarExercicio(exercicio.id); });

            const botaoExcluir = document.createElement("button");
            botaoExcluir.type = "button";
            botaoExcluir.className = "botao-excluir";
            botaoExcluir.textContent = "Excluir";
            botaoExcluir.addEventListener("click", function () { excluirExercicio(exercicio.id); });
            celulaAcoes.append(botaoEditar, botaoExcluir);
            linha.appendChild(celulaAcoes);
            corpoExercicios.appendChild(linha);
        }

        mensagemExercicios.textContent = exerciciosAtuais.length + " exercícios encontrados.";
    } catch (erro) {
        mensagemExercicios.textContent = erro.message || "Não foi possível conectar à API.";
    }
}

async function salvarExercicio(evento) {
    evento.preventDefault();
    const exercicio = {
        aluno_id: Number(seletorAluno.value),
        nome: document.getElementById("nome").value,
        grupo_muscular: document.getElementById("grupoMuscular").value,
        series: Number(document.getElementById("series").value),
        repeticoes: Number(document.getElementById("repeticoes").value),
        carga_kg: Number(document.getElementById("carga").value)
    };

    try {
        const caminho = idEdicao === null ? "/exercicios" : "/exercicios/" + idEdicao;
        const metodo = idEdicao === null ? "POST" : "PUT";
        const dados = await requisicao(caminho, { method: metodo, body: JSON.stringify(exercicio) });
        mensagemExercicios.textContent = dados.mensagem;
        cancelarEdicao();
        await buscarExercicios();
    } catch (erro) {
        mensagemExercicios.textContent = erro.message || "Não foi possível salvar o exercício.";
    }
}

function editarExercicio(id) {
    const exercicio = exerciciosAtuais.find(function (item) { return item.id === id; });
    if (!exercicio) return;

    idEdicao = id;
    seletorAluno.value = exercicio.aluno_id;
    document.getElementById("nome").value = exercicio.nome;
    document.getElementById("grupoMuscular").value = exercicio.grupo_muscular;
    document.getElementById("series").value = exercicio.series;
    document.getElementById("repeticoes").value = exercicio.repeticoes;
    document.getElementById("carga").value = exercicio.carga_kg;
    document.getElementById("tituloFormulario").textContent = "Editar exercício";
    botaoSalvar.textContent = "Salvar alteração";
    botaoCancelar.hidden = false;
}

function cancelarEdicao() {
    idEdicao = null;
    formularioExercicio.reset();
    document.getElementById("carga").value = "0";
    document.getElementById("tituloFormulario").textContent = "Cadastrar exercício";
    botaoSalvar.textContent = "Cadastrar";
    botaoCancelar.hidden = true;
}

async function excluirExercicio(id) {
    if (!window.confirm("Deseja excluir este exercício?")) return;
    try {
        const dados = await requisicao("/exercicios/" + id, { method: "DELETE" });
        mensagemExercicios.textContent = dados.mensagem;
        await buscarExercicios();
    } catch (erro) {
        mensagemExercicios.textContent = erro.message || "Não foi possível excluir o exercício.";
    }
}
