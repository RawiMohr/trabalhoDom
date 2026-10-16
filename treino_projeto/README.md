# Sistema de Treinos

## 1. O que é o sistema

O sistema permite consultar e manter uma lista de exercícios de musculação. Cada exercício guarda o nome, o grupo muscular, a quantidade de séries e a quantidade de repetições.

## 2. Como rodar

1. Abra o MySQL Workbench ou outro cliente MySQL.
2. Abra e execute `sql/treino.sql`. Esse arquivo recria o banco `treino_dom` e inclui os exercícios de exemplo.
3. Confira as configurações de acesso ao banco em `backend/.env`.
4. No terminal, entre na pasta `treino_projeto/backend` e execute:

```text
npm install
npm start
```

5. Abra `frontend/index.html` com a extensão Live Server. A página deve usar `http://127.0.0.1:5500` ou `http://localhost:5500`.
6. Acesse `http://localhost:3000/` para confirmar que a API está funcionando.

## 3. Estrutura de pastas

| Arquivo | Para que serve |
| --- | --- |
| `sql/treino.sql` | Cria o banco, a tabela e os registros iniciais. |
| `frontend/index.html` | Define os campos, os botões e a tabela da página. |
| `frontend/style.css` | Define as cores, os espaços e a aparência da página. |
| `frontend/script.js` | Reage aos cliques, usa fetch e atualiza a página. |
| `backend/server.js` | Configura e inicia o servidor Express. |
| `backend/.env` | Guarda as configurações locais do banco e da porta. |
| `backend/.env.example` | Mostra os nomes das configurações necessárias. |
| `backend/.gitignore` | Evita enviar dependências e configurações privadas ao Git. |
| `backend/package.json` | Lista as dependências e o comando para iniciar a API. |
| `backend/database/conexao.js` | Cria o pool de conexões e testa o banco. |
| `backend/middlewares/corsMiddleware.js` | Libera as duas origens usadas pelo Live Server. |
| `backend/routes/exerciciosRoutes.js` | Relaciona os endereços HTTP às funções do controller. |
| `backend/controllers/exerciciosController.js` | Valida os dados e executa as consultas do CRUD. |
| `README.md` | Reúne instruções e explicações para estudar o sistema. |

## 4. Rotas da API

Todas as rotas de exercícios começam com `/exercicios`.

| Método HTTP | Rota | O que faz | Função do controller |
| --- | --- | --- | --- |
| GET | `/` | Confirma que a API está funcionando. | Função definida em `server.js` |
| GET | `/exercicios` | Lista todos os exercícios. | `listarExercicios` |
| GET | `/exercicios/:id` | Busca um exercício pelo identificador. | `buscarExercicioPorId` |
| POST | `/exercicios` | Cadastra um exercício. | `cadastrarExercicio` |
| PUT | `/exercicios/:id` | Atualiza um exercício. | `atualizarExercicio` |
| DELETE | `/exercicios/:id` | Exclui um exercício. | `excluirExercicio` |

## 5. Fluxo de dados em cada operação

### Consultar

Ao clicar em Buscar exercícios, `script.js` chama `fetch` com GET. A rota encaminha o pedido para `listarExercicios`. O controller faz um SELECT no MySQL. A API responde com JSON e o JavaScript cria as linhas da tabela.

### Cadastrar

Ao enviar o formulário, o JavaScript reúne os quatro campos e usa `fetch` com POST e um corpo JSON. A rota chama `cadastrarExercicio`. O controller verifica os campos e faz um INSERT com parâmetros. A API responde com status 201 e uma mensagem. O JavaScript limpa o formulário e busca a lista novamente.

### Alterar

Ao clicar em Editar, o JavaScript busca o registro com GET `/exercicios/:id` e preenche o formulário. Ao salvar, usa PUT `/exercicios/:id` com os novos dados em JSON. A rota chama `atualizarExercicio`, que valida os campos e executa UPDATE para o identificador recebido. A API responde com uma mensagem e a lista é carregada novamente.

### Excluir

Ao clicar em Excluir, a página pede confirmação. Se a resposta for positiva, o JavaScript usa DELETE `/exercicios/:id`. A rota chama `excluirExercicio`, que executa DELETE para aquele identificador. A API responde com uma mensagem e a lista é carregada novamente.

Em todas as operações, o controller acessa o banco pelo pool criado em `conexao.js`. As consultas usam `?` e enviam os valores separadamente, para que os dados não sejam montados diretamente dentro do SQL. Se a API responder com erro, o JavaScript mostra a mensagem enviada pelo controller.

## 6. Perguntas para a apresentação

**Onde está a conexão com o banco?** Em `backend/database/conexao.js`, que cria o pool usando os dados de `backend/.env`.

**Qual arquivo inicia o servidor?** `backend/server.js`.

**Onde ficam as rotas?** Em `backend/routes/exerciciosRoutes.js`.

**Qual método e rota cadastram, consultam, alteram e excluem?** Cadastro usa POST `/exercicios`. Consulta usa GET `/exercicios` ou GET `/exercicios/:id`. Alteração usa PUT `/exercicios/:id`. Exclusão usa DELETE `/exercicios/:id`.

**Onde é usado o fetch?** Em `frontend/script.js`, para enviar pedidos HTTP do navegador à API.

**Como o sistema sabe qual registro alterar ou excluir?** Cada linha tem um ID. O botão daquela linha envia esse ID na URL, por exemplo `/exercicios/3`.

**O que acontece se o banco não estiver conectado?** O servidor mostra a mensagem de falha do teste de conexão. Ele ainda inicia, mas as consultas não funcionam e a API responde com status 500 e uma mensagem de erro.

## Comandos para executar

No terminal, abra a pasta `treino_projeto/backend` e execute `npm install` uma vez. Depois, execute `npm start` para iniciar a API. Em seguida, abra `frontend/index.html` pelo Live Server.

Para demonstrar o CRUD, use Buscar exercícios para consultar, preencha e envie o formulário para cadastrar, clique em Editar para alterar e clique em Excluir para remover após confirmar.
