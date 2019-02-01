# API Filas
## Desafio Cubos

### Preparando Ambiente

Para preparação do ambiente de forma que seja rodada a aplicação em um OS Linux - Elementary é preciso instalar o `npm` o `typescript` e o `ts-node`.

Para instalar o `npm` basta executar o comando `sudo apt-get install npm` num console.
Para instalar os demais requistos é preciso entrar no diretório da aplicação e utilizar os seguintes comandos:
```
npm install -g typescript ts-node
npm install
```

### Iniciando a Aplicação

Para iniciar a aplicação, estando dentro do diretório dela, é só utilizar o comando `npm run watch-node`

Desta forma, a aplicação já estará funcionando. Acessando a url [http://localhost:3000](http://localhost:3000) será retornado "OK", mostrando que está funcionando

### Testando os endpoints

#### /createUser - POST

Neste endpoint pode-se cadastrar um novo usuário, passando no body, como JSON, "nome", "sobrenome" e "email", como no exemplo abaixo:
```
{
	"nome" : "Renan",
	"sobrenome" : "Bispo",
	"email" : "renan.bisposilva@gmail.com"
}
```

As entradas são validadas e retornam erros caso não sejam válidas.

#### /addToLine - POST

Neste endpoint pode-se adicionar um usuário ja cadastrado a fila, passando no body, como JSON, o "email". Não é possivel fazer a adição à fila de outra maneira, já que o email é a variável identificadora, enquanto as demais podem se repetir. Também é válido dizer que se o usuário ainda não estiver cadastrado não poderá ser adicionado a fila. Abaixo um exemplo:
```
{
	"email" : "renan.bisposilva@gmail.com"
}
```

As entradas são validadas e retornam erros caso não sejam válidas.

#### /findPosition - POST

Neste endpoint pode-se verificar a posição na fila de um usuário, que já esteja inserido nela, passando no body como JSON o "email". Caso o usuário portador do email passado não esteja inserido na fila,, a API rejeitará a consulta. Abaixo um exemplo de consulta válida:
```
{
	"email" : "renan.bisposilva@gmail.com"
}
```

As entradas são validadas e retornam erros caso não sejam válidas.

#### /showLine - GET

Neste endpoint pode-severificar a posição de todos os usuários inseridos na fila. O retorno deste endpoint se dá em JSON.

#### /filterLine - POST

Neste endpoint pode-se verificar as informações de um usuário cadastrado, pesquisando através de uma das três chaves que cadastram ("nome","sobrenome" e "email). Não é possivel filtrar por mais de uma caracteristica. A requisição é feita passando os dados no body como JSON. Abaixo três exemplos de pesquisas:
```
{
	"email" : "renan.bisposilva@gmail.com"
}
```
```
{
	"nome" : "Renan"
}
```
```
{
	"sobrenome" : "Bispo"
}
```

As entradas são validadas e retornam erros caso não sejam válidas.


#### /popLine - GET

Neste endpoint é removido o usuário que ocupa a primeira posição da fila, retornando o sucesso da operação.
