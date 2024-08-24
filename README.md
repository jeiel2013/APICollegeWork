# Projeto API Instrutor

Este é um projeto desenvolvido por **Jeiel Jedson Leão Alves** como parte da disciplina de **Desenvolvimento Web** na **Universidade Vale do Rio Doce (UNIVALE)**.

## Descrição

O projeto consiste em uma API para gerenciamento de instrutores e turmas, desenvolvida em **Node.js**. A API permite o cadastro de instrutores, turmas, e a vinculação de turmas a instrutores, além de funcionalidades para busca e alteração de dados.

## Estrutura do Projeto

- **Código**: O código fonte da API está disponível na pasta `src`, e utiliza **Express.js** para a criação das rotas e middlewares.

## Requisitos e Regras de Negócio

- Cadastro de instrutores e turmas.
- Vinculação de turmas a instrutores.
- Busca de instrutores por nome, CPF ou registro.
- Busca de turmas por ID ou associadas a um instrutor.
- Alteração de dados de instrutores.
- Exclusão de instrutores e turmas.
- Formatação de dados como CPF, nome, número de celular e data.

## Tecnologias Utilizadas

- **Node.js**
- **Express.js**
- **Nodemon** (para desenvolvimento)

## Como Executar

1. Instale as dependências:
   ```bash
   npm install

2. Inicie o servidor:
   ```bash
   npm run dev
3. A API estará disponível em `http://localhost:3333`.