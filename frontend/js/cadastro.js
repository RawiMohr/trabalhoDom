const formularioCadastro = document.getElementById("formularioCadastro");
const mensagemCadastro = document.getElementById("mensagem");

formularioCadastro.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    const senha = document.getElementById("senha").value;
    const confirmacao = document.getElementById("confirmacao").value;
    if (senha !== confirmacao) {
        mensagemCadastro.textContent = "As senhas não são iguais.";
        return;
    }

    try {
        const dados = await requisicao("/auth/cadastro", {
            method: "POST",
            body: JSON.stringify({
                nome: document.getElementById("nome").value,
                email: document.getElementById("email").value,
                senha
            })
        });
        mensagemCadastro.textContent = dados.mensagem + " Agora você pode entrar.";
        formularioCadastro.reset();
    } catch (erro) {
        mensagemCadastro.textContent = erro.message || "Não foi possível conectar à API.";
    }
});
