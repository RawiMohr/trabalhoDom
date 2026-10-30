# Sistema de Treinos

## Problema

Quem treina musculação, principalmente quem está começando, costuma receber a ficha em papel ou por mensagem. Ela pode se perder ou ficar desatualizada. O aluno também pode esquecer as séries, as repetições e as cargas usadas. Para o instrutor, acompanhar e atualizar as fichas de várias pessoas dá trabalho.

Esse problema afeta alunos de academia, instrutores e também a administração, que precisa organizar os acessos ao sistema. Sem um lugar para consultar os treinos e registrar as cargas, fica mais difícil acompanhar o que foi feito e perceber a evolução de cada aluno.

## Proposta de solução

O Sistema de Treinos será um site para organizar as fichas de musculação. O instrutor poderá montar e atualizar a ficha de cada aluno. O aluno poderá consultar a própria ficha pelo computador ou celular e registrar a carga usada no treino. A administração poderá cuidar dos acessos dos usuários.

Os objetivos do projeto são:

1. Manter os exercícios de cada aluno organizados em uma ficha.
2. Permitir que o aluno consulte a ficha e acompanhe as cargas registradas.
3. Dar ao instrutor ferramentas para organizar os treinos dos alunos.
4. Separar as permissões de aluno, instrutor e administrador.

## Funcionalidades

O que já existe:

* CRUD de exercícios: consultar, cadastrar, editar e excluir exercícios. Cada exercício tem nome, grupo muscular, séries e repetições.

O que está planejado:

* Cadastro e login de alunos, instrutores e administradores.
* Uma ficha de exercícios ligada a cada aluno.
* Consulta da ficha e registro das cargas usadas pelo aluno.
* Histórico dos treinos registrados.
* Gerenciamento dos usuários pelo administrador.

## Tipos de usuário planejados

* **Aluno:** cria a própria conta, consulta somente a própria ficha, registra as cargas do treino e vê o próprio histórico.
* **Instrutor:** consulta os alunos e cria, edita ou exclui exercícios nas fichas. Também pode consultar os registros dos alunos.
* **Administrador:** tem as ações do instrutor e pode listar usuários e alterar o nível de acesso de outra pessoa.

O cadastro aberto ao público criará uma conta de aluno. As permissões também serão verificadas pela API.

## Fluxo básico planejado

1. O aluno cria uma conta e entra no sistema.
2. O instrutor entra e seleciona um aluno para organizar a ficha.
3. O aluno consulta a própria ficha e registra a carga usada em cada treino.
4. O aluno consulta seu histórico e o instrutor pode acompanhar os registros.
5. O administrador gerencia os níveis de acesso dos usuários.

Na versão atual, existe somente o CRUD de exercícios, sem contas ou perfis de usuário.

## Tecnologias

* **Frontend:** HTML, CSS e JavaScript no navegador. O JavaScript usa `fetch` para conversar com a API.
* **Backend:** Node.js com Express, em módulos ES.
* **Banco de dados:** MySQL, acessado pelo pacote `mysql2`.
* **Execução local:** Live Server para abrir a página e uma API Express na porta 3000.

## Estrutura do repositório

Esta é a estrutura que existe na Entrega 1:

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
│   ├── package.json
│   ├── routes/exerciciosRoutes.js
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
└── sql/
    └── treino.sql
```

O restante planejado será criado nas próximas entregas:

* **Entrega 2:** `backend/routes/` e `backend/controllers/` recebem os arquivos de autenticação e usuários. `backend/middlewares/` recebe autenticação e autorização. O SQL passa a criar as tabelas relacionadas e o frontend recebe as páginas de cadastro, login, aluno, instrutor e administrador, além de `js/api.js`.
* **Entrega 3:** entram as rotas e o controller de registros de treino, junto com as telas de histórico e registro de carga.
* **Entrega 4:** entram o tratamento final de erros, os ajustes de apresentação e a documentação completa para executar e demonstrar o sistema.

Ao final, a estrutura planejada é:

```text
backend/
├── server.js
├── package.json
├── .env.example
├── database/conexao.js
├── routes/
│   ├── authRoutes.js
│   ├── usuariosRoutes.js
│   ├── exerciciosRoutes.js
│   └── registrosRoutes.js
├── controllers/
│   ├── authController.js
│   ├── usuariosController.js
│   ├── exerciciosController.js
│   └── registrosController.js
└── middlewares/
    ├── corsMiddleware.js
    ├── autenticacaoMiddleware.js
    └── autorizacaoMiddleware.js
