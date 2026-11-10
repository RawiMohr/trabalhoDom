const usuarioAluno = exigirNivel(["aluno"]);
const listaFicha = document.getElementById("listaExercicios");
const listaHistorico = document.getElementById("listaHistorico");
const mensagemFicha = document.getElementById("mensagem");
const mensagemHistorico = document.getElementById("mensagemHistorico");

if (usuarioAluno) {
    document.getElementById("usuarioNome").textContent = usuarioAluno.nome;
    document.getElementById("usuarioNivel").textContent = usuarioAluno.nivel;
    document.getElementById("btnSair").addEventListener("click", sair);
    carregarFicha();
    carregarHistorico();
}

async function carregarFicha() {
    try {
        const exercicios = await requisicao("/exercicios");
        listaFicha.replaceChildren();
        if (exercicios.length === 0) {
            mensagemFicha.textContent = "Sua ficha ainda não tem exercícios.";
            return;
        }

        for (const exercicio of exercicios) {
            const linha = document.createElement("tr");
            for (const valor of [exercicio.nome, exercicio.grupo_muscular, exercicio.series, exercicio.repeticoes, exercicio.carga_kg + " kg"]) {
                const celula = document.createElement("td");
                celula.textContent = valor;
                linha.appendChild(celula);
            }

            const celulaRegistro = document.createElement("td");
            const formulario = document.createElement("form");
            formulario.className = "formulario-registro";
            const campoCarga = document.createElement("input");
            campoCarga.type = "number";
            campoCarga.min = "0";
            campoCarga.max = "500";
            campoCarga.step = "0.5";
            campoCarga.required = true;
            campoCarga.setAttribute("aria-label", "Carga usada em " + exercicio.nome + " em kg");
            const botaoRegistrar = document.createElement("button");
            botaoRegistrar.type = "submit";
            botaoRegistrar.textContent = "Registrar";
            formulario.append(campoCarga, botaoRegistrar);
            formulario.addEventListener("submit", function (evento) {
                registrarTreino(evento, exercicio.id, campoCarga);
            });
            celulaRegistro.appendChild(formulario);
            linha.appendChild(celulaRegistro);
            listaFicha.appendChild(linha);
        }
        mensagemFicha.textContent = exercicios.length + " exercícios na sua ficha.";
    } catch (erro) {
        mensagemFicha.textContent = erro.message || "Não foi possível carregar a ficha.";
    }
}

async function registrarTreino(evento, exercicioId, campoCarga) {
    evento.preventDefault();
    try {
        const dados = await requisicao("/registros", {
            method: "POST",
            body: JSON.stringify({ exercicio_id: exercicioId, carga_kg: Number(campoCarga.value) })
        });
        mensagemFicha.textContent = dados.mensagem;
        campoCarga.value = "";
        await carregarHistorico();
    } catch (erro) {
        mensagemFicha.textContent = erro.message || "Não foi possível registrar o treino.";
    }
}

async function carregarHistorico() {
    try {
        const registros = await requisicao("/registros");
        listaHistorico.replaceChildren();
        for (const registro of registros) {
            const linha = document.createElement("tr");
            for (const valor of [registro.data_registro, registro.exercicio_nome, registro.carga_kg + " kg"]) {
                const celula = document.createElement("td");
                celula.textContent = valor;
                linha.appendChild(celula);
            }
            listaHistorico.appendChild(linha);
        }
        mensagemHistorico.textContent = registros.length === 0 ? "Você ainda não registrou treinos." : registros.length + " registros no histórico.";
    } catch (erro) {
        mensagemHistorico.textContent = erro.message || "Não foi possível carregar o histórico.";
    }
}
