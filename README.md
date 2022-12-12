# Pré-requisitos
[Node.js](https://nodejs.org/en/)

Java 11+

## Firebase
```bash
npm install -g firebase-tools
```

Firebase CLI é necessário pra rodar os emuladores.

# DevOps
A branch ```main``` será usada para as releases. Todo commit feito vai ativar um deploy.

A branch ```develop``` será usada para as features em desenvolvimento.

## Rodando o projeto

1. Instalar todas as dependências do projeto:
    ```bash
    lerna bootstrap
    ```

2. Colocar o .env na pasta do front-end (packages/webapp)

3. Para inicializar o backend (emulador do Firebase):
    ```bash
    # Na pasta raíz
    npm run backend
    ```

3. Para inicializar o front-end em dev:
    ```
    # Na pasta raíz
    npm run frontend:dev


    # Ou na pasta packages/webapp
    npm run start
    ```

# Módulos

## Webapp (front-end)
Front-end escrito em React.

## Functions
Caso precise criar alguma função extra não coberta pelo Firestore.