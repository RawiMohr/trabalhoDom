const usuarioAluno = exigirNivel(["aluno"]);
const listaFicha = document.getElementById("listaExercicios");
const mensagemFicha = document.getElementById("mensagem");

if (usuarioAluno) {
    document.getElementById("usuarioNome").textContent = usuarioAluno.nome;
    document.getElementById("usuarioNivel").textContent = usuarioAluno.nivel;
    document.getElementById("btnSair").addEventListener("click", sair);
    carregarFicha();
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
            listaFicha.appendChild(linha);
        }
        mensagemFicha.textContent = exercicios.length + " exercícios na sua ficha.";
    } catch (erro) {
        mensagemFicha.textContent = erro.message || "Não foi possível carregar a ficha.";
    }
}