frontend/
├── index.html
├── cadastro.html
├── aluno.html
├── instrutor.html
├── admin.html
├── css/style.css
└── js/
    ├── api.js
    ├── login.js
    ├── cadastro.js
    ├── aluno.js
    ├── instrutor.js
    └── admin.js
```

Os arquivos de autenticação, usuários e novas páginas nascem na Entrega 2. Os arquivos de registros e as funções de histórico nascem na Entrega 3. O tratamento de erros e a revisão final acontecem na Entrega 4.

### Responsabilidade das pastas do backend

* `routes` liga cada endereço HTTP a uma função do controller.
* `controllers` valida os dados recebidos, aplica as regras do sistema e monta as respostas da API.
* `middlewares` verifica informações que devem ser conferidas antes de chegar ao controller, como identidade e nível de acesso.
* `database` configura o acesso ao MySQL e fornece o pool de conexões usado pelas consultas.

## Modelo de dados planejado

O banco continuará se chamando `treino_dom`. A Entrega 1 ainda usa somente a tabela `exercicios` atual. O modelo com três tabelas será criado na Entrega 2:

* **usuarios:** guarda `id` (chave primária), `nome`, `email` (único), `senha` com hash, `nivel` (`aluno`, `instrutor` ou `admin`) e `data_criacao`.
* **exercicios:** guarda `id` (chave primária), `nome`, `grupo_muscular`, `series`, `repeticoes`, `carga_kg` e `aluno_id` (chave estrangeira para `usuarios.id`). O nome será único dentro da ficha de cada aluno.
* **registros_treino:** guarda `id` (chave primária), `exercicio_id` (chave estrangeira para `exercicios.id`), `aluno_id` (chave estrangeira para `usuarios.id`), `carga_kg` e `data_registro`. Cada exercício terá no máximo um registro por aluno em cada dia. Ao excluir um exercício, seus registros serão excluídos junto com ele.

Assim, um usuário com nível aluno pode ter vários exercícios e vários registros. Cada registro aponta para um exercício e para o aluno que treinou.

## Andamento das entregas

* [x] **Entrega 1:** problema, proposta, organização na raiz e estrutura inicial documentados.
* [ ] **Entrega 2:** banco relacionado, cadastro, login, JWT e perfis.
* [ ] **Entrega 3:** CRUD ligado às fichas, registro de treinos, permissões e validações.
* [ ] **Entrega 4:** revisão de erros, teste de instalação limpa, documentação final e apresentação.

## Como executar o estado atual

1. Inicie o MySQL e importe `sql/treino.sql` pelo MySQL Workbench ou por outro cliente MySQL. O script recria o banco `treino_dom`, apagando os dados anteriores desse banco, e insere exercícios de exemplo.
2. Confira os dados locais de conexão em `backend/.env`. O arquivo `.env.example` mostra os nomes das configurações. O `.env` não deve ser enviado ao Git.
3. No PowerShell, abra a pasta `backend` e instale as dependências. Se a política do Windows bloquear `npm`, use `npm.cmd`:

```powershell
cd backend
npm.cmd install
npm.cmd start
```

4. Abra `frontend/index.html` pelo Live Server, usando `http://127.0.0.1:5500` ou `http://localhost:5500`.
5. Para conferir se a API está ativa, abra `http://localhost:3000/`. O botão **Buscar exercícios** carrega a lista do banco.

Na versão atual, as rotas de exercícios são `GET /exercicios`, `GET /exercicios/:id`, `POST /exercicios`, `PUT /exercicios/:id` e `DELETE /exercicios/:id`. O servidor também responde em `GET /` para indicar que está ativo.
