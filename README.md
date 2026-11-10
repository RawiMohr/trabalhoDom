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

O Sistema de Treinos organiza as fichas de musculação. O instrutor monta e atualiza os exercícios de cada aluno, o aluno consulta a própria ficha e o administrador gerencia os níveis de acesso.

## Tecnologias

* Frontend: HTML, CSS e JavaScript, com Fetch API.
* Backend: Node.js e Express, organizado em rotas, controllers, middlewares e conexão com o banco.
* Banco: MySQL relacional.
* Acesso: senha com hash bcryptjs e token JWT.

## Funcionalidades da Entrega 3

* Cadastro público de aluno e login para aluno, instrutor e admin.
* A ficha de exercícios fica ligada a um aluno. O aluno consulta somente a própria ficha.
* Instrutor e admin consultam fichas e fazem o CRUD de exercícios.
* O aluno registra a carga usada em cada exercício e consulta o próprio histórico.
* Instrutor e admin consultam os registros do aluno selecionado.
* A API valida os limites da ficha, a quantidade máxima de exercícios e as permissões de cada perfil.
* Admin lista usuários e altera o nível de acesso, mas não pode alterar o próprio nível.
* A API confere token e nível de acesso. A interface também mostra as ações de cada perfil.

## Níveis de usuário

* **Aluno:** cria a própria conta, consulta a própria ficha e sai da conta.
* **Instrutor:** lista alunos, escolhe uma ficha e cria, edita ou exclui exercícios.
* **Admin:** faz as ações do instrutor, lista todos os usuários e altera o nível de acesso.

O cadastro público sempre cria um aluno. Um campo `nivel` enviado pelo navegador não altera essa regra.

## Como o sistema funciona

1. A pessoa cria uma conta de aluno ou entra com uma conta existente.
2. O servidor confere a senha e, no login, devolve um token JWT.
3. O navegador guarda o token e envia o token no header `Authorization` nas rotas protegidas.
4. O backend confere o token e o nível antes de responder ou alterar os dados.
5. A tela muda conforme o nível: aluno, instrutor ou admin.

## Estrutura do repositório

```text
.
├── .gitignore
├── README.md
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── exerciciosController.js
│   │   ├── registrosController.js
│   │   └── usuariosController.js
│   ├── database/conexao.js
│   ├── middlewares/
│   │   ├── autenticacaoMiddleware.js
│   │   ├── autorizacaoMiddleware.js
│   │   └── corsMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── exerciciosRoutes.js
│   │   ├── registrosRoutes.js
│   │   └── usuariosRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── css/style.css
│   ├── js/
│   │   ├── admin.js
│   │   ├── aluno.js
│   │   ├── api.js
│   │   ├── cadastro.js
│   │   ├── instrutor.js
│   │   └── login.js
│   ├── admin.html
│   ├── aluno.html
│   ├── cadastro.html
│   ├── index.html
│   └── instrutor.html
└── sql/treino.sql
```

As **routes** ligam os endereços às funções. Os **controllers** validam os dados básicos e consultam o MySQL. Os **middlewares** conferem token e nível de acesso. A pasta **database** cria o pool de conexões.

## Banco de dados

O banco `treino_dom` tem três tabelas relacionadas:

* `usuarios`: id, nome, email único, senha com hash, nível (`aluno`, `instrutor` ou `admin`) e data de criação.
* `exercicios`: id, nome, grupo muscular, séries, repetições, carga de referência e id do aluno. A chave estrangeira liga cada exercício a `usuarios`.
* `registros_treino`: id, exercício, aluno, carga e data. As chaves estrangeiras ligam o registro a `exercicios` e `usuarios`. A tabela impede dois registros do mesmo exercício na mesma data e apaga registros quando o exercício é removido.

O script cria as três contas de teste, dez exercícios para o aluno de teste e três registros de exemplo. **Atenção:** `sql/treino.sql` apaga e recria o banco `treino_dom`, então a importação remove os dados que já existirem nesse banco.

## Rotas desta entrega

Todas as respostas de erro e confirmação usam JSON com `mensagem`. Nas rotas protegidas, envie `Authorization: Bearer TOKEN`.

