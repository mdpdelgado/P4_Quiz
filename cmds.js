
const {log, biglog, errorlog, colorize} = require("./out");

const {models} = require('./model');

const Sequelize = require('sequelize');

const validateId = id => {
    return new Sequelize.Promise((resolve, reject) => {
        if (typeof id === "undefined"){
            reject(new Error(`Flata el parametro <id>.`));
        } else {
            id = parseInt(id); //coger parte entera
            if (Number.isNaN(id)){
                reject(new Error(`El valor del parametro <id> no es un número`));
            } else {
                resolve(id);
            }
        }
    });
};

const makeQuestion = (rl, text) => {
    return new Sequelize.Promise ((resolve, reject) => {
        rl.question(colorize(text, 'red'), answer =>{
            resolve(answer.trim());
        });
    });
};

exports.helpCmd = (socket, rl) => {
    log(socket, "Comandos:");
    log(socket, "  h|help - Muestra esta ayuda");
    log(socket, "  list - Listar los quizzes existentes");
    log(socket, "  show<id> - Muestra la pregunta y la respuesta del quiz indicado");
    log(socket, "  add - Añadir un nuevo quiz interactivamente");
    log(socket, "  delete <id> - borra el quiz indicado");
    log(socket, "  edit <id> - editar el quiz indicado");
    log(socket, "  test <id> - probar el quiz indicado");
    log(socket, "  p|play - jugar a preguntar aleatoriamente todos los quizzes");
    log(socket, "  credits - créditos");
    log(socket, "  q|quit - salir del programa");
    rl.prompt();
};

exports.quitCmd = (socket, rl) => {
    rl.close();
    socket.end();
};

