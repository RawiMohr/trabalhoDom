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
