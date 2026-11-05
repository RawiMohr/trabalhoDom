const API_URL = "http://localhost:3000";

function salvarSessao(token, usuario) {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
}

function lerSessao() {
    try {
        return {
            token: localStorage.getItem("token"),
            usuario: JSON.parse(localStorage.getItem("usuario"))
        };
    } catch (erro) {
        limparSessao();
        return { token: null, usuario: null };
    }
}

function limparSessao() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
}

function exigirNivel(niveis) {
    const sessao = lerSessao();
    if (!sessao.token || !sessao.usuario || !niveis.includes(sessao.usuario.nivel)) {
        limparSessao();
        window.location.href = "index.html";
        return null;
    }
    return sessao.usuario;
}

function sair() {
    limparSessao();
    window.location.href = "index.html";
}

async function requisicao(caminho, opcoes = {}) {
    const sessao = lerSessao();
    const cabecalhos = { "Content-Type": "application/json", ...opcoes.headers };
    if (sessao.token) {
        cabecalhos.Authorization = "Bearer " + sessao.token;
    }

    const resposta = await fetch(API_URL + caminho, { ...opcoes, headers: cabecalhos });
    let dados = {};
    try {
        dados = await resposta.json();
    } catch (erro) {
        dados = {};
    }

    if (resposta.status === 401) {
        if (sessao.token) {
            limparSessao();
            window.location.href = "index.html";
        }
        throw new Error(dados.mensagem || "Sua sessão terminou. Entre novamente.");
    }
    if (!resposta.ok) {
        throw new Error(dados.mensagem || "Não foi possível concluir o pedido.");
    }
    return dados;
}