exports.addCmd = (socket, rl) => {
    makeQuestion(rl, 'Introduzca una pregunta: ')
        .then(q => {
            return makeQuestion(rl, 'Introduzca la respuesta: ')
                .then(a => {
                    return {question: q, answer:a};
                });
        })
        .then(quiz => {
            return models.quiz.create(quiz);
        })
        .then ((quiz) => {
            log(socket, ` ${colorize('se ha añadido', 'magenta')}: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        })
        .catch(Sequelize.ValidationError, error => {
            errorlog(socket, 'El quiz es erronoe:');
            error.errors.forEach(({message}) => errorlog(socket, message));
        })
        .catch(error => {
            errorlog(socket, error.message);
        })
        .then(() =>{
            rl.prompt();
        });
};

exports.listCmd = (socket, rl) => {
    models.quiz.findAll()
        .each(quiz => {
           log(socket, `  [${colorize(quiz.id, 'magenta')}]: ${quiz.question}`);
       })
       .catch(error => {
           errorlog(socket, error.message);
       })
       .then(() => {
           rl.prompt();
       });
};

exports.showCmd = (socket, rl, id) => {
    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if(!quiz){
                throw new Error(`No existe un quiz asociado al id=${id}.`);
            }
            log(socket, ` [${colorize(quiz.id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        })
        .catch(error => {
            errorlog(socket, error.message);
        })
        .then(() => {
            rl.prompt();
        });
};

exports.testCmd = (socket, rl,id) => {
   validateId(id)
       .then(id => models.quiz.findById(id))
       .then(quiz => {
           if (!quiz) {
               throw new Error(`No existe un quiz asociado al id=${id}.`);
           }
           return makeQuestion (rl, `${quiz.question}?` )
               .then(a =>{
                   if(a.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
                       return log(socket, `correcto`);
                   }
                   else{
                       return log(socket, `incorrecto`);
                   }

               });

       })
       .catch(Sequelize.ValidationError, error => {
           errorlog(socket, 'El quiz es erronoe:');
           error.errors.forEach(({message}) => errorlog(socket, message));
       })
       .catch(error => {
           errorlog(socket, error.message);
       })
       .then(() =>{
           rl.prompt();
       });
};

exports.playCmd = (socket, rl) => {
    let score = 0;
    let toBeResolved = [];
    models.quiz.findAll()
        .each(quiz => {
            toBeResolved.push(quiz);
        })
        .then(playOne = () => {
            if (toBeResolved.length === 0) {
                log(socket, `no hay mas preguntas`);
                log(socket, `fin`);
                log(socket, `${score}`);
                rl.prompt();
            } else {
                let id = Math.floor(Math.random() * toBeResolved.length);
                let quiz = toBeResolved[id];
                toBeResolved.splice(id,1);

                rl.question(quiz.question+"?"+" ", answer => {
                    if(answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
                        log(socket, `correcto`);
                        score++;
                        log(socket, `${score}`);
                        playOne();
                    }
                    else{
                        log(socket, `incorrecto`);
                        log(socket, `${score}`);
                        log(socket, `fin`);
                        rl.prompt();
                    }
                });
            }
        })
        .catch(Sequelize.ValidationError, error => {
            errorlog(socket, 'El quiz es erronoe:');
            error.errors.forEach(({message}) => errorlog(socket, message));
        })
        .catch(error => {
            errorlog(socket, error.message);
        })
        .then(() =>{
            rl.prompt();
        });

};


   /**let score = 0;
   let toBeResolved = [];
   let i=0;
   let cont=0;
   models.quiz.findAll()
       .each(quiz => {
           toBeResolved.push(quiz.question);
       })
       .then(a =>{
           for(i=0; i<toBeResolved.length; i++){
               log(`las preguntas son: ${toBeResolved[i]}`);
           }
       })
       .then( fun => {
           cont = toBeResolved.length;
           const playOne = () => {
               if (cont <= 0) {
                   log(`no hay mas preguntas`);
                   log(`${score}`);
                   rl.prompt();
               } else {
                   let id=0;
                   do{
                       id = Math.floor(Math.random() * toBeResolved.length);
                       log(`id: ${id}`);
                   }while(toBeResolved[id]===0)
                   toBeResolved[id]=0;
                   cont--;
                   id++;

                   validateId(id)
                       .then(id => models.quiz.findById(id))
                       .then(quiz => {
                           if (!quiz) {
                               throw new Error(`No existe un quiz asociado al id=${id}.`);
                           }
                           return makeQuestion(rl, `${quiz.question}?`)
                               .then(a => {
                                   if (a.toLowerCase().trim() === quiz.answer.toLowerCase().trim()) {
                                       log(`correcto`);
                                       score++;
                                       log(`${score}`);
                                       return playOne();
                                   }
                                   else {
                                       log(`incorrecto`);
                                       log(`${score}`);
                                       log(`fin`);
                                       return rl.prompt();
                                   }
                               });
                        })
                       .catch(Sequelize.ValidationError, error => {
                           errorlog('El quiz es erronoe:');
                           error.errors.forEach(({message}) => errorlog(message));
                       })
                       .catch(error => {
                           errorlog(error.message);
                       });
               }
           };
           playOne();
       })
       .catch(Sequelize.ValidationError, error => {
           errorlog('El quiz es erronoe:');
           error.errors.forEach(({message}) => errorlog(message));
       })
       .catch(error => {
           errorlog(error.message);
       });*/


exports.deleteCmd = (socket, rl,id) => {
    validateId(id)
        .then(id => models.quiz.destroy({where: {id}}))
        .catch(error => {
            errorlog(socket, error.message);
        })
        .then(() => {
            rl.prompt();
        });
};

exports.editCmd = (socket, rl,id) => {
    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if(!quiz){
                throw new Error(`No existe un quiz asociado al id=${id}.`);
            }
            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);
            return makeQuestion(rl, 'Introduzca la pregunta: ')
                .then(q => {
                    process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);
                    return makeQuestion(rl, 'Introduzca la respuesta: ')
                        .then(a =>{
                            quiz.question = q;
                            quiz.answer = a;
                            return quiz;
                        });
                });
        })
        .then(quiz => {
            return quiz.save();
        })
        .then((quiz) => {
            log(socket, `Se ha cambiado el quiz ${colorize(quiz.id, 'magenta')} por: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        })
        .catch(Sequelize.ValidationError, error => {
            errorlog(socket, 'El quiz es erronoe:');
            error.errors.forEach(({message}) => errorlog(socket, message));
        })
        .catch(error => {
            errorlog(socket, error.message);
        })
        .then(() =>{
            rl.prompt();
        });
};

exports.creditsCmd = (socket,rl) => {
    log(socket, 'Autores de la práctica');
    log(socket, 'Maria del Pilar Delgado Pardo', 'green');
    rl.prompt();
};