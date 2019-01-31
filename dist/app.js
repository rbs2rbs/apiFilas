"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const util = require("util");
const class_validator_1 = require("class-validator");
/** A classe Post é utilizada para validar as entradas, que são aceitas em formato JSON.
 *  o @IsAlpha valida o dado, rejeitando caso a valor passado contenha números.
 *  O @IsEmail valida se a entrada é um email. @Length avalia se o valor passado tem uma
 *  certa quantidade de characteres.
 */
class Post {
}
__decorate([
    class_validator_1.IsAlpha(),
    class_validator_1.Length(2, 20)
], Post.prototype, "nome", void 0);
__decorate([
    class_validator_1.IsAlpha(),
    class_validator_1.Length(2, 20)
], Post.prototype, "sobrenome", void 0);
__decorate([
    class_validator_1.IsEmail()
], Post.prototype, "email", void 0);
exports.Post = Post;
class PostEmail {
}
__decorate([
    class_validator_1.IsEmail()
], PostEmail.prototype, "email", void 0);
exports.PostEmail = PostEmail;
/** A variável app armazena a biblioteca express */
const app = express();
/** Define a porta na qual será execultada a API */
app.set("port", process.env.PORT || 3000);
/** Decodifica os JSON's passados na requisição */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/** Definine o método get para verificar se a API está no ar com de uma mensagem de OK
 *  com o path '/'.
 */
app.get('/', (req, res) => {
    res.send('OK');
});
/** Definição das variaveis que armazenam os usuarios que serão cadastrados e os ID's dos mesmos */
let usuarios;
let id;
/** Método post que solicita os parametros @param email, @param nome e @param sobrenhome através do path /createUser
 *  para cadastrar um novo usuario. Os dados devem ser passado em formato JSON no body da requisição. Retorna mensagens
 *  do que ocorreu na operação.
 */
app.post('/createUser', (req, res) => {
    let post = new Post();
    post.email = req.body.email;
    post.nome = req.body.nome;
    post.sobrenome = req.body.sobrenome;
    class_validator_1.validate(post).then(errors => {
        if (errors.length > 0) {
            return res.send(util.format("Erro na validação dos dados. Verifique se são entradas válidas com os seguintes erros: \n %s", errors));
        }
        else {
            try {
                if (usuarios == null) {
                    usuarios = {
                        tabela: []
                    };
                    id = 1;
                    usuarios.tabela.push({ 'id': id, 'usuario': post });
                    return res.send(util.format("Usuario %s %s de email %s cadastrado com sucesso !!", post.nome, post.sobrenome, post.email));
                }
                else {
                    var emailExiste = usuarios.tabela.filter(v => v.usuario.email == post.email);
                    if (Object.keys(emailExiste).length > 0) {
                        return res.send('Email Já Cadastrado');
                    }
                    else {
                        id++;
                        usuarios.tabela.push({ 'id': id, 'usuario': req.body });
                        return res.send(util.format("Usuario %s %s de email %s cadastrado com sucesso !!", post.nome, post.sobrenome, post.email));
                    }
                }
            }
            catch (err) {
                return res.send('Erro');
            }
        }
    });
});
/** Definição das variaveis que armazenam os usuarios que serão colocados na fila e as posições dos mesmos */
let fila;
fila = {
    tabela: []
};
let pos = 1;
/** Método post que solicita o parametro @param email através do path /addToLine para colocoar um usuario, já cadastrado, na fila.
 *  Os dados devem ser passado em formato JSON no body da requisição. Retorna mensagens do que ocorreu na operação.
 */
app.post('/addToLine', (req, res) => {
    let post = new PostEmail();
    post.email = req.body.email;
    class_validator_1.validate(post).then(errors => {
        if (errors.length > 0) {
            return res.send(util.format("Erro na validação dos dados. Verifique se são entradas válidas com os seguintes erros: \n %s", errors));
        }
        else {
            try {
                if (usuarios == null) {
                    return res.send('Nenhum usuario cadastrado, ainda!');
                }
                else {
                    let emailFila = fila.tabela.filter(v => v.email === post.email);
                    if (Object.keys(emailFila).length > 0) {
                        return res.send('Este usuario já esta na fila');
                    }
                    else {
                        let usuarioCadastrado = usuarios.tabela.filter(v => v.usuario.email === post.email);
                        fila.tabela.push({ 'pos': pos, 'pessoa': usuarioCadastrado, 'email': post.email });
                        pos++;
                        return res.send(util.format("Usuario %s colocado no final da fila", post.email));
                    }
                }
            }
            catch (err) {
                return res.send('Erro');
            }
        }
    });
});
/** Método post que solicita o parametro @param email através do path /findPosition verificar a posição de um usuario
 *  cadastrado e que já esteja na fila. Os dados devem ser passado em formato JSON no body da requisição.
 *  Retorna mensagens do que ocorreu na operação.
 */
