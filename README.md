# Sistema de Treinos

## Sobre o projeto

Quem treina musculação costuma receber a ficha em papel ou por mensagem. Ela pode se perder, ficar desatualizada ou ser difícil de consultar durante o treino. O aluno também pode esquecer as séries, as repetições e a carga que usou.

Isso afeta alunos, instrutores e a administração da academia. O instrutor precisa organizar as fichas de várias pessoas, o aluno precisa consultar o treino e acompanhar as cargas, e a administração precisa cuidar dos acessos. Por isso, estou planejando um sistema simples para deixar essas informações em um só lugar.

## O que o sistema vai fazer

O instrutor poderá montar e atualizar a ficha de cada aluno. O aluno poderá consultar a própria ficha pelo celular ou computador e registrar as cargas usadas. O administrador poderá cuidar dos acessos.

Quero deixar as fichas mais fáceis de consultar, ajudar o aluno a acompanhar as cargas e separar o que cada tipo de usuário pode fazer.

As funções previstas são:

* Aluno: criar uma conta, ver a própria ficha e o próprio histórico, e registrar a carga usada.
* Instrutor: consultar os alunos e criar, editar ou excluir exercícios nas fichas deles. Também poderá consultar os registros dos treinos.
* Administrador: fazer o que o instrutor faz, listar usuários e alterar o nível de acesso de outra pessoa.

O cadastro aberto será sempre de aluno. As permissões serão conferidas pela API também.

## Como deve funcionar

1. O aluno cria a conta e entra no sistema.
2. O instrutor escolhe um aluno e monta a ficha dele.
3. O aluno consulta a ficha e registra as cargas do treino.
4. O aluno vê o histórico, e o instrutor pode acompanhar os registros.
5. O administrador gerencia os acessos dos usuários.

## O que já está pronto

Por enquanto, o sistema tem o CRUD de exercícios. Dá para consultar, cadastrar, editar e excluir exercícios com nome, grupo muscular, séries e repetições. Cadastro, login e perfis ainda serão feitos nas próximas etapas.

## Tecnologias

O site usa HTML, CSS e JavaScript. O JavaScript conversa com uma API feita com Node.js e Express, e os dados ficam em um banco MySQL. No navegador, uso `fetch` para enviar pedidos à API.

## Pastas do projeto

Esta é a estrutura atual:

```text
.
├── .gitignore
├── README.md
├── backend/
│   ├── .env.example
│   ├── controllers/exerciciosController.js
│   ├── database/conexao.js
│   ├── middlewares/corsMiddleware.js
│   ├── package-lock.json
│   ├── routes/exerciciosRoutes.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
└── sql/treino.sql
```

Nas próximas entregas, vou acrescentar:

* **Entrega 2:** tabelas relacionadas, cadastro e login, JWT, perfis e telas para cada tipo de usuário. As rotas ligam os endereços da API aos controllers. Os controllers cuidam das consultas e regras. Os middlewares verificam o token e as permissões. A pasta `database` configura a conexão com o MySQL.
* **Entrega 3:** ficha ligada a cada aluno, validações do CRUD e registro de carga e histórico.
* **Entrega 4:** tratamento de erros, revisão final, testes e instruções para apresentar o sistema.

## Banco de dados planejado

Na Entrega 1, o banco `treino_dom` ainda tem só a tabela `exercicios`. Na Entrega 2, o plano é usar três tabelas:

* `usuarios`: `id`, `nome`, `email`, `senha` guardada com hash, `nivel` (`aluno`, `instrutor` ou `admin`) e `data_criacao`. O email será único.
* `exercicios`: `id`, `nome`, `grupo_muscular`, `series`, `repeticoes`, `carga_kg` e `aluno_id`. O `aluno_id` liga o exercício a `usuarios`. O nome não poderá se repetir na ficha do mesmo aluno.
* `registros_treino`: `id`, `exercicio_id`, `aluno_id`, `carga_kg` e `data_registro`. Cada registro liga um aluno a um exercício. Um exercício só terá um registro por dia, e os registros serão apagados junto com o exercício.

As três tabelas terão um id como chave primária. Exercícios apontam para usuários, e registros apontam para exercícios e usuários por chaves estrangeiras.

## Andamento

* [x] Entrega 1: problema, proposta, estrutura inicial e documentação.
* [ ] Entrega 2: banco relacionado, cadastro, login, JWT e perfis.
* [ ] Entrega 3: CRUD das fichas, permissões e regras de negócio.
* [ ] Entrega 4: revisão, testes e preparação da apresentação.

## Como executar a versão atual

1. Inicie o MySQL e importe `sql/treino.sql`. O script recria o banco `treino_dom` e adiciona exercícios de exemplo. Ele apaga os dados anteriores desse banco.
2. Confira a configuração local em `backend/.env`. O arquivo `backend/.env.example` mostra quais valores são necessários. Não envie o `.env` ao Git.
3. No PowerShell, abra a pasta `backend` e rode:

```powershell
npm.cmd install
npm.cmd start
```

4. Abra `frontend/index.html` com o Live Server. A página pode usar `http://127.0.0.1:5500` ou `http://localhost:5500`.
5. Para conferir a API, acesse `http://localhost:3000/`. Na página, clique em **Buscar exercícios** para carregar a lista.

As rotas atuais são `GET /exercicios`, `GET /exercicios/:id`, `POST /exercicios`, `PUT /exercicios/:id` e `DELETE /exercicios/:id`.