| Método | Rota | Acesso | O que faz |
| --- | --- | --- | --- |
| POST | `/auth/cadastro` | Público | Cadastra uma conta de aluno |
| POST | `/auth/login` | Público | Confere email e senha e devolve o token |
| GET | `/exercicios` | Qualquer usuário autenticado | Lista a ficha própria do aluno ou fichas para instrutor/admin |
| GET | `/exercicios/:id` | Qualquer usuário autenticado | Consulta um exercício permitido para o perfil |
| POST | `/exercicios` | Instrutor e admin | Cria um exercício na ficha de um aluno |
| PUT | `/exercicios/:id` | Instrutor e admin | Atualiza um exercício |
| DELETE | `/exercicios/:id` | Instrutor e admin | Exclui um exercício |
| GET | `/registros` | Qualquer usuário autenticado | Lista registros permitidos para o perfil |
| POST | `/registros` | Aluno | Registra a carga usada hoje em um exercício da própria ficha |
| GET | `/usuarios/alunos` | Instrutor e admin | Lista os alunos para escolher uma ficha |
| GET | `/usuarios` | Admin | Lista usuários sem devolver a senha |
| PUT | `/usuarios/:id/nivel` | Admin | Altera o nível de acesso |

O instrutor e o admin podem filtrar `GET /exercicios` com `?aluno_id=ID`. O nível de acesso é lido do token. Se o admin mudar o nível de alguém, a mudança no acesso dessa pessoa passa a valer ao entrar de novo ou quando o token atual expirar.

## Regras de negócio

* Uma ficha só pode ser criada para um usuário com nível aluno.
* Nome do exercício: de 2 a 100 caracteres. Grupo muscular: de 2 a 50 caracteres. Séries: de 1 a 10. Repetições: de 1 a 100. Carga: de 0 a 500 kg.
* O nome não pode se repetir na ficha do mesmo aluno, e cada aluno pode ter no máximo 15 exercícios.
* O aluno só registra treino em exercícios da própria ficha. A data vem do servidor, e cada exercício aceita um registro por dia.
* Excluir um exercício também apaga os registros ligados a ele. A tela pede confirmação antes da exclusão.
* O admin não pode alterar o próprio nível. O nível escolhido precisa ser aluno, instrutor ou admin.

## Testes manuais de permissão

Use as contas da seção de contas de teste. Os códigos aparecem no elemento de mensagem da tela ou na resposta JSON da API.

1. Sem entrar, tente abrir uma rota protegida como `GET /exercicios`: a API responde `401`.
2. Entre como aluno. A ficha e o histórico mostram apenas os dados dele. Tentar criar exercício ou abrir a lista de usuários responde `403`.
3. Na tela do aluno, registre uma carga em um exercício da própria ficha. O primeiro registro responde `201`. Tente registrar o mesmo exercício novamente no mesmo dia: a API responde `409`. Um exercício que pertence a outro aluno responde `403`.
4. Entre como instrutor. Crie, edite e exclua um exercício, e selecione um aluno para consultar os registros dele. Os exercícios e registros de outras fichas continuam acessíveis pela API apenas para os perfis permitidos.
5. Entre como admin e tente salvar uma mudança no próprio nível: a API responde `409`. Escolher um nível inválido responde `400`.

Outros casos de `400` incluem campos fora dos limites, aluno inválido e ids de rota que não sejam inteiros positivos. Nome repetido e ficha acima de 15 exercícios respondem `409`.

## Instalação e execução

1. Inicie o MySQL e importe `sql/treino.sql`. O script recria `treino_dom` e insere os dados de exemplo.
2. No PowerShell, entre em `backend` e copie o arquivo de exemplo:

```powershell
Copy-Item .env.example .env
```

3. Edite `.env` com os dados da conexão MySQL. Gere um segredo para `JWT_SECRET` com o comando abaixo e copie o resultado para o arquivo. Mantenha `JWT_EXPIRES_IN=2h`:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Não envie `backend/.env` ao Git. O `.gitignore` da raiz já ignora esse arquivo.

4. Ainda na pasta `backend`, instale as dependências e inicie a API:

```powershell
npm.cmd install
npm.cmd start
```

O servidor não inicia sem `JWT_SECRET`. Quando estiver ativo, a API usa `http://localhost:3000`.

5. Abra `frontend/index.html` com o Live Server. Use `http://127.0.0.1:5500` ou `http://localhost:5500`.

## Contas locais de teste

As três contas usam a senha `Treino@123`:

| Perfil | Email |
| --- | --- |
| Admin | `admin@treino.com` |
| Instrutor | `instrutor@treino.com` |
| Aluno | `aluno@treino.com` |

Essas contas são apenas para desenvolvimento local. As senhas são guardadas no banco como hash bcrypt, nunca em texto puro.

## Andamento das entregas

* [x] Entrega 1: problema, proposta, estrutura inicial e documentação.
* [x] Entrega 2: banco relacionado, cadastro, login, JWT e perfis.
* [x] Entrega 3: registro de carga, histórico, permissões e regras de negócio.
* [ ] Entrega 4: tratamento final de erros, revisão, testes e apresentação.
