const formularioLogin = document.getElementById("formularioLogin");
const mensagemLogin = document.getElementById("mensagem");

formularioLogin.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    mensagemLogin.textContent = "Entrando...";

    try {
        const dados = await requisicao("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email: document.getElementById("email").value,
                senha: document.getElementById("senha").value
            })
        });
        salvarSessao(dados.token, dados.usuario);

        const telas = { aluno: "aluno.html", instrutor: "instrutor.html", admin: "admin.html" };
        window.location.href = telas[dados.usuario.nivel] || "index.html";
    } catch (erro) {
        mensagemLogin.textContent = erro.message || "Não foi possível conectar à API.";
    }
});