app.post('/findPosition', (req, res) => {
    let post = new PostEmail();
    post.email = req.body.email;
    class_validator_1.validate(post).then(errors => {
        if (errors.length > 0) {
            return res.send(util.format("Erro na validação dos dados. Verifique se são entradas válidas com os seguintes erros: \n %s", errors));
        }
        else {
            try {
                if (usuarios == null) {
                    return res.send('Nenhum usuario cadastrado, ainda!');
                }
                else {
                    if (Object.keys(fila.tabela).length === 0) {
                        return res.send('Nenhum usuario entrou na fila!');
                    }
                    else {
                        let usuarioCadastradoPos = usuarios.tabela.filter(v => v.usuario.email === req.body.email);
                        let emailFilaPos = fila.tabela.filter(v => v.email === req.body.email);
                        if (Object.keys(emailFilaPos).length > 0 && Object.keys(usuarioCadastradoPos).length > 0) {
                            var posicao = fila.tabela.filter(v => v.email === req.body.email);
                            return res.send(util.format('O usuario %s oculpa a posição %i', req.body.email, posicao[0].pos));
                        }
                        else {
                            return res.send(util.format('Usuario %s não cadastrado, ou não adcionado a fila', req.body.email));
                        }
                    }
                }
            }
            catch (err) {
                return res.send('Erro');
            }
        }
    });
});
/** Método get que, path /showLine lista todos os usuarios presentes na fila.
 *  Os dados devem ser passado em formato JSON no body da requisição.
 *  Retorna mensagens do que ocorreu na operação.
 */
app.get('/showLine', (req, res) => {
    try {
        if (usuarios == null) {
            return res.send('Nenhum usuario cadastrado, ainda!');
        }
        else {
            if (Object.keys(fila.tabela).length === 0) {
                return res.send('Nenhum usuario entrou na fila!');
            }
            else {
                let saida = [];
                fila.tabela.forEach(i => {
                    saida.push({ 'posição': i.pos, 'email': i.email });
                });
                return res.send(saida);
            }
        }
    }
    catch (err) {
        return res.send('Erro');
    }
});
/** Método post que solicita o parametro @param email ou @param nome ou @param sobrenhomeatravés do path /filterLine
 *  verificar informações de um usuario cadastrado. Os dados devem ser passado em formato JSON no body da requisição.
 *  Retorna mensagens do que ocorreu na operação.
 */
app.post('/filterLine', (req, res) => {
    try {
        if (usuarios == null) {
            return res.send('Nenhum usuario cadastrado, ainda!');
        }
        else {
            let saida = [];
            Object.keys(req.body).forEach(i => {
                saida.push(usuarios.tabela.filter(v => v.usuario[i] === req.body[i]));
            });
            if (Object.keys(saida[0]).length > 0) {
                return res.send(saida);
            }
            else {
                return res.send('Usuario não encontrado, ou a chave de busca inválida');
            }
        }
    }
    catch (err) {
        return res.send('Erro');
    }
});
/** Método get que, path /popLine remove o primeiro usuario que esteja na fila.
 *  Os dados devem ser passado em formato JSON no body da requisição.
 *  Retorna mensagens do que ocorreu na operação.
 */
app.get('/popLine', (req, res) => {
    let post = new Post();
    post.email = req.body.email;
    post.nome = req.body.nome;
    post.sobrenome = req.body.sobrenome;
    class_validator_1.validate(post).then(errors => {
        if (errors.length > 0) {
            return res.send(util.format("Erro na validação dos dados. Verifique se são entradas válidas com os seguintes erros: \n %s", errors));
        }
        else {
            try {
                if (usuarios == null) {
                    return res.send('Nenhum usuario cadastrado, ainda!');
                }
                else {
                    if (Object.keys(fila.tabela).length === 0) {
                        return res.send('Nenhum usuario entrou na fila!');
                    }
                    else {
                        let removido = fila.tabela.shift();
                        fila.tabela.forEach((i, index) => {
                            i.pos = index + 1;
                        });
                        return res.send(util.format("O usuario de email %s (primeiro da fila) foi removido com sucesso!!", removido.email));
                    }
                }
            }
            catch (err) {
                return res.send('Erro');
            }
        }
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map